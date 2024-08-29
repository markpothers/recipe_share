import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

jest.mock("@react-native-voice/voice");

// stops random warnings about Animated.useNativeDriver
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

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

// fixes a bug where this is undefined.  It was removed from react.reanimated at some point
// and I think some dependencies have not been updated to account for it, at least, not in
// testing.
global.__reanimatedWorkletInit = jest.fn();
