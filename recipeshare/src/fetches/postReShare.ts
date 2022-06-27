import { databaseURL } from "../dataComponents/databaseURL"
import { actionTimeout } from "../dataComponents/timeouts"

export const postReShare = (recipeID: number, chefID: number, auth_token: string): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" })
		}, actionTimeout)

		fetch(`${databaseURL}/re_shares`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				recipe: {
					recipe_id: recipeID,
					chef_id: chefID,
				},
			}),
		})
			.then((res) => res.json())
			.then((re_share) => {
				if (re_share.error && re_share.message == "Invalid authentication") {
					reject({ name: "Logout" })
				}
				if (re_share) {
					resolve(re_share)
				}
			})
			.catch((e) => {
				reject(e)
			})
	})
}
