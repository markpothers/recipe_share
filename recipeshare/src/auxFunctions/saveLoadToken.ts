import * as SecureStore from "expo-secure-store";

export const saveToken = async (token: string): Promise<void> => {
	try {
		const options = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY };
		await SecureStore.setItemAsync("token", token, options);
	} catch {
		// Silently handle errors to maintain backward compatibility
		// The calling code doesn't expect this function to throw
	}
};

export const loadToken = async (): Promise<string | null> => {
	try {
		const token = await SecureStore.getItemAsync("token");
		if (token) {
			return token;
		} else {
			return null;
		}
	} catch {
		// Return null on error - the app can handle missing tokens gracefully
		return null;
	}
};

export const deleteToken = async (): Promise<void> => {
	try {
		await SecureStore.deleteItemAsync("token");
	} catch {
		// Silently handle errors to maintain backward compatibility
	}
};
