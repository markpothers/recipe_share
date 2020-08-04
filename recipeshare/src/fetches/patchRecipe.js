import { databaseURL } from '../dataComponents/databaseURL'
import { detailsTimeout } from '../dataComponents/timeouts'

export const patchRecipe = (
	chef_id,
	auth_token,
	name,
	ingredients,
	instructions,
	instructionImages,
	time,
	difficulty,
	primaryImages,
	filter_settings,
	cuisine,
	serves,
	recipeID,
	acknowledgement,
	description
) => {
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject()
		}, detailsTimeout)

		let primaryImagesForRails = primaryImages.map((image, index) => {
			if (image.base64 && image.base64 != 'data:image/jpeg;base64,'){
				return {
					index: index,
					base64: image.base64
				}
			} else if (image.image_url) {
				return {
					index: index,
					...image
				}
			}
		})

		//format for Rails Strong params to permit an object or base64 data
		let instructionImagesForRails = instructionImages.map((image, index) => {
			if (typeof image === 'string') {
				return {
					index: index,
					base64: image,
				}
			} else {
				return {
					index: index,
					...image
				}
			}
		})

		fetch(`${databaseURL}/recipes/${recipeID}`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				recipe: {
					chef_id: chef_id,
					name: name,
					ingredients: ingredients,
					instructions: instructions,
					instruction_images: instructionImagesForRails,
					time: time,
					difficulty: difficulty,
					primary_images: primaryImagesForRails,
					filter_settings: filter_settings,
					cuisine: cuisine,
					serves: serves,
					acknowledgement: acknowledgement,
					description: description
				}
			})
		})
			.then(res => res.json())
			.then(recipe => {
				if (recipe) {
					resolve(recipe)
				}
			})
			.catch( () => {
			})
	})
}
