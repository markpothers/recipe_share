import { databaseURL } from '../dataComponents/databaseURL'
import { actionTimeout } from '../dataComponents/timeouts'

export const postFollow = (follower_id, followee_id, auth_token) => {
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject()
		}, actionTimeout)

		fetch(`${databaseURL}/follows`, {
			method: "POST",
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
			.then(follow => {
				if (follow.error && follow.message == "Invalid authentication") {
					reject("logout")
				}
				if (follow) {
					resolve(follow)
				}
			})
			.catch(() => {
				reject()
			})
	})
}
