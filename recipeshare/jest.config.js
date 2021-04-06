module.exports = {
	preset: "jest-expo",
	transformIgnorePatterns: [
		"node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)"
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
