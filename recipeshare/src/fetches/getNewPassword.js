import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'
import { actionTimeout } from '../dataComponents/timeouts'

export const getNewPassword = (e_mail) => {
    return new Promise((resolve, reject) => {
        // console.log(databaseURL)
        
        setTimeout(()=>{
            reject()
        }, actionTimeout)

        fetch(`${databaseURL}/password_reset?email=${e_mail}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(response => {
            // console.log(response)
            resolve(response)
        })
        .catch(error => {
        })
    })
}