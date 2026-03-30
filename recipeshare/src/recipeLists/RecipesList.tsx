import { Animated, FlatList, Keyboard, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { FilterMenu, OfflineMessage, SearchBar, SearchBarClearButton, SpinachAppContainer } from "../components";
import { ListRecipe, LoggedInChef } from "../centralTypes";
import { getAllRecipeLists, getLoggedInChef } from "../redux/selectors";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useAppSelector } from "../redux/hooks";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React, { useCallback } from "react";
import RecipeCard from "./RecipeCard";
import { centralStyles } from "../centralStyleSheet";
import { styles } from "./recipeListStyleSheet";
import { RecipesListNavigation, RecipesListRoute, useRecipesListModel } from "./hooks/useRecipesListModel";
import { RecipeListChoice } from "../navigation";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<ListRecipe>);

type RecipesListProps = {
	navigation: RecipesListNavigation;
	route: RecipesListRoute;
	listChoice: RecipeListChoice;
	queryChefID?: number;
	global_ranking?: string;
	fetchChefDetails?: () => Promise<void> | void;
};

const RecipesList = (props: RecipesListProps) => {
	const allRecipeLists = useAppSelector(getAllRecipeLists);
	const loggedInChef = useAppSelector(getLoggedInChef) as LoggedInChef;

	const model = useRecipesListModel({
		...props,
		allRecipeLists,
		loggedInChef,
	});

	const renderRecipeListItem = useCallback(
		({ item, index }: { item: ListRecipe; index: number }) => {
			return (
				<RecipeCard
					listChoice={props.listChoice}
					key={index.toString()}
					{...item}
					navigateToRecipeDetails={model.navigateToRecipeDetails}
					navigateToChefDetails={model.navigateToChefDetails}
					likeRecipe={model.likeRecipe}
					unlikeRecipe={model.unlikeRecipe}
					makeRecipe={model.makeRecipe}
					reShareRecipe={model.reShareRecipe}
					unReShareRecipe={model.unReShareRecipe}
					renderOfflineMessage={model.dataICantGet}
					clearOfflineMessage={model.removeDataFromCantGetList}
				/>
			);
		},
		[
			props.listChoice,
			model.navigateToRecipeDetails,
			model.navigateToChefDetails,
			model.likeRecipe,
			model.unlikeRecipe,
			model.makeRecipe,
			model.reShareRecipe,
			model.unReShareRecipe,
			model.dataICantGet,
			model.removeDataFromCantGetList,
		]
	);

	return (
		<SpinachAppContainer awaitingServer={model.awaitingServer} scrollingEnabled={false}>
			<TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss}>
				{model.renderOfflineMessage && (
					<OfflineMessage
						message={`Sorry, can't do that right now.${"\n"}You appear to be offline.`}
						topOffset={"10%"}
						clearOfflineMessage={model.hideOfflineMessage}
						diagnostics={loggedInChef.is_admin ? model.offlineDiagnostics || undefined : undefined}
					/>
				)}
				{props.route.name === "My Feed" &&
					model.recipeList.length === 0 &&
					!model.renderOfflineMessage &&
					model.renderNoRecipesMessage &&
					model.searchTerm.length === 0 && (
						<OfflineMessage
							message={`There's nothing to show here at the moment.${"\n"}Touch here to go to All Recipes &${"\n"}Chefs and find some chefs to follow.${"\n"}(or clear your filters)`}
							topOffset={"10%"}
							clearOfflineMessage={model.hideNoRecipesMessage}
							delay={20000}
							action={() => props.navigation.navigate("BrowseRecipesCover")}
						/>
					)}
				{model.recipeList.length === 0 && (
					<View style={centralStyles.swipeDownContainer}>
						<Icon
							name="gesture-swipe-down"
							size={responsiveHeight(5)}
							style={centralStyles.swipeDownIcon}
						/>
						<Text style={centralStyles.swipeDownText}>Swipe down to refresh</Text>
					</View>
				)}
				{(model.recipeList.length > 0 || model.searchTerm !== "") && (
					<Animated.View
						style={{
							position: "absolute",
							zIndex: model.searchBarZIndex,
							transform: [
								{
									translateY: model.yOffset.interpolate({
										inputRange: [model.currentYTop, model.currentYTop + responsiveHeight(7)],
										outputRange: [0, -responsiveHeight(7)],
										extrapolate: "clamp",
									}),
								},
							],
						}}
					>
						<SearchBar
							text={"Search for Recipes"}
							searchTerm={model.searchTerm}
							setSearchTerm={model.setSearchTerm}
							searchBar={model.searchBar as never}
							onBlur={model.handleSearchBarBlur}
						/>
					</Animated.View>
				)}
				<AnimatedFlatList
					testID={"recipeListFlatList"}
					listKey={props.route.key}
					ListHeaderComponent={() => {
						const searchBarIsDisplayed = model.recipeList.length > 0 || model.searchTerm !== "";
						return (
							<TouchableOpacity
								style={{
									height: searchBarIsDisplayed ? responsiveHeight(7) : responsiveHeight(70),
								}}
								onPress={searchBarIsDisplayed ? model.handleSearchBarFocus : model.refresh}
							>
								{model.searchTerm.length > 0 ? (
									<SearchBarClearButton setSearchTerm={model.setSearchTerm} />
								) : null}
							</TouchableOpacity>
						);
					}}
					data={model.recipeList}
					ref={model.recipeFlatList}
					style={{ minHeight: responsiveHeight(70) }}
					renderItem={renderRecipeListItem}
					keyExtractor={(item) => item.id.toString()}
					refreshControl={
						<RefreshControl
							refreshing={false}
							onRefresh={model.refresh}
							colors={["#104e01"]}
							progressBackgroundColor={"#fff59b"}
							tintColor={"#fff59b"}
						/>
					}
					onEndReached={model.onEndReached}
					onEndReachedThreshold={2.5}
					initialNumToRender={model.recipeList.length}
					scrollEventThrottle={16}
					onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: model.yOffset } } }], {
						useNativeDriver: true,
						listener: model.onScroll,
					})}
					nestedScrollEnabled={true}
				/>
				{model.filterDisplayed && (
					<FilterMenu
						handleCategoriesButton={model.handleFilterButton}
						closeFilterAndRefresh={model.closeFilterAndRefresh}
						confirmButtonText={"Apply \n& Close"}
						title={"Apply filters to recipes list"}
						fetchFilterChoices={model.fetchFilterChoices}
						clearSearchTerm={() => model.setSearchTerm("")}
						cuisineOptions={model.cuisineOptions}
						selectedCuisine={model.selectedCuisine}
						setSelectedCuisine={model.setSelectedCuisine}
						servesOptions={model.servesOptions}
						selectedServes={model.selectedServes}
						setSelectedServes={model.setSelectedServes}
						filterOptions={model.filterOptions as never}
						filterSettings={model.filterSettings}
						setFilterSetting={model.setFilterSetting}
						clearFilterSettings={model.clearFilterSettings}
						newRecipe={false}
						switchNewRecipeFilterValue={() => {
							// required prop on shared component; no-op in list mode
						}}
					/>
				)}
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.filterButton}
				activeOpacity={0.7}
				onPress={model.handleFilterButton}
				testID={"filterButton"}
				accessibilityLabel={"display filter options"}
			>
				{model.anyFilterActive && (
					<Icon name="checkbox-blank-circle" size={responsiveHeight(2.5)} style={styles.filterActiveIcon} />
				)}
				<Icon name="filter" size={responsiveHeight(3.5)} style={styles.filterIcon} />
			</TouchableOpacity>
		</SpinachAppContainer>
	);
};

export default RecipesList;
