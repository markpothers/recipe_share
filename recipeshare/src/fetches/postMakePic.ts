import { MakePic, MakePicChef } from "../centralTypes";

import { databaseURL } from "../constants/databaseURL";
import { detailsTimeout } from "../constants/timeouts";
import { getBase64FromFile } from "../auxFunctions/getBase64FromFile";

export const postMakePic = async (
	recipeID: number,
	chefID: number,
	auth_token: string,
	makePicFileUri: string
): Promise<{ make_pic: MakePic; make_pic_chef: MakePicChef }> => {
	const imageBase64 = await getBase64FromFile(makePicFileUri);
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" });
		}, detailsTimeout);

		fetch(`${databaseURL}/make_pics`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				recipe: {
					recipe_id: recipeID,
					chef_id: chefID,
					base64: imageBase64,
				},
			}),
		})
			.then((res) => res.json())
			.then((makepic) => {
				if (makepic.error && makepic.message == "Invalid authentication") {
					reject({ name: "Logout" });
				}
				if (makepic) {
					resolve(makepic);
				}
			})
			.catch((e) => {
				console.log(e);
				reject(e);
			});
	});
};
