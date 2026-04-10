export const SaveFormat = {
	JPEG: "jpeg",
	PNG: "png",
};

// Mock implementation that can be controlled in tests
let mockShouldFail = false;
let mockBase64Result = "mockBase64String";

export const setMockShouldFail = (shouldFail) => {
	mockShouldFail = shouldFail;
};

export const setMockBase64Result = (base64String) => {
	mockBase64Result = base64String;
};

export const manipulateAsync = jest.fn((uri, actions, options) => {
	if (mockShouldFail) {
		return Promise.reject(new Error("Mock ImageManipulator error"));
	}

	return Promise.resolve({
		uri: "mockProcessedUri",
		base64: options.base64 ? mockBase64Result : undefined,
		width: 100,
		height: 100,
	});
});

// Reset mocks after each test
export const resetMocks = () => {
	mockShouldFail = false;
	mockBase64Result = "mockBase64String";
	manipulateAsync.mockClear();
};
