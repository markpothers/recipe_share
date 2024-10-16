import { databaseURL } from "../constants/databaseURL";
import { getBase64FromFile } from "../auxFunctions/getBase64FromFile";
import { submitTimeout } from "../constants/timeouts";

export const postInstructionImage = async (
	chef_id: number,
	auth_token: string,
	instruction_id: number,
	image_id: number,
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

		fetch(`${databaseURL}/instruction_images`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				instruction_image: {
					chef_id: chef_id,
					instruction_id: instruction_id,
					image_id: image_id,
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
