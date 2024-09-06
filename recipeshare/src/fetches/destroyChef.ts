import { databaseURL } from "../constants/databaseURL";
import { detailsTimeout } from "../constants/timeouts";

export const destroyChef = (auth_token: string, chefID: number, deleteRecipes: boolean) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" });
		}, detailsTimeout);

		fetch(`${databaseURL}/chefs/${chefID}?deleteRecipes=${deleteRecipes}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((deletedChef) => {
				if (deletedChef.error && deletedChef.message == "Invalid authentication") {
					reject({ name: "Logout" });
				}
				if (deletedChef) {
					resolve(deletedChef);
				}
			})
			.catch((e) => {
				reject(e);
			});
	});
};
