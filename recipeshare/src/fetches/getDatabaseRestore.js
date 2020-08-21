import { databaseURL } from '../dataComponents/databaseURL'
import { actionTimeout } from '../dataComponents/timeouts'

export const getDatabaseRestore = (auth_token, databaseLevel) => {

	return new Promise((resolve, reject) => {
		// console.log(databaseURL)

		setTimeout(() => {
			reject()
		}, actionTimeout)

		fetch(`${databaseURL}/database/${databaseLevel}restore`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				'Content-Type': 'application/json'
			},
		})
			.then(res => res.json())
			.then(confirmation => {
				if (confirmation.error && confirmation.message == "Invalid authentication") {
					reject("logout")
				}
				if (confirmation) {
					resolve(confirmation)
				}
			})
			.catch(() => {
				reject()
			})
	})
}
