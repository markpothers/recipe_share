import { saveRecipeListsLocally, loadLocalRecipeLists } from "./saveRecipeListsLocally";
import { ListRecipe } from "../centralTypes";
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

describe("saveRecipeListsLocally", () => {
	let mockRecipeList: ListRecipe[];
	const mockCurrentDate = new Date("2023-01-01T00:00:00.000Z").getTime();

	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();

		mockRecipeList = [
			{
				id: 1,
				name: "Test Recipe",
				description: "A test recipe",
				chef_id: 123,
				username: "testchef",
				created_at: "2023-01-01",
				updated_at: "2023-01-01",
				cuisine: "American",
				difficulty: 2,
				prep_time: 15,
				cook_time: 30,
				serves: "4",
				image_url: "test.jpg",
				likes_count: 10,
				makes_count: 5,
				comments_count: 3,
				shares_count: 2,
				acknowledgement: "",
				acknowledgement_link: "",
				chef_commented: 0,
				chef_liked: 0,
				chef_made: 0,
				chef_shared: 0,
				chefimage_url: "chef.jpg",
				ordering_param: "created_at",
				shared_id: null,
				sharer_id: null,
				sharer_username: null,
				show_blog_preview: false,
				time: null,
				total_time: 45,
			},
		];
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	describe("saveRecipeListsLocally", () => {
		it("creates new recipe lists storage when none exists", async () => {
			mockGetItem.mockResolvedValue(null);
			jest.setSystemTime(mockCurrentDate);

			await saveRecipeListsLocally(123, 456, "liked", mockRecipeList);

			expect(mockGetItem).toHaveBeenCalledWith("localRecipeLists");
			expect(mockSetItem).toHaveBeenCalled();

			const setItemCall = mockSetItem.mock.calls[0];
			const savedData = JSON.parse(setItemCall[1]);

			expect(savedData).toHaveProperty("123");
			expect(savedData["123"]).toHaveProperty("liked");
			expect(savedData["123"]["liked"].recipeList).toEqual(mockRecipeList);
			expect(savedData["123"]["liked"].dateSaved).toBe(mockCurrentDate);
		});

		it("returns a Promise when called", () => {
			mockGetItem.mockResolvedValue(null);

			const result = saveRecipeListsLocally(123, 456, "liked", mockRecipeList);

			expect(result).toBeInstanceOf(Promise);
		});

		it("adds recipe list to existing storage structure", async () => {
			const existingData = {
				"456": {
					made: {
						recipeList: [{ id: 999, name: "Existing Recipe", chef_id: 888 }],
						dateSaved: mockCurrentDate - 1000,
					},
				},
			};

			mockGetItem.mockResolvedValue(JSON.stringify(existingData));
			jest.setSystemTime(mockCurrentDate);

			await saveRecipeListsLocally(123, 456, "liked", mockRecipeList);

			const setItemCall = mockSetItem.mock.calls[0];
			const savedData = JSON.parse(setItemCall[1]);

			// Should preserve existing data
			expect(savedData["456"]["made"]).toBeDefined();
			// Should add new data
			expect(savedData["123"]["liked"]).toBeDefined();
			expect(savedData["123"]["liked"].recipeList).toEqual(mockRecipeList);
		});

		it("updates existing recipe list when same parameters provided", async () => {
			const existingData = {
				"123": {
					liked: {
						recipeList: [{ id: 999, name: "Old Recipe", chef_id: 888 }],
						dateSaved: mockCurrentDate - 1000,
					},
				},
			};

			mockGetItem.mockResolvedValue(JSON.stringify(existingData));
			jest.setSystemTime(mockCurrentDate);

			await saveRecipeListsLocally(123, 456, "liked", mockRecipeList);

			const setItemCall = mockSetItem.mock.calls[0];
			const savedData = JSON.parse(setItemCall[1]);

			expect(savedData["123"]["liked"].recipeList).toEqual(mockRecipeList);
			expect(savedData["123"]["liked"].dateSaved).toBe(mockCurrentDate);
		});

		it("removes recipe lists older than 7 days (but preserves myId lists)", async () => {
			const currentTime = mockCurrentDate;
			const expiredTime = currentTime - 1000 * 60 * 60 * 24 * 8; // 8 days ago (expired)
			const validTime = currentTime - 1000 * 60 * 60 * 24 * 6; // 6 days ago (valid)

			const existingData = {
				"999": {
					// Different chef, not myId (456), should be cleaned up
					liked: {
						recipeList: [{ id: 998, name: "Expired Recipe", chef_id: 888 }],
						dateSaved: expiredTime,
					},
					made: {
						recipeList: [{ id: 999, name: "Valid Recipe", chef_id: 888 }],
						dateSaved: validTime,
					},
				},
				"456": {
					// This is myId, should never expire
					liked: {
						recipeList: [{ id: 777, name: "My Old Recipe", chef_id: 456 }],
						dateSaved: expiredTime, // Even though old, should be preserved
					},
				},
			};

			mockGetItem.mockResolvedValue(JSON.stringify(existingData));
			jest.setSystemTime(mockCurrentDate);

			await saveRecipeListsLocally(123, 456, "liked", mockRecipeList);

			const setItemCall = mockSetItem.mock.calls[0];
			const savedData = JSON.parse(setItemCall[1]);

			// Should keep chef 999 but only the valid "made" list (expired "liked" should be removed)
			expect(savedData["999"]).toBeDefined();
			expect(savedData["999"]["liked"]).toBeUndefined(); // Expired list removed
			expect(savedData["999"]["made"]).toBeDefined(); // Valid list kept
			// Should keep myId chef data regardless of age
			expect(savedData["456"]).toBeDefined();
			// Should contain new list
			expect(savedData["123"]["liked"]).toBeDefined();
		});

		it("handles malformed JSON gracefully", async () => {
			mockGetItem.mockResolvedValue("invalid json");
			jest.setSystemTime(mockCurrentDate);

			// Should not throw but also not save due to JSON parse error
			await expect(saveRecipeListsLocally(123, 456, "liked", mockRecipeList)).resolves.toBeUndefined();

			// Should not call setItem since JSON parsing failed
			expect(mockSetItem).not.toHaveBeenCalled();
		});

		it("handles AsyncStorage errors gracefully", async () => {
			mockGetItem.mockRejectedValue(new Error("Storage error"));

			// Should not throw
			await expect(saveRecipeListsLocally(123, 456, "liked", mockRecipeList)).resolves.toBeUndefined();
			// Should not call setItem since error occurred
			expect(mockSetItem).not.toHaveBeenCalled();
		});

		it("sets dateSaved to current time", async () => {
			const testTime = new Date("2023-06-15T10:30:00.000Z").getTime();
			mockGetItem.mockResolvedValue(null);
			jest.setSystemTime(testTime);

			await saveRecipeListsLocally(123, 456, "liked", mockRecipeList);

			const setItemCall = mockSetItem.mock.calls[0];
			const savedData = JSON.parse(setItemCall[1]);

			expect(savedData["123"]["liked"].dateSaved).toBe(testTime);
		});
	});

	describe("loadLocalRecipeLists", () => {
		it("returns empty array when no data exists", async () => {
			mockGetItem.mockResolvedValue(null);

			const result = await loadLocalRecipeLists(123, "liked");

			expect(result).toEqual([]);
			expect(mockGetItem).toHaveBeenCalledWith("localRecipeLists");
		});

		it("returns a Promise when called", () => {
			mockGetItem.mockResolvedValue(null);

			const result = loadLocalRecipeLists(123, "liked");

			expect(result).toBeInstanceOf(Promise);
		});

		it("returns recipe list when data exists", async () => {
			const storedData = {
				"123": {
					liked: {
						recipeList: mockRecipeList,
						dateSaved: mockCurrentDate,
					},
				},
			};

			mockGetItem.mockResolvedValue(JSON.stringify(storedData));

			const result = await loadLocalRecipeLists(123, "liked");

			expect(result).toEqual(mockRecipeList);
		});

		it("returns empty array when specific chef does not exist", async () => {
			const storedData = {
				"999": {
					liked: {
						recipeList: mockRecipeList,
						dateSaved: mockCurrentDate,
					},
				},
			};

			mockGetItem.mockResolvedValue(JSON.stringify(storedData));

			const result = await loadLocalRecipeLists(123, "liked");

			expect(result).toEqual([]);
		});

		it("returns empty array when specific list name does not exist", async () => {
			const storedData = {
				"123": {
					made: {
						recipeList: mockRecipeList,
						dateSaved: mockCurrentDate,
					},
				},
			};

			mockGetItem.mockResolvedValue(JSON.stringify(storedData));

			const result = await loadLocalRecipeLists(123, "liked");

			expect(result).toEqual([]);
		});

		it("handles malformed JSON gracefully", async () => {
			mockGetItem.mockResolvedValue("invalid json");

			const result = await loadLocalRecipeLists(123, "liked");

			expect(result).toEqual([]);
		});

		it("handles AsyncStorage errors gracefully", async () => {
			mockGetItem.mockRejectedValue(new Error("Storage error"));

			const result = await loadLocalRecipeLists(123, "liked");

			expect(result).toEqual([]);
		});
	});

	describe("integration tests", () => {
		it("save and load work together correctly", async () => {
			// First save
			mockGetItem.mockResolvedValue(null);
			jest.setSystemTime(mockCurrentDate);

			await saveRecipeListsLocally(123, 456, "liked", mockRecipeList);

			// Get the saved data and use it for the load test
			const setItemCall = mockSetItem.mock.calls[0];
			const savedData = setItemCall[1];

			// Now test load
			mockGetItem.mockResolvedValue(savedData);

			const result = await loadLocalRecipeLists(123, "liked");

			expect(result).toEqual(mockRecipeList);
		});

		it("correctly handles multiple recipe lists for different parameters", async () => {
			mockGetItem.mockResolvedValue(null);
			jest.setSystemTime(mockCurrentDate);

			const recipeList2 = [{ id: 2, name: "Recipe 2", chef_id: 456 }] as ListRecipe[];

			// Save multiple lists
			await saveRecipeListsLocally(123, 456, "liked", mockRecipeList);

			// Update mock to return the first saved data
			const firstSave = mockSetItem.mock.calls[0][1];
			mockGetItem.mockResolvedValue(firstSave);

			await saveRecipeListsLocally(123, 456, "made", recipeList2);

			// Get final saved data
			const finalSave = mockSetItem.mock.calls[1][1];
			mockGetItem.mockResolvedValue(finalSave);

			// Test loading each list
			expect(await loadLocalRecipeLists(123, "liked")).toEqual(mockRecipeList);
			expect(await loadLocalRecipeLists(123, "made")).toEqual(recipeList2);
		});
	});
});
