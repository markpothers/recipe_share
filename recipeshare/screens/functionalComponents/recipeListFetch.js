import React from 'react'
import { databaseURL } from './databaseURL'

export const fetchRecipeList = (listType, chef_id, limit, offset, global_ranking, auth_token) => {

    return new Promise((resolve) => {
        fetch(`${databaseURL}/recipes/index`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${auth_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recipe: {
                listType: listType,
                chef_id: chef_id,
                limit: limit,
                offset: offset,
                ranking: global_ranking
                }
            })
        })
        .then(res => res.json())
        .then(recipes => {
            resolve(recipes)
        })
    })
}