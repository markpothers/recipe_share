import { Ingredient } from "../centralTypes"
import { databaseURL } from "../dataComponents/databaseURL"
import { actionTimeout } from "../dataComponents/timeouts"

export const fetchIngredients = (auth_token: string): Promise<Ingredient[]> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" })
		}, actionTimeout)

		fetch(`${databaseURL}/ingredients`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				"Content-Type": "application/json"
			}
		})
			.then((res) => res.json())
			.then((ingredients) => {
				if (ingredients.error && ingredients.message == "Invalid authentication") {
					reject({ name: "Logout" })
				}
				if (ingredients) {
					resolve(ingredients)
				}
			})
			.catch((e) => {
				reject(e)
			})
	})
}
