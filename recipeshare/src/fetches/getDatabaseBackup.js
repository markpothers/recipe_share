import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'
import { actionTimeout } from '../dataComponents/timeouts'

export const getDatabaseBackup = (auth_token, method) => {

    return new Promise((resolve, reject) => {
        // console.log(auth_token)
        
        setTimeout(()=>{
            reject()
        }, actionTimeout)

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
        .catch(error => {
        })
    })
}