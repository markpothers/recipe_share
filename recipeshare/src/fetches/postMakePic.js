import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const postMakePic = (recipeID, chefID, auth_token, base64) => {
    return new Promise((resolve) => {
        fetch(`${databaseURL}/make_pics`, {
            method: "POST",
            headers: {
            Authorization: `Bearer ${auth_token}`,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            recipe: {
                recipe_id: recipeID,
                chef_id: chefID,
                base64: base64
            }
            })
        })
        .then(res => res.json())
        .then(makepic => {
            if (makepic) {
                resolve(makepic)
            }
        }
        )
    })
}