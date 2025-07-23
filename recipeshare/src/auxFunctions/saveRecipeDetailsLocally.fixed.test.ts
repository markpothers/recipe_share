import saveRecipeDetailsLocally from "./saveRecipeDetailsLocally";
import { Recipe } from "../centralTypes";

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

describe("saveRecipeDetailsLocally (Fixed)", () => {
	const mockCurrentDate = new Date("2023-01-01T00:00:00.000Z").getTime();

	// Create a mock recipe details that matches the Recipe type but allows for missing properties
	const mockRecipeDetails = {
		recipe: {
			id: 123,
			name: "Test Recipe",
			description: "A test recipe",
			chef_id: 456,
			created_at: "2023-01-01",
			updated_at: "2023-01-01",
			cuisine: "American" as const,
			difficulty: 2,
			prep_time: 15,
			cook_time: 30,
			serves: "4" as const,
			acknowledgement: "",
			acknowledgement_link: "",
			show_blog_preview: false,
			hidden: false,
			time: null,
			total_time: 45,
			// FilterSettings defaults
			Bread: false,
			Breakfast: false,
			Chicken: false,
			"Dairy free": false,
			Dessert: false,
			Dinner: false,
			"Freezer meal": false,
			"Gluten free": false,
			Keto: false,
			Lunch: false,
			Paleo: false,
			"Red meat": false,
			Salad: false,
			Seafood: false,
			Side: false,
			Soup: false,
			Vegan: false,
			Vegetarian: false,
			Weekend: false,
			Weeknight: false,
			"White meat": false,
			"Whole 30": false,
		},
		chef_id: 456,
		chef_username: "testchef",
		comments: [],
		ingredient_uses: [],
		ingredients: [],
		instructions: [],
		instruction_images: [],
		likeable: true,
		make_pics: [],
		make_pics_chefs: [],
		makeable: true,
		re_shares: 2,
		recipe_images: [],
		recipe_likes: 10,
		dateSaved: mockCurrentDate,
	} as Recipe & { dateSaved: number };

	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	describe("when no local recipe details exist", () => {
		beforeEach(() => {
			mockAsyncStorage.getItem.mockResolvedValue(null);
		});

		it("creates new recipe list with the provided recipe", async () => {
			jest.setSystemTime(mockCurrentDate);

			await saveRecipeDetailsLocally(mockRecipeDetails, 456);

			expect(mockAsyncStorage.getItem).toHaveBeenCalledWith("localRecipeDetails");
			expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
				"localRecipeDetails",
				JSON.stringify([mockRecipeDetails])
			);
		});

		it("returns a Promise when called", () => {
			const result = saveRecipeDetailsLocally(mockRecipeDetails, 456);

			expect(result).toBeInstanceOf(Promise);
		});
	});

	describe("when local recipe details exist", () => {
		it("adds new recipe to existing list", async () => {
			const existingRecipes = [
				{
					recipe: { id: 999, name: "Existing Recipe", chef_id: 789 },
					dateSaved: new Date("2022-12-01T00:00:00.000Z").getTime(),
				},
			];
			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingRecipes));
			jest.setSystemTime(mockCurrentDate);

			await saveRecipeDetailsLocally(mockRecipeDetails, 456);

			const setItemCall = mockAsyncStorage.setItem.mock.calls[0];
			const savedData = JSON.parse(setItemCall[1]);

			expect(savedData).toHaveLength(2);
			expect(savedData.find((r: { recipe: { id: number } }) => r.recipe.id === 123)).toBeDefined();
			expect(savedData.find((r: { recipe: { id: number } }) => r.recipe.id === 999)).toBeDefined();
		});

		it("updates existing recipe when recipe already exists", async () => {
			const existingRecipes = [
				{
					recipe: { id: 123, name: "Old Recipe", chef_id: 456 },
					dateSaved: new Date("2022-12-01T00:00:00.000Z").getTime(),
				},
			];
			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingRecipes));
			jest.setSystemTime(mockCurrentDate);

			await saveRecipeDetailsLocally(mockRecipeDetails, 456);

			const setItemCall = mockAsyncStorage.setItem.mock.calls[0];
			const savedData = JSON.parse(setItemCall[1]);

			expect(savedData).toHaveLength(1);
			expect(savedData[0].recipe.name).toBe("Test Recipe");
			expect(savedData[0].dateSaved).toBe(mockCurrentDate);
		});

		it("removes expired recipes older than one week (for non-user recipes)", async () => {
			const currentTime = mockCurrentDate;
			const expiredTime = currentTime - 1000 * 60 * 60 * 24 * 8; // 8 days ago (expired)
			const validTime = currentTime - 1000 * 60 * 60 * 24 * 6; // 6 days ago (valid)

			const existingRecipes = [
				{
					recipe: { id: 998, name: "Old Recipe", chef_id: 999 }, // Not user's recipe
					dateSaved: expiredTime,
				},
				{
					recipe: { id: 999, name: "Recent Recipe", chef_id: 888 }, // Not user's recipe
					dateSaved: validTime,
				},
			];

			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingRecipes));
			jest.setSystemTime(mockCurrentDate);

			await saveRecipeDetailsLocally(mockRecipeDetails, 456);

			const setItemCall = mockAsyncStorage.setItem.mock.calls[0];
			const savedData = JSON.parse(setItemCall[1]);

			// Should not contain the old recipe (998)
			expect(savedData.find((r: { recipe: { id: number } }) => r.recipe.id === 998)).toBeUndefined();
			// Should contain the recent recipe (999)
			expect(savedData.find((r: { recipe: { id: number } }) => r.recipe.id === 999)).toBeDefined();
			// Should contain the new recipe (123)
			expect(savedData.find((r: { recipe: { id: number } }) => r.recipe.id === 123)).toBeDefined();
		});

		it("keeps user's own recipes forever regardless of age", async () => {
			const currentTime = mockCurrentDate;
			const veryOldTime = currentTime - 1000 * 60 * 60 * 24 * 365; // 1 year ago

			const existingRecipes = [
				{
					recipe: { id: 998, name: "Very Old User Recipe", chef_id: 456 }, // User's recipe
					dateSaved: veryOldTime,
				},
			];

			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingRecipes));
			jest.setSystemTime(mockCurrentDate);

			await saveRecipeDetailsLocally(mockRecipeDetails, 456);

			const setItemCall = mockAsyncStorage.setItem.mock.calls[0];
			const savedData = JSON.parse(setItemCall[1]);

			// Should keep the old user recipe
			expect(savedData.find((r: { recipe: { id: number } }) => r.recipe.id === 998)).toBeDefined();
			// Should also contain the new recipe
			expect(savedData.find((r: { recipe: { id: number } }) => r.recipe.id === 123)).toBeDefined();
		});

		it("keeps liked recipes for three months", async () => {
			const currentTime = mockCurrentDate;
			const twoMonthsAgo = currentTime - 1000 * 60 * 60 * 24 * 60; // 2 months ago (within 3 months)
			const fourMonthsAgo = currentTime - 1000 * 60 * 60 * 24 * 120; // 4 months ago (expired)

			const existingRecipes = [
				{
					recipe: { id: 997, name: "Liked Recipe Recent", chef_id: 999 },
					dateSaved: twoMonthsAgo,
					likeable: false, // This means it's liked
				},
				{
					recipe: { id: 996, name: "Liked Recipe Old", chef_id: 999 },
					dateSaved: fourMonthsAgo,
					likeable: false, // This means it's liked but too old
				},
			];

			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingRecipes));
			jest.setSystemTime(mockCurrentDate);

			await saveRecipeDetailsLocally(mockRecipeDetails, 456);

			const setItemCall = mockAsyncStorage.setItem.mock.calls[0];
			const savedData = JSON.parse(setItemCall[1]);

			// Should keep the 2-month-old liked recipe
			expect(savedData.find((r: { recipe: { id: number } }) => r.recipe.id === 997)).toBeDefined();
			// Should not keep the 4-month-old liked recipe
			expect(savedData.find((r: { recipe: { id: number } }) => r.recipe.id === 996)).toBeUndefined();
		});
	});

	describe("edge cases", () => {
		it("handles AsyncStorage getItem errors gracefully", async () => {
			mockAsyncStorage.getItem.mockRejectedValue(new Error("Storage error"));
			jest.setSystemTime(mockCurrentDate);

			// Should not throw
			await expect(saveRecipeDetailsLocally(mockRecipeDetails, 456)).resolves.toBeUndefined();
			// Should not call setItem since error occurred
			expect(mockAsyncStorage.setItem).not.toHaveBeenCalled();
		});

		it("handles malformed JSON in storage gracefully", async () => {
			mockAsyncStorage.getItem.mockResolvedValue("invalid json");
			jest.setSystemTime(mockCurrentDate);

			// Should not throw and should handle gracefully
			await expect(saveRecipeDetailsLocally(mockRecipeDetails, 456)).resolves.toBeUndefined();
		});

		it("sets dateSaved to current time", async () => {
			const testTime = new Date("2023-06-15T10:30:00.000Z").getTime();
			mockAsyncStorage.getItem.mockResolvedValue(null);
			jest.setSystemTime(testTime);

			// Create a copy without dateSaved to test that it gets set
			const recipeWithoutDate = { ...mockRecipeDetails };
			delete (recipeWithoutDate as { dateSaved?: number }).dateSaved;

			await saveRecipeDetailsLocally(recipeWithoutDate as Recipe & { dateSaved: number }, 456);

			const setItemCall = mockAsyncStorage.setItem.mock.calls[0];
			const savedData = JSON.parse(setItemCall[1]);

			expect(savedData[0].dateSaved).toBe(testTime);
		});
	});

	describe("date filtering logic", () => {
		it("correctly calculates time thresholds", async () => {
			const currentTime = mockCurrentDate;
			const twoWeeksAgo = currentTime - 1000 * 60 * 60 * 24 * 14; // Beyond one week
			const fourMonthsAgo = currentTime - 1000 * 60 * 60 * 24 * 120; // Beyond three months

			const existingRecipes = [
				{
					recipe: { id: 997, name: "Two Weeks Old", chef_id: 999 },
					dateSaved: twoWeeksAgo,
					likeable: true, // Not liked, so should expire after one week
				},
				{
					recipe: { id: 996, name: "Four Months Old Liked", chef_id: 999 },
					dateSaved: fourMonthsAgo,
					likeable: false, // Liked, but should expire after three months
				},
			];

			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingRecipes));
			jest.setSystemTime(mockCurrentDate);

			await saveRecipeDetailsLocally(mockRecipeDetails, 456);

			const setItemCall = mockAsyncStorage.setItem.mock.calls[0];
			const savedData = JSON.parse(setItemCall[1]);

			// Both should be removed as they're past their expiration
			expect(savedData.find((r: { recipe: { id: number } }) => r.recipe.id === 997)).toBeUndefined();
			expect(savedData.find((r: { recipe: { id: number } }) => r.recipe.id === 996)).toBeUndefined();
			// Should only contain the new recipe
			expect(savedData).toHaveLength(1);
			expect(savedData[0].recipe.id).toBe(123);
		});
	});
});
