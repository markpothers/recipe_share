import { actionTimeout } from "../constants/timeouts";
import { databaseURL } from "../constants/databaseURL";

export const destroyReShare = (recipeID: number, chefID: number, auth_token: string): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" });
		}, actionTimeout);

		fetch(`${databaseURL}/re_shares`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				recipe: {
					recipe_id: recipeID,
					chef_id: chefID,
				},
			}),
		})
			.then((res) => res.json())
			.then((unlike) => {
				if (unlike.error && unlike.message == "Invalid authentication") {
					reject({ name: "Logout" });
				}
				if (unlike) {
					resolve(unlike);
				}
			})
			.catch((e) => {
				reject(e);
			});
	});
};
