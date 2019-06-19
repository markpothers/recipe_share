import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const fetchRecipeList = (listType, chef_id, limit, offset, global_ranking, auth_token) => {

    return new Promise((resolve) => {
        // console.log(databaseURL)
        fetch(`${databaseURL}/recipes?listType=${listType}&chef_id=${chef_id}&limit=${limit}&offset=${offset}&global_ranking=${global_ranking}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${auth_token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(recipes => {
            resolve(recipes)
        })
    })
}