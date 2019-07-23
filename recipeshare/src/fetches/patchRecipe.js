import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const patchRecipe = (chef_id, auth_token, name, ingredients, instructions, time, difficulty, imageBase64, filter_settings, cuisine, serves, recipeID) => {
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
                    time: time,
                    difficulty: difficulty,
                    imageBase64: imageBase64,
                    filter_settings: filter_settings,
                    cuisine: cuisine,
                    serves: serves
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