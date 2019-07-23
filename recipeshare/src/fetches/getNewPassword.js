import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const getNewPassword = (e_mail) => {
    return new Promise((resolve) => {
        // console.log(databaseURL)
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
    })
}