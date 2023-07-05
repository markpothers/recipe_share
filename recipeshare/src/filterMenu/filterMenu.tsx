import React from "react";
import { Modal, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "./filterMenuStyleSheet";
import { centralStyles } from "../centralStyleSheet"; //eslint-disable-line no-unused-vars
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { clearedFilters } from "../dataComponents/clearedFilters";
import DualOSPicker from "../dualOSPicker/DualOSPicker";
import SwitchSized from "../customComponents/switchSized/switchSized";
import { responsiveWidth, responsiveHeight, responsiveFontSize } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars
import { FilterSettings, Filters, Cuisine, Serves } from "../centralTypes";

type OwnProps = {
	confirmButtonText: string;
	title: string;
	filterSettings: FilterSettings;
	filterOptions: Filters[];
	newRecipe: boolean;
	selectedCuisine: Cuisine;
	selectedServes: Serves;
	cuisineOptions: Cuisine[];
	servesOptions: Serves[];
	setSelectedCuisine: (cuisine: Cuisine) => void;
	setNewRecipeCuisine: (cuisine: Cuisine, field: "cuisine") => void;
	setSelectedServes: (serves: Serves) => void;
	setNewRecipeServes: (serves: Serves, field: "serves") => void;
	fetchFilterChoices: () => void;
	clearFilterSettings: () => void;
	clearSearchTerm: () => void;
	switchNewRecipeFilterValue: (filter: Filters) => void;
	setFilterSetting: (filter: Filters, value: boolean) => void;
	closeFilterAndRefresh: () => void;
	handleCategoriesButton: () => void;
};

export const FilterMenu = ({
	filterSettings,
	filterOptions,
	newRecipe,
	confirmButtonText,
	title,
	selectedCuisine,
	selectedServes,
	cuisineOptions,
	servesOptions,
	setSelectedCuisine,
	setNewRecipeCuisine,
	setSelectedServes,
	setNewRecipeServes,
	fetchFilterChoices,
	clearFilterSettings,
	clearSearchTerm,
	switchNewRecipeFilterValue,
	setFilterSetting,
	closeFilterAndRefresh,
	handleCategoriesButton,
}: OwnProps) => {
	const renderFilterItems = () => {
		const theseFilterOptions = filterOptions // the available filters to select
			.map((choice) => (choice.charAt(0).toUpperCase() + choice.slice(1)).replace("_", " ")); // modified to match to way they are displayed
		return Object.keys(clearedFilters)
			.sort()
			.map((filter) => {
				return (
					<TouchableOpacity
						style={styles.filterItemContainer}
						key={filter}
						activeOpacity={1}
						onPress={() => handleCategoryChange(filter, !filterSettings[filter])}
					>
						<View style={styles.switchContainer}>
							<SwitchSized
								value={filterSettings[filter]}
								onValueChange={(value) => handleCategoryChange(filter, value)}
								disabled={!newRecipe && !theseFilterOptions.includes(filter)}
								testID={`${filter}-switch`}
							/>
						</View>
						<View style={styles.categoryContainer}>
							<Text maxFontSizeMultiplier={2} style={styles.categoryText}>
								{filter}
							</Text>
						</View>
					</TouchableOpacity>
				);
			});
	};

	const handleApplyButton = () => {
		newRecipe ? handleCategoriesButton() : closeFilterAndRefresh();
	};

	const handleCategoryChange = async (filter, value) => {
		await (newRecipe ? switchNewRecipeFilterValue(filter) : setFilterSetting(filter, value));
		await (!newRecipe && fetchFilterChoices());
	};

	const handleCuisineChange = async (cuisine) => {
		(await newRecipe) ? setNewRecipeCuisine(cuisine, "cuisine") : setSelectedCuisine(cuisine);
		await (!newRecipe && fetchFilterChoices());
	};

	const handleServesChange = async (serves) => {
		(await newRecipe) ? setNewRecipeServes(serves, "serves") : setSelectedServes(serves);
		await (!newRecipe && fetchFilterChoices());
	};

	const handleClearButton = async () => {
		await clearFilterSettings();
		(await !newRecipe) && clearSearchTerm();
		await (!newRecipe && fetchFilterChoices());
	};

	if (!cuisineOptions || cuisineOptions.length == 0) {
		cuisineOptions = ["Any"];
	}

	return (
		<Modal animationType="fade" transparent={true} visible={true}>
			<View style={styles.modalFullScreenContainer}>
				<View style={styles.contentsContainer}>
					<View style={styles.titleContainer}>
						<Text maxFontSizeMultiplier={2} style={styles.title}>
							{title}
						</Text>
					</View>
					<ScrollView style={styles.categoriesScrollView}>
						<View style={styles.columnsContainer}>{renderFilterItems()}</View>
					</ScrollView>
					<View style={styles.bottomContainer}>
						<View style={styles.bottomTopContainer}>
							<Text maxFontSizeMultiplier={2} style={styles.title}>
								Cuisine:
							</Text>
							<View style={styles.picker}>
								<DualOSPicker
									onChoiceChange={handleCuisineChange}
									options={cuisineOptions}
									selectedChoice={selectedCuisine}
									textAlignment={"flex-start"}
									testID={"cuisines"}
									accessibilityLabel={"cuisines picker"}
								/>
							</View>
						</View>
						<View style={styles.bottomTopContainer}>
							<Text maxFontSizeMultiplier={2} style={styles.title}>
								Serves:{" "}
							</Text>
							<View style={styles.picker}>
								<DualOSPicker
									onChoiceChange={handleServesChange}
									options={["Any", ...servesOptions]}
									selectedChoice={selectedServes}
									textAlignment={"flex-start"}
									testID={"serves"}
									accessibilityLabel={"serves picker"}
								/>
							</View>
						</View>
						<View style={styles.clearFiltersButtonContainer}>
							<TouchableOpacity
								style={centralStyles.yellowRectangleButton}
								activeOpacity={0.7}
								// title="clearFilters"
								onPress={handleClearButton}
							>
								<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name="cancel" />
								<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>
									Clear{"\n"}filters
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={centralStyles.greenRectangleButton}
								activeOpacity={0.7}
								// title="applyFilters"
								onPress={handleApplyButton}
							>
								<Icon style={centralStyles.yellowButtonIcon} size={responsiveHeight(4)} name="check" />
								<Text maxFontSizeMultiplier={2} style={centralStyles.yellowButtonText}>
									{confirmButtonText}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default FilterMenu;
