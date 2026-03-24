export type NewRecipeSeedMode = "empty" | "short" | "long";

export const PRODUCTION_API_URL = "https://www.recipe-share.com/api";

export const normalizeApiUrl = (rawUrl?: string): string => {
	const configuredUrl = (rawUrl || "").trim();
	const baseUrl = configuredUrl.length > 0 ? configuredUrl : PRODUCTION_API_URL;
	return baseUrl.replace(/\/+$/, "");
};

export const normalizeSeedMode = (rawSeedMode?: string): NewRecipeSeedMode => {
	const normalized = (rawSeedMode || "").trim().toLowerCase();

	if (normalized === "short" || normalized === "long" || normalized === "empty") {
		return normalized;
	}

	return "empty";
};

export const getEffectiveSeedMode = (
	configuredSeedMode: NewRecipeSeedMode,
	productionRuntime: boolean,
): NewRecipeSeedMode => {
	if (productionRuntime) {
		return "empty";
	}

	return configuredSeedMode;
};

export const isTestRuntime = process.env.NODE_ENV === "test";
const isDevRuntime = typeof __DEV__ !== "undefined" ? __DEV__ : process.env.NODE_ENV !== "production";
export const isProductionRuntime = !isDevRuntime && !isTestRuntime;

const configuredSeedMode = normalizeSeedMode(process.env.EXPO_PUBLIC_NEW_RECIPE_SEED_MODE);

export const runtimeConfig = {
	apiUrl: normalizeApiUrl(process.env.EXPO_PUBLIC_API_URL),
	configuredSeedMode,
	seedMode: getEffectiveSeedMode(configuredSeedMode, isProductionRuntime),
};
