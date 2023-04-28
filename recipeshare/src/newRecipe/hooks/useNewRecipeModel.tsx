import React, { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../../redux";
import {
	ImageSource,
	Ingredient,
	Instruction,
	InstructionImage,
	NewRecipe,
	Recipe,
	RecipeImage,
	RecipeIngredient,
	Unit,
} from "../../centralTypes";
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchIngredients } from "../../fetches/fetchIngredients";
import AppHeader from "../../../navigation/appHeader";
import { clearedFilters } from "../../dataComponents/clearedFilters";
import { emptyRecipe } from "../recipeTemplates/emptyRecipe";
import NetInfo from "@react-native-community/netinfo";
import { patchRecipe } from "../../fetches/patchRecipe";
import { postRecipeImage } from "../../fetches/postRecipeImage";
import { postInstructionImage } from "../../fetches/postInstructionImage";
import { postRecipe } from "../../fetches/postRecipe";
import { Keyboard, TextInput } from "react-native";
import { getMinutesFromTimeString } from "../../auxFunctions/getTimeStringFromMinutes";
import { shortTestRecipe } from "../recipeTemplates/shortTestRecipe";
import * as ImagePicker from "expo-image-picker";

const isDev = __DEV__ ? false : false;
const testRecipe = shortTestRecipe;

