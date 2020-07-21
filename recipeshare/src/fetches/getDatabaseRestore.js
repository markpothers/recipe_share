import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'
import { actionTimeout } from '../dataComponents/timeouts'

export const getDatabaseRestore = (auth_token, databaseLevel) => {

	return new Promise((resolve, reject) => {
		// console.log(databaseURL)

		setTimeout(() => {
			reject()
		}, actionTimeout)

		fetch(`${databaseURL}/database/${databaseLevel}restore`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				'Content-Type': 'application/json'
			},
		})
			.then(res => res.json())
			.then(confirmation => {
				// console.log(recipes)
				resolve(confirmation)
			})
			.catch(error => {
			})
	})
}
