import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const destroyFollow = (follower_id, followee_id, auth_token) => {
    return new Promise((resolve) => {
        fetch(`${databaseURL}/follows`, {
            method: "DELETE",
            headers: {
            Authorization: `Bearer ${auth_token}`,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                follow: {
                    follower_id: follower_id,
                    followee_id: followee_id,
                }
            })
        })
        .then(res => res.json())
        .then(deleted => {
            if (deleted) {
                resolve(deleted)
            }
        })
    })
}