
// stops random warnings about Animated.useNativeDriver
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

//copy this line in some way to many invalid component name errors
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon')
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon')

// imports stock AsyncStorage + any modifications I've made in the file
// also allows you to specify some return value in there
// import mockAsyncStorage from './__mocks__/@react-native-async-storage/async-storage';
// jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('expo-secure-store', () => ({
	getItemAsync: jest.fn()
}))
