import { Difficulty, FilterSettings, Ingredient, Cuisine, Serves, Recipe, Instruction } from "../centralTypes"
import { databaseURL } from "../dataComponents/databaseURL"
import { submitTimeout } from "../dataComponents/timeouts"
// import { getBase64FromFile } from '../auxFunctions/getBase64FromFile.js'

export const postRecipe = async (
	chef_id: number,
	auth_token: string,
	name: string,
	ingredients: Ingredient[],
	instructions: string[],
	// instructionImages,
	prep_time: number,
	cook_time: number,
	total_time: number,
	difficulty: Difficulty,
	// primaryImages,
	filter_settings: FilterSettings,
	cuisine: Cuisine,
	serves: Serves,
	acknowledgement: string,
	acknowledgementLink: string,
	description: string,
	showBlogPreview: boolean
): Promise<{ recipe: Recipe; instructions: Instruction[] } | { error: boolean; message: string[] }> => {
	// let primaryImagesForRails = await Promise.all(primaryImages.map(async (image, index) => {
	// 	if (image.uri) {
	// 		return {
	// 			index: index,
	// 			base64: await getBase64FromFile(image.uri)
	// 		}
	// 	} else if (image.image_url) {
	// 		return {
	// 			index: index,
	// 			...image
	// 		}
	// 	}
	// }))

	//format for Rails Strong params to permit an object or base64 data
	// let instructionImagesForRails = await Promise.all(instructionImages.map(async (image, index) => {
	// 	if (typeof image === 'string') {
	// 		return {
	// 			index: index,
	// 			base64: await getBase64FromFile(image),
	// 		}
	// 	} else {
	// 		return {
	// 			index: index,
	// 			...image
	// 		}
	// 	}
	// }))

	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" })
		}, submitTimeout)

		// had to add this validation in here because doing it in rails doesn't work
		// you end up rejecting everything because you don't save instructions and ingredients
		// until you've already saved the recipe once
		if (!showBlogPreview && (ingredients.length == 0 || instructions.length == 0)) {
			resolve({
				error: true,
				message: [
					"If not showing blog preview, a recipe must contain at least one ingredient and one instruction step. Add one of each or check 'Show blog preview'.",
				],
			})
			return
		}

		fetch(`${databaseURL}/recipes`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				recipe: {
					chef_id: chef_id,
					name: name || "",
					ingredients: ingredients,
					instructions: instructions,
					// instruction_images: instructionImagesForRails,
					prep_time: prep_time,
					cook_time: cook_time,
					total_time: total_time,
					difficulty: difficulty,
					// primary_images: primaryImagesForRails,
					filter_settings: filter_settings,
					cuisine: cuisine,
					serves: serves,
					acknowledgement: acknowledgement || "",
					acknowledgement_link: acknowledgementLink?.toLowerCase().trim() || "",
					description: description || "",
					show_blog_preview: showBlogPreview,
				},
			}),
		})
			.then((res) => res.json())
			.then((recipe) => {
				if (recipe.error && recipe.message == "Invalid authentication") {
					reject({ name: "Logout" })
				}
				if (recipe) {
					// console.log(recipe)
					resolve(recipe)
				}
			})
			.catch((e) => {
				reject(e)
			})
	})
}
