import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'
import { listsTimeout } from '../dataComponents/timeouts'

export const getChefList = (listType, queryChefID, limit, offset, auth_token) => {

    return new Promise((resolve, reject) => {
        // console.log(databaseURL)
        
        setTimeout(()=>{
            reject()
        }, listsTimeout)

        fetch(`${databaseURL}/chefs?listType=${listType}&queryChefID=${queryChefID}&limit=${limit}&offset=${offset}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${auth_token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(chefs => {
            // console.log(recipes)
            resolve(chefs)
        })
        .catch(error => {
        })
    })
}