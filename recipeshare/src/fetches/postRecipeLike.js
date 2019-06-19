import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const postRecipeLike = (recipeID, chefID, auth_token) => {
    return new Promise((resolve) => {
        fetch(`${databaseURL}/recipe_likes`, {
            method: "POST",
            headers: {
            Authorization: `Bearer ${auth_token}`,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            recipe: {
                recipe_id: recipeID,
                chef_id: chefID,
            }
            })
        })
        .then(res => res.json())
        .then(like => {
            if (like == true) {
                resolve(like)
            }
        }
        )
    })
}