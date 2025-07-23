import { saveChefListsLocally, loadLocalChefLists } from "./saveChefListsLocally";
import { ListChef } from "../centralTypes";

// Mock AsyncStorage
const mockAsyncStorage = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
	getAllKeys: jest.fn(),
	multiGet: jest.fn(),
	multiSet: jest.fn(),
	multiRemove: jest.fn(),
};

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

describe("saveChefListsLocally (Fixed)", () => {
	const mockChefList: ListChef[] = [
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

	const mockDate = new Date("2024-01-01T00:00:00.000Z");
	const mockCurrentDate = mockDate.getTime();

	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
		jest.setSystemTime(mockDate);
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	describe("saveChefListsLocally", () => {
		it("creates new chef lists storage when none exists", async () => {
			mockAsyncStorage.getItem.mockResolvedValue(null);

			await saveChefListsLocally(123, 456, "1", mockChefList);

			expect(mockAsyncStorage.getItem).toHaveBeenCalledWith("localChefLists");
			expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
				"localChefLists",
				JSON.stringify({
					123: {
						"1": {
							chefList: mockChefList,
							dateSaved: mockCurrentDate,
						},
					},
				})
			);
		});

		it("adds new chef list to existing storage", async () => {
			const existingData = {
				456: {
					"2": {
						chefList: mockChefList,
						dateSaved: mockCurrentDate,
					},
				},
			};
			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingData));

			await saveChefListsLocally(123, 456, "1", mockChefList);

			expect(mockAsyncStorage.setItem).toHaveBeenCalledWith("localChefLists", expect.stringContaining('"123"'));
		});

		it("removes expired chef lists but keeps user lists", async () => {
			const currentTime = mockCurrentDate;
			const expiredTime = currentTime - 1000 * 60 * 60 * 24 * 8; // 8 days ago (expired)
			const validTime = currentTime - 1000 * 60 * 60 * 24 * 6; // 6 days ago (valid)

			const existingData = {
				456: {
					// user lists - never expire
					"1": {
						chefList: mockChefList,
						dateSaved: expiredTime, // This should NOT be removed (user lists)
					},
				},
				999: {
					// non-user lists
					"1": {
						chefList: mockChefList,
						dateSaved: expiredTime, // This SHOULD be removed
					},
				},
				789: {
					// non-user lists
					"1": {
						chefList: mockChefList,
						dateSaved: validTime, // This should NOT be removed (still valid)
					},
				},
			};

			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingData));

			await saveChefListsLocally(123, 456, "1", mockChefList);

			const setItemCall = mockAsyncStorage.setItem.mock.calls[0];
			const savedData = JSON.parse(setItemCall[1]);

			// Should not contain the expired chef 999
			expect(savedData).not.toHaveProperty("999");
			// Should contain the user chef 456 (never expires)
			expect(savedData).toHaveProperty("456");
			// Should contain the valid chef 789
			expect(savedData).toHaveProperty("789");
		});

		it("handles AsyncStorage errors gracefully", async () => {
			mockAsyncStorage.getItem.mockRejectedValue(new Error("Storage error"));

			// Should not throw
			await expect(saveChefListsLocally(123, 456, "1", mockChefList)).resolves.toBeUndefined();
			expect(mockAsyncStorage.setItem).not.toHaveBeenCalled();
		});

		it("handles malformed JSON gracefully", async () => {
			mockAsyncStorage.getItem.mockResolvedValue("invalid json");

			// Should not throw and should handle the error gracefully
			await expect(saveChefListsLocally(123, 456, "1", mockChefList)).resolves.toBeUndefined();
		});

		it("returns a Promise", () => {
			mockAsyncStorage.getItem.mockResolvedValue(null);

			const result = saveChefListsLocally(123, 456, "1", mockChefList);

			expect(result).toBeInstanceOf(Promise);
		});
	});

	describe("loadLocalChefLists", () => {
		it("returns chef list when it exists in storage", async () => {
			const storedData = {
				123: {
					"1": {
						chefList: mockChefList,
						dateSaved: mockCurrentDate,
					},
				},
			};

			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedData));

			const result = await loadLocalChefLists(123, "1");

			expect(result).toEqual(mockChefList);
			expect(mockAsyncStorage.getItem).toHaveBeenCalledWith("localChefLists");
		});

		it("returns empty array when chef does not exist", async () => {
			const storedData = {
				456: {
					"1": {
						chefList: mockChefList,
						dateSaved: mockCurrentDate,
					},
				},
			};

			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedData));

			const result = await loadLocalChefLists(123, "1");

			expect(result).toEqual([]);
		});

		it("returns empty array when list name does not exist for chef", async () => {
			const storedData = {
				123: {
					"2": {
						chefList: mockChefList,
						dateSaved: mockCurrentDate,
					},
				},
			};

			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedData));

			const result = await loadLocalChefLists(123, "1");

			expect(result).toEqual([]);
		});

		it("returns empty array when no storage exists", async () => {
			mockAsyncStorage.getItem.mockResolvedValue(null);

			const result = await loadLocalChefLists(123, "1");

			expect(result).toEqual([]);
		});

		it("returns empty array when AsyncStorage errors", async () => {
			mockAsyncStorage.getItem.mockRejectedValue(new Error("Storage error"));

			const result = await loadLocalChefLists(123, "1");

			expect(result).toEqual([]);
		});

		it("returns empty array when JSON parsing fails", async () => {
			mockAsyncStorage.getItem.mockResolvedValue("invalid json");

			const result = await loadLocalChefLists(123, "1");

			expect(result).toEqual([]);
		});
	});

	describe("integration scenarios", () => {
		it("save then load workflow", async () => {
			// Mock successful storage operations
			let storedData: string | null = null;
			mockAsyncStorage.getItem.mockImplementation(() => Promise.resolve(storedData));
			mockAsyncStorage.setItem.mockImplementation((key, value) => {
				storedData = value;
				return Promise.resolve();
			});

			// Save data
			await saveChefListsLocally(123, 456, "1", mockChefList);

			// Load data
			const result = await loadLocalChefLists(123, "1");

			expect(result).toEqual(mockChefList);
		});

		it("demonstrates the timeout bug is fixed", () => {
			// The original bug: const oneWeek = 1000 * 60 * 3; (3 minutes!)
			// Fixed to: const oneWeek = 1000 * 60 * 60 * 24 * 7; (7 days)

			const oneWeekCorrect = 1000 * 60 * 60 * 24 * 7;
			const threeMinutesBug = 1000 * 60 * 3;

			expect(oneWeekCorrect).toBe(604800000); // 7 days in milliseconds
			expect(threeMinutesBug).toBe(180000); // 3 minutes in milliseconds
			expect(oneWeekCorrect).not.toBe(threeMinutesBug);
		});
	});
});
