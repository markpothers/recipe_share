// import saveChefDetailsLocally from '../auxFunctions/saveChefDetailsLocally'
import { databaseURL } from "../dataComponents/databaseURL"
import { actionTimeout } from "../dataComponents/timeouts"
import type { LoginChef } from "../centralTypes"

export const loginChef = (chef: { e_mail: string; password: string }): Promise<LoginChef> => {
	// console.log(chef.password.trim())
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" })
		}, actionTimeout)

		fetch(`${databaseURL}/chefs/authenticate`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				chef: {
					e_mail: chef.e_mail.toLowerCase().trim(),
					password: chef.password.trim(),
				},
			}),
		})
			.then((res) => res.json())
			.then((chef) => {
				if (chef) {
					resolve(chef)
				}
			})
			.catch((e) => {
				reject(e)
			})
	})
}