import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'

export const loginChef = (chef) => {
  console.log(databaseURL)
    return new Promise((resolve) => {
        fetch(`${databaseURL}/chefs/authenticate`, {
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