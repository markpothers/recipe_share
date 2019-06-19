import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const destroyRecipeLike = (recipeID, chefID, auth_token) => {
    return new Promise((resolve) => {
        fetch(`${databaseURL}/recipe_likes`, {
            method: "DELETE",
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
        .then(unlike => {
            if (unlike == true) {
                resolve(unlike)
            }
        })
    })
}