import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const patchRecipe = (
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
    recipeID,
    acknowledgement
    ) => {
    return new Promise((resolve) => {
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
                    instruction_images, instructionImages,
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
        }
        )
    })
}