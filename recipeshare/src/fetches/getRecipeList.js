import { databaseURL } from '../dataComponents/databaseURL'
import { listsTimeout } from '../dataComponents/timeouts'

export const getRecipeList = (listType, queryChefID, limit, offset, global_ranking, auth_token, filter_settings, cuisine, serves, searchTerm, abortController) => {
	const filters = Object.keys(filter_settings).filter(category => filter_settings[category] === true).join("/").toLowerCase()
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			reject({name: 'Timeout'})
		}, listsTimeout)

		fetch(`${databaseURL}/recipes?listType=${listType}&queryChefID=${queryChefID}&limit=${limit}&offset=${offset}&global_ranking=${global_ranking}&filters=${filters}&cuisine=${cuisine}&serves=${serves}&search_term=${searchTerm}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				'Content-Type': 'application/json'
			},
			signal: abortController.signal
		})
			.then(res => res.json())
			.then(result => {
				// console.log(result.cuisines)
				if (result.error && result.message == "Invalid authentication") {
					reject({name: 'Logout'})
				}
				resolve(result)
			})
			.catch(e => {
				reject(e)
			})
	})
}
