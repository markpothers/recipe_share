import { databaseURL } from '../dataComponents/databaseURL'
import { actionTimeout } from '../dataComponents/timeouts'

export const postRecipeMake = (recipeID, chefID, auth_token) => {
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject()
		}, actionTimeout)

		fetch(`${databaseURL}/recipe_makes`, {
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
			.then(make => {
				if (make.error && make.message == "Invalid authentication") {
					reject("logout")
				}
				if (make == true) {
					resolve(make)
				}
			})
			.catch(() => {
				reject()
			})
	})
}
