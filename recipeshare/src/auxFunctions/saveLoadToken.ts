import * as SecureStore from "expo-secure-store"

export const saveToken = (token: string): void => {
	const options = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY }
	SecureStore.setItemAsync("token", token, options)
}

export const loadToken = async (): Promise<string> => {
	const token = await SecureStore.getItemAsync("token")
	if (token) {
		return token
	} else {
		return null
	}
}

export const deleteToken = (): void => {
	SecureStore.deleteItemAsync("token")
}
