import type { Recipe } from "../centralTypes";
import { databaseURL } from "../constants/databaseURL";
import { detailsTimeout } from "../constants/timeouts";

export const getRecipeDetails = (recipe_id: number, auth_token: string): Promise<Recipe> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" });
		}, detailsTimeout);

		fetch(`${databaseURL}/recipes/${recipe_id}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((recipe_details) => {
				if (recipe_details.error && recipe_details.message == "Invalid authentication") {
					reject({ name: "Logout" });
				}
				if (recipe_details) {
					resolve(recipe_details);
				}
			})
			.catch((e) => {
				reject(e);
			});
	});
};
