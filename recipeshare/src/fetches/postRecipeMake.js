import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const postRecipeMake = (recipeID, chefID, auth_token) => {
    return new Promise((resolve) => {
        fetch(`${databaseURL}/recipe_makes`, {
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
        .then(make => {
            if (make == true) {
                resolve(make)
            }
        }
        )
    })
}