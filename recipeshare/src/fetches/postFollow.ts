import type { Follow } from "../centralTypes";
import { actionTimeout } from "../constants/timeouts";
import { databaseURL } from "../constants/databaseURL";

export const postFollow = (follower_id: number, followee_id: number, auth_token: string): Promise<Follow> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" });
		}, actionTimeout);

		fetch(`${databaseURL}/follows`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				follow: {
					follower_id: follower_id,
					followee_id: followee_id,
				},
			}),
		})
			.then((res) => res.json())
			.then((follow) => {
				if (follow.error && follow.message == "Invalid authentication") {
					reject({ name: "Logout" });
				}
				if (follow) {
					resolve(follow);
				}
			})
			.catch((e) => {
				reject(e);
			});
	});
};
