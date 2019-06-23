import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const postComment = (recipeID, chefID, auth_token, comment) => {
    return new Promise((resolve) => {
        fetch(`${databaseURL}/comments`, {
            method: "POST",
            headers: {
            Authorization: `Bearer ${auth_token}`,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            comment: {
                recipe_id: recipeID,
                chef_id: chefID,
                comment: comment
            }
            })
        })
        .then(res => res.json())
        .then(comments => {
            if (comments) {
                resolve(comments)
            }
        }
        )
    })
}