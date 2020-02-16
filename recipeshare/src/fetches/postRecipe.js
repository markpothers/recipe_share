import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const postRecipe = (chef_id, auth_token, name, ingredients, instructions, instructionsOrder, time, difficulty, imageBase64, filter_settings, cuisine, serves, acknowledgement) => {
    return new Promise((resolve) => {
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
                    instructionsOrder: instructionsOrder,
                    time: time,
                    difficulty: difficulty,
                    imageBase64: imageBase64,
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