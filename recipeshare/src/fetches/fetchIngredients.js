import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const fetchIngredients = (auth_token) => {
    return new Promise((resolve) => {
        fetch(`${databaseURL}/ingredients`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${auth_token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(ingredients => {
            if (ingredients) {
                resolve(ingredients)
            }
        })
    })
}
