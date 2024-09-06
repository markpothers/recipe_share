import { databaseURL } from "../constants/databaseURL";
import { getBase64FromFile } from "../auxFunctions/getBase64FromFile";
import { submitTimeout } from "../constants/timeouts";

export const postRecipeImage = async (
	chef_id: number,
	auth_token: string,
	recipe_id: number,
	image_id: number,
	index: number,
	local_uri: string
): Promise<boolean> => {
	// let image = await getBase64FromFile(image.uri)
	let base64 = null;
	if (local_uri) {
		base64 = await getBase64FromFile(local_uri);
	}

	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" });
		}, submitTimeout);

		// had to add this validation in here because doing it in rails doesn't work
		// you end up rejecting everything because you don't save instructions and ingredients
		// until you've already saved the recipe once
		// if (!showBlogPreview && (ingredients.length == 0 || instructions.length == 0)) {
		// 	resolve({
		// 		error: true,
		// 		message: ["If not showing blog preview, a recipe must contain at least one ingredient and one instruction step. Add one of each or check 'Show blog preview'."]
		// 	})
		// }

		fetch(`${databaseURL}/recipe_images`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				recipe_image: {
					chef_id: chef_id,
					recipe_id: recipe_id,
					image_id: image_id,
					image_index: index,
					base64: base64,
				},
			}),
		})
			.then((res) => res.json())
			.then((result) => {
				if (result.error && result.message == "Invalid authentication") {
					reject({ name: "Logout" });
				}
				if (result) {
					// console.log(result)
					resolve(result);
				}
			})
			.catch((e) => {
				reject(e);
			});
	});
};
