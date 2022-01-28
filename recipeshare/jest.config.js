module.exports = {
	preset: "jest-expo",
	transformIgnorePatterns: [
		"node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
	],
	collectCoverage: true,
	collectCoverageFrom: [
		"**/*.{js,jsx}",
		"!**/coverage/**",
		"!**/node_modules/**",
		"!**/babel.config.js",
		"!**/jest.setup.js"
	],
	verbose: true,
	setupFiles: [
		"./jestSetup.js"
	],
	setupFilesAfterEnv: [
		"./enzymeSetup.js"
	],
	snapshotSerializers: [
		"enzyme-to-json/serializer"
	]
};
