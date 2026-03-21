import * as ImagePicker from "expo-image-picker";

import { Ingredient, NewRecipe, RecipeImage, RecipeIngredient, RecipeInstruction, Unit } from "../../centralTypes";
import { NewRecipeNavigationProps, NewRecipeRouteProps } from "../../navigation";
import React, { useCallback, useEffect, useState } from "react";
import { fetchIngredients, patchRecipe, postInstructionImage, postRecipe, postRecipeImage } from "../../fetches";
import { getLoggedInChef, useAppSelector } from "../../redux";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

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

export const useNewRecipeModel = (
	navigation: NewRecipeNavigationProps,
	route: NewRecipeRouteProps,
	nextInstructionInput: React.MutableRefObject<any>,
	nextIngredientInput: React.MutableRefObject<any>
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
				const uniqueIngredients = {};
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
		const savedEditingRecipe = JSON.parse(await AsyncStorage.getItem("localEditRecipeDetails"));
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
		(forceNew = false) => {
			const dataToSave = {
				newRecipeDetails: newRecipeDetails,
				instructionHeights: instructionHeights,
				averageInstructionHeight: averageInstructionHeight,
			};
			if (!forceNew && newRecipeDetails.recipeId) {
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
	const clearEditRecipeDetails = async (editedRecipeSavedToDatabase) => {
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
		const newInstructionHeights = [];
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

	const toggleFilterCategory = (category) => {
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

	const postImages = async (newRecipeDetails, recipe) => {
		try {
			await Promise.all(
				newRecipeDetails.primaryImages.map((image, index) => {
					return postRecipeImage(
						loggedInChef.id,
						loggedInChef.auth_token,
						recipe.recipe.id,
						image.id || 0,
						index,
						image.uri
					);
				})
			);
			// Post instruction images using newRecipeDetails.instructions
			await Promise.all(
				newRecipeDetails.instructions.map((instruction, index) => {
					const recipeInstruction = recipe.instructions.find((i) => i.step === index);
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
		} catch (e) {
			console.error("Error posting images:", e);
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
					if (e.name === "Logout") {
						navigation.navigate("ProfileCover", {
							screen: "Profile",
							params: { logout: true, title: "Profile" },
						});
					}
					// console.log(e)
					setRenderOfflineMessage(true);
					setOfflineDiagnostics(e);
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
							setNewRecipeDetails({
								...newRecipeDetails,
								recipeId: recipe.recipe.id,
							});

							// save the recipe locally with its new id to make sure resubmissions don't submit duplicates (as often as possible)
							saveNewRecipeDetailsLocally(true);
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
					if (e.name === "Logout") {
						navigation.navigate("ProfileCover", {
							screen: "Profile",
							params: { title: "Profile", logout: true },
						});
					}
					// console.log(e)
					setRenderOfflineMessage(true);
					setOfflineDiagnostics(e);
					setAwaitingServer(false);
				}
			}
		} else {
			setRenderOfflineMessage(true);
		}
	};

	// console.log("newRecipeDetails:", newRecipeDetails.instructions);
	const setRecipeParamsForEditing = async (recipeDetails) => {
		const { recipe } = recipeDetails;
		const newIngredients = recipeDetails.ingredient_uses.map((ingredient_use) => {
			return {
				ingredientId: ingredient_use.ingredient_id,
				quantity: ingredient_use.quantity,
				unit: ingredient_use.unit,
			};
		});
		newIngredients.forEach(
			(use) => (use.name = recipeDetails.ingredients.find((ingredient) => ingredient.id == use.ingredientId).name)
		);
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
		setNewRecipeDetails({
			recipeId: recipe.id,
			name: recipe.name,
			instructions: newInstructions,
			ingredients: newIngredients.length > 0 ? newIngredients : [],
			difficulty: recipe.difficulty.toString(),
			times: {
				prepTime: recipe.prep_time > 0 ? recipe.prep_time : 0,
				cookTime: recipe.cook_time > 0 ? recipe.cook_time : 0,
				totalTime:
					recipe.total_time > 0 ? recipe.total_time : recipe.time ? getMinutesFromTimeString(recipe.time) : 0,
			},
			primaryImages: recipeDetails.recipe_images?.length > 0 ? recipeDetails.recipe_images : [{ uri: "" }],
			filter_settings: {
				Breakfast: recipe["breakfast"],
				Lunch: recipe["lunch"],
				Dinner: recipe["dinner"],
				Chicken: recipe["chicken"],
				"Red meat": recipe["red_meat"],
				Seafood: recipe["seafood"],
				Vegetarian: recipe["vegetarian"],
				Salad: recipe["salad"],
				Vegan: recipe["vegan"],
				Soup: recipe["soup"],
				Dessert: recipe["dessert"],
				Side: recipe["side"],
				"Whole 30": recipe["whole_30"],
				Paleo: recipe["paleo"],
				"Freezer meal": recipe["freezer_meal"],
				Keto: recipe["keto"],
				Weeknight: recipe["weeknight"],
				Weekend: recipe["weekend"],
				"Gluten free": recipe["gluten_free"],
				Bread: recipe["bread"],
				"Dairy free": recipe["dairy_free"],
				"White meat": recipe["white_meat"],
			},
			cuisine: recipe.cuisine,
			serves: recipe.serves,
			acknowledgement: recipe.acknowledgement,
			acknowledgementLink: recipe.acknowledgement_link,
			description: recipe.description,
			showBlogPreview: recipe.show_blog_preview,
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
