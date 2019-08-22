import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const loginChef = (chef) => {
    return new Promise((resolve) => {
        fetch(`${databaseURL}/login`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              chef: chef
            })
          })
        .then(res => res.json())
        .then(chef => {
            if (chef) {
                // console.log(chef)
                resolve(chef)
            }
        }
        )
    })
}