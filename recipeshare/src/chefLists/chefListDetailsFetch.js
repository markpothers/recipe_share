import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'


export const fetchChefDetails = (chefs, auth_token) => {

    return new Promise((resolve) => {
        fetch(`${databaseURL}/chefs/details`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${auth_token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            details: {listed_chefs: chefs}
            })
        })
        .then(res => res.json())
        .then(chefListDetails => {
            resolve(chefListDetails)
        })
    })

}
