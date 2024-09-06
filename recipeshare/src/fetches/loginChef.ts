// import saveChefDetailsLocally from '../auxFunctions/saveChefDetailsLocally'

import type { ApiError, LoginChef } from "../centralTypes";

import { actionTimeout } from "../constants/timeouts";
import { databaseURL } from "../constants/databaseURL";

export const postLoginChef = (chef: { e_mail: string; password: string }): Promise<LoginChef | ApiError> => {
	// console.log(chef.password.trim())
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" });
		}, actionTimeout);

		fetch(`${databaseURL}/chefs/authenticate`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				chef: {
					e_mail: chef.e_mail.toLowerCase().trim(),
					password: chef.password.trim(),
				},
			}),
		})
			.then((res) => res.json())
			.then((chef) => {
				if (chef) {
					resolve(chef);
				}
			})
			.catch((e) => {
				console.log(e);
				reject(e);
			});
	});
};
