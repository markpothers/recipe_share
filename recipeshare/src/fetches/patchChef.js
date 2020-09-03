import { databaseURL } from '../dataComponents/databaseURL'
import { detailsTimeout } from '../dataComponents/timeouts'
import { getBase64FromFile } from '../functionalComponents/getBase64FromFile.js'

export const patchChef = async (chefID, auth_token, username, profile_text, country, updatingPassword, password, password_confirmation, imageFileUri) => {

	const imageBase64 = imageFileUri === "DELETED" ? imageFileUri : await getBase64FromFile(imageFileUri)

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
