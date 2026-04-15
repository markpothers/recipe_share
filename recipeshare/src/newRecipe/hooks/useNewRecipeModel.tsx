import * as ImagePicker from "expo-image-picker";

import {
	Filters,
	InstructionImage,
	Ingredient,
	NewRecipe,
	RecipeImage,
	RecipeIngredient,
	RecipeInstruction,
	Unit,
	Recipe,
	Instruction,
	FilterSettings,
} from "../../centralTypes";
import { NewRecipeNavigationProps, NewRecipeRouteProps } from "../../navigation";
import React, { useCallback, useEffect, useState } from "react";
import { fetchIngredients, patchRecipe, postInstructionImage, postRecipe, postRecipeImage } from "../../fetches";
import { getLoggedInChef, useAppSelector } from "../../redux";
import { responsiveHeight } from "react-native-responsive-dimensions";

import AppHeader from "../../navigation/appHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Keyboard } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { clearedFilters } from "../../constants/clearedFilters";
import { runtimeConfig, type NewRecipeSeedMode } from "../../constants/runtimeConfig";
import { emptyRecipe } from "../recipeTemplates/emptyRecipe";
import { getMinutesFromTimeString } from "../../auxFunctions/getTimeStringFromMinutes";
import { longTestRecipe } from "../recipeTemplates/longTestRecipe";
import { shortTestRecipe } from "../recipeTemplates/shortTestRecipe";
import { useSpeechToText } from "./useSpeechToText";
import uuid from "react-native-uuid";

const getNewRecipeSeed = (seedMode: NewRecipeSeedMode): NewRecipe => {
	switch (seedMode) {
		case "short":
			return shortTestRecipe;
		case "long":
			return longTestRecipe;
		case "empty":
		default:
			return emptyRecipe;
	}
};

const selectedSeedRecipe = getNewRecipeSeed(runtimeConfig.seedMode);

const getErrorName = (error: unknown): string | undefined => {
	if (typeof error === "object" && error !== null && "name" in error) {
		const maybeName = (error as { name?: unknown }).name;
		if (typeof maybeName === "string") {
			return maybeName;
		}
	}
	return undefined;
};

const getErrorMessage = (error: unknown): string => {
	if (typeof error === "string") {
		return error;
	}
	if (error instanceof Error) {
		return error.message;
	}
	try {
		return JSON.stringify(error);
	} catch {
		return "Unknown error";
	}
};

