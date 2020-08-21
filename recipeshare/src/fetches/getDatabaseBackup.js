import { databaseURL } from '../dataComponents/databaseURL'
import { actionTimeout } from '../dataComponents/timeouts'

export const getDatabaseBackup = (auth_token, method) => {

	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject()
		}, actionTimeout)

		fetch(`${databaseURL}/database/${method}backup`, {
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
