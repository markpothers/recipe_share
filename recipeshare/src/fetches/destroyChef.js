import { databaseURL } from '../dataComponents/databaseURL'
import { detailsTimeout } from '../dataComponents/timeouts'

export const destroyChef = (auth_token, chefID, deleteRecipes) => {
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject()
		}, detailsTimeout)

		fetch(`${databaseURL}/chefs/${chefID}?deleteRecipes=${deleteRecipes}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				'Content-Type': 'application/json'
			},
		})
			.then(res => res.json())
			.then(deletedChef => {
				if (deletedChef.error && deletedChef.message == "Invalid authentication"){
					reject("logout")
				}
				if (deletedChef) {
					resolve(deletedChef)
				}
			})
			.catch(() => {
				reject()
			})
	})
}
