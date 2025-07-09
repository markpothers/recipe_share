import { chefDetails } from "../__mocks__/data/chefDetails";
import { chefList } from "../__mocks__/data/chefList";
import { cuisines } from "../__mocks__/data/cuisines";
import { filters } from "../__mocks__/data/filters";
import { ingredients } from "../__mocks__/data/ingredients";
import { recipeDetails } from "../__mocks__/data/recipeDetails";
import { recipeList } from "../__mocks__/data/recipeList";
import { serves } from "../__mocks__/data/serves";

let data = () => {
	return {
		recipes: {
			recipes: recipeList,
			cuisines: cuisines,
			serves: serves,
			filters: filters
		},
		recipeDetails: recipeDetails,
		chefs: chefList,
		chefDetails: chefDetails,
		availableFilters: {
			cuisines: cuisines,
			serves: serves,
			filters: filters
		},
		recipeLikes: [],
		recipeMakes: [],
		comments: [],
		follows: [],
		reShares: [],
		logs: [],
		ingredients: ingredients
	}
}


module.exports = data