export const useNewRecipeModel = (
	navigation: NewRecipeNavigationProps,
	route: NewRecipeRouteProps,
	nextInstructionInput: React.RefObject<{ focus: () => void } | null>,
	nextIngredientInput: React.RefObject<{ focus: () => void } | null>
) => {
	const loggedInChef = useAppSelector(getLoggedInChef);
	const [renderOfflineMessage, setRenderOfflineMessage] = useState<boolean>(false);
	const [alertPopupShowing, setAlertPopupShowing] = useState<boolean>(false);
	const [helpShowing, setHelpShowing] = useState<boolean>(false);
	const [helpText, setHelpText] = useState<{ title: string; text: string }>();
	const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);
	const [autoCompleteFocused, setAutoCompleteFocused] = useState<string | null>(null);
	const [choosingPrimaryPicture, setChoosingPrimaryPicture] = useState<boolean>(false);
	const [choosingInstructionPicture, setChoosingInstructionPicture] = useState<string | null>(null);
	const [filterDisplayed, setFilterDisplayed] = useState<boolean>(false);
	const [awaitingServer, setAwaitingServer] = useState<boolean>(false);
	const [scrollingEnabled, setScrollingEnabled] = useState<boolean>(true);
	const [errors, setErrors] = useState<string | string[]>([]);
	const [offlineDiagnostics, setOfflineDiagnostics] = useState<string>("");
	const [newRecipeDetails, setNewRecipeDetails] = useState<NewRecipe>(selectedSeedRecipe);
	const [instructionHeights, setInstructionHeights] = useState<number[]>([]);
	const [averageInstructionHeight, setAverageInstructionHeight] = useState<number>(responsiveHeight(6.5));
	const [instructionsLength, setInstructionsLength] = useState<number>(100); // start with a high number so first number is always a decrease
	const [ingredientsLength, setIngredientsLength] = useState<number>(100); // start with a high number so first number is always a decrease
	const [recordingInstructionIndex, setRecordingInstructionIndex] = useState<string | null>(null);
	const [isRecordingAbout, setIsRecordingAbout] = useState<boolean>(false);
	const [isRecordingAcknowledgement, setIsRecordingAcknowledgement] = useState<boolean>(false);

	const { startSpeechToText, endSpeechToText } = useSpeechToText();

	const fetchIngredientsForAutoComplete = useCallback(async () => {
		try {
			const ingredients = await fetchIngredients(loggedInChef.auth_token);
			if (ingredients) {
				// remove untrimmed duplicates
				const uniqueIngredients: Record<string, Ingredient> = {};
				ingredients.forEach((ingredient) => {
					uniqueIngredients[ingredient.name.trim()] = ingredient;
				});
				setIngredientsList(Object.values(uniqueIngredients));
			}
		} catch {
			// this.setState({ awaitingServer: false })
		}
	}, [loggedInChef.auth_token]);

	const setEditRecipeDetails = useCallback(async () => {
		const savedEditingRecipeRaw = await AsyncStorage.getItem("localEditRecipeDetails");
		const savedEditingRecipe = savedEditingRecipeRaw ? JSON.parse(savedEditingRecipeRaw) : null;
		if (
			savedEditingRecipe &&
			savedEditingRecipe.newRecipeDetails.recipeId == route.params?.recipe_details.recipe.id
		) {
			if (
				"newRecipeDetails" in savedEditingRecipe &&
				"instructionHeights" in savedEditingRecipe &&
				"averageInstructionHeight" in savedEditingRecipe
			) {
				const { newRecipeDetails, instructionHeights, averageInstructionHeight } = savedEditingRecipe;
				setNewRecipeDetails(newRecipeDetails);
				setInstructionHeights(instructionHeights);
				setAverageInstructionHeight(averageInstructionHeight);
			}
			setAwaitingServer(false);
		} else {
			setRecipeParamsForEditing(route.params.recipe_details);
			setAwaitingServer(false);
		}
	}, [route.params.recipe_details]);

	const loadNewRecipeDetails = useCallback(async () => {
		AsyncStorage.getItem("localNewRecipeDetails", (err, res) => {
			if (res != null) {
				const savedData = JSON.parse(res);
				if (
					"newRecipeDetails" in savedData &&
					"instructionHeights" in savedData &&
					"averageInstructionHeight" in savedData
				) {
					const {
						newRecipeDetails: savedNewRecipeDetails,
						instructionHeights: savedInstructionsHeights,
						averageInstructionHeight: savedAverageInstructionHeights,
					} = savedData;
					setNewRecipeDetails(savedNewRecipeDetails);
					setInstructionHeights(savedInstructionsHeights);
					setAverageInstructionHeight(savedAverageInstructionHeights);
					// Sync length snapshots so the focus effects don't misread the load as a user-added row
					setIngredientsLength(savedNewRecipeDetails.ingredients.length);
					setInstructionsLength(savedNewRecipeDetails.instructions.length);
				}
			}
			setAwaitingServer(false);
		});
	}, []);

	useEffect(() => {
		fetchIngredientsForAutoComplete(); //don't await this, just let it happen in the background
		// console.log("route1:", route);
		if (route.params.recipe_details !== undefined) {
			setEditRecipeDetails();
		} else {
			//look to see if we're half way through creating a recipe
			loadNewRecipeDetails();
		}
	}, [
		fetchIngredientsForAutoComplete,
		setEditRecipeDetails,
		setNewRecipeDetails,
		route.params?.recipe_details,
		loadNewRecipeDetails,
	]);

	const saveNewRecipeDetailsLocally = useCallback(
		(forceNew = false, recipeDetailsToSave: NewRecipe | null = null) => {
			const detailsToSave = recipeDetailsToSave ?? newRecipeDetails;
			const dataToSave = {
				newRecipeDetails: detailsToSave,
				instructionHeights: instructionHeights,
				averageInstructionHeight: averageInstructionHeight,
			};
			if (!forceNew && detailsToSave.recipeId) {
				AsyncStorage.setItem("localEditRecipeDetails", JSON.stringify(dataToSave), () => {
					// console.log('localEditRecipeDetails saved')
				});
			} else {
				AsyncStorage.setItem("localNewRecipeDetails", JSON.stringify(dataToSave), () => {
					// console.log("localNewRecipeDetails saved");
				});
			}
		},
		[newRecipeDetails, instructionHeights, averageInstructionHeight]
	);

	useEffect(() => {
		if (newRecipeDetails.recipeId) {
			if (route.params?.recipe_details?.recipe?.id) {
				navigation.setOptions({
					headerTitle: (props) => <AppHeader {...props} text={"Update Recipe"} />,
				});
			} else {
				navigation.setOptions({
					headerTitle: (props) => <AppHeader {...props} text={"Finish Recipe"} />,
				});
			}
		} else {
			navigation.setOptions({
				headerTitle: (props) => <AppHeader {...props} text={"Create a New Recipe"} />,
			});
		}
	}, [newRecipeDetails, route, navigation]);

	useEffect(() => {
		saveNewRecipeDetailsLocally();
	}, [newRecipeDetails, instructionHeights, averageInstructionHeight, saveNewRecipeDetailsLocally]);

	useEffect(() => {
		if (newRecipeDetails.instructions.length - instructionsLength === 1 && nextInstructionInput.current) {
			nextInstructionInput.current.focus();
		}
		setInstructionsLength(newRecipeDetails.instructions.length);
	}, [newRecipeDetails.instructions.length, instructionsLength, nextInstructionInput]);

	useEffect(() => {
		if (newRecipeDetails.ingredients.length - ingredientsLength === 1 && nextIngredientInput.current) {
			nextIngredientInput.current.focus();
		}
		setIngredientsLength(newRecipeDetails.ingredients.length);
	}, [newRecipeDetails.ingredients.length, ingredientsLength, nextIngredientInput]);

	const activateScrollView = () => setScrollingEnabled(true);

	const deactivateScrollView = () => setScrollingEnabled(false);

	const askToReset = () => setAlertPopupShowing(true);

	const choosePrimaryPicture = () => setChoosingPrimaryPicture(true);

	const primarySourceChosen = async () => setChoosingPrimaryPicture(false);

	const autocompleteIsFocused = (id: string | null) => setAutoCompleteFocused(id);

	const savePrimaryImages = (newImages: RecipeImage[]) => {
		setNewRecipeDetails({ ...newRecipeDetails, primaryImages: newImages });
	};

	const updateIngredientEntry = (id: string, name: string, quantity: string, unit: Unit) => {
		const newIngredients = newRecipeDetails.ingredients.map((ing) =>
			ing.id === id ? { ...ing, name, quantity, unit } : ing
		);
		setNewRecipeDetails({
			...newRecipeDetails,
			ingredients: newIngredients,
		});
	};

	const addNewIngredient = () => {
		const ingredients = newRecipeDetails.ingredients;
		const newIngredients = [
			...ingredients,
			{ name: "", quantity: "", unit: "Oz" as Unit, id: uuid.v4() as string },
		];
		setNewRecipeDetails({ ...newRecipeDetails, ingredients: newIngredients });
	};

	const handleIngredientSort = async (newIngredients: RecipeIngredient[]) => {
		setNewRecipeDetails({
			...newRecipeDetails,
			ingredients: newIngredients,
		});
	};

	const removeIngredient = (id: string) => {
		const newIngredients = newRecipeDetails.ingredients.filter((ing) => ing.id !== id);
		setNewRecipeDetails({ ...newRecipeDetails, ingredients: newIngredients });
	};

	const handleInput = (
		text: string | { prepTime: number; cookTime: number; totalTime: number } | boolean,
		parameter: string
	) => {
		// console.log("text:", text);
		// console.log("param:", parameter);
		setNewRecipeDetails({ ...newRecipeDetails, [parameter]: text });
	};
	const clearNewRecipeDetails = async () => {
		AsyncStorage.removeItem("localNewRecipeDetails", async () => {
			setAlertPopupShowing(false);
			setNewRecipeDetails(selectedSeedRecipe);
			setInstructionHeights([]);
			setAverageInstructionHeight(responsiveHeight(6.5));
			// this.setState({
			// ...(testing ? testRecipe : emptyRecipe),
			// alertPopupShowing: false,
			// });
			navigation.setOptions({
				headerTitle: (props) => <AppHeader {...props} text={"Create a New Recipe"} />,
			});
		});
	};
	const clearEditRecipeDetails = async (editedRecipeSavedToDatabase: boolean) => {
		AsyncStorage.removeItem("localEditRecipeDetails", async () => {
			setAlertPopupShowing(false);
			// primarily this is to clear out the instructions so when repopulated they layout and measure their heights correctly
			setNewRecipeDetails(emptyRecipe);
			if (route.params?.recipe_details !== undefined) {
				if (!editedRecipeSavedToDatabase) {
					// if you updated the saved recipe you don't want to refresh async store before leaving
					await setRecipeParamsForEditing(route.params.recipe_details);
				}
			}
		});
	};

	const handleCategoriesButton = () => {
		setFilterDisplayed(!filterDisplayed);
	};

	const handleInstructionChange = (text: string, id: string) => {
		const newInstructions = newRecipeDetails.instructions.map((inst) =>
			inst.id === id ? { ...inst, text } : inst
		);
		setNewRecipeDetails({ ...newRecipeDetails, instructions: newInstructions });
	};

	const handleInstructionSizeChange = (id: string, size: number) => {
		const index = newRecipeDetails.instructions.findIndex((inst) => inst.id === id);
		if (index === -1) return;
		const newInstructionHeights = [...instructionHeights];
		newInstructionHeights[index] = size + responsiveHeight(0.5);
		const newAverageInstructionHeight = parseFloat(
			(
				newInstructionHeights.reduce((acc, height) => acc + (height || 0), 0) / newInstructionHeights.length
			).toString()
		);
		setInstructionHeights(newInstructionHeights);
		setAverageInstructionHeight(newAverageInstructionHeight);
	};

	const handleInstructionsSort = (newInstructions: RecipeInstruction[]) => {
		const newInstructionHeights: number[] = [];
		newInstructions.forEach((inst) => {
			const index = newRecipeDetails.instructions.findIndex((i) => i.id === inst.id);
			newInstructionHeights.push(instructionHeights[index]);
		});
		setNewRecipeDetails({ ...newRecipeDetails, instructions: newInstructions });
		setInstructionHeights(newInstructionHeights);
	};

	const addNewInstruction = () => {
		const newInstructions = [...newRecipeDetails.instructions, { id: uuid.v4() as string, text: "", image: "" }];
		const newInstructionHeights = [...instructionHeights, responsiveHeight(6.5)];
		const newAverageInstructionHeight =
			newInstructionHeights.reduce((acc, h) => acc + h, 0) / newInstructionHeights.length;
		setNewRecipeDetails({ ...newRecipeDetails, instructions: newInstructions });
		setInstructionHeights(newInstructionHeights);
		setAverageInstructionHeight(newAverageInstructionHeight);
	};

	const removeInstruction = (id: string) => {
		const index = newRecipeDetails.instructions.findIndex((inst) => inst.id === id);
		if (index === -1) return;
		const newInstructions = newRecipeDetails.instructions.filter((inst) => inst.id !== id);
		const newInstructionHeights = [...instructionHeights];
		newInstructionHeights.splice(index, 1);
		const newAverageInstructionHeight =
			newInstructionHeights.length > 0
				? newInstructionHeights.reduce((acc, h) => acc + h, 0) / newInstructionHeights.length
				: 0;
		setNewRecipeDetails({ ...newRecipeDetails, instructions: newInstructions });
		setInstructionHeights(newInstructionHeights);
		setAverageInstructionHeight(newAverageInstructionHeight);
	};

	const chooseInstructionPicture = (id: string) => {
		setChoosingInstructionPicture(id);
	};

	const instructionSourceChosen = async () => {
		setChoosingInstructionPicture(null);
	};

	const saveInstructionImage = (image: ImagePicker.ImagePickerAsset, id: string) => {
		const newInstructions = newRecipeDetails.instructions.map((inst) =>
			inst.id === id ? { ...inst, image: image.uri } : inst
		);
		setNewRecipeDetails({ ...newRecipeDetails, instructions: newInstructions });
	};

	const cancelChooseInstructionImage = (image: string, id: string) => {
		const newInstructions = newRecipeDetails.instructions.map((inst) =>
			inst.id === id ? { ...inst, image } : inst
		);
		setChoosingInstructionPicture(null);
		setNewRecipeDetails({ ...newRecipeDetails, instructions: newInstructions });
		setAwaitingServer(false);
	};

	const toggleFilterCategory = (category: Filters) => {
		setNewRecipeDetails({
			...newRecipeDetails,
			filter_settings: {
				...newRecipeDetails.filter_settings,
				[category]: !newRecipeDetails.filter_settings[category],
			},
		});
	};

	const clearFilterSettings = () => {
		setNewRecipeDetails({
			...newRecipeDetails,
			filter_settings: clearedFilters,
			cuisine: "Any",
			serves: "Any",
		});
	};

	const postImages = async (
		newRecipeDetailsToPost: NewRecipe,
		recipe: Recipe & {
			instructions: Instruction[];
		}
	) => {
		try {
			await Promise.all(
				newRecipeDetailsToPost.primaryImages.map((image, index: number) => {
					const existingImageId = "id" in image ? image.id : 0;
					const uploadedImageUri = "uri" in image ? image.uri : "";
					return postRecipeImage(
						loggedInChef.id,
						loggedInChef.auth_token,
						recipe.recipe.id,
						existingImageId || 0,
						index,
						uploadedImageUri
					);
				})
			);
			// Post instruction images using newRecipeDetails.instructions
			await Promise.all(
				newRecipeDetailsToPost.instructions.map((instruction, index: number) => {
					const recipeInstruction = recipe.instructions.find((i) => i.step === index);
					if (!recipeInstruction) {
						return Promise.resolve(true);
					}
					// for new images, the image is the local uri and has no id
					// it needs to be uploaded to the server along with the instruction id
					if (instruction.image && typeof instruction.image === "string" && instruction.image !== "") {
						return postInstructionImage(
							loggedInChef.id,
							loggedInChef.auth_token,
							recipeInstruction?.id,
							0,
							instruction.image
						);
						// for existing images, the image is the object from the server with an id
						// we just need to associate this id with the instruction id
					} else if (instruction.image && typeof instruction.image !== "string" && instruction.image.id) {
						return postInstructionImage(
							loggedInChef.id,
							loggedInChef.auth_token,
							recipeInstruction?.id,
							instruction.image.id,
							""
						);
					}
					return Promise.resolve(true);
				})
			);
			return true;
		} catch {
			setErrors(
				"The recipe saved successfully but not all the images could be saved. Please finish submission now or later to try again. Your recipe will be visible without those images that failed already."
			);
			setAwaitingServer(false);
		}
		return false;
	};

	const submitRecipe = async () => {
		Keyboard.dismiss();
		const netInfoState = await NetInfo.fetch();
		if (netInfoState.isConnected) {
			setAwaitingServer(true);
			// this.setState({ awaitingServer: true }, async () => {
			// const newRecipeDetails = newRecipeDetails;
			// console.log(newRecipeDetails);
			if (newRecipeDetails.recipeId) {
				// it's an existing recipe we're updating
				try {
					// console.log('editing recipe')
					const recipe = await patchRecipe(
						loggedInChef.id,
						loggedInChef.auth_token,
						newRecipeDetails.name,
						newRecipeDetails.ingredients,
						newRecipeDetails.instructions.map((i) => i.text),
						newRecipeDetails.times.prepTime,
						newRecipeDetails.times.cookTime,
						newRecipeDetails.times.totalTime,
						newRecipeDetails.difficulty,
						newRecipeDetails.filter_settings,
						newRecipeDetails.cuisine,
						newRecipeDetails.serves,
						newRecipeDetails.recipeId,
						newRecipeDetails.acknowledgement,
						newRecipeDetails.acknowledgementLink,
						newRecipeDetails.description,
						newRecipeDetails.showBlogPreview
					);
					if (recipe) {
						if ("error" in recipe) {
							setErrors(recipe.message);
							setAwaitingServer(false);
						} else {
							const success = await postImages(newRecipeDetails, recipe);
							if (success) {
								setAwaitingServer(false);
								clearEditRecipeDetails(true);
								navigation.navigate("MyRecipeBook", {
									title: "My Recipe Book",
									screen: "My Recipes",
									params: { refresh: true },
								});
							}
						}
					}
				} catch (e) {
					if (getErrorName(e) === "Logout") {
						navigation.navigate("ProfileCover", {
							screen: "Profile",
							params: { logout: true, title: "Profile" },
						});
					}
					// console.log(e)
					setRenderOfflineMessage(true);
					setOfflineDiagnostics(getErrorMessage(e));
					setAwaitingServer(false);
				}
			} else {
				// it's a new recipe
				try {
					// console.log('new recipe')
					const recipe = await postRecipe(
						loggedInChef.id,
						loggedInChef.auth_token,
						newRecipeDetails.name,
						newRecipeDetails.ingredients,
						newRecipeDetails.instructions.map((i) => i.text),
						newRecipeDetails.times.prepTime,
						newRecipeDetails.times.cookTime,
						newRecipeDetails.times.totalTime,
						newRecipeDetails.difficulty,
						newRecipeDetails.filter_settings,
						newRecipeDetails.cuisine,
						newRecipeDetails.serves,
						newRecipeDetails.acknowledgement,
						newRecipeDetails.acknowledgementLink,
						newRecipeDetails.description,
						newRecipeDetails.showBlogPreview
					);
					if (recipe) {
						if ("error" in recipe) {
							setErrors(recipe.message);
							setAwaitingServer(false);
						} else {
							const newRecipeDetailsWithId = {
								...newRecipeDetails,
								recipeId: recipe.recipe.id,
							};
							setNewRecipeDetails(newRecipeDetailsWithId);

							// save the recipe locally with its new id to make sure resubmissions don't submit duplicates (as often as possible)
							saveNewRecipeDetailsLocally(true, newRecipeDetailsWithId);
							// navigation.setParams({
							// recipeDetails: { recipe: { id: recipe.recipe.id } },
							// });
							const success = await postImages(newRecipeDetails, recipe);
							if (success) {
								setAwaitingServer(false);
								clearNewRecipeDetails();
								// this.props.navigation.popToTop() //clears Recipe Details and newRecipe screens from the view stack so that switching back to BrowseRecipes will go to the List and not another screen
								navigation.navigate("MyRecipeBook", {
									title: "My Recipe Book",
									screen: "My Recipes",
									params: { refresh: true },
								});
							}
						}
					}
				} catch (e) {
					if (getErrorName(e) === "Logout") {
						navigation.navigate("ProfileCover", {
							screen: "Profile",
							params: { title: "Profile", logout: true },
						});
					}
					// console.log(e)
					setRenderOfflineMessage(true);
					setOfflineDiagnostics(getErrorMessage(e));
					setAwaitingServer(false);
				}
			}
		} else {
			setRenderOfflineMessage(true);
		}
	};

	// console.log("newRecipeDetails:", newRecipeDetails.instructions);
	const setRecipeParamsForEditing = async (recipeDetails: Recipe) => {
		const { recipe } = recipeDetails;
		const newIngredients: RecipeIngredient[] = recipeDetails.ingredient_uses.map((ingredient_use) => {
			const ingredientName =
				recipeDetails.ingredients.find((ingredient) => ingredient.id == ingredient_use.ingredient_id)?.name ||
				"";
			return {
				name: ingredientName,
				quantity: ingredient_use.quantity,
				unit: ingredient_use.unit as Unit,
			};
		});
		const newInstructions = recipeDetails.instructions.map((i) => {
			const image = recipeDetails.instruction_images.find((j) => j.instruction_id == i.id);
			return {
				id: uuid.v4() as string,
				text: i.instruction,
				image: image ?? "",
			};
		});
		setInstructionHeights(recipeDetails.instructions.map(() => responsiveHeight(6.5)));
		setAverageInstructionHeight(responsiveHeight(6.5));
		setErrors([]);
		const recipeId = (recipe.id as number) || 0;
		const prepTime = (recipe.prep_time as number) || 0;
		const cookTime = (recipe.cook_time as number) || 0;
		const totalTime = (recipe.total_time as number) || 0;
		const recipeTime = (recipe.time as string | null) || null;
		const getFilterValue = (snakeKey: string, titleKey: Filters): boolean => {
			const snakeValue = recipe[snakeKey];
			if (typeof snakeValue === "boolean") {
				return snakeValue;
			}
			const titleValue = recipe[titleKey];
			return typeof titleValue === "boolean" ? titleValue : false;
		};
		setNewRecipeDetails({
			recipeId: recipeId,
			name: (recipe.name as string) || "",
			instructions: newInstructions,
			ingredients: newIngredients.length > 0 ? newIngredients : [],
			difficulty: String(recipe.difficulty ?? "0") as NewRecipe["difficulty"],
			times: {
				prepTime: prepTime > 0 ? prepTime : 0,
				cookTime: cookTime > 0 ? cookTime : 0,
				totalTime: totalTime > 0 ? totalTime : recipeTime ? getMinutesFromTimeString(recipeTime) : 0,
			},
			primaryImages:
				recipeDetails.recipe_images && recipeDetails.recipe_images.length > 0
					? recipeDetails.recipe_images
					: ([{ uri: "" }] as NewRecipe["primaryImages"]),
			filter_settings: {
				Breakfast: getFilterValue("breakfast", "Breakfast"),
				Lunch: getFilterValue("lunch", "Lunch"),
				Dinner: getFilterValue("dinner", "Dinner"),
				Chicken: getFilterValue("chicken", "Chicken"),
				"Red meat": getFilterValue("red_meat", "Red meat"),
				Seafood: getFilterValue("seafood", "Seafood"),
				Vegetarian: getFilterValue("vegetarian", "Vegetarian"),
				Salad: getFilterValue("salad", "Salad"),
				Vegan: getFilterValue("vegan", "Vegan"),
				Soup: getFilterValue("soup", "Soup"),
				Dessert: getFilterValue("dessert", "Dessert"),
				Side: getFilterValue("side", "Side"),
				"Whole 30": getFilterValue("whole_30", "Whole 30"),
				Paleo: getFilterValue("paleo", "Paleo"),
				"Freezer meal": getFilterValue("freezer_meal", "Freezer meal"),
				Keto: getFilterValue("keto", "Keto"),
				Weeknight: getFilterValue("weeknight", "Weeknight"),
				Weekend: getFilterValue("weekend", "Weekend"),
				"Gluten free": getFilterValue("gluten_free", "Gluten free"),
				Bread: getFilterValue("bread", "Bread"),
				"Dairy free": getFilterValue("dairy_free", "Dairy free"),
				"White meat": getFilterValue("white_meat", "White meat"),
			},
			cuisine: (recipe.cuisine as NewRecipe["cuisine"]) || "Any",
			serves: (recipe.serves as NewRecipe["serves"]) || "Any",
			acknowledgement: (recipe.acknowledgement as string) || "",
			acknowledgementLink: (recipe.acknowledgement_link as string) || "",
			description: (recipe.description as string) || "",
			showBlogPreview: Boolean(recipe.show_blog_preview),
		});
	};

	const startInstructionSpeechRecognition = async (id: string) => {
		if (recordingInstructionIndex) {
			setRecordingInstructionIndex(null);
			endSpeechToText();
		} else {
			setRecordingInstructionIndex(id);
			const callback = (speechResult: string, isFinished: boolean) => {
				if (speechResult) {
					handleInstructionChange(speechResult, id);
				}
				if (isFinished) {
					setRecordingInstructionIndex(null);
				}
			};
			startSpeechToText(callback);
		}
	};

	const startAboutSpeechRecognition = async () => {
		if (isRecordingAbout) {
			endSpeechToText();
			setIsRecordingAbout(false);
		} else {
			setIsRecordingAbout(true);
			const callback = (speechResult: string, isFinished: boolean) => {
				if (speechResult) {
					handleInput(speechResult, "description");
				}
				if (isFinished) {
					setIsRecordingAbout(false);
				}
			};
			startSpeechToText(callback);
		}
	};

	const startAcknowledgementSpeechRecognition = async () => {
		if (isRecordingAcknowledgement) {
			endSpeechToText();
			setIsRecordingAcknowledgement(false);
		} else {
			setIsRecordingAcknowledgement(true);
			const callback = (speechResult: string, isFinished: boolean) => {
				if (speechResult) {
					handleInput(speechResult, "acknowledgement");
				}
				if (isFinished) {
					setIsRecordingAcknowledgement(false);
				}
			};
			startSpeechToText(callback);
		}
	};

	// Ensure all ingredients have an id on load
	useEffect(() => {
		setNewRecipeDetails((prev) => {
			if (prev.ingredients.some((ing) => !ing.id)) {
				return {
					...prev,
					ingredients: prev.ingredients.map((ing) => ({
						...ing,
						id: ing.id || (uuid.v4() as string),
						unit: ing.unit as Unit,
					})),
				};
			}
			return prev;
		});
	}, [newRecipeDetails.ingredients]);

	return {
		loggedInChef,
		renderOfflineMessage,
		setRenderOfflineMessage,
		alertPopupShowing,
		setAlertPopupShowing,
		helpShowing,
		setHelpShowing,
		helpText,
		setHelpText,
		ingredientsList,
		autoCompleteFocused,
		setAutoCompleteFocused,
		choosingPrimaryPicture,
		choosingInstructionPicture,
		filterDisplayed,
		awaitingServer,
		scrollingEnabled,
		errors,
		offlineDiagnostics,
		newRecipeDetails,
		instructionHeights,
		averageInstructionHeight,
		activateScrollView,
		deactivateScrollView,
		askToReset,
		choosePrimaryPicture,
		primarySourceChosen,
		autocompleteIsFocused,
		savePrimaryImages,
		updateIngredientEntry,
		handleIngredientSort,
		addNewIngredient,
		removeIngredient,
		handleInput,
		clearNewRecipeDetails,
		clearEditRecipeDetails,
		handleCategoriesButton,
		handleInstructionChange,
		handleInstructionSizeChange,
		handleInstructionsSort,
		addNewInstruction,
		removeInstruction,
		chooseInstructionPicture,
		instructionSourceChosen,
		saveInstructionImage,
		cancelChooseInstructionImage,
		toggleFilterCategory,
		clearFilterSettings,
		submitRecipe,
		startInstructionSpeechRecognition,
		recordingInstructionIndex,
		startAboutSpeechRecognition,
		isRecordingAbout,
		startAcknowledgementSpeechRecognition,
		isRecordingAcknowledgement,
	};
};
