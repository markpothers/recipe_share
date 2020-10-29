
//stops random warnings about Animated.useNativeDriver
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

//copy this line in some way to many invalid component name errors
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon')
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon')
