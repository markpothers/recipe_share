import { actionTimeout } from "../constants/timeouts";
import { databaseURL } from "../constants/databaseURL";

export const getDatabaseBackup = (auth_token, method) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" });
		}, actionTimeout);

		fetch(`${databaseURL}/database/${method}backup`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((confirmation) => {
				if (confirmation.error && confirmation.message == "Invalid authentication") {
					reject({ name: "Logout" });
				}
				if (confirmation) {
					resolve(confirmation);
				}
			})
			.catch((e) => {
				reject(e);
			});
	});
};
