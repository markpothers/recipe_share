import { databaseURL } from '../dataComponents/databaseURL'
import { detailsTimeout } from '../dataComponents/timeouts'
import { getBase64FromFile } from '../functionalComponents/getBase64FromFile.js'

export const postMakePic = async (recipeID, chefID, auth_token, makePicFileUri) => {

	const imageBase64 = await getBase64FromFile(makePicFileUri)

	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject()
		}, detailsTimeout)

		fetch(`${databaseURL}/make_pics`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				recipe: {
					recipe_id: recipeID,
					chef_id: chefID,
					base64: imageBase64
				}
			})
		})
			.then(res => res.json())
			.then(makepic => {
				if (makepic.error && makepic.message == "Invalid authentication") {
					reject("logout")
				}
				if (makepic) {
					resolve(makepic)
				}
			})
			.catch(() => {
				reject()
			})
	})
}
