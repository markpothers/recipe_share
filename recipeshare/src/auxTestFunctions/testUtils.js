import { act, fireEvent, waitFor } from "@testing-library/react-native";

/**
 * Custom test utilities to simplify React Native testing with proper act wrapping
 */

// Basic interaction utilities
export const actAndWait = async (action, assertion) => {
	await act(async () => {
		await action();
	});
	if (assertion) {
		await waitFor(assertion);
	}
};

export const pressAndWait = async (element, assertion) => {
	await act(async () => {
		fireEvent.press(element);
	});
	if (assertion) {
		await waitFor(assertion);
	}
};

export const changeTextAndWait = async (element, text, assertion) => {
	await act(async () => {
		fireEvent.changeText(element, text);
	});
	if (assertion) {
		await waitFor(assertion);
	}
};

export const triggerEventAndWait = async (element, eventName, value, assertion) => {
	await act(async () => {
		fireEvent(element, eventName, value);
	});
	if (assertion) {
		await waitFor(assertion);
	}
};

// Timer utilities
export const runTimersAndWait = async (assertion) => {
	await act(async () => {
		jest.runAllTimers();
	});
	if (assertion) {
		await waitFor(assertion);
	}
};

// Component loading utilities
export const waitForLoadingToComplete = async (queryAllByTestId) => {
	await waitFor(() => expect(queryAllByTestId("activityIndicator").length).toEqual(0));
};

// Navigation assertion utilities
export const expectNavigation = (mockNavigate, screen, params) => {
	expect(mockNavigate).toHaveBeenCalledWith(screen, params);
};

export const expectNoNavigation = (mockNavigate) => {
	expect(mockNavigate).not.toHaveBeenCalled();
};

// Storage assertion utilities  
export const expectStorageCall = (mockGetItem, key, expectCallback = true) => {
	if (expectCallback) {
		// For old callback pattern (recipe/chef details)
		expect(mockGetItem).toHaveBeenCalledWith(key, expect.any(Function));
	} else {
		// For new async/await pattern (recipe/chef lists) 
		expect(mockGetItem).toHaveBeenCalledWith(key);
	}
};

export const expectStorageSet = (mockSetItem, key, value) => {
	expect(mockSetItem).toHaveBeenCalledWith(key, JSON.stringify(value));
};

// API assertion utilities
export const expectApiCall = (mockApi, ...args) => {
	expect(mockApi).toHaveBeenCalledWith(...args);
};

export const expectApiCallCount = (mockApi, count) => {
	expect(mockApi).toHaveBeenCalledTimes(count);
};

// Element assertion utilities
export const expectElementExists = (element) => {
	expect(element).toBeTruthy();
};

export const expectElementCount = (elements, count) => {
	expect(elements.length).toEqual(count);
};

export const expectElementProp = (element, prop, value) => {
	expect(element.props[prop]).toEqual(value);
};

// Complex interaction patterns
export const pressAndExpectNavigation = async (element, mockNavigate, screen, params) => {
	await pressAndWait(element, () => {
		expectNavigation(mockNavigate, screen, params);
	});
};

export const pressAndExpectOfflineMessage = async (element, getByTestId) => {
	await pressAndWait(element, () => {
		expectElementExists(getByTestId("offlineMessage"));
	});
};

export const searchAndWaitForResults = async (searchInput, searchText, queryByTestIdFunc, expectedCount) => {
	await act(async () => {
		fireEvent.changeText(searchInput, searchText);
	});
	await waitFor(() => {
		expect(queryByTestIdFunc("recipeCard").length).toEqual(expectedCount);
	});
};

// Filter interaction patterns
export const openFiltersAndWait = async (filterButton, getByTextFunc, expectedText) => {
	await act(async () => {
		fireEvent.press(filterButton);
	});
	await waitFor(() => {
		expect(getByTextFunc(expectedText)).toBeTruthy();
	});
};

export const selectFilterAndWait = async (filterElement, assertion) => {
	await pressAndWait(filterElement, assertion);
};

export const openPickerAndSelect = async (pickerButton, getByTestIdFunc, pickerId, value) => {
	await act(async () => {
		fireEvent.press(pickerButton);
	});
	await waitFor(() => {
		expect(getByTestIdFunc(pickerId)).toBeTruthy();
	});

	await act(async () => {
		fireEvent(getByTestIdFunc(pickerId), "onValueChange", value);
	});

	await runTimersAndWait();
};

// Recipe interaction patterns
export const likeRecipeAndWait = async (likeButton, assertion) => {
	await pressAndWait(likeButton, assertion);
};

export const shareRecipeAndWait = async (shareButton, assertion) => {
	await pressAndWait(shareButton, assertion);
};

export const commentOnRecipeAndWait = async (commentButton, assertion) => {
	await pressAndWait(commentButton, assertion);
};

// Count assertion utilities
export const expectCountChange = (countElement, expectedCount) => {
	expect(countElement.props.children).toEqual(expectedCount);
};

// Grouped assertions for common patterns
export const expectRecipeNavigation = (mockNavigate, recipeID, commenting = false) => {
	expectNavigation(mockNavigate, "RecipeDetails", { recipeID, commenting });
};

export const expectChefNavigation = (mockNavigate, chefID) => {
	expectNavigation(mockNavigate, "ChefDetails", { chefID });
};

export const expectLogoutNavigation = (mockNavigate) => {
	expectNavigation(mockNavigate, "ProfileCover", {
		screen: "Profile",
		params: { logout: true },
	});
};

export const pressAndExpectClosing = async (element, queryFunction, searchText) => {
	await act(async () => {
		fireEvent.press(element);
	});
	await waitFor(() => {
		expect(queryFunction(searchText).length).toEqual(0);
	});
};

export const pressAndWaitForResults = async (element, queryFunction, testId, expectedCount) => {
	await act(async () => {
		fireEvent.press(element);
	});
	await waitFor(() => {
		expect(queryFunction(testId).length).toEqual(expectedCount);
	});
};
