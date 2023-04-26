import { useState } from "react";
import { useNewRecipeState } from "./useNewRecipeState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchIngredients } from "../../fetches/fetchIngredients";
import { RecipeImage, RecipeIngredient, Unit } from "../../centralTypes";
import { useNewRecipeMethods } from "./useNewRecipeMethods";
import { Keyboard } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { patchRecipe } from "../../fetches/patchRecipe";
import { postRecipeImage } from "../../fetches/postRecipeImage";
import { postInstructionImage } from "../../fetches/postInstructionImage";
import { postRecipe } from "../../fetches/postRecipe";

export const useSubmitRecipe = (navigation: boolean, route: boolean) => {
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
	const {
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
		clearEditRecipeDetails
	} = useNewRecipeMethods(navigation, route);

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
			setErrors({
				errors: "The recipe saved successfully but not all the images could be saved. Please finish submission now or later to try again. Your recipe will be visible without those images that failed already.",
				awaitingServer: false,
			});
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
			// console.log(newRecipeDetails)
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

							async () => {
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
							};
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

	return {
		postImages,
		submitRecipe,
	};
};
