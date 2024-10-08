import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recipe } from "../centralTypes";

const saveRecipeDetailsLocally = (recipeDetails: Recipe & { dateSaved: number }, userId: number) => {
	AsyncStorage.getItem("localRecipeDetails", (err, res) => {
		if (res != null) {
			const localRecipeDetails = JSON.parse(res);
			let newRecipesList = localRecipeDetails.filter(
				(localRecipe) => localRecipe.recipe && localRecipe.recipe.id !== recipeDetails.recipe.id
			);
			const date = new Date().getTime();
			recipeDetails.dateSaved = date;
			newRecipesList.push(recipeDetails);

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
			AsyncStorage.setItem("localRecipeDetails", JSON.stringify(newRecipesList));
		} else {
			const newRecipesList = [recipeDetails];
			AsyncStorage.setItem("localRecipeDetails", JSON.stringify(newRecipesList));
		}
	});
};

export default saveRecipeDetailsLocally;
