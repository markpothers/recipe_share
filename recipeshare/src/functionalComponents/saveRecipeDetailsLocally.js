import React from 'react';
import { AsyncStorage } from 'react-native';
import { detailsTimeout } from '../dataComponents/timeouts';


const saveRecipeDetailsLocally = (recipeDetails, userId) => {
	AsyncStorage.getItem('localRecipeDetails', (err, res) => {
		if (res != null) {
			let localRecipeDetails = JSON.parse(res)
			let newRecipesList = localRecipeDetails.filter(localRecipe => localRecipe.recipe.id !== recipeDetails.recipe.id)
			const date = new Date().getTime()
			recipeDetails.dateSaved = date
			newRecipesList.push(recipeDetails)

			//get rid of recipes that have been saved too long
			const oneWeek = 1000 * 60 * 60 * 24 * 7
			const threeMonths = 1000 * 60 * 60 * 24 * 90
			newRecipesList = newRecipesList.filter(listRecipe => {
				// console.log(listRecipe.recipe.id)
				// console.log(listRecipe)
				if (listRecipe.recipe.chef_id == userId) { //keep user recipes forever
					// console.log('recipe is mine')
					return listRecipe
				} else if (listRecipe.dateSaved >= date - oneWeek) { //keep viewed recipes for one month
					// console.log('recipe is young')
					return listRecipe
				} else if (!listRecipe.likeable && listRecipe.dateSaved >= date - threeMonths) { //keep liked recipes for three months
					// console.log('recipe is liked')
					return listRecipe
				} else {

				}
			})
			AsyncStorage.setItem('localRecipeDetails', JSON.stringify(newRecipesList), () => {
				// console.log('localRecipeDetails saved')
			})
		} else {
			console.log('mark')
			let newRecipesList = [recipeDetails]
			AsyncStorage.setItem('localRecipeDetails', JSON.stringify(newRecipesList), () => {
				// console.log('initial recipe  saved')
			})
		}
	})
}

export default saveRecipeDetailsLocally
