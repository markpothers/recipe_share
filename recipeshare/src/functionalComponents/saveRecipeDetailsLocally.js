import React from 'react';
import { AsyncStorage } from 'react-native';
import { detailsTimeout } from '../dataComponents/timeouts';


const saveRecipeDetailsLocally = (recipeDetails, userId) => {
    // console.log(userId)
    console.log('saving locally')

    // AsyncStorage.removeItem('localRecipeDetails')

    AsyncStorage.getItem('localRecipeDetails', (err, res) => {
        if (res != null) {
            // console.log(recipeDetails)
            let localRecipeDetails = JSON.parse(res)
            // console.log(localRecipeDetails[0].recipe.id)
            // console.log(recipeDetails.recipe.id)
            console.log(localRecipeDetails.length)
            let newRecipesList = localRecipeDetails.filter(localRecipe => localRecipe.recipe.id !== recipeDetails.recipe.id)
            // console.log(recipeStoredLocally)

            const date = new Date().getTime()
            recipeDetails.dateSaved = date
            // console.log('date')
            // console.log(date)
            newRecipesList.push(recipeDetails)

            //get rid of recipes that have been saved too long
            const oneMonth = 1000 * 60 * 60 * 24 * 30
            const threeMonths = 1000 * 60 * 60 * 24 * 90
            newRecipesList = newRecipesList.filter(listRecipe => {
                console.log(listRecipe.recipe.id)
                // console.log(listRecipe)
                if (listRecipe.recipe.chef_id == userId){ //keep user recipes forever
                    console.log('recipe is mine')
                    return listRecipe
                } else if (listRecipe.dateSaved >= date - oneMonth) { //keep viewed recipes for one month
                    console.log('recipe is young')
                    return listRecipe
                } else if (!listRecipe.likeable && listRecipe.dateSaved >= date - threeMonths){ //keep liked recipes for three months
                    console.log('recipe is liked')
                    return listRecipe
                } else {
                    console.log('recipe not saved')
                    // console.log(listRecipe)
                    // console.log('chef if')
                    // console.log(listRecipe.recipe.chef_id)
                    // console.log('date saved')
                    // console.log(date.getTime())
                    // console.log(date - oneMonth)
                    // console.log()
                    // console.log('<1 month old?')
                    // console.log(listRecipe.dateSaved >= date - oneMonth)
                }
            })

            AsyncStorage.setItem('localRecipeDetails', JSON.stringify(newRecipesList), () => {
                console.log('localRecipeDetails saved')
            })
        } else {
            console.log('mark')
            let newRecipesList = [recipeDetails]
            AsyncStorage.setItem('localRecipeDetails', JSON.stringify(newRecipesList), () => {
                console.log('initial recipe  saved')
            })
        }
    })
}

export default saveRecipeDetailsLocally