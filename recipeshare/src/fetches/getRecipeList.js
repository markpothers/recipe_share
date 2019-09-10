import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const getRecipeList = (listType, queryChefID, limit, offset, global_ranking, auth_token, filter_settings, cuisine, serves) => {

    const filters = Object.keys(filter_settings).filter( category => filter_settings[category] === true).join("/").toLowerCase()

    return new Promise((resolve) => {
        // console.log(databaseURL)
        fetch(`${databaseURL}/recipes?listType=${listType}&queryChefID=${queryChefID}&limit=${limit}&offset=${offset}&global_ranking=${global_ranking}&filters=${filters}&cuisine=${cuisine}&serves=${serves}`, {
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