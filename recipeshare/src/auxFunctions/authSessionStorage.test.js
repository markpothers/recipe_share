import AsyncStorage from "@react-native-async-storage/async-storage";

import { clearPersistedSession, persistSession, restorePersistedSession } from "./authSessionStorage";
import { deleteToken, loadToken, saveToken } from "./saveLoadToken";

jest.mock("./saveLoadToken");

describe("authSessionStorage", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("restorePersistedSession", () => {
		test("restores logged-in session when token and chef are valid", async () => {
			loadToken.mockResolvedValue("valid-token");
			AsyncStorage.getItem.mockResolvedValue(
				JSON.stringify({
					id: 22,
					e_mail: "email@test.com",
					username: "chef",
					image_url: "http://image",
					is_admin: false,
					is_member: true,
				})
			);

			const restored = await restorePersistedSession();

			expect(restored.loggedIn).toBe(true);
			expect(restored.chef).toEqual({
				id: 22,
				e_mail: "email@test.com",
				username: "chef",
				image_url: "http://image",
				is_admin: false,
				is_member: true,
				auth_token: "valid-token",
			});
		});

		test("clears and logs out when token exists but chef is missing", async () => {
			loadToken.mockResolvedValue("valid-token");
			AsyncStorage.getItem.mockResolvedValue(null);

			const restored = await restorePersistedSession();

			expect(restored).toEqual({ loggedIn: false, chef: null });
			expect(deleteToken).toHaveBeenCalledTimes(1);
			expect(AsyncStorage.removeItem).toHaveBeenCalledWith("chef");
		});

		test("clears and logs out when chef exists but token is missing", async () => {
			loadToken.mockResolvedValue(null);
			AsyncStorage.getItem.mockResolvedValue(
				JSON.stringify({
					id: 22,
					e_mail: "email@test.com",
					username: "chef",
					image_url: "http://image",
					is_admin: false,
					is_member: true,
				})
			);

			const restored = await restorePersistedSession();

			expect(restored).toEqual({ loggedIn: false, chef: null });
			expect(deleteToken).toHaveBeenCalledTimes(1);
			expect(AsyncStorage.removeItem).toHaveBeenCalledWith("chef");
		});

		test("clears and logs out when chef JSON is corrupt", async () => {
			loadToken.mockResolvedValue("valid-token");
			AsyncStorage.getItem.mockResolvedValue("{bad json");

			const restored = await restorePersistedSession();

			expect(restored).toEqual({ loggedIn: false, chef: null });
			expect(deleteToken).toHaveBeenCalledTimes(1);
			expect(AsyncStorage.removeItem).toHaveBeenCalledWith("chef");
		});
	});

	describe("persistSession", () => {
		test("persists token and chef payload without auth token duplication", async () => {
			await persistSession({
				id: 22,
				e_mail: "email@test.com",
				username: "chef",
				image_url: "http://image",
				is_admin: false,
				is_member: true,
				auth_token: "valid-token",
			});

			expect(saveToken).toHaveBeenCalledWith("valid-token");
			expect(AsyncStorage.setItem).toHaveBeenCalledWith(
				"chef",
				JSON.stringify({
					id: 22,
					e_mail: "email@test.com",
					username: "chef",
					image_url: "http://image",
					is_admin: false,
					is_member: true,
				})
			);
		});
	});

	describe("clearPersistedSession", () => {
		test("best-effort clears token and stored chef", async () => {
			await clearPersistedSession();

			expect(deleteToken).toHaveBeenCalledTimes(1);
			expect(AsyncStorage.removeItem).toHaveBeenCalledWith("chef");
		});
	});
});
