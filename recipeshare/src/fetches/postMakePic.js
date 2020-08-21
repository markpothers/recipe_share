import { databaseURL } from '../dataComponents/databaseURL'
import { actionTimeout } from '../dataComponents/timeouts'

export const postMakePic = (recipeID, chefID, auth_token, makePicBase64) => {
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject()
		}, actionTimeout)

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
					base64: makePicBase64
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
