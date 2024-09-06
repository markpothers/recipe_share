import type { Comment } from "../centralTypes";
import { actionTimeout } from "../constants/timeouts";
import { databaseURL } from "../constants/databaseURL";

export const postComment = (
	recipeID: number,
	chefID: number,
	auth_token: string,
	comment: string
): Promise<Comment[]> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" });
		}, actionTimeout);

		fetch(`${databaseURL}/comments`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				comment: {
					recipe_id: recipeID,
					chef_id: chefID,
					comment: comment,
				},
			}),
		})
			.then((res) => res.json())
			.then((comments) => {
				if (comments.error && comments.message == "Invalid authentication") {
					reject({ name: "Logout" });
				}
				if (comments) {
					resolve(comments);
				}
			})
			.catch((e) => {
				reject(e);
			});
	});
};
