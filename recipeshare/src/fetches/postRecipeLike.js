import { databaseURL } from '../dataComponents/databaseURL'
import { actionTimeout } from '../dataComponents/timeouts'

export const postRecipeLike = (recipeID, chefID, auth_token) => {
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject()
		}, actionTimeout)

		fetch(`${databaseURL}/recipe_likes`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				recipe: {
					recipe_id: recipeID,
					chef_id: chefID,
				}
			})
		})
			.then(res => res.json())
			.then(like => {
				if (like.error && like.message == "Invalid authentication"){
					reject("logout")
				}
				if (like) {
					resolve(like)
				}
			})
			.catch(() => {
				reject()
			})
	})
}
