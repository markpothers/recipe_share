import { databaseURL } from '../dataComponents/databaseURL'
import { detailsTimeout } from '../dataComponents/timeouts'

export const postChef = (username, e_mail, password, password_confirmation, country, image_url, profile_text) => {
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject()
		}, detailsTimeout)

		fetch(`${databaseURL}/chefs`, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chef: {
					username: username,
					e_mail: e_mail,
					password: password,
					password_confirmation: password_confirmation,
					country: country,
					image_url: image_url,
					profile_text: profile_text
				}
			})
		})
			.then(res => res.json())
			.then(chef => {
				if (chef) {
					resolve(chef)
				}
			})
			.catch(() => {
				reject()
			})
	})
}
