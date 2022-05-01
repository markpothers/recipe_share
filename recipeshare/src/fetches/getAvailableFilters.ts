import { databaseURL } from "../dataComponents/databaseURL"
import { listsTimeout } from "../dataComponents/timeouts"
import type { FilterSettings, Cuisine, Serves, AvailableFilters } from "../centralTypes"

export const getAvailableFilters = (
	listType: string,
	queryChefID: number,
	limit: number,
	offset: number,
	global_ranking: string,
	auth_token: string,
	filter_settings: FilterSettings,
	cuisine: Cuisine,
	serves: Serves,
	searchTerm: string,
	abortController: AbortController
): Promise<AvailableFilters> => {
	const filters = Object.keys(filter_settings)
		.filter((category) => filter_settings[category] === true)
		.join("/")
		.toLowerCase()
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" })
		}, listsTimeout)

		fetch(
			`${databaseURL}/get_available_filters?listType=${listType}&queryChefID=${queryChefID}&limit=${limit}&offset=${offset}&global_ranking=${global_ranking}&filters=${filters}&cuisine=${cuisine}&serves=${serves}&search_term=${searchTerm}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${auth_token}`,
					"Content-Type": "application/json"
				},
				signal: abortController.signal
			}
		)
			.then((res) => res.json())
			.then((result) => {
				if (result.error && result.message == "Invalid authentication") {
					reject({ name: "Logout" })
				}
				resolve(result)
			})
			.catch((e) => {
				reject(e)
			})
	})
}
