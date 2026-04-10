import { Animated, FlatList, Keyboard, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { OfflineMessage, SearchBar, SearchBarClearButton, SpinachAppContainer } from "../components";
import { ChefsFollowingMeTabProps, ChefsIFollowTabProps, NewestChefsTabProps, TopChefsTabProps } from "../navigation";
import { ChefListQuery, ListChef } from "../centralTypes";
import { NetInfoState } from "@react-native-community/netinfo";
import { responsiveHeight } from "react-native-responsive-dimensions";

import ChefCard from "./ChefCard";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React, { useMemo } from "react";
import { centralStyles } from "../centralStyleSheet";
import { useChefListModel } from "./hooks/useChefListModel";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<ListChef>);

type ChefListProps = {
	navigation:
		| ChefsIFollowTabProps["navigation"]
		| ChefsFollowingMeTabProps["navigation"]
		| NewestChefsTabProps["navigation"]
		| TopChefsTabProps["navigation"];
	route:
		| ChefsIFollowTabProps["route"]
		| ChefsFollowingMeTabProps["route"]
		| NewestChefsTabProps["route"]
		| TopChefsTabProps["route"];
	listChoice: ChefListQuery;
	queryChefID?: number;
};

type SearchBarRef = {
	focus: () => void;
};

export default function ChefList({ navigation, route, listChoice, queryChefID }: ChefListProps) {
	const searchBarRef = React.useRef<SearchBarRef | null>(null);
	const chefFlatListRef = React.useRef<FlatList<ListChef> | null>(null);

	const model = useChefListModel(navigation, route, listChoice, queryChefID, searchBarRef, chefFlatListRef);
	const searchBarIsDisplayed = model.chefList.length > 0 || model.searchTerm !== "";
	const diagnostics = model.isAdmin
		? (model.offlineDiagnostics as string | Error | NetInfoState | undefined)
		: undefined;
	const scrollHandler = useMemo(
		() =>
			Animated.event([{ nativeEvent: { contentOffset: { y: model.yOffset } } }], {
				useNativeDriver: true,
			}),
		[model.yOffset]
	);

	return (
		<SpinachAppContainer awaitingServer={model.awaitingServer} scrollingEnabled={false}>
			<TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss}>
				{model.renderOfflineMessage && (
					<OfflineMessage
						message={`Sorry, can't get recipes chefs now.${"\n"}You appear to be offline.`}
						topOffset={"10%"}
						clearOfflineMessage={model.clearOfflineMessage}
						diagnostics={diagnostics}
					/>
				)}
				{model.chefList.length === 0 && (
					<View style={centralStyles.swipeDownContainer}>
						<Icon
							name="gesture-swipe-down"
							size={responsiveHeight(5)}
							style={centralStyles.swipeDownIcon}
						/>
						<Text style={centralStyles.swipeDownText}>Swipe down to refresh</Text>
					</View>
				)}
				{searchBarIsDisplayed && (
					<Animated.View
						style={{
							position: "absolute",
							zIndex: 1,
							transform: [
								{
									translateY: model.clampedScroll.interpolate({
										inputRange: [0, responsiveHeight(7)],
										outputRange: [0, -responsiveHeight(7)],
										extrapolate: "clamp",
									}),
								},
							],
						}}
					>
						<SearchBar
							text={"Search for Chefs"}
							searchTerm={model.searchTerm}
							setSearchTerm={model.setSearchTerm}
							searchBar={searchBarRef as never}
							onBlur={model.onSearchBarBlur}
						/>
					</Animated.View>
				)}
				<AnimatedFlatList
					ListHeaderComponent={() => (
						<TouchableOpacity
							style={{
								height: searchBarIsDisplayed ? responsiveHeight(7) : responsiveHeight(70),
							}}
							onPress={searchBarIsDisplayed ? model.handleSearchBarFocus : model.refresh}
						>
							{model.searchTerm.length > 0 && <SearchBarClearButton setSearchTerm={model.setSearchTerm} />}
						</TouchableOpacity>
					)}
					ref={chefFlatListRef}
					data={model.chefList}
					renderItem={({ item, index }) => (
						<ChefCard
							key={index.toString()}
							{...item}
							navigateToChefDetails={model.navigateToChefDetails}
							followChef={model.followChef}
							unFollowChef={model.unFollowChef}
							renderOfflineMessage={model.chefsICantGet}
							clearOfflineMessage={model.removeChefFromCantGetList}
						/>
					)}
					style={{ minHeight: responsiveHeight(70) }}
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
					onEndReachedThreshold={0.3}
					scrollEventThrottle={16}
					onScroll={scrollHandler}
				/>
			</TouchableOpacity>
		</SpinachAppContainer>
	);
}
