import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

// Voice package removed - fallback implementation doesn't need mocking
// jest.mock("@react-native-voice/voice");

// stops random warnings about Animated.useNativeDriver
// jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

//copy this line in some way to many invalid component name errors
jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => "Icon");
jest.mock("react-native-vector-icons/FontAwesome", () => "Icon");

// imports stock AsyncStorage + any modifications I've made in the file
// also allows you to specify some return value in there
// import mockAsyncStorage from './__mocks__/@react-native-async-storage/async-storage';
// jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock("expo-secure-store", () => ({
	getItemAsync: jest.fn(),
}));

jest.mock("react-native-webview", () => ({}));

// SDK 55 updates draggable-flatlist/reanimated internals to rely on worklets
// native initialization, which is not available in Jest.
jest.mock("react-native-draggable-flatlist", () => {
	const React = require("react");
	const { View } = require("react-native");

	const ScaleDecorator = ({ children }) => React.createElement(React.Fragment, null, children);
	const MockDraggableFlatList = ({ data = [], renderItem, ListFooterComponent, ...rest }) => {
		return React.createElement(
			View,
			rest,
			data.map((item, index) =>
				renderItem({
					item,
					index,
					drag: jest.fn(),
					isActive: false,
					getIndex: () => index,
				}),
			),
			ListFooterComponent ? React.createElement(ListFooterComponent) : null,
		);
	};

	return {
		__esModule: true,
		default: MockDraggableFlatList,
		ScaleDecorator,
	};
});

// fixes a bug where this is undefined.  It was removed from react.reanimated at some point
// and I think some dependencies have not been updated to account for it, at least, not in
// testing.
global.__reanimatedWorkletInit = jest.fn();
