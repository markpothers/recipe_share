import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const destroyChef = (auth_token, chefID, deleteRecipes) => {
    return new Promise((resolve) => {
        fetch(`${databaseURL}/chefs/${chefID}?deleteRecipes=${deleteRecipes}`, {
            method: "DELETE",
            headers: {
            Authorization: `Bearer ${auth_token}`,
            'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(deletedChef => {
            if (deletedChef) {
                resolve(deletedChef)
            }
        })
    })
}