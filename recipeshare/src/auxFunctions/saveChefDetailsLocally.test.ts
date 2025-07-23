import AsyncStorage from "@react-native-async-storage/async-storage";
import saveChefDetailsLocally from "./saveChefDetailsLocally";
import { Chef } from "../centralTypes";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage");
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

type StoredChef = Chef & { dateSaved?: number };

describe("saveChefDetailsLocally", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	const mockChef: Chef = {
		chef: {
			id: 123,
			username: "testchef",
			country: "US",
			created_at: "2023-01-01",
			image_url: null,
			profile_text: "Test profile",
		},
		chef_commented: false,
		chef_followed: false,
		chef_liked: false,
		chef_made: false,
		chef_make_piced: false,
		chef_shared: false,
		comments: 0,
		comments_received: 0,
		followers: 10,
		following: 5,
		make_pics: 0,
		make_pics_received: 0,
		re_shares: 0,
		re_shares_received: 0,
		recipe_likes: 0,
		recipe_likes_received: 0,
		recipes: 3,
	};

	const mockCurrentDate = new Date("2023-01-01T00:00:00.000Z").getTime();

	describe("when no local chef details exist", () => {
		beforeEach(() => {
			mockAsyncStorage.getItem.mockImplementation((key, callback) => {
				callback?.(null, null);
				return Promise.resolve(null);
			});
		});

		it("creates new chef list with the provided chef", () => {
			jest.setSystemTime(mockCurrentDate);

			saveChefDetailsLocally(mockChef, 456);

			expect(mockAsyncStorage.getItem).toHaveBeenCalledWith("localChefDetails", expect.any(Function));
			expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
				"localChefDetails",
				JSON.stringify([mockChef]) // No dateSaved added when no existing data
			);
		});

		it("does not await the AsyncStorage operations", () => {
			const setItemSpy = jest.spyOn(mockAsyncStorage, "setItem");

			saveChefDetailsLocally(mockChef, 456);

			// Verify the function returns void immediately
			expect(setItemSpy).toHaveBeenCalled();
		});
	});

	describe("when local chef details exist", () => {
		const existingChef1 = {
			chef: { id: 111, username: "chef1" },
			dateSaved: mockCurrentDate - 1000 * 60 * 60 * 24 * 3, // 3 days ago
		};

		const existingChef2 = {
			chef: { id: 222, username: "chef2" },
			dateSaved: mockCurrentDate - 1000 * 60 * 60 * 24 * 10, // 10 days ago (expired)
		};

		beforeEach(() => {
			mockAsyncStorage.getItem.mockImplementation((key, callback) => {
				callback?.(null, JSON.stringify([existingChef1, existingChef2]));
				return Promise.resolve(JSON.stringify([existingChef1, existingChef2]));
			});
		});

		it("adds new chef to existing list", () => {
			jest.setSystemTime(mockCurrentDate);

			saveChefDetailsLocally(mockChef, 456);

			const expectedChefsList = [
				existingChef1, // kept (within one week)
				{ ...mockChef, dateSaved: mockCurrentDate }, // new chef added
			];

			expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
				"localChefDetails",
				JSON.stringify(expectedChefsList)
			);
		});

		it("removes expired chef details (older than one week)", () => {
			jest.setSystemTime(mockCurrentDate);

			saveChefDetailsLocally(mockChef, 456);

			const setItemCall = mockAsyncStorage.setItem.mock.calls[0];
			const savedChefs = JSON.parse(setItemCall[1]) as StoredChef[];

			// Should not contain chef2 (10 days old)
			expect(savedChefs.find((chef: StoredChef) => chef.chef.id === 222)).toBeUndefined();
			// Should contain chef1 (3 days old)
			expect(savedChefs.find((chef: StoredChef) => chef.chef.id === 111)).toBeDefined();
		});

		it("keeps user's own chef details regardless of age", () => {
			const userChef = {
				chef: { id: 456, username: "currentuser" },
				dateSaved: mockCurrentDate - 1000 * 60 * 60 * 24 * 30, // 30 days ago
			};

			mockAsyncStorage.getItem.mockImplementation((key, callback) => {
				callback?.(null, JSON.stringify([userChef, existingChef2]));
				return Promise.resolve(JSON.stringify([userChef, existingChef2]));
			});

			jest.setSystemTime(mockCurrentDate);

			saveChefDetailsLocally(mockChef, 456); // userId matches userChef.chef.id

			const setItemCall = mockAsyncStorage.setItem.mock.calls[0];
			const savedChefs = JSON.parse(setItemCall[1]) as StoredChef[];

			// Should keep user's own chef details even though it's 30 days old
			expect(savedChefs.find((chef: StoredChef) => chef.chef.id === 456)).toBeDefined();
		});

		it("updates existing chef details when chef already exists", () => {
			const existingMatchingChef = {
				chef: { id: 123, username: "oldusername" },
				dateSaved: mockCurrentDate - 1000 * 60 * 60 * 24 * 2,
			};

			mockAsyncStorage.getItem.mockImplementation((key, callback) => {
				callback?.(null, JSON.stringify([existingChef1, existingMatchingChef]));
				return Promise.resolve(JSON.stringify([existingChef1, existingMatchingChef]));
			});

			jest.setSystemTime(mockCurrentDate);

			saveChefDetailsLocally(mockChef, 456);

			const setItemCall = mockAsyncStorage.setItem.mock.calls[0];
			const savedChefs = JSON.parse(setItemCall[1]) as StoredChef[];

			// Should have only one chef with id 123 (the new one)
			const chefsWithId123 = savedChefs.filter((chef: StoredChef) => chef.chef.id === 123);
			expect(chefsWithId123).toHaveLength(1);
			expect(chefsWithId123[0].chef.username).toBe("testchef");
			expect(chefsWithId123[0].dateSaved).toBe(mockCurrentDate);
		});
	});

	describe("edge cases", () => {
		it("handles AsyncStorage getItem errors by treating them as no data", () => {
			mockAsyncStorage.getItem.mockImplementation((key, callback) => {
				callback?.(new Error("Storage error"), null);
				return Promise.resolve(null);
			});

			jest.setSystemTime(mockCurrentDate);

			// The function doesn't check for errors, so it treats null result as "no data"
			saveChefDetailsLocally(mockChef, 456);

			// Should create new chef list since res is null
			expect(mockAsyncStorage.setItem).toHaveBeenCalledWith("localChefDetails", JSON.stringify([mockChef]));
		});

		it("handles malformed JSON in storage", () => {
			mockAsyncStorage.getItem.mockImplementation((key, callback) => {
				callback?.(null, "invalid json {");
				return Promise.resolve("invalid json {");
			});

			// This will actually throw when trying to JSON.parse
			expect(() => {
				saveChefDetailsLocally(mockChef, 456);
			}).toThrow();
		});

		it("handles chef details with undefined dateSaved when existing data exists", () => {
			// Set up existing data so the function goes to the main branch
			mockAsyncStorage.getItem.mockImplementation((key, callback) => {
				callback?.(null, JSON.stringify([]));
				return Promise.resolve(JSON.stringify([]));
			});

			const chefWithoutDate = { ...mockChef };
			delete (chefWithoutDate as StoredChef).dateSaved;

			jest.setSystemTime(mockCurrentDate);

			saveChefDetailsLocally(chefWithoutDate, 456);

			const setItemCall = mockAsyncStorage.setItem.mock.calls[0];
			const savedChefs = JSON.parse(setItemCall[1]) as StoredChef[];

			expect(savedChefs[0].dateSaved).toBe(mockCurrentDate);
		});

		it("throws when trying to parse empty storage result", () => {
			mockAsyncStorage.getItem.mockImplementation((key, callback) => {
				callback?.(null, "");
				return Promise.resolve("");
			});

			jest.setSystemTime(mockCurrentDate);

			// Empty string is not null, so function tries to JSON.parse("") which throws
			expect(() => {
				saveChefDetailsLocally(mockChef, 456);
			}).toThrow("Unexpected end of JSON input");
		});
	});

	describe("date filtering logic", () => {
		it("correctly calculates one week threshold", () => {
			const oneWeek = 1000 * 60 * 60 * 24 * 7;
			const recentChef = {
				chef: { id: 111, username: "recent" },
				dateSaved: mockCurrentDate - oneWeek + 1000, // Just under one week
			};
			const oldChef = {
				chef: { id: 222, username: "old" },
				dateSaved: mockCurrentDate - oneWeek - 1000, // Just over one week
			};

			mockAsyncStorage.getItem.mockImplementation((key, callback) => {
				callback?.(null, JSON.stringify([recentChef, oldChef]));
				return Promise.resolve(JSON.stringify([recentChef, oldChef]));
			});

			jest.setSystemTime(mockCurrentDate);

			saveChefDetailsLocally(mockChef, 456);

			const setItemCall = mockAsyncStorage.setItem.mock.calls[0];
			const savedChefs = JSON.parse(setItemCall[1]) as StoredChef[];

			expect(savedChefs.find((chef: StoredChef) => chef.chef.id === 111)).toBeDefined();
			expect(savedChefs.find((chef: StoredChef) => chef.chef.id === 222)).toBeUndefined();
		});
	});
});
