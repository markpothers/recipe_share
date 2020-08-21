import { databaseURL } from '../dataComponents/databaseURL'
import { detailsTimeout } from '../dataComponents/timeouts'

export const getChefDetails = (chef_id, auth_token) => {
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject()
		}, detailsTimeout)

		fetch(`${databaseURL}/chefs/${chef_id}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				'Content-Type': 'application/json'
			},
		})
			.then(res => res.json())
			.then(chef_details => {
				if (chef_details.error && chef_details.message == "Invalid authentication"){
					reject("logout")
				}
				if (chef_details) {
					resolve(chef_details)
				}
			})
			.catch(() => {
				reject()
			})
	})
}
