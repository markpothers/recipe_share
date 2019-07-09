import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const getChefDetails = (chef_id, auth_token) => {
    return new Promise((resolve) => {
        fetch(`${databaseURL}/chefs/${chef_id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${auth_token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(chef_details => {
            if (chef_details) {
                resolve(chef_details)
            }
        })
    })
}
