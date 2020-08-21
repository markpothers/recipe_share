import { databaseURL } from '../dataComponents/databaseURL'
import { detailsTimeout } from '../dataComponents/timeouts'

export const patchChef = (chefID, auth_token, username, profile_text, country, updatingPassword, password, password_confirmation, imageBase64) => {
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject()
		}, detailsTimeout)

		fetch(`${databaseURL}/chefs/${chefID}`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chef: {
					username: username,
					profile_text: profile_text,
					country: country,
					updatingPassword: updatingPassword,
					password: password,
					password_confirmation: password_confirmation,
					image_url: imageBase64
				}
			})
		})
			.then(res => res.json())
			.then(chef => {
				if (chef.error && chef.message == "Invalid authentication") {
					reject("logout")
				}
				if (chef) {
					resolve(chef)
				}
			})
			.catch(() => {
				reject()
			})
	})
}
