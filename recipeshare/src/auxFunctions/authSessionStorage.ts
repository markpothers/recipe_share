import AsyncStorage from "@react-native-async-storage/async-storage";

import { LoginChef } from "../centralTypes";
import { deleteToken, loadToken, saveToken } from "./saveLoadToken";

const CHEF_STORAGE_KEY = "chef";

type StoredChef = Omit<LoginChef, "auth_token">;

type RestoredSession = {
	loggedIn: boolean;
	chef: LoginChef | null;
};

const isStoredChef = (candidate: unknown): candidate is StoredChef => {
	if (typeof candidate !== "object" || candidate === null) {
		return false;
	}

	const maybeChef = candidate as Partial<StoredChef>;
	return (
		typeof maybeChef.id === "number" &&
		typeof maybeChef.e_mail === "string" &&
		typeof maybeChef.username === "string" &&
		typeof maybeChef.image_url === "string" &&
		typeof maybeChef.is_admin === "boolean" &&
		typeof maybeChef.is_member === "boolean"
	);
};

const loadStoredChef = async (): Promise<{ chef: StoredChef | null; hadStoredValue: boolean }> => {
	try {
		const rawStoredChef = await AsyncStorage.getItem(CHEF_STORAGE_KEY);
		if (!rawStoredChef) {
			return { chef: null, hadStoredValue: false };
		}

		const parsed = JSON.parse(rawStoredChef);
		if (!isStoredChef(parsed)) {
			return { chef: null, hadStoredValue: true };
		}

		return { chef: parsed, hadStoredValue: true };
	} catch {
		return { chef: null, hadStoredValue: true };
	}
};

export const clearPersistedSession = async (): Promise<void> => {
	await Promise.allSettled([deleteToken(), AsyncStorage.removeItem(CHEF_STORAGE_KEY)]);
};

export const restorePersistedSession = async (): Promise<RestoredSession> => {
	const [token, { chef, hadStoredValue }] = await Promise.all([loadToken(), loadStoredChef()]);

	if (token && chef) {
		return {
			loggedIn: true,
			chef: {
				...chef,
				auth_token: token,
			},
		};
	}

	if ((token && !chef) || (!token && hadStoredValue)) {
		await clearPersistedSession();
	}

	return { loggedIn: false, chef: null };
};

export const persistSession = async (chef: LoginChef): Promise<void> => {
	const { auth_token, ...storedChef } = chef;

	try {
		await saveToken(auth_token);
		await AsyncStorage.setItem(CHEF_STORAGE_KEY, JSON.stringify(storedChef));
	} catch {
		await clearPersistedSession();
	}
};
