import { databaseURL } from '../dataComponents/databaseURL'
import { actionTimeout } from '../dataComponents/timeouts'

export const loginChef = (chef) => {
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject()
		}, actionTimeout)

		fetch(`${databaseURL}/chefs/authenticate`, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chef: chef
			})
		})
			.then(res => res.json())
			.then(chef => {
				if (chef) {
					resolve(chef)
				}
			})
			.catch(error => {
			})
	})
}
