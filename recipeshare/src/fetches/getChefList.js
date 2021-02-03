import { databaseURL } from '../dataComponents/databaseURL'
import { listsTimeout } from '../dataComponents/timeouts'

export const getChefList = (listType, queryChefID, limit, offset, auth_token, searchTerm) => {

	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject({name: 'Timeout'})
		}, listsTimeout)

		fetch(`${databaseURL}/chefs?listType=${listType}&queryChefID=${queryChefID}&limit=${limit}&offset=${offset}&search_term=${searchTerm}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				'Content-Type': 'application/json'
			},
		})
			.then(res => res.json())
			.then(chefs => {
				if (chefs.error && chefs.message == "Invalid authentication") {
					reject({name: 'Logout'})
				}
				if (chefs) {
					resolve(chefs)
				}
			})
			.catch(e => {
				reject(e)
			})
	})
}
