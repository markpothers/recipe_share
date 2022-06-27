import { databaseURL } from "../dataComponents/databaseURL"
import { listsTimeout } from "../dataComponents/timeouts"
import type { ListChef } from "../centralTypes"

export const getChefList = (
	listType: string,
	queryChefID: number,
	limit: number,
	offset: number,
	auth_token: string,
	searchTerm: string
): Promise<ListChef[]> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" })
		}, listsTimeout)

		fetch(
			`${databaseURL}/chefs?listType=${listType}&queryChefID=${queryChefID}&limit=${limit}&offset=${offset}&search_term=${searchTerm}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${auth_token}`,
					"Content-Type": "application/json",
				},
			}
		)
			.then((res) => res.json())
			.then((chefs) => {
				if (chefs.error && chefs.message == "Invalid authentication") {
					reject({ name: "Logout" })
				}
				if (chefs) {
					resolve(chefs)
				}
			})
			.catch((e) => {
				reject(e)
			})
	})
}
