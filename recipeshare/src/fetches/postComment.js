import React from 'react'
import { databaseURL } from '../dataComponents/databaseURL'
import { actionTimeout } from '../dataComponents/timeouts'

export const postComment = (recipeID, chefID, auth_token, comment) => {
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject()
		}, actionTimeout)

		fetch(`${databaseURL}/comments`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				comment: {
					recipe_id: recipeID,
					chef_id: chefID,
					comment: comment
				}
			})
		})
			.then(res => res.json())
			.then(comments => {
				if (comments) {
					resolve(comments)
				}
			})
			.catch(error => {
			})
	})
}
