import type { AvailableFilters, Cuisine, FilterSettings, ListRecipe, Serves } from "../centralTypes";

import { databaseURL } from "../constants/databaseURL";
import { listsTimeout } from "../constants/timeouts";

export const getRecipeList = (
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
): Promise<{ recipes: ListRecipe[] } & AvailableFilters> => {
	const filters = Object.keys(filter_settings)
		.filter((category) => filter_settings[category] === true)
		.join("/")
		.toLowerCase();
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" });
		}, listsTimeout);

		fetch(
			`${databaseURL}/recipes?listType=${listType}&queryChefID=${queryChefID}&limit=${limit}&offset=${offset}&global_ranking=${global_ranking}&filters=${filters}&cuisine=${cuisine}&serves=${serves}&search_term=${searchTerm}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${auth_token}`,
					"Content-Type": "application/json",
				},
				signal: abortController.signal,
			}
		)
			.then((res) => {
				// console.log('MARK')
				// console.log(res.type)
				// console.log(res.status)
				// console.log(res.statusText)
				// console.log(res.ok)
				return res.json();
			})
			.then((result) => {
				if (result.error && result.message == "Invalid authentication") {
					reject({ name: "Logout" });
				}
				resolve(result);
			})
			.catch((e) => {
				reject(e);
			});
	});
};
