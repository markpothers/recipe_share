import { actionTimeout } from "../constants/timeouts";
import { databaseURL } from "../constants/databaseURL";

export const destroyMakePic = (auth_token: string, makePicID: number): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" });
		}, actionTimeout);

		fetch(`${databaseURL}/make_pics/${makePicID}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((destroyed) => {
				if (destroyed.error && destroyed.message == "Invalid authentication") {
					reject({ name: "Logout" });
				}
				if (destroyed == true) {
					resolve(destroyed);
				}
			})
			.catch((e) => {
				reject(e);
			});
	});
};
