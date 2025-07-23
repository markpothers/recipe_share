// Mock constants that match expo-secure-store
export const WHEN_UNLOCKED_THIS_DEVICE_ONLY = "whenUnlockedThisDeviceOnly";
export const WHEN_UNLOCKED = "whenUnlocked";
export const WHEN_PASSCODE_SET_THIS_DEVICE_ONLY = "whenPasscodeSetThisDeviceOnly";
export const ALWAYS = "always";
export const ALWAYS_THIS_DEVICE_ONLY = "alwaysThisDeviceOnly";

// Mock storage to simulate SecureStore behavior
let mockStorage = {};
let mockShouldFail = false;
let mockError = new Error("Mock SecureStore error");

// Control functions for testing
export const setMockShouldFail = (shouldFail, error = new Error("Mock SecureStore error")) => {
	mockShouldFail = shouldFail;
	mockError = error;
};

export const clearMockStorage = () => {
	mockStorage = {};
};

export const getMockStorage = () => {
	return { ...mockStorage };
};

export const setMockStorage = (storage) => {
	mockStorage = { ...storage };
};

// Mock SecureStore functions
export const setItemAsync = jest.fn((key, value, options = {}) => {
	if (mockShouldFail) {
		return Promise.reject(mockError);
	}
	// Store the value with any options metadata for testing
	mockStorage[key] = { value, options };
	return Promise.resolve();
});

export const getItemAsync = jest.fn((key) => {
	if (mockShouldFail) {
		return Promise.reject(mockError);
	}
	const stored = mockStorage[key];
	return Promise.resolve(stored ? stored.value : null);
});

export const deleteItemAsync = jest.fn((key) => {
	if (mockShouldFail) {
		return Promise.reject(mockError);
	}
	delete mockStorage[key];
	return Promise.resolve();
});

// Reset function for tests
export const resetMocks = () => {
	mockStorage = {};
	mockShouldFail = false;
	mockError = new Error("Mock SecureStore error");
	setItemAsync.mockClear();
	getItemAsync.mockClear();
	deleteItemAsync.mockClear();
};