export const useNewRecipeModel = (
	navigation: boolean,
	route: boolean,
	nextInstructionInput: React.MutableRefObject<any>,
	nextIngredientInput: React.MutableRefObject<any>
) => {
	// return { ...useNewRecipeMethods(navigation, route), ...useSubmitRecipe(navigation, route) };
	const loggedInChef = useAppSelector((state) => state.root.loggedInChef);
	const [hasPermission, setHasPermission] = useState<boolean>(false);
	const [renderOfflineMessage, setRenderOfflineMessage] = useState<boolean>(false);
	const [isFocused, setIsFocused] = useState<boolean>(true);
	const [alertPopupShowing, setAlertPopupShowing] = useState<boolean>(false);
	const [helpShowing, setHelpShowing] = useState<boolean>(false);
	const [helpText, setHelpText] = useState<{ title: string; text: string }>();
	const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);
	const [autoCompleteFocused, setAutoCompleteFocused] = useState<boolean | null>(null);
	const [choosingPrimaryPicture, setChoosingPrimaryPicture] = useState<boolean>(false);
	const [choosingInstructionPicture, setChoosingInstructionPicture] = useState<boolean>(false);
	const [instructionImageIndex, setInstructionImageIndex] = useState<number>(0);
	const [filterDisplayed, setFilterDisplayed] = useState<boolean>(false);
	const [awaitingServer, setAwaitingServer] = useState<boolean>(false);
	const [scrollingEnabled, setScrollingEnabled] = useState<boolean>(true);
	const [errors, setErrors] = useState<string | string[]>([]);
	const [offlineDiagnostics, setOfflineDiagnostics] = useState<string>("");
	const [testing] = useState<boolean>(isDev);
	const [newRecipeDetails, setNewRecipeDetails] = useState<NewRecipe>(isDev ? testRecipe : emptyRecipe);
	const [instructionHeights, setInstructionHeights] = useState<number[]>([]);
	const [averageInstructionHeight, setAverageInstructionHeight] = useState<number>(responsiveHeight(6.5));

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
					// console.log('localNewRecipeDetails saved')
				});
			}
		},
		[newRecipeDetails, instructionHeights, averageInstructionHeight]
	);

	useEffect(() => {
		saveNewRecipeDetailsLocally();
	}, [newRecipeDetails, instructionHeights, averageInstructionHeight, saveNewRecipeDetailsLocally]);

	useEffect(() => {
		if (nextInstructionInput.current) {
			nextInstructionInput.current.focus();
		}
	}, [newRecipeDetails.instructions.length, nextInstructionInput]);

	useEffect(() => {
		if (nextIngredientInput.current) {
			nextIngredientInput.current.focus();
		}
	}, [newRecipeDetails.ingredients.length, nextIngredientInput]);

	const activateScrollView = () => setScrollingEnabled(true);

	const deactivateScrollView = () => setScrollingEnabled(false);

	const askToReset = () => setAlertPopupShowing(true);

	const choosePrimaryPicture = () => setChoosingPrimaryPicture(true);

	const primarySourceChosen = async () => setChoosingPrimaryPicture(false);

	const autocompleteIsFocused = (index: number) => setAutoCompleteFocused(index);

	const savePrimaryImages = (newImages: RecipeImage[]) => {
		setNewRecipeDetails({ ...newRecipeDetails, primaryImages: newImages });
	};

	const fetchIngredientsForAutoComplete = async () => {
		try {
			const ingredients = await fetchIngredients(loggedInChef.auth_token);
			if (ingredients) {
				setIngredientsList(ingredients);
			}
		} catch {
			// this.setState({ awaitingServer: false })
		}
	};

	const updateIngredientEntry = (index: number, name: string, quantity: string, unit: Unit) => {
		const newIngredients = newRecipeDetails.ingredients;
		newIngredients[index].name = name;
		newIngredients[index].quantity = quantity;
		newIngredients[index].unit = unit;
		setNewRecipeDetails({
			...newRecipeDetails,
			ingredients: newIngredients,
		});
	};

	const handleIngredientSort = async (newIngredients: RecipeIngredient[]) => {
		setNewRecipeDetails({
			...newRecipeDetails,
			ingredients: newIngredients,
		});
	};

	const addNewIngredient = () => {
		const ingredients = newRecipeDetails.ingredients;
		const newIngredients = [...ingredients, { name: "", quantity: "", unit: "Oz" as const }];
		setNewRecipeDetails({ ...newRecipeDetails, ingredients: newIngredients });
	};

	const removeIngredient = (index: number) => {
		const newIngredients = [...newRecipeDetails.ingredients];
		newIngredients.splice(index, 1);
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
			setNewRecipeDetails(emptyRecipe);
			// this.setState({
			// ...(testing ? testRecipe : emptyRecipe),
			// alertPopupShowing: false,
			// });
			navigation.setOptions({
				headerTitle: (props) => <AppHeader {...props} text={"Create a New Recipe"} route={route} />,
			});
		});
	};

	const clearEditRecipeDetails = async (editedRecipeSavedToDatabase) => {
		AsyncStorage.removeItem("localEditRecipeDetails", async () => {
			setAlertPopupShowing(false);
			if (route.params?.recipe_details !== undefined) {
				if (!editedRecipeSavedToDatabase) {
					// if you updated the saved recipe you don't want to refresh async store before leaving
					await setRecipeParamsForEditing(route.params.recipe_details);
				}
				setAlertPopupShowing(false);
			}

			// this.setState(
			// () => (testing ? testRecipe : emptyRecipe),
			// async () => {
			// if (this.props.route.params?.recipe_details !== undefined) {
			// if (!editedRecipeSavedToDatabase) {
			// if you updated the saved recipe you don't want to refresh async store before leaving
			// await this.setRecipeParamsForEditing(this.props.route.params.recipe_details);
			// }
			// this.setState({ alertPopupShowing: false });
			// }
			// }
			// );
		});
	};

	const handleCategoriesButton = () => {
		setFilterDisplayed(!filterDisplayed);
	};

	const handleInstructionChange = (text: string, index: number) => {
		const newInstructions = [...newRecipeDetails.instructions];
		newInstructions[index] = text;
		const newInstructionHeights = [...instructionHeights];
		setNewRecipeDetails({ ...newRecipeDetails, instructions: newInstructions });
		setInstructionHeights(newInstructionHeights);
	};

	const handleInstructionSizeChange = (index: number, size: number) => {
		const newInstructionHeights = [...instructionHeights];
		newInstructionHeights[index] = size + responsiveHeight(0.5);
		const newAverageInstructionHeight = parseFloat(
			(newInstructionHeights.reduce((acc, height) => acc + height, 0) / newInstructionHeights.length).toString()
		);
		setInstructionHeights(newInstructionHeights);
		setAverageInstructionHeight(newAverageInstructionHeight);
	};

	const handleInstructionsSort = (newInstructions: string[]) => {
		const newInstructionHeights = [];
		const newInstructionImages = [];
		newInstructions.forEach((instruction) => {
			const index = newRecipeDetails.instructions.indexOf(instruction);
			newInstructionHeights.push(instructionHeights[index]);
			newInstructionImages.push(newRecipeDetails.instructionImages[index]);
		});
		setNewRecipeDetails({
			...newRecipeDetails,
			instructions: newInstructions,
			instructionImages: newInstructionImages,
		});
		setInstructionHeights(newInstructionHeights);
	};

	const addNewInstruction = () => {
		const newInstructions = [...newRecipeDetails.instructions];
		newInstructions.push("");
		const newInstructionImages = [...newRecipeDetails.instructionImages, ""];
		const newInstructionHeights = [...instructionHeights, responsiveHeight(6.5)];
		const newAverageInstructionHeight =
			newInstructionHeights.reduce((acc, h) => acc + h, 0) / newInstructionHeights.length;
		setNewRecipeDetails({
			...newRecipeDetails,
			instructions: newInstructions,
			instructionImages: newInstructionImages,
		});
		setInstructionHeights(newInstructionHeights);
		setAverageInstructionHeight(newAverageInstructionHeight);
	};

	const removeInstruction = (index: number) => {
		const newInstructions = [...newRecipeDetails.instructions];
		newInstructions.splice(index, 1);
		const newInstructionHeights = [...instructionHeights];
		newInstructionHeights.splice(index, 1);
		const newInstructionImages = [...newRecipeDetails.instructionImages];
		newInstructionImages.splice(index, 1);
		const newAverageInstructionHeight =
			newInstructionHeights.length > 0
				? newInstructionHeights.reduce((acc, h) => acc + h, 0) / newInstructionHeights.length
				: 0;
		setNewRecipeDetails({
			...newRecipeDetails,
			instructions: newInstructions,
			instructionImages: newInstructionImages,
		});
		setInstructionHeights(newInstructionHeights);
		setAverageInstructionHeight(newAverageInstructionHeight);
	};

	const chooseInstructionPicture = (index: number) => {
		setChoosingInstructionPicture(true);
		setInstructionImageIndex(index);
	};

	const instructionSourceChosen = async () => {
		setChoosingInstructionPicture(false);
	};

	const saveInstructionImage = (image: ImagePicker.ImagePickerResult, index: number) => {
		console.log(image);
		console.log("canceled:", image.canceled);
		console.log("assets length:", image.assets.length);
		if (image.canceled === false && image.assets.length > 0) {
			const newInstructionImages = [...newRecipeDetails.instructionImages];
			console.log("imageURL:", image.assets[0].uri);
			newInstructionImages[index] = image.assets[0].uri;
			setNewRecipeDetails({
				...newRecipeDetails,
				instructionImages: newInstructionImages,
			});
		}
	};

	const cancelChooseInstructionImage = (image: string, index: number) => {
		const newInstructionImages = [...newRecipeDetails.instructionImages];
		newInstructionImages[index] = image;
		setChoosingInstructionPicture(false);
		setNewRecipeDetails({
			...newRecipeDetails,
			instructionImages: newInstructionImages,
		});
		setAwaitingServer(false);
		// return {
		// 	choosingPicture: false,
		// 	newRecipeDetails: {
		// 		...state.newRecipeDetails,
		// 		instructionImages: newInstructionImages,
		// 	},
		// 	awaitingServer: false,
		// };
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
			await Promise.all(
				newRecipeDetails.instructionImages.map((image, index) => {
					if (image) {
						return postInstructionImage(
							loggedInChef.id,
							loggedInChef.auth_token,
							recipe.instructions.sort((a, b) => (a.step > b.step ? 1 : -1))[index].id,
							image.id || 0,
							image // this sends the whole object if it's existing image, and it really shouldn't
						);
					}
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
						newRecipeDetails.instructions,
						// newRecipeDetails.instructionImages,
						newRecipeDetails.times.prepTime,
						newRecipeDetails.times.cookTime,
						newRecipeDetails.times.totalTime,
						newRecipeDetails.difficulty,
						// newRecipeDetails.primaryImages,
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
									screen: "My Recipes",
									params: { refresh: true },
								});
								// });
							}
						}
					}
				} catch (e) {
					if (e.name === "Logout") {
						navigation.navigate("ProfileCover", {
							screen: "Profile",
							params: { logout: true },
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
						newRecipeDetails.instructions,
						// newRecipeDetails.instructionImages,
						newRecipeDetails.times.prepTime,
						newRecipeDetails.times.cookTime,
						newRecipeDetails.times.totalTime,
						newRecipeDetails.difficulty,
						// newRecipeDetails.primaryImages,
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
							navigation.setParams({
								recipeDetails: { recipe: { id: recipe.recipe.id } },
							});
							const success = await postImages(newRecipeDetails, recipe);
							if (success) {
								setAwaitingServer(false);
								clearNewRecipeDetails();
								// this.props.navigation.popToTop() //clears Recipe Details and newRecipe screens from the view stack so that switching back to BrowseRecipes will go to the List and not another screen
								navigation.navigate("MyRecipeBook", {
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
							params: { logout: true },
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

	const setEditRecipeDetails = async () => {
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
	};

	const loadNewRecipeDetails = async () => {
		AsyncStorage.getItem("localNewRecipeDetails", (err, res) => {
			if (res != null) {
				const savedData = JSON.parse(res);
				if (
					"newRecipeDetails" in savedData &&
					"instructionHeights" in savedData &&
					"averageInstructionHeight" in savedData
				) {
					const { newRecipeDetails, instructionHeights, averageInstructionHeight } = savedData;
					setNewRecipeDetails(newRecipeDetails);
					setInstructionHeights(instructionHeights);
					setAverageInstructionHeight(averageInstructionHeight);
				}
			}
			setAwaitingServer(false);
		});
	};

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
		const newInstructionImages = recipeDetails.instructions.map((i) => {
			const image = recipeDetails.instruction_images.find((j) => j.instruction_id == i.id);
			if (image) {
				return image;
			} else {
				return "";
			}
		});
		setInstructionHeights(recipeDetails.instructions.map(() => responsiveHeight(6.5)));
		setAverageInstructionHeight(responsiveHeight(6.5));
		setErrors([]);
		setNewRecipeDetails({
			recipeId: recipe.id,
			name: recipe.name,
			instructions:
				recipeDetails.instructions.length > 0 ? recipeDetails.instructions.map((i) => i.instruction) : [],
			instructionImages: newInstructionImages.length > 0 ? newInstructionImages : [],
			ingredients: newIngredients.length > 0 ? newIngredients : [],
			difficulty: recipe.difficulty.toString(),
			times: {
				prepTime: recipe.prep_time > 0 ? recipe.prep_time : 0,
				cookTime: recipe.cook_time > 0 ? recipe.cook_time : 0,
				totalTime:
					recipe.total_time > 0 ? recipe.total_time : recipe.time ? getMinutesFromTimeString(recipe.time) : 0,
			},
			primaryImages:
				recipeDetails.recipe_images?.length > 0
					? recipeDetails.recipe_images
					: [
							{
								uri: "",
							},
					  ],
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

	return {
		loggedInChef,
		hasPermission,
		setHasPermission,
		renderOfflineMessage,
		setRenderOfflineMessage,
		isFocused,
		setIsFocused,
		alertPopupShowing,
		setAlertPopupShowing,
		helpShowing,
		setHelpShowing,
		helpText,
		setHelpText,
		ingredientsList,
		setIngredientsList,
		autoCompleteFocused,
		setAutoCompleteFocused,
		choosingPrimaryPicture,
		setChoosingPrimaryPicture,
		choosingInstructionPicture,
		setChoosingInstructionPicture,
		instructionImageIndex,
		setInstructionImageIndex,
		filterDisplayed,
		setFilterDisplayed,
		awaitingServer,
		setAwaitingServer,
		scrollingEnabled,
		setScrollingEnabled,
		errors,
		setErrors,
		offlineDiagnostics,
		setOfflineDiagnostics,
		testing,
		newRecipeDetails,
		setNewRecipeDetails,
		instructionHeights,
		setInstructionHeights,
		averageInstructionHeight,
		setAverageInstructionHeight,
		saveNewRecipeDetailsLocally,
		activateScrollView,
		deactivateScrollView,
		askToReset,
		choosePrimaryPicture,
		primarySourceChosen,
		autocompleteIsFocused,
		savePrimaryImages,
		fetchIngredientsForAutoComplete,
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
		postImages,
		submitRecipe,
		setEditRecipeDetails,
		loadNewRecipeDetails,
	};
};
