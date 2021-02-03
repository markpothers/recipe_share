import { databaseURL } from '../dataComponents/databaseURL'
import { actionTimeout } from '../dataComponents/timeouts'

export const getNewPassword = (e_mail) => {
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject({name: 'Timeout'})
		}, actionTimeout)

		fetch(`${databaseURL}/password_reset?email=${e_mail.toLowerCase().trim()}`, {
			method: "GET",
			headers: {
				'Content-Type': 'application/json'
			},
		})
			.then(res => res.json())
			.then(response => {
				if (response.error && response.message == "Invalid authentication"){
					reject({name: 'Logout'})
				}
				if (response){
				resolve(response)
				}
			})
			.catch(e => {
				reject(e)
			})
	})
}
