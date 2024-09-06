import { actionTimeout } from "../constants/timeouts";
import { databaseURL } from "../constants/databaseURL";

export const postRecipeLike = (recipeID: number, chefID: number, auth_token: string): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" });
		}, actionTimeout);

		fetch(`${databaseURL}/recipe_likes`, {
			method: "POST",
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
			.then((like) => {
				if (like.error && like.message == "Invalid authentication") {
					reject({ name: "Logout" });
				}
				if (like) {
					resolve(like);
				}
			})
			.catch((e) => {
				reject(e);
			});
	});
};
