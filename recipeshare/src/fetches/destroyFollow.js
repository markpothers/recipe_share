import { databaseURL } from '../dataComponents/databaseURL'
import { actionTimeout } from '../dataComponents/timeouts'

export const destroyFollow = (follower_id, followee_id, auth_token) => {
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject({name: 'Timeout'})
		}, actionTimeout)

		fetch(`${databaseURL}/follows`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				follow: {
					follower_id: follower_id,
					followee_id: followee_id,
				}
			})
		})
			.then(res => res.json())
			.then(deleted => {
				if (deleted.error && deleted.message == "Invalid authentication"){
					reject({name: 'Logout'})
				}
				if (deleted) {
					resolve(deleted)
				}
			})
			.catch(e => {
				reject(e)
			})
	})
}
