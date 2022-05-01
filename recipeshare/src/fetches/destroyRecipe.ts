import { databaseURL } from "../dataComponents/databaseURL"
import { detailsTimeout } from "../dataComponents/timeouts"

export const destroyRecipe = (recipeID: number, auth_token: string): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" })
		}, detailsTimeout)

		fetch(`${databaseURL}/recipes/${recipeID}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				"Content-Type": "application/json"
			}
		})
			.then((res) => res.json())
			.then((deleted) => {
				if (deleted.error && deleted.message == "Invalid authentication") {
					reject({ name: "Logout" })
				}
				if (deleted) {
					resolve(deleted)
				}
			})
			.catch((e) => {
				reject(e)
			})
	})
}
