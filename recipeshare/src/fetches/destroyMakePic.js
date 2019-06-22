import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const destroyMakePic = (chefID, auth_token, makePicID) => {
    return new Promise((resolve) => {
        fetch(`${databaseURL}/make_pics/${makePicID}`, {
            method: "DELETE",
            headers: {
            Authorization: `Bearer ${auth_token}`,
            'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(destroyed => {
            if (destroyed == true) {
                resolve(destroyed)
            }
        })
    })
}