import React, { useState } from "react";
import { useNewRecipeState } from "./useNewRecipeState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchIngredients } from "../../fetches/fetchIngredients";
import { Instruction, InstructionImage, RecipeImage, RecipeIngredient, Unit } from "../../centralTypes";
import AppHeader from "../../../navigation/appHeader";
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars
import { clearedFilters } from "../../dataComponents/clearedFilters";

const isDev = __DEV__ ? true : false;

export const useNewRecipeMethods = (navigation: boolean, route: boolean) => {
	const {
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
	} = useNewRecipeState();

	const saveNewRecipeDetailsLocally = (forceNew = false) => {
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
	};

	const activateScrollView = () => setScrollingEnabled(true);
	const deactivateScrollView = () => setScrollingEnabled(false);
	const askToReset = () => setAlertPopupShowing(true);
	const choosePrimaryPicture = () => setChoosingPrimaryPicture(true);
	const primarySourceChosen = async () => setChoosingPrimaryPicture(false);
	const autocompleteIsFocused = (index: number) => autoCompleteFocused(index);

	const savePrimaryImages = (newImages: RecipeImage[]) => {
		setNewRecipeDetails({ ...newRecipeDetails, primaryImages: newImages });
		saveNewRecipeDetailsLocally();
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
		saveNewRecipeDetailsLocally();
	};

	const handleIngredientSort = async (newIngredients: RecipeIngredient[]) => {
		setNewRecipeDetails({
			...newRecipeDetails,
			ingredients: newIngredients,
		});
		saveNewRecipeDetailsLocally();
	};

	const addNewIngredient = () => {
		const ingredients = newRecipeDetails.ingredients;
		const newIngredients = [...ingredients, { name: "", quantity: "", unit: "Oz" }];
		setNewRecipeDetails({ ...newRecipeDetails, ingredients: newIngredients });
		saveNewRecipeDetailsLocally();
		this.nextIngredientInput.focus();
	};

	const removeIngredient = (index: number) => {
		const newIngredients = [...newRecipeDetails.ingredients];
		newIngredients.splice(index, 1);
		setNewRecipeDetails({ ...newRecipeDetails, ingredients: newIngredients });
		saveNewRecipeDetailsLocally();
	};

	const handleInput = (text: string, parameter: string) => {
		setNewRecipeDetails({ ...newRecipeDetails, [parameter]: text });
		saveNewRecipeDetailsLocally();
	};

	const clearNewRecipeDetails = async () => {
		AsyncStorage.removeItem("localNewRecipeDetails", async () => {
			setAlertPopupShowing(false);
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
					await this.setRecipeParamsForEditing(route.params.recipe_details);
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
		saveNewRecipeDetailsLocally();
	};

	const handleInstructionChange = (text: string, index: number) => {
		const newInstructions = [...newRecipeDetails.instructions];
		newInstructions[index] = text;
		const newInstructionHeights = [...instructionHeights];
		setNewRecipeDetails({ ...newRecipeDetails, instructions: newInstructions });
		setInstructionHeights(newInstructionHeights);
		saveNewRecipeDetailsLocally();
	};

	const handleInstructionSizeChange = (index: number, size: number) => {
		const newInstructionHeights = [...instructionHeights];
		newInstructionHeights[index] = size + responsiveHeight(0.5);
		const newAverageInstructionHeight = parseFloat(
			newInstructionHeights.reduce((acc, height) => acc + height, 0) / newInstructionHeights.length
		);
		setInstructionHeights(newInstructionHeights);
		setAverageInstructionHeight(newAverageInstructionHeight);
	};

	const handleInstructionsSort = (newInstructions: Instruction[]) => {
		// this.setState((state) => {
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
		saveNewRecipeDetailsLocally();
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
		saveNewRecipeDetailsLocally();
		// this.nextInstructionInput.focus();
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
		saveNewRecipeDetailsLocally();
	};

	const chooseInstructionPicture = (index: number) => {
		setChoosingInstructionPicture(true);
		setInstructionImageIndex(index);
	};

	const instructionSourceChosen = async () => {
		setChoosingInstructionPicture(false);
		saveNewRecipeDetailsLocally();
	};

	const saveInstructionImage = (image: InstructionImage, index: number) => {
		// this.setState({ awaitingServer: true }, async () => {
		if (image.cancelled === false) {
				const newInstructionImages = [...newRecipeDetails.instructionImages];
				newInstructionImages[index] = image.uri;
				setChoosingInstructionPicture(false);
				setNewRecipeDetails({
					...newRecipeDetails,
					instructionImages: newInstructionImages,
				})
				saveNewRecipeDetailsLocally();
				// return {
					// choosingPicture: false,
					// awaitingServer: false
				};
			// } else {
			// this.setState({ awaitingServer: false })
		}
		// })
	// };

	const cancelChooseInstructionImage = (image: InstructionImage, index: number) => {
			const newInstructionImages = [...newRecipeDetails.instructionImages];
			newInstructionImages[index] = image;
			setChoosingInstructionPicture(false);
			setNewRecipeDetails({
				...newRecipeDetails,
				instructionImages: newInstructionImages,
			})
			saveNewRecipeDetailsLocally();
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
		})
		saveNewRecipeDetailsLocally();
	};

	const clearFilterSettings = () => {
		setNewRecipeDetails({
			...newRecipeDetails,
			filter_settings: clearedFilters,
			cuisine: "Any",
			serves: "Any",
		})
		saveNewRecipeDetailsLocally();
	};

	return {
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
		clearFilterSettings
	};
};
