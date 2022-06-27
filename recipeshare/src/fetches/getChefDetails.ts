import { databaseURL } from "../dataComponents/databaseURL"
import { detailsTimeout } from "../dataComponents/timeouts"
import type { Chef } from "../centralTypes"

export const getChefDetails = (chef_id: number, auth_token: string): Promise<Chef> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" })
		}, detailsTimeout)

		fetch(`${databaseURL}/chefs/${chef_id}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				"Content-Type": "application/json"
			}
		})
			.then((res) => res.json())
			.then((chef_details) => {
				if (chef_details.error && chef_details.message == "Invalid authentication") {
					reject({ name: "Logout" })
				}
				if (chef_details) {
					resolve(chef_details)
				}
			})
			.catch((e) => {
				reject(e)
			})
	})
}
