import { saveToken, loadToken, deleteToken } from "./saveLoadToken";
import * as SecureStore from "expo-secure-store";

// Mock the entire module
jest.mock("expo-secure-store", () => ({
	WHEN_UNLOCKED_THIS_DEVICE_ONLY: "whenUnlockedThisDeviceOnly",
	setItemAsync: jest.fn(),
	getItemAsync: jest.fn(),
	deleteItemAsync: jest.fn(),
}));

const mockSetItemAsync = SecureStore.setItemAsync as jest.MockedFunction<typeof SecureStore.setItemAsync>;
const mockGetItemAsync = SecureStore.getItemAsync as jest.MockedFunction<typeof SecureStore.getItemAsync>;
const mockDeleteItemAsync = SecureStore.deleteItemAsync as jest.MockedFunction<typeof SecureStore.deleteItemAsync>;

describe("saveLoadToken", () => {
	beforeEach(() => {
		mockSetItemAsync.mockClear();
		mockGetItemAsync.mockClear();
		mockDeleteItemAsync.mockClear();
		mockSetItemAsync.mockResolvedValue();
		mockGetItemAsync.mockResolvedValue(null);
		mockDeleteItemAsync.mockResolvedValue();
	});

	describe("saveToken", () => {
		test("saves token to SecureStore with correct options", () => {
			const testToken = "test-jwt-token-12345";

			saveToken(testToken);

			expect(mockSetItemAsync).toHaveBeenCalledWith("token", testToken, {
				keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
			});
		});

		test("saves different token values correctly", () => {
			const tokens = [
				"simple-token",
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
				"token-with-special-chars!@#$%^&*()",
				"very-long-token-" + "a".repeat(1000),
				"",
			];

			tokens.forEach((token) => {
				mockSetItemAsync.mockClear();
				saveToken(token);

				expect(mockSetItemAsync).toHaveBeenCalledWith("token", token, {
					keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
				});
			});
		});

		test("now awaits the setItemAsync call for proper error handling", async () => {
			const testToken = "test-token";

			// saveToken now returns a promise for proper error handling
			const result = await saveToken(testToken);

			expect(result).toBeUndefined();
			expect(mockSetItemAsync).toHaveBeenCalled();
		});

		test("handles SecureStore save errors gracefully", async () => {
			const testToken = "test-token";
			const mockError = new Error("Keychain save failed");
			mockSetItemAsync.mockRejectedValue(mockError);

			// Should not throw, but handle error gracefully
			const result = await saveToken(testToken);

			expect(result).toBeUndefined();
			expect(mockSetItemAsync).toHaveBeenCalledWith("token", testToken, {
				keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
			});
		});
	});

	describe("loadToken", () => {
		test("returns token when it exists in SecureStore", async () => {
			const testToken = "stored-token-123";
			mockGetItemAsync.mockResolvedValue(testToken);

			const result = await loadToken();

			expect(mockGetItemAsync).toHaveBeenCalledWith("token");
			expect(result).toBe(testToken);
		});

		test("returns null when no token is stored", async () => {
			mockGetItemAsync.mockResolvedValue(null);

			const result = await loadToken();

			expect(mockGetItemAsync).toHaveBeenCalledWith("token");
			expect(result).toBeNull();
		});

		test("returns null when SecureStore returns null", async () => {
			mockGetItemAsync.mockResolvedValue(null);

			const result = await loadToken();

			expect(result).toBeNull();
		});

		test("handles empty string token correctly", async () => {
			mockGetItemAsync.mockResolvedValue("");

			const result = await loadToken();

			// Empty string is falsy, so should return null
			expect(result).toBeNull();
		});

		test("handles whitespace-only token correctly", async () => {
			mockGetItemAsync.mockResolvedValue("   ");

			const result = await loadToken();

			// Whitespace string is truthy, so should return the actual value
			expect(result).toBe("   ");
		});

		test("returns null when SecureStore fails instead of throwing", async () => {
			const mockError = new Error("Keychain access failed");
			mockGetItemAsync.mockRejectedValue(mockError);

			const result = await loadToken();

			expect(result).toBeNull();
			expect(mockGetItemAsync).toHaveBeenCalledWith("token");
		});

		test("handles various token formats", async () => {
			const testCases = [
				"simple-token",
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
				"token-with-special-chars!@#$%^&*()",
				"123456789",
				"Token With Spaces",
			];

			for (const token of testCases) {
				mockGetItemAsync.mockClear();
				mockGetItemAsync.mockResolvedValue(token);

				const result = await loadToken();
				expect(result).toBe(token);
			}
		});
	});

	describe("deleteToken", () => {
		test("deletes token from SecureStore", () => {
			deleteToken();

			expect(mockDeleteItemAsync).toHaveBeenCalledWith("token");
		});

		test("now awaits the deleteItemAsync call for proper error handling", async () => {
			// deleteToken now returns a promise for proper error handling
			const result = await deleteToken();

			expect(result).toBeUndefined();
			expect(mockDeleteItemAsync).toHaveBeenCalled();
		});

		test("handles SecureStore delete errors gracefully", async () => {
			const mockError = new Error("Keychain delete failed");
			mockDeleteItemAsync.mockRejectedValue(mockError);

			// Should not throw, but handle error gracefully
			const result = await deleteToken();

			expect(result).toBeUndefined();
			expect(mockDeleteItemAsync).toHaveBeenCalledWith("token");
		});

		test("can delete multiple times without error", () => {
			deleteToken();
			deleteToken();
			deleteToken();

			expect(mockDeleteItemAsync).toHaveBeenCalledTimes(3);
		});
	});

	describe("integration scenarios", () => {
		test("save, load, delete workflow", async () => {
			const testToken = "integration-test-token";

			// Save token
			await saveToken(testToken);
			expect(mockSetItemAsync).toHaveBeenCalledWith("token", testToken, {
				keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
			});

			// Simulate that the token was saved and load it
			mockGetItemAsync.mockResolvedValue(testToken);
			const loadedToken = await loadToken();
			expect(loadedToken).toBe(testToken);

			// Delete token
			await deleteToken();
			expect(mockDeleteItemAsync).toHaveBeenCalledWith("token");

			// Simulate that the token was deleted and try to load it
			mockGetItemAsync.mockResolvedValue(null);
			const deletedToken = await loadToken();
			expect(deletedToken).toBeNull();
		});

		test("overwriting existing token", async () => {
			const firstToken = "first-token";
			const secondToken = "second-token";

			// Save first token
			await saveToken(firstToken);
			mockGetItemAsync.mockResolvedValue(firstToken);

			// Verify first token is loaded
			let loadedToken = await loadToken();
			expect(loadedToken).toBe(firstToken);

			// Save second token (overwrite)
			mockSetItemAsync.mockClear();
			await saveToken(secondToken);
			mockGetItemAsync.mockResolvedValue(secondToken);

			// Verify second token is loaded
			loadedToken = await loadToken();
			expect(loadedToken).toBe(secondToken);
		});
	});
});
