import { act, fireEvent, waitFor } from "@testing-library/react-native";

import type { ReactTestInstance } from "react-test-renderer";

/**
 * Custom test utilities to simplify React Native testing with proper act wrapping
 */

// Type definitions
type AssertionFunction = () => void | Promise<void>;
type QueryAllFunction = (testId: string) => ReactTestInstance[];
type NavigationMock = jest.MockedFunction<(screen: string, params?: Record<string, unknown>) => void>;
type StorageMock = jest.MockedFunction<(key: string, value?: string | (() => void)) => void>;
type ApiMock = jest.MockedFunction<(...args: unknown[]) => unknown>;

// Basic interaction utilities
export const actAndWait = async (action: () => Promise<void> | void, assertion?: AssertionFunction): Promise<void> => {
	await act(async () => {
		await action();
	});
	if (assertion) {
		await waitFor(assertion);
	}
};

export const pressAndWait = async (element: ReactTestInstance, assertion?: AssertionFunction): Promise<void> => {
	await act(async () => {
		fireEvent.press(element);
	});
	if (assertion) {
		await waitFor(assertion);
	}
};

export const changeTextAndWait = async (
	element: ReactTestInstance,
	text: string,
	assertion?: AssertionFunction
): Promise<void> => {
	await act(async () => {
		fireEvent.changeText(element, text);
	});
	if (assertion) {
		await waitFor(assertion);
	}
};

export const triggerEventAndWait = async (
	element: ReactTestInstance,
	eventName: string,
	value: unknown,
	assertion?: AssertionFunction
): Promise<void> => {
	await act(async () => {
		fireEvent(element, eventName, value);
	});
	if (assertion) {
		await waitFor(assertion);
	}
};

// Timer utilities
export const runTimersAndWait = async (assertion?: AssertionFunction): Promise<void> => {
	await act(async () => {
		jest.runAllTimers();
	});
	if (assertion) {
		await waitFor(assertion);
	}
};

// Component loading utilities
export const waitForLoadingToComplete = async (queryAllByTestId: QueryAllFunction): Promise<void> => {
	await waitFor(() => expect(queryAllByTestId("activityIndicator").length).toEqual(0));
};

// Navigation assertion utilities
export const expectNavigation = (
	mockNavigate: NavigationMock,
	screen: string,
	params?: Record<string, unknown>
): void => {
	expect(mockNavigate).toHaveBeenCalledWith(screen, params);
};

export const expectNoNavigation = (mockNavigate: NavigationMock): void => {
	expect(mockNavigate).not.toHaveBeenCalled();
};

// Storage assertion utilities
export const expectStorageCall = (mockGetItem: StorageMock, key: string): void => {
	// Promise-based API (modern)
	expect(mockGetItem).toHaveBeenCalledWith(key);
};

export const expectStorageSet = (mockSetItem: StorageMock, key: string, value: unknown): void => {
	expect(mockSetItem).toHaveBeenCalledWith(key, JSON.stringify(value));
};

// API assertion utilities
export const expectApiCall = (mockApi: ApiMock, ...args: unknown[]): void => {
	expect(mockApi).toHaveBeenCalledWith(...args);
};

export const expectApiCallCount = (mockApi: ApiMock, count: number): void => {
	expect(mockApi).toHaveBeenCalledTimes(count);
};

// Element assertion utilities
export const expectElementExists = (element: ReactTestInstance | null): void => {
	expect(element).toBeTruthy();
};

export const expectElementCount = (elements: ReactTestInstance[], count: number): void => {
	expect(elements.length).toEqual(count);
};

export const expectElementProp = (element: ReactTestInstance, prop: string, value: unknown): void => {
	expect(element.props[prop]).toEqual(value);
};

// Complex interaction patterns
export const pressAndExpectNavigation = async (
	element: ReactTestInstance,
	mockNavigate: NavigationMock,
	screen: string,
	params?: Record<string, unknown>
): Promise<void> => {
	await pressAndWait(element, () => {
		expectNavigation(mockNavigate, screen, params);
	});
};

export const pressAndExpectOfflineMessage = async (
	element: ReactTestInstance,
	getByTestId: (testId: string) => ReactTestInstance
): Promise<void> => {
	await pressAndWait(element, () => {
		expectElementExists(getByTestId("offlineMessage"));
	});
};

export const searchAndWaitForResults = async (
	searchInput: ReactTestInstance,
	searchText: string,
	queryByTestIdFunc: QueryAllFunction,
	expectedCount: number
): Promise<void> => {
	await act(async () => {
		fireEvent.changeText(searchInput, searchText);
	});
	await waitFor(() => {
		expect(queryByTestIdFunc("recipeCard").length).toEqual(expectedCount);
	});
};

// Filter interaction patterns
export const openFiltersAndWait = async (
	filterButton: ReactTestInstance,
	getByTextFunc: (text: string) => ReactTestInstance,
	expectedText: string
): Promise<void> => {
	await act(async () => {
		fireEvent.press(filterButton);
	});
	await waitFor(() => {
		expect(getByTextFunc(expectedText)).toBeTruthy();
	});
};

export const selectFilterAndWait = async (
	filterElement: ReactTestInstance,
	assertion?: AssertionFunction
): Promise<void> => {
	await pressAndWait(filterElement, assertion);
};

export const openPickerAndSelect = async (
	pickerButton: ReactTestInstance,
	getByTestIdFunc: (testId: string) => ReactTestInstance,
	pickerId: string,
	value: unknown
): Promise<void> => {
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
export const likeRecipeAndWait = async (
	likeButton: ReactTestInstance,
	assertion?: AssertionFunction
): Promise<void> => {
	await pressAndWait(likeButton, assertion);
};

export const shareRecipeAndWait = async (
	shareButton: ReactTestInstance,
	assertion?: AssertionFunction
): Promise<void> => {
	await pressAndWait(shareButton, assertion);
};

export const commentOnRecipeAndWait = async (
	commentButton: ReactTestInstance,
	assertion?: AssertionFunction
): Promise<void> => {
	await pressAndWait(commentButton, assertion);
};

// Count assertion utilities
export const expectCountChange = (countElement: ReactTestInstance, expectedCount: number): void => {
	expect(countElement.props.children).toEqual(expectedCount);
};

// Grouped assertions for common patterns
export const expectRecipeNavigation = (mockNavigate: NavigationMock, recipeID: string, commenting = false): void => {
	expectNavigation(mockNavigate, "RecipeDetails", { recipeID, commenting });
};

export const expectChefNavigation = (mockNavigate: NavigationMock, chefID: string): void => {
	expectNavigation(mockNavigate, "ChefDetails", { chefID });
};

export const expectLogoutNavigation = (mockNavigate: NavigationMock): void => {
	expectNavigation(mockNavigate, "ProfileCover", {
		screen: "Profile",
		params: { logout: true },
	});
};

export const pressAndExpectClosing = async (
	element: ReactTestInstance,
	queryFunction: QueryAllFunction,
	searchText: string
): Promise<void> => {
	await act(async () => {
		fireEvent.press(element);
	});
	await waitFor(() => {
		expect(queryFunction(searchText).length).toEqual(0);
	});
};

export const pressAndWaitForResults = async (
	element: ReactTestInstance,
	queryFunction: QueryAllFunction,
	testId: string,
	expectedCount: number
): Promise<void> => {
	await act(async () => {
		fireEvent.press(element);
	});
	await waitFor(() => {
		expect(queryFunction(testId).length).toEqual(expectedCount);
	});
};
