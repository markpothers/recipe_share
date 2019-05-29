import React from 'react'
import { databaseURL } from './databaseURL'


export const fetchRecipeDetails = (recipe_ids, auth_token) => {

    return new Promise((resolve) => {
        fetch(`${databaseURL}/recipes/details`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${auth_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                details: {listed_recipes: recipe_ids}
                })
        })
        .then(res => res.json())
        .then(recipe_details => {
            resolve(recipe_details)
        })
    })
}
