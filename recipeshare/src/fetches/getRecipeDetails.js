import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const getRecipeDetails = (recipe_id, auth_token) => {
    return new Promise((resolve) => {
        fetch(`${databaseURL}/recipes/${recipe_id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${auth_token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(recipe_details => {
            if (recipe_details) {
                resolve(recipe_details)
            }
        })
    })
}