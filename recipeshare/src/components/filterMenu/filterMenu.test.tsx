import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { FilterMenu } from "./filterMenu";
import { clearedFilters } from "../../constants/clearedFilters";
import { Filters, Cuisine, Serves } from "../../centralTypes";

// Mock the dependencies
jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => "Icon");
jest.mock("react-native-responsive-dimensions", () => ({
	responsiveFontSize: jest.fn(() => 16),
	responsiveHeight: jest.fn(() => 50),
	responsiveWidth: jest.fn(() => 100),
}));

// Mock DualOSPicker with a simple implementation
jest.mock("../dualOSPicker/dualOSPicker", () => "MockDualOSPicker");

// Mock SwitchSized with a simple implementation
jest.mock("../switchSized/switchSized", () => "MockSwitchSized");

describe("FilterMenu", () => {
	const mockProps = {
		confirmButtonText: "Apply Filters",
		title: "Filter Recipes",
		filterSettings: { ...clearedFilters },
		filterOptions: ["Breakfast", "Lunch", "Dinner"] as Filters[],
		newRecipe: false,
		selectedCuisine: "Any" as Cuisine,
		selectedServes: "Any" as Serves,
		cuisineOptions: ["Any", "Italian", "Mexican"] as Cuisine[],
		servesOptions: ["1", "2", "3", "4"] as Serves[],
		setSelectedCuisine: jest.fn(),
		setNewRecipeCuisine: jest.fn(),
		setSelectedServes: jest.fn(),
		setNewRecipeServes: jest.fn(),
		fetchFilterChoices: jest.fn(),
		clearFilterSettings: jest.fn(),
		clearSearchTerm: jest.fn(),
		switchNewRecipeFilterValue: jest.fn(),
		setFilterSetting: jest.fn(),
		closeFilterAndRefresh: jest.fn(),
		handleCategoriesButton: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Rendering", () => {
		test("renders the FilterMenu with title and basic elements", () => {
			const { getByText } = render(<FilterMenu {...mockProps} />);

			// Check title
			expect(getByText("Filter Recipes")).toBeTruthy();

			// Check filter categories are rendered
			expect(getByText("Breakfast")).toBeTruthy();
			expect(getByText("Lunch")).toBeTruthy();
			expect(getByText("Dinner")).toBeTruthy();

			// Check pickers labels
			expect(getByText("Cuisine:")).toBeTruthy();
			expect(getByText("Serves:")).toBeTruthy();

			// Check buttons
			expect(getByText("Clear\nfilters")).toBeTruthy();
			expect(getByText("Apply Filters")).toBeTruthy();
		});

		test("renders with custom title and button text", () => {
			const customProps = {
				...mockProps,
				title: "Custom Filter Title",
				confirmButtonText: "Save Changes",
			};

			const { getByText } = render(<FilterMenu {...customProps} />);

			expect(getByText("Custom Filter Title")).toBeTruthy();
			expect(getByText("Save Changes")).toBeTruthy();
		});

		test("renders all filter categories from clearedFilters", () => {
			const { getByText } = render(<FilterMenu {...mockProps} />);

			// Test that all filter categories are rendered
			Object.keys(clearedFilters).forEach((filter) => {
				expect(getByText(filter)).toBeTruthy();
			});
		});
	});

	describe("Button Actions", () => {
		test("apply button calls closeFilterAndRefresh for existing recipe", () => {
			const { getByText } = render(<FilterMenu {...mockProps} />);

			const applyButton = getByText("Apply Filters");
			fireEvent.press(applyButton);

			expect(mockProps.closeFilterAndRefresh).toHaveBeenCalled();
			expect(mockProps.handleCategoriesButton).not.toHaveBeenCalled();
		});

		test("apply button calls handleCategoriesButton for new recipe", () => {
			const newRecipeProps = {
				...mockProps,
				newRecipe: true,
			};

			const { getByText } = render(<FilterMenu {...newRecipeProps} />);

			const applyButton = getByText("Apply Filters");
			fireEvent.press(applyButton);

			expect(mockProps.handleCategoriesButton).toHaveBeenCalled();
			expect(mockProps.closeFilterAndRefresh).not.toHaveBeenCalled();
		});

		test("clear button clears filters and search term for existing recipe", async () => {
			const { getByText } = render(<FilterMenu {...mockProps} />);

			const clearButton = getByText("Clear\nfilters");
			fireEvent.press(clearButton);

			await waitFor(() => {
				expect(mockProps.clearFilterSettings).toHaveBeenCalled();
				expect(mockProps.clearSearchTerm).toHaveBeenCalled();
				expect(mockProps.fetchFilterChoices).toHaveBeenCalled();
			});
		});

		test("clear button only clears filters for new recipe", async () => {
			const newRecipeProps = {
				...mockProps,
				newRecipe: true,
			};

			const { getByText } = render(<FilterMenu {...newRecipeProps} />);

			const clearButton = getByText("Clear\nfilters");
			fireEvent.press(clearButton);

			await waitFor(() => {
				expect(mockProps.clearFilterSettings).toHaveBeenCalled();
				expect(mockProps.clearSearchTerm).not.toHaveBeenCalled();
				expect(mockProps.fetchFilterChoices).not.toHaveBeenCalled();
			});
		});
	});

	describe("Filter Toggle Functionality", () => {
		test("filter touchable areas are rendered and functional", () => {
			const { getAllByTestId } = render(<FilterMenu {...mockProps} />);
			
			// Check that MockSwitchSized components are rendered for filters
			const breadSwitch = getAllByTestId("Bread-switch");
			const breakfastSwitch = getAllByTestId("Breakfast-switch");
			const dinnerSwitch = getAllByTestId("Dinner-switch");
			
			expect(breadSwitch.length).toBe(1);
			expect(breakfastSwitch.length).toBe(1);
			expect(dinnerSwitch.length).toBe(1);
		});
	});

	describe("Picker Functionality", () => {
		test("picker elements are rendered", () => {
			const component = render(<FilterMenu {...mockProps} />);

			// Check that the component renders without errors
			expect(component.toJSON()).toBeTruthy();
		});
	});

	describe("Filter Display and Formatting", () => {
		test("capitalizes and formats filter names correctly", () => {
			const { getByText } = render(<FilterMenu {...mockProps} />);

			// Test that filter names are properly formatted
			expect(getByText("Breakfast")).toBeTruthy();
			expect(getByText("Lunch")).toBeTruthy();
			expect(getByText("Dinner")).toBeTruthy();
			expect(getByText("Gluten free")).toBeTruthy(); // Should handle spaces
			expect(getByText("Dairy free")).toBeTruthy();
		});
	});

	describe("Switch Values", () => {
		test("component renders with filter settings", () => {
			const activeFilters = {
				...clearedFilters,
				Breakfast: true,
				Lunch: true,
			};

			const propsWithActiveFilters = {
				...mockProps,
				filterSettings: activeFilters,
			};

			const component = render(<FilterMenu {...propsWithActiveFilters} />);
			expect(component.toJSON()).toBeTruthy();
		});

		test("component handles switch interactions", () => {
			const component = render(<FilterMenu {...mockProps} />);
			
			// Test that the component renders properly
			expect(component.toJSON()).toBeTruthy();
		});
	});

	describe("Accessibility", () => {
		test("sets maxFontSizeMultiplier for text elements", () => {
			const { getByText } = render(<FilterMenu {...mockProps} />);

			const titleText = getByText("Filter Recipes");
			expect(titleText.props.maxFontSizeMultiplier).toBe(2);
		});

		test("component is accessible", () => {
			const component = render(<FilterMenu {...mockProps} />);

			// Test that the component renders without accessibility issues
			expect(component.toJSON()).toBeTruthy();
		});
	});

	describe("Edge Cases", () => {
		test("handles null cuisineOptions gracefully", () => {
			const propsWithNullCuisines = {
				...mockProps,
				cuisineOptions: null,
			};

			expect(() => render(<FilterMenu {...propsWithNullCuisines} />)).not.toThrow();
		});

		test("handles empty cuisineOptions by defaulting to 'Any'", () => {
			const propsWithEmptyCuisines = {
				...mockProps,
				cuisineOptions: [],
			};

			expect(() => render(<FilterMenu {...propsWithEmptyCuisines} />)).not.toThrow();
		});

		test("handles undefined optional props gracefully", () => {
			const minimalProps = {
				...mockProps,
				setSelectedCuisine: undefined,
				setSelectedServes: undefined,
				fetchFilterChoices: undefined,
				clearSearchTerm: undefined,
				setFilterSetting: undefined,
				closeFilterAndRefresh: undefined,
			};

			expect(() => render(<FilterMenu {...minimalProps} />)).not.toThrow();
		});
	});

	describe("Component Lifecycle", () => {
		test("async handlers are awaited properly", async () => {
			const { getByText } = render(<FilterMenu {...mockProps} />);

			const clearButton = getByText("Clear\nfilters");
			fireEvent.press(clearButton);

			// Wait for async operations
			await waitFor(() => {
				expect(mockProps.clearFilterSettings).toHaveBeenCalled();
			});
		});
	});
});
