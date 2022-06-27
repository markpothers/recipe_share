import { databaseURL } from "../dataComponents/databaseURL"
import { actionTimeout } from "../dataComponents/timeouts"
import type { Comment } from "../centralTypes"

export const destroyComment = (auth_token: string, commentID: number): Promise<Comment[]> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ name: "Timeout" })
		}, actionTimeout)

		fetch(`${databaseURL}/comments/${commentID}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${auth_token}`,
				"Content-Type": "application/json"
			}
		})
			.then((res) => res.json())
			.then((comments) => {
				if (comments.error && comments.message == "Invalid authentication") {
					reject({ name: "Logout" })
				}
				if (comments) {
					resolve(comments)
				}
			})
			.catch((e) => {
				reject(e)
			})
	})
}
