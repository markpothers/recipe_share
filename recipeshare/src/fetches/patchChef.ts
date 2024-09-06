import type { LoginChef } from "../centralTypes";
import { databaseURL } from "../constants/databaseURL";
import { detailsTimeout } from "../constants/timeouts";
import { getBase64FromFile } from "../auxFunctions/getBase64FromFile";

export const patchChef = async (
	chefID: number,
	auth_token: string,
	e_mail: string,
	username: string,
	profile_text: string,
	country: string,
	updatingPassword: boolean,
	password: string,
	password_confirmation: string,
	imageFileUri: string
): Promise<LoginChef> => {
	const imageBase64 = imageFileUri === "DELETED" ? imageFileUri : await getBase64FromFile(imageFileUri);

	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" });
		}, detailsTimeout);

		fetch(`${databaseURL}/chefs/${chefID}`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				chef: {
					username: username,
					e_mail: e_mail,
					profile_text: profile_text,
					country: country,
					updatingPassword: updatingPassword,
					password: password.trim(),
					password_confirmation: password_confirmation.trim(),
					image_url: imageBase64,
				},
			}),
		})
			.then((res) => res.json())
			.then((chef) => {
				if (chef.error && chef.message == "Invalid authentication") {
					reject({ name: "Logout" });
				}
				if (chef) {
					resolve(chef);
				}
			})
			.catch((e) => {
				reject(e);
			});
	});
};
