import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const postReShare = (recipeID, chefID, auth_token) => {
    return new Promise((resolve) => {
        fetch(`${databaseURL}/re_shares`, {
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
        .then(re_share => {
            if (re_share == true) {
                resolve(re_share)
            }
        }
        )
    })
}