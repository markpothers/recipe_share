import { databaseURL } from '../dataComponents/databaseURL'
import { actionTimeout } from '../dataComponents/timeouts'

export const destroyRecipeLike = (recipeID, chefID, auth_token) => {
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject({name: 'Timeout'})
		}, actionTimeout)

		fetch(`${databaseURL}/recipe_likes`, {
			method: "DELETE",
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
			.then(unlike => {
				if (unlike.error && unlike.message == "Invalid authentication"){
					reject({name: 'Logout'})
				}
				if (unlike == true) {
					resolve(unlike)
				}
			})
			.catch(e => {
				reject(e)
			})
	})
}
