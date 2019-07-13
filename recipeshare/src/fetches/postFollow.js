import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const postFollow = (follower_id, followee_id, auth_token) => {
    // console.log("is this working")
    return new Promise((resolve) => {
        fetch(`${databaseURL}/follows`, {
            method: "POST",
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
        .then(follow => {
            if (follow) {
                resolve(follow)
            }
        }
        )
    })
}