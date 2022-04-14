const { chefDetails } = require("../__mocks__/data/chefDetails")
const { chefList } = require("../__mocks__/data/chefList")
const { cuisines } = require("../__mocks__/data/cuisines")
const { filters } = require("../__mocks__/data/filters")
const { ingredients } = require("../__mocks__/data/ingredients")
const { recipeDetails } = require("../__mocks__/data/recipeDetails")
const { recipeList } = require("../__mocks__/data/recipeList")
const { serves } = require("../__mocks__/data/serves")

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