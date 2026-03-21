const productionURL = "https://www.recipe-share.com/api";
const configuredURL = (process.env.EXPO_PUBLIC_API_URL || "").trim();

const databaseURL = (configuredURL.length > 0 ? configuredURL : productionURL).replace(/\/+$/, "");

export { databaseURL };
