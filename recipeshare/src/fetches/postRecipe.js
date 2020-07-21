import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'
import { detailsTimeout } from '../dataComponents/timeouts'

export const postRecipe = (
	chef_id,
	auth_token,
	name,
	ingredients,
	instructions,
	instructionImages,
	time,
	difficulty,
	primaryImageBase64,
	filter_settings,
	cuisine,
	serves,
	acknowledgement
) => {
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject()
		}, detailsTimeout)

		//format for Rails Strong params to permit an object or base64 data
		instructionImagesForRails = instructionImages.map((image, index) => {
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
					time: time,
					difficulty: difficulty,
					primaryImageBase64: primaryImageBase64,
					filter_settings: filter_settings,
					cuisine: cuisine,
					serves: serves,
					acknowledgement: acknowledgement
				}
			})
		})
			.then(res => res.json())
			.then(recipe => {
				if (recipe) {
					// console.log(recipe)
					resolve(recipe)
				}
			})
			.catch(error => {
			})
	})
}
