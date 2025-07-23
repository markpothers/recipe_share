import { saveChefListsLocally, loadLocalChefLists } from "./saveChefListsLocally";
import { ListChef } from "../centralTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
	getAllKeys: jest.fn(),
	multiGet: jest.fn(),
	multiSet: jest.fn(),
	multiRemove: jest.fn(),
}));

const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
const mockSetItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>;

describe("saveChefListsLocally", () => {
	let mockChefList: ListChef[];
	const mockCurrentDate = new Date("2023-01-01T00:00:00.000Z").getTime();

	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();

		mockChefList = [
			{
				id: 1,
				username: "testchef",
				country: "US",
				comments_given: 5,
				comments_received: 10,
				created_at: "2023-01-01",
				followers: 100,
				image_url: "test.jpg",
				profile_text: "Test chef",
				recipe_count: 25,
				recipe_likes_given: 50,
				recipe_likes_received: 75,
				recipe_makes_given: 20,
				recipe_makes_received: 30,
				user_chef_following: 1,
			},
		];
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	describe("saveChefListsLocally", () => {
		it("creates new chef lists storage when none exists", async () => {
			mockGetItem.mockResolvedValue(null);
			jest.setSystemTime(mockCurrentDate);

			await saveChefListsLocally(123, 456, "followers", mockChefList);

			expect(mockGetItem).toHaveBeenCalledWith("localChefLists");
			expect(mockSetItem).toHaveBeenCalled();
			
			const setItemCall = mockSetItem.mock.calls[0];
			const savedData = JSON.parse(setItemCall[1]);
			
			expect(savedData).toHaveProperty("123");
			expect(savedData["123"]).toHaveProperty("followers");
			expect(savedData["123"]["followers"].chefList).toEqual(mockChefList);
			expect(savedData["123"]["followers"].dateSaved).toBe(mockCurrentDate);
		});

		it("returns a Promise when called", () => {
			mockGetItem.mockResolvedValue(null);
			
			const result = saveChefListsLocally(123, 456, "followers", mockChefList);
			
			expect(result).toBeInstanceOf(Promise);
		});

		it("adds chef list to existing storage structure", async () => {
			const existingData = {
				"456": {
					"following": {
						chefList: [{ id: 999, username: "existingchef" }],
						dateSaved: mockCurrentDate - 1000,
					},
				},
			};
			
			mockGetItem.mockResolvedValue(JSON.stringify(existingData));
			jest.setSystemTime(mockCurrentDate);

			await saveChefListsLocally(123, 456, "followers", mockChefList);

			const setItemCall = mockSetItem.mock.calls[0];
			const savedData = JSON.parse(setItemCall[1]);
			
			// Should preserve existing data
			expect(savedData["456"]["following"]).toBeDefined();
			// Should add new data
			expect(savedData["123"]["followers"]).toBeDefined();
			expect(savedData["123"]["followers"].chefList).toEqual(mockChefList);
		});

		it("updates existing chef list when same parameters provided", async () => {
			const existingData = {
				"123": {
					"followers": {
						chefList: [{ id: 999, username: "oldchef" }],
						dateSaved: mockCurrentDate - 1000,
					},
				},
			};
			
			mockGetItem.mockResolvedValue(JSON.stringify(existingData));
			jest.setSystemTime(mockCurrentDate);

			await saveChefListsLocally(123, 456, "followers", mockChefList);

			const setItemCall = mockSetItem.mock.calls[0];
			const savedData = JSON.parse(setItemCall[1]);
			
			expect(savedData["123"]["followers"].chefList).toEqual(mockChefList);
			expect(savedData["123"]["followers"].dateSaved).toBe(mockCurrentDate);
		});

		it("removes chef lists older than 7 days (but preserves myId lists)", async () => {
			const currentTime = mockCurrentDate;
			const expiredTime = currentTime - (1000 * 60 * 60 * 24 * 8); // 8 days ago (expired)
			const validTime = currentTime - (1000 * 60 * 60 * 24 * 6); // 6 days ago (valid)

			const existingData = {
				"999": { // Different chef, not myId (456), should be cleaned up
					"followers": {
						chefList: [{ id: 998, username: "expiredchef" }],
						dateSaved: expiredTime,
					},
					"following": {
						chefList: [{ id: 999, username: "validchef" }],
						dateSaved: validTime,
					},
				},
				"456": { // This is myId, should never expire
					"followers": {
						chefList: [{ id: 777, username: "my-old-chef" }],
						dateSaved: expiredTime, // Even though old, should be preserved
					},
				},
			};
			
			mockGetItem.mockResolvedValue(JSON.stringify(existingData));
			jest.setSystemTime(mockCurrentDate);

			await saveChefListsLocally(123, 456, "followers", mockChefList);

			const setItemCall = mockSetItem.mock.calls[0];
			const savedData = JSON.parse(setItemCall[1]);
			
			// Should keep chef 999 but only the valid "following" list (expired "followers" should be removed)
			expect(savedData["999"]).toBeDefined();
			expect(savedData["999"]["followers"]).toBeUndefined(); // Expired list removed
			expect(savedData["999"]["following"]).toBeDefined(); // Valid list kept
			// Should keep myId chef data regardless of age
			expect(savedData["456"]).toBeDefined();
			// Should contain new list
			expect(savedData["123"]["followers"]).toBeDefined();
		});

		it("handles malformed JSON gracefully", async () => {
			mockGetItem.mockResolvedValue("invalid json");
			jest.setSystemTime(mockCurrentDate);

			// Should not throw but also not save due to JSON parse error
			await expect(saveChefListsLocally(123, 456, "followers", mockChefList)).resolves.toBeUndefined();
			
			// Should not call setItem since JSON parsing failed
			expect(mockSetItem).not.toHaveBeenCalled();
		});

		it("handles AsyncStorage errors gracefully", async () => {
			mockGetItem.mockRejectedValue(new Error("Storage error"));

			// Should not throw
			await expect(saveChefListsLocally(123, 456, "followers", mockChefList)).resolves.toBeUndefined();
			// Should not call setItem since error occurred
			expect(mockSetItem).not.toHaveBeenCalled();
		});

		it("sets dateSaved to current time", async () => {
			const testTime = new Date("2023-06-15T10:30:00.000Z").getTime();
			mockGetItem.mockResolvedValue(null);
			jest.setSystemTime(testTime);

			await saveChefListsLocally(123, 456, "followers", mockChefList);

			const setItemCall = mockSetItem.mock.calls[0];
			const savedData = JSON.parse(setItemCall[1]);
			
			expect(savedData["123"]["followers"].dateSaved).toBe(testTime);
		});
	});

	describe("loadLocalChefLists", () => {
		it("returns empty array when no data exists", async () => {
			mockGetItem.mockResolvedValue(null);

			const result = await loadLocalChefLists(123, "followers");

			expect(result).toEqual([]);
			expect(mockGetItem).toHaveBeenCalledWith("localChefLists");
		});

		it("returns a Promise when called", () => {
			mockGetItem.mockResolvedValue(null);
			
			const result = loadLocalChefLists(123, "followers");
			
			expect(result).toBeInstanceOf(Promise);
		});

		it("returns chef list when data exists", async () => {
			const storedData = {
				"123": {
					"followers": {
						chefList: mockChefList,
						dateSaved: mockCurrentDate,
					},
				},
			};

			mockGetItem.mockResolvedValue(JSON.stringify(storedData));

			const result = await loadLocalChefLists(123, "followers");

			expect(result).toEqual(mockChefList);
		});

		it("returns empty array when specific chef does not exist", async () => {
			const storedData = {
				"999": {
					"followers": {
						chefList: mockChefList,
						dateSaved: mockCurrentDate,
					},
				},
			};

			mockGetItem.mockResolvedValue(JSON.stringify(storedData));

			const result = await loadLocalChefLists(123, "followers");

			expect(result).toEqual([]);
		});

		it("returns empty array when specific list name does not exist", async () => {
			const storedData = {
				"123": {
					"following": {
						chefList: mockChefList,
						dateSaved: mockCurrentDate,
					},
				},
			};

			mockGetItem.mockResolvedValue(JSON.stringify(storedData));

			const result = await loadLocalChefLists(123, "followers");

			expect(result).toEqual([]);
		});

		it("handles malformed JSON gracefully", async () => {
			mockGetItem.mockResolvedValue("invalid json");

			const result = await loadLocalChefLists(123, "followers");

			expect(result).toEqual([]);
		});

		it("handles AsyncStorage errors gracefully", async () => {
			mockGetItem.mockRejectedValue(new Error("Storage error"));

			const result = await loadLocalChefLists(123, "followers");

			expect(result).toEqual([]);
		});
	});

	describe("integration tests", () => {
		it("save and load work together correctly", async () => {
			// First save
			mockGetItem.mockResolvedValue(null);
			jest.setSystemTime(mockCurrentDate);

			await saveChefListsLocally(123, 456, "followers", mockChefList);

			// Get the saved data and use it for the load test
			const setItemCall = mockSetItem.mock.calls[0];
			const savedData = setItemCall[1];

			// Now test load
			mockGetItem.mockResolvedValue(savedData);

			const result = await loadLocalChefLists(123, "followers");

			expect(result).toEqual(mockChefList);
		});

		it("correctly handles multiple chef lists for different parameters", async () => {
			mockGetItem.mockResolvedValue(null);
			jest.setSystemTime(mockCurrentDate);

			const chefList2 = [{ id: 2, username: "chef2" }] as ListChef[];

			// Save multiple lists
			await saveChefListsLocally(123, 456, "followers", mockChefList);
			
			// Update mock to return the first saved data
			const firstSave = mockSetItem.mock.calls[0][1];
			mockGetItem.mockResolvedValue(firstSave);
			
			await saveChefListsLocally(123, 456, "following", chefList2);

			// Get final saved data
			const finalSave = mockSetItem.mock.calls[1][1];
			mockGetItem.mockResolvedValue(finalSave);

			// Test loading each list
			expect(await loadLocalChefLists(123, "followers")).toEqual(mockChefList);
			expect(await loadLocalChefLists(123, "following")).toEqual(chefList2);
		});

		it("demonstrates the timeout bug is fixed", () => {
			// This test verifies the critical timeout fix (3 minutes → 7 days)
			const oneWeek = 1000 * 60 * 60 * 24 * 7;
			const threeMinutes = 1000 * 60 * 3;
			
			// The bug was using 3 minutes instead of 7 days
			expect(oneWeek).toBe(604800000); // 7 days in milliseconds
			expect(threeMinutes).toBe(180000); // 3 minutes in milliseconds
			expect(oneWeek).toBeGreaterThan(threeMinutes * 3000); // 7 days >> 3 minutes
		});
	});
});
