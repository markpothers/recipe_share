import { databaseURL } from '../dataComponents/databaseURL'
import { detailsTimeout } from '../dataComponents/timeouts'
import { getBase64FromFile } from '../auxFunctions/getBase64FromFile.js'

export const postChef = async(username, e_mail, password, password_confirmation, country, image_url, profile_text) => {

	const imageBase64 = await getBase64FromFile(image_url)

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
					username: username.toLowerCase().trim(),
					e_mail: e_mail.toLowerCase().trim(),
					password: password.toLowerCase().trim(),
					password_confirmation: password_confirmation.toLowerCase().trim(),
					country: country,
					image_url: imageBase64,
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
