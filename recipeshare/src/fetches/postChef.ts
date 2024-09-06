import { databaseURL } from "../constants/databaseURL";
import { detailsTimeout } from "../constants/timeouts";
import { getBase64FromFile } from "../auxFunctions/getBase64FromFile";

export const postChef = async (
	username: string,
	e_mail: string,
	password: string,
	password_confirmation: string,
	country: string,
	image_url: string,
	profile_text: String
): Promise<boolean> => {
	const imageBase64 = await getBase64FromFile(image_url);

	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" });
		}, detailsTimeout);

		fetch(`${databaseURL}/chefs`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				chef: {
					username: username.trim(),
					e_mail: e_mail.toLowerCase().trim(),
					password: password.trim(),
					password_confirmation: password_confirmation.trim(),
					country: country,
					image_url: imageBase64,
					profile_text: profile_text,
				},
			}),
		})
			.then((res) => res.json())
			.then((chef) => {
				if (chef) {
					resolve(chef);
				}
			})
			.catch((e) => {
				reject(e);
			});
	});
};
