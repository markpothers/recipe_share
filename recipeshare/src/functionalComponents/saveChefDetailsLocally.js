import React from 'react';
import { AsyncStorage } from 'react-native';
import { detailsTimeout } from '../dataComponents/timeouts';


const saveChefDetailsLocally = (chefDetails, userId) => {
	// console.log(userId)
	// console.log('saving chef locally')

	// AsyncStorage.removeItem('localChefDetails')

	AsyncStorage.getItem('localChefDetails', (err, res) => {
		if (res != null) {
			// console.log(chefDetails)
			let localChefDetails = JSON.parse(res)
			// console.log(localChefDetails[0].recipe.id)
			// console.log(chefDetails.recipe.id)
			// console.log(localChefDetails.length)
			let newChefsList = localChefDetails.filter(localChef => localChef.chef.id !== chefDetails.chef.id)
			// console.log(recipeStoredLocally)

			const date = new Date().getTime()
			chefDetails.dateSaved = date
			// console.log('date')
			// console.log(date)
			newChefsList.push(chefDetails)

			//get rid of recipes that have been saved too long
			const oneWeek = 1000 * 60 * 60 * 24 * 7
			// const threeMonths = 1000 * 60 * 60 * 24 * 90
			newChefsList = newChefsList.filter(listChef => {
				// console.log(listChef.recipe.id)
				// console.log(listChef)
				if (listChef.chef.id == userId) { //keep my own details
					// console.log('chef is me')
					return listChef
				} else if (listChef.dateSaved >= date - oneWeek) { //keep viewed recipes for one month
					// console.log('recipe is young')
					return listChef
				} else {
					// console.log('recipe not saved')
					// console.log(listChef)
					// console.log('chef if')
					// console.log(listChef.recipe.chef_id)
					// console.log('date saved')
					// console.log(date.getTime())
					// console.log(date - oneWeek)
					// console.log()
					// console.log('<1 month old?')
					// console.log(listChef.dateSaved >= date - oneWeek)
				}
			})
			AsyncStorage.setItem('localChefDetails', JSON.stringify(newChefsList), () => {
				// console.log('localChefDetails saved')
				// console.log('clearing?')
				// AsyncStorage.removeItem('localChefDetails')
			})
		} else {
			// console.log('mark')
			let newChefsList = [chefDetails]
			AsyncStorage.setItem('localChefDetails', JSON.stringify(newChefsList), () => {
				// console.log('initial recipe  saved')
			})
		}
	})
}

export default saveChefDetailsLocally
