import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const getRecipeList = (listType, queryChefID, limit, offset, global_ranking, auth_token) => {

    return new Promise((resolve) => {
        // console.log(queryChefID)
        fetch(`${databaseURL}/recipes?listType=${listType}&queryChefID=${queryChefID}&limit=${limit}&offset=${offset}&global_ranking=${global_ranking}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${auth_token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(recipes => {
            // console.log(recipes)
            resolve(recipes)
        })
    })
}