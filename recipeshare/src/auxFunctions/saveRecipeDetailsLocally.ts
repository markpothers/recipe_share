import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recipe } from "../centralTypes";

const saveRecipeDetailsLocally = async (
	recipeDetails: Recipe & { dateSaved: number },
	userId: number
): Promise<void> => {
	try {
		const res = await AsyncStorage.getItem("localRecipeDetails");
		const date = new Date().getTime();
		recipeDetails.dateSaved = date;

		let newRecipesList: (Recipe & { dateSaved: number })[];

		if (res != null) {
			const localRecipeDetails = JSON.parse(res);
			newRecipesList = localRecipeDetails.filter(
				(localRecipe) => localRecipe.recipe && localRecipe.recipe.id !== recipeDetails.recipe.id
			);
			newRecipesList.push(recipeDetails);
		} else {
			newRecipesList = [recipeDetails];
		}

		//get rid of recipes that have been saved too long
		const oneWeek = 1000 * 60 * 60 * 24 * 7;
		const threeMonths = 1000 * 60 * 60 * 24 * 90;
		newRecipesList = newRecipesList.filter((listRecipe) => {
			if (listRecipe.recipe.chef_id == userId) {
				//keep user recipes forever
				return true;
			} else if (listRecipe.dateSaved >= date - oneWeek) {
				//keep viewed recipes for one month
				return true;
			} else if (!listRecipe.likeable && listRecipe.dateSaved >= date - threeMonths) {
				//keep liked recipes for three months
				return true;
			} else {
				return false;
			}
		});

		await AsyncStorage.setItem("localRecipeDetails", JSON.stringify(newRecipesList));
	} catch {
		// Handle errors gracefully - silent fail for local storage
	}
};

export default saveRecipeDetailsLocally;
