import { databaseURL } from '../dataComponents/databaseURL'
import { submitTimeout } from '../dataComponents/timeouts'
import { getBase64FromFile } from '../auxFunctions/getBase64FromFile.js'

export const postRecipe = async (
	chef_id,
	auth_token,
	name,
	ingredients,
	instructions,
	instructionImages,
	prep_time,
	cook_time,
	total_time,
	difficulty,
	primaryImages,
	filter_settings,
	cuisine,
	serves,
	acknowledgement,
	acknowledgementLink,
	description
) => {

	let primaryImagesForRails = await Promise.all(primaryImages.map(async (image, index) => {
		if (image.uri) {
			return {
				index: index,
				base64: await getBase64FromFile(image.uri)
			}
		} else if (image.image_url) {
			return {
				index: index,
				...image
			}
		}
	}))

	//format for Rails Strong params to permit an object or base64 data
	let instructionImagesForRails = await Promise.all(instructionImages.map(async (image, index) => {
		if (typeof image === 'string') {
			return {
				index: index,
				base64: await getBase64FromFile(image),
			}
		} else {
			return {
				index: index,
				...image
			}
		}
	}))

	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject()
		}, submitTimeout)

		fetch(`${databaseURL}/recipes`, {
			method: "POST",
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
					prep_time: prep_time,
					cook_time: cook_time,
					total_time: total_time,
					difficulty: difficulty,
					primary_images: primaryImagesForRails,
					filter_settings: filter_settings,
					cuisine: cuisine,
					serves: serves,
					acknowledgement: acknowledgement,
					acknowledgement_link: acknowledgementLink,
					description: description
				}
			})
		})
			.then(res => res.json())
			.then(recipe => {
				if (recipe.error && recipe.message == "Invalid authentication") {
					reject("logout")
				}
				if (recipe) {
					// console.log(recipe)
					resolve(recipe)
				}
			})
			.catch(() => {
				reject()
			})
	})
}
