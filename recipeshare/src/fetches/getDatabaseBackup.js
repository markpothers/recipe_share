import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const getDatabaseBackup = (auth_token, method) => {

    return new Promise((resolve) => {
        // console.log(auth_token)
        fetch(`${databaseURL}/database/${method}backup`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${auth_token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(confirmation => {
            // console.log(confirmation)
            resolve(confirmation)
        })
    })
}