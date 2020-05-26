import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'
import { detailsTimeout } from '../dataComponents/timeouts'

export const destroyRecipe = (recipeID, auth_token) => {
    return new Promise((resolve, reject) => {
        
        setTimeout(()=>{
            reject()
        }, detailsTimeout)

        fetch(`${databaseURL}/recipes/${recipeID}`, {
            method: "DELETE",
            headers: {
            Authorization: `Bearer ${auth_token}`,
            'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(deleted => {
            if (deleted) {
                resolve(deleted)
            }
        })
        .catch(error => {
        })
    })
}