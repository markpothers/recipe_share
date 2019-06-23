import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const destroyComment = (auth_token, commentID) => {
    return new Promise((resolve) => {
        fetch(`${databaseURL}/comments/${commentID}`, {
            method: "DELETE",
            headers: {
            Authorization: `Bearer ${auth_token}`,
            'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(comments => {
            if (comments) {
                resolve(comments)
            }
        })
    })
}