import { Animated, FlatList, Keyboard, Platform, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { FilterMenu, OfflineMessage, SearchBar, SearchBarClearButton, SpinachAppContainer } from "../components";
import { loadLocalRecipeLists, saveRecipeListsLocally } from "../auxFunctions/saveRecipeListsLocally";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars
import { storeChefDetails, storeRecipeDetails, updateAllRecipeLists, updateSingleRecipeList } from "../redux";

import AppHeader from "../navigation/appHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NetInfo from "@react-native-community/netinfo";
import React from "react";
import RecipeCard from "./RecipeCard";
import { centralStyles } from "../centralStyleSheet"; //eslint-disable-line no-unused-vars
import { clearedFilters } from "../constants/clearedFilters";
import { connect } from "react-redux";
import { cuisines } from "../constants/cuisines";
import { destroyReShare } from "../fetches/destroyReShare";
import { destroyRecipeLike } from "../fetches/destroyRecipeLike";
import { getAvailableFilters } from "../fetches/getAvailableFilters";
import { getChefDetails } from "../fetches/getChefDetails";
import { getRecipeDetails } from "../fetches/getRecipeDetails";
import { getRecipeList } from "../fetches/getRecipeList";
import { postReShare } from "../fetches/postReShare";
import { postRecipeLike } from "../fetches/postRecipeLike";
import { postRecipeMake } from "../fetches/postRecipeMake";
import saveChefDetailsLocally from "../auxFunctions/saveChefDetailsLocally";
import saveRecipeDetailsLocally from "../auxFunctions/saveRecipeDetailsLocally";
import { serves } from "../constants/serves";
import { styles } from "./recipeListStyleSheet";

NetInfo.configure({ reachabilityShortTimeout: 5 }); //5ms

// import { apiCall } from '../auxFunctions/apiCall'

// import Constants from 'expo-constants';

const startingLimit = 10;
const startingOffset = 0;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const mapStateToProps = (state) => ({
	allRecipeLists: state.root.allRecipeLists,
	recipes_details: state.root.recipes_details,
	loggedInChef: state.root.loggedInChef,
});

const mapDispatchToProps = {
	updateSingleRecipeList: (listKey, recipeList) => {
		return (dispatch) => {
			// dispatch({ type: "UPDATE_SINGLE_RECIPE_LIST", listKey: listKey, recipeList: recipeList });
			dispatch(updateSingleRecipeList({ listKey: listKey, recipeList: recipeList }));
		};
	},
	updateAllRecipeLists: (allRecipeLists) => {
		return (dispatch) => {
			// dispatch({ type: "UPDATE_ALL_RECIPE_LISTS", allRecipeLists: allRecipeLists });
			dispatch(updateAllRecipeLists(allRecipeLists));
		};
	},
	storeRecipeDetails: (recipe_details) => {
		return (dispatch) => {
			// dispatch({ type: "STORE_RECIPE_DETAILS", recipe_details: recipe_details });
			dispatch(storeRecipeDetails(recipe_details));
		};
	},
	storeChefDetails: (chef_details) => {
		return (dispatch) => {
			// dispatch({ type: "STORE_CHEF_DETAILS", chefID: `chef${chef_details.chef.id}`, chef_details: chef_details });
			dispatch(storeChefDetails({ chefID: `chef${chef_details.chef.id}`, chef_details: chef_details }));
		};
	},
};

//variable to synchronously record FlatList y offset on ios since velocity is not available
let previousScrollViewOffset = 0;

export class RecipesList extends React.Component {
	constructor(props) {
		super(props);
		this.searchBar = React.createRef();
		this.recipeFlatList = React.createRef();
		this.abortController = new AbortController();
		this.state = {
			limit: startingLimit,
			offset: startingOffset,
			//isDisplayed: true,
			filterDisplayed: false,
			awaitingServer: false,
			dataICantGet: [],
			renderOfflineMessage: false,
			offlineDiagnostics: "",
			renderNoRecipesMessage: false,
			searchTerm: "",
			yOffset: new Animated.Value(0),
			currentYTop: 0,
			searchBarZIndex: 0,
			// recipeList: [],
			cuisineOptions: cuisines,
			selectedCuisine: "Any",
			servesOptions: serves,
			selectedServes: "Any",
			filterOptions: Object.keys(clearedFilters),
			filterSettings: clearedFilters,
		};
	}

	componentDidMount = async () => {
		await this.fetchRecipeList();
		this.props.navigation.addListener("focus", this.respondToFocus);
		// this.props.navigation.addListener("blur", this.respondToBlur);
		this.setupHeaderScrollToTopButton();
	};

	componentWillUnmount = () => {
		// console.log(this.abortController)
		this.abortController.abort();
		this.props.navigation.removeListener("focus", this.respondToFocus);
		// this.props.navigation.removeListener("blur", this.respondToBlur);
		this.deleteRecipeList();
	};

	// componentDidUpdate = async () => {};

	//shouldComponentUpdate = (nextProps, nextState) => { }

	// respondToBlur = () => {};

	respondToFocus = async () => {
		this.setupHeaderScrollToTopButton();
		this.setState(
			{
				awaitingServer: true,
			},
			async () => {
				if (this.props.route.params?.deleteId) {
					this.deleteRecipeFromAllLists(this.props.route.params?.deleteId);
					this.props.navigation.setParams({ deleteId: null });
					this.setState({ awaitingServer: false });
				} else if (this.props.route.params?.refresh) {
					this.props.navigation.setParams({ refresh: false });
					this.setState(
						{
							offset: startingOffset,
							limit: startingLimit,
							awaitingServer: true,
						},
						async () => {
							await this.fetchRecipeList();
							this.recipeFlatList.scrollToOffset({ x: 0, y: 0, animated: true });
							this.setState({ awaitingServer: false });
						}
					);
				} else {
					this.setState({ awaitingServer: false });
				}
			}
		);
	};

	setupHeaderScrollToTopButton = () => {
		const { routes } = this.props.navigation?.getParent()?.getState();
		if (this.props.navigation.isFocused()) {
			this.props.navigation.getParent().setOptions({
				headerTitle: (props) => (
					<AppHeader
						{...props}
						text={routes[routes.length - 1]?.params?.title}
						buttonAction={() => this.recipeFlatList.scrollToOffset({ offset: 0, animated: true })}
					/>
				),
			});
		}
	};

	getQueryChefId = () => {
		let queryChefId = this.props.queryChefID ? this.props.queryChefID : this.props.loggedInChef.id;
		return queryChefId;
	};

	getRecipeListName = () => {
		return this.props["listChoice"];
		//return this.props.allRecipeLists[this.props.route.key]
	};

	getRecipeList = () => {
		//return this.props[this.getRecipeListName() + `_Recipes`]
		// return this.state.recipeList
		// console.log(this.props.allRecipeLists)
		return this.props.allRecipeLists[this.props.route.key] || [];
	};

	fetchRecipeList = async () => {
		let netInfoState = await NetInfo.fetch();
		if (netInfoState.isConnected) {
			this.setState({ awaitingServer: true }, async () => {
				try {
					let result = await getRecipeList(
						this.getRecipeListName(),
						this.getQueryChefId(),
						this.state.limit,
						this.state.offset,
						this.props.global_ranking,
						this.props.loggedInChef.auth_token,
						this.state.filterSettings,
						this.state.selectedCuisine,
						this.state.selectedServes,
						this.state.searchTerm,
						this.abortController
					);
					if (result.recipes.length == 0) {
						this.setState({ renderNoRecipesMessage: true });
					}
					this.props.updateSingleRecipeList(this.props.route.key, result.recipes);
					this.setState({
						cuisineOptions: result.cuisines,
						servesOptions: result.serves,
						filterOptions: result.filters,
						awaitingServer: false,
					});
					saveRecipeListsLocally(
						this.getQueryChefId(),
						this.props.loggedInChef.id,
						this.getRecipeListName(),
						this.getRecipeList()
					);
				} catch (e) {
					this.setState({
						awaitingServer: false,
					});
					switch (e.name) {
						case "Logout":
							{
								this.props.navigation.navigate("ProfileCover", {
									screen: "Profile",
									params: { logout: true },
								});
							}
							break;
						case "AbortError":
							break;
						case "Timeout":
							if (this.getRecipeList().length == 0) {
								// console.log('failed to get recipes. Loading from async storage.')
								this.loadRecipesLocally();
							}
							break;
						default:
							if (this.getRecipeList().length == 0) {
								// console.log('failed to get recipes. Loading from async storage.')
								this.loadRecipesLocally();
							}
							break;
					}
				}
			});
		} else {
			this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState });
		}
	};

	fetchAdditionalRecipesForList = async () => {
		// only run if there are recipes present already, otherwise it won't be needed, and it
		// prevents running immediately on mount before initial fetch is finished
		if (this.getRecipeList().length > 0) {
			try {
				const result = await getRecipeList(
					this.getRecipeListName(),
					this.getQueryChefId(),
					this.state.limit,
					this.state.offset,
					this.props.global_ranking,
					this.props.loggedInChef.auth_token,
					this.state.filterSettings,
					this.state.selectedCuisine,
					this.state.selectedServes,
					this.state.searchTerm,
					this.abortController
				);
				this.setState({
					cuisineOptions: result.cuisines,
					servesOptions: result.serves,
					filterOptions: result.filters,
				});
				saveRecipeListsLocally(this.getQueryChefId(), this.props.loggedInChef.id, this.getRecipeListName(), [
					...this.getRecipeList(),
					...result.recipes,
				]);
				this.props.updateSingleRecipeList(this.props.route.key, [...this.getRecipeList(), ...result.recipes]);
			} catch (e) {
				if (e.name === "Logout") {
					this.props.navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
				}
				//console.log('failed to get ADDITIONAL recipes')
				//console.log(e)
			}
		}
	};

	loadRecipesLocally = async () => {
		let localRecipeList = await loadLocalRecipeLists(this.getQueryChefId(), this.getRecipeListName());
		if (localRecipeList.length > 0) {
			this.props.updateSingleRecipeList(this.props.route.key, localRecipeList);
		}
		this.setState({ awaitingServer: false });
	};

	fetchFilterChoices = async () => {
		try {
			let result = await getAvailableFilters(
				this.getRecipeListName(),
				this.getQueryChefId(),
				this.state.limit,
				this.state.offset,
				this.props.global_ranking,
				this.props.loggedInChef.auth_token,
				this.state.filterSettings,
				this.state.selectedCuisine,
				this.state.selectedServes,
				this.state.searchTerm,
				this.abortController
			);
			this.setState({
				cuisineOptions: result.cuisines,
				servesOptions: result.serves,
				filterOptions: result.filters,
			});
		} catch (e) {
			switch (e.name) {
				case "Logout":
					{
						this.props.navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
					}
					break;
				default:
					break;
			}
		}
	};

	deleteRecipeList = () => {
		let newAllRecipeLists = this.props.allRecipeLists;
		delete newAllRecipeLists[this.props.route.key];
		this.props.updateAllRecipeLists(newAllRecipeLists);
	};

	deleteRecipeFromAllLists = (recipeId) => {
		let newAllRecipeLists = {};
		Object.keys(this.props.allRecipeLists).forEach((list) => {
			newAllRecipeLists[list] = this.props.allRecipeLists[list].filter((recipe) => recipe.id != recipeId);
		});
		this.props.updateAllRecipeLists(newAllRecipeLists);
	};

	navigateToRecipeDetails = async (recipeID, commenting = false) => {
		this.setState({ awaitingServer: true }, async () => {
			try {
				const recipeDetails = await getRecipeDetails(recipeID, this.props.loggedInChef.auth_token);
				if (recipeDetails) {
					// console.log(recipeDetails.recipe)
					saveRecipeDetailsLocally(recipeDetails, this.props.loggedInChef.id);
					await this.props.storeRecipeDetails(recipeDetails);
					this.setState(
						{
							awaitingServer: false,
							filterDisplayed: false,
						},
						() => {
							this.props.navigation.navigate("RecipeDetails", {
								recipeID: recipeID,
								commenting: commenting,
							});
						}
					);
				}
			} catch (e) {
				if (e.name === "Logout") {
					this.props.navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
				}
				// console.log("looking for local recipes");
				AsyncStorage.getItem("localRecipeDetails", (err, res) => {
					if (res != null) {
						let localRecipeDetails = JSON.parse(res);
						let thisRecipeDetails = localRecipeDetails.find(
							(recipeDetails) => recipeDetails.recipe.id === recipeID
						);

						if (thisRecipeDetails) {
							this.props.storeRecipeDetails(thisRecipeDetails);
							this.setState({ awaitingServer: false }, () => {
								this.props.navigation.navigate("RecipeDetails", {
									recipeID: recipeID,
									commenting: commenting,
								});
							});
						} else {
							// console.log('recipe not present in saved list')
							this.setState((state) => {
								return {
									dataICantGet: [...state.dataICantGet, recipeID],
									awaitingServer: false,
								};
							});
						}
					} else {
						// console.log('no recipes saved')
						this.setState((state) => {
							return {
								dataICantGet: [...state.dataICantGet, recipeID],
								awaitingServer: false,
							};
						});
					}
				});
			}
			this.setState({ awaitingServer: false });
		});
	};

	navigateToChefDetails = async (chefID, recipeID) => {
		this.setState({ awaitingServer: true }, async () => {
			try {
				const chefDetails = await getChefDetails(chefID, this.props.loggedInChef.auth_token);
				if (chefDetails) {
					this.props.storeChefDetails(chefDetails);
					saveChefDetailsLocally(chefDetails, this.props.loggedInChef.id);
					this.setState({ awaitingServer: false }, () => {
						this.props.navigation.navigate("ChefDetails", { chefID: chefID });
					});
				}
			} catch (e) {
				if (e.name === "Logout") {
					this.props.navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
				}
				// console.log('looking for local chefs')
				AsyncStorage.getItem("localChefDetails", (err, res) => {
					if (res != null) {
						// console.log('found some local chefs')
						let localChefDetails = JSON.parse(res);
						let thisChefDetails = localChefDetails.find((chefDetails) => chefDetails.chef.id === chefID);
						if (thisChefDetails) {
							this.props.storeChefDetails(thisChefDetails);
							this.setState({ awaitingServer: false }, () => {
								this.props.navigation.navigate("ChefDetails", { chefID: chefID });
							});
						} else {
							// console.log('recipe not present in saved list')
							this.setState((state) => {
								return {
									dataICantGet: [...state.dataICantGet, recipeID],
									awaitingServer: false,
								};
							});
						}
					} else {
						// console.log('no recipes saved')
						this.setState((state) => {
							return {
								dataICantGet: [...state.dataICantGet, recipeID],
								awaitingServer: false,
							};
						});
					}
				});
			}
			this.setState(() => ({ awaitingServer: false }));
		});
	};

	removeDataFromCantGetList = (recipeID) => {
		this.setState((state) => {
			let newDataICantGet = state.dataICantGet.filter((data) => data != recipeID);
			return {
				dataICantGet: newDataICantGet,
			};
		});
	};

	renderRecipeListItem = (item) => {
		return (
			<RecipeCard
				listChoice={this.getRecipeListName()}
				key={item.index.toString()}
				{...item.item}
				navigateToRecipeDetails={this.navigateToRecipeDetails}
				navigateToChefDetails={this.navigateToChefDetails}
				likeRecipe={this.likeRecipe}
				unlikeRecipe={this.unlikeRecipe}
				makeRecipe={this.makeRecipe}
				reShareRecipe={this.reShareRecipe}
				unReShareRecipe={this.unReShareRecipe}
				renderOfflineMessage={this.state.dataICantGet}
				clearOfflineMessage={this.removeDataFromCantGetList}
			/>
		);
	};

	refresh = async () => {
		this.setState({ limit: startingLimit, offset: startingOffset, awaitingServer: true }, async () => {
			await this.fetchRecipeList();
			this.setState({ awaitingServer: false });
		});
	};

	onEndReached = () => {
		// console.log('end reached')
		if (this.getRecipeList().length % startingLimit == 0) {
			this.setState((state) => ({ offset: this.getRecipeList().length }), this.fetchAdditionalRecipesForList);
		}
	};

	updateAttributeCountInRecipeLists = (recipeId, attribute, toggle, diff) => {
		const newAllRecipeLists = {};
		Object.keys(this.props.allRecipeLists).forEach((list) => {
			const recipeList = this.props.allRecipeLists[list].map((recipe) => {
				if (recipe.id == recipeId) {
					const newRecipe = { ...recipe };
					newRecipe[attribute] += diff;
					newRecipe[toggle] = diff > 0 ? 1 : 0;
					return newRecipe;
				} else {
					return recipe;
				}
			});
			newAllRecipeLists[list] = recipeList;
		});
		this.props.updateAllRecipeLists(newAllRecipeLists);
	};

	likeRecipe = async (recipeID) => {
		let netInfoState = await NetInfo.fetch();
		if (netInfoState.isConnected) {
			this.setState({ awaitingServer: true }, async () => {
				try {
					const likePosted = await postRecipeLike(
						recipeID,
						this.props.loggedInChef.id,
						this.props.loggedInChef.auth_token
					);
					if (likePosted) {
						this.updateAttributeCountInRecipeLists(recipeID, "likes_count", "chef_liked", 1);
						this.props.fetchChefDetails && (await this.props.fetchChefDetails());
					}
				} catch (e) {
					if (e.name === "Logout") {
						this.props.navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
					}
					this.setState((state) => ({ dataICantGet: [...state.dataICantGet, recipeID] }));
				}
				this.setState({ awaitingServer: false });
			});
		} else {
			this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState });
		}
	};

	unlikeRecipe = async (recipeID) => {
		let netInfoState = await NetInfo.fetch();
		if (netInfoState.isConnected) {
			this.setState({ awaitingServer: true }, async () => {
				try {
					const unlikePosted = await destroyRecipeLike(
						recipeID,
						this.props.loggedInChef.id,
						this.props.loggedInChef.auth_token
					);
					if (unlikePosted) {
						this.updateAttributeCountInRecipeLists(recipeID, "likes_count", "chef_liked", -1);
						this.props.fetchChefDetails && this.props.fetchChefDetails();
					}
				} catch (e) {
					if (e.name === "Logout") {
						this.props.navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
					}
					await this.setState((state) => ({ dataICantGet: [...state.dataICantGet, recipeID] }));
				}
				this.setState({ awaitingServer: false });
			});
		} else {
			this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState });
		}
	};

	makeRecipe = async (recipeID) => {
		let netInfoState = await NetInfo.fetch();
		if (netInfoState.isConnected) {
			this.setState({ awaitingServer: true }, async () => {
				try {
					const makePosted = await postRecipeMake(
						recipeID,
						this.props.loggedInChef.id,
						this.props.loggedInChef.auth_token
					);
					if (makePosted) {
						this.updateAttributeCountInRecipeLists(recipeID, "makes_count", "chef_made", 1);
					}
				} catch (e) {
					if (e.name === "Logout") {
						this.props.navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
					}
					await this.setState((state) => ({ dataICantGet: [...state.dataICantGet, recipeID] }));
				}
				this.setState({ awaitingServer: false });
			});
		} else {
			this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState });
		}
	};

	reShareRecipe = async (recipeID) => {
		let netInfoState = await NetInfo.fetch();
		if (netInfoState.isConnected) {
			this.setState({ awaitingServer: true }, async () => {
				try {
					const reSharePosted = await postReShare(
						recipeID,
						this.props.loggedInChef.id,
						this.props.loggedInChef.auth_token
					);
					if (reSharePosted) {
						this.updateAttributeCountInRecipeLists(recipeID, "shares_count", "chef_shared", 1);
						this.props.fetchChefDetails && this.props.fetchChefDetails();
					}
				} catch (e) {
					if (e.name === "Logout") {
						this.props.navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
					}
					await this.setState((state) => ({ dataICantGet: [...state.dataICantGet, recipeID] }));
				}
				this.setState({ awaitingServer: false });
			});
		} else {
			this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState });
		}
	};

	unReShareRecipe = async (recipeID) => {
		let netInfoState = await NetInfo.fetch();
		if (netInfoState.isConnected) {
			this.setState({ awaitingServer: true }, async () => {
				try {
					const unReShared = await destroyReShare(
						recipeID,
						this.props.loggedInChef.id,
						this.props.loggedInChef.auth_token
					);
					if (unReShared) {
						this.updateAttributeCountInRecipeLists(recipeID, "shares_count", "chef_shared", -1);
						this.props.fetchChefDetails && this.props.fetchChefDetails();
					}
				} catch (e) {
					if (e.name === "Logout") {
						this.props.navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
					}
					await this.setState((state) => ({ dataICantGet: [...state.dataICantGet, recipeID] }));
				}
				this.setState({ awaitingServer: false });
			});
		} else {
			this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState });
		}
	};

	handleFilterButton = () => {
		this.setState({ filterDisplayed: true });
	};

	closeFilterAndRefresh = () => {
		this.setState({ filterDisplayed: false }, this.refresh);
	};

	setSearchTerm = (searchTerm) => {
		this.setState(
			{
				searchTerm: searchTerm,
				limit: startingLimit,
				offset: startingOffset,
			},
			async () => {
				this.abortController.abort();
				this.abortController = new AbortController();
				this.recipeFlatList.scrollToOffset({ animated: true, offset: 0 });
				await this.fetchRecipeList();
			}
		);
	};

	handleSearchBarFocus = () => {
		this.setState({ searchBarZIndex: 1 }, () => {
			this.searchBar.current.focus();
		});
	};

	setSelectedCuisine = (selectedCuisine) => this.setState({ selectedCuisine: selectedCuisine });

	setSelectedServes = (selectedServes) => this.setState({ selectedServes: selectedServes });

	setFilterSetting = (filter, value) => {
		this.setState((state) => {
			return {
				...state,
				filterSettings: {
					...state.filterSettings,
					[filter]: value,
				},
			};
		});
	};

	clearFilterSettings = () => {
		this.setState({
			filterSettings: clearedFilters,
			selectedCuisine: "Any",
			selectedServes: "Any",
		});
	};

	checkFilterSetting = (element) => this.state.filterSettings[element] == true;

	render() {
		// console.log(this.getRecipeList().length)
		// console.log(this.getRecipeList().map(r => r.id))
		//console.log(this.props.route)
		// console.log(Object.keys(this.props.allRecipeLists))
		//console.log('recipe list re-rendering')
		// console.log(this.recipeFlatList.scrollToOffset({ animated: true, offset: 0 }))
		// console.log(this.state.filterOptions)
		let anyFilterActive =
			Object.keys(this.state.filterSettings).some(this.checkFilterSetting) ||
			this.state.selectedCuisine != "Any" ||
			this.state.selectedServes != "Any";
		return (
			<SpinachAppContainer awaitingServer={this.state.awaitingServer}>
				<TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss}>
					{this.state.renderOfflineMessage && (
						<OfflineMessage
							message={`Sorry, can't do that right now.${"\n"}You appear to be offline.`}
							topOffset={"10%"}
							clearOfflineMessage={() => this.setState({ renderOfflineMessage: false })}
							diagnostics={this.props.loggedInChef.is_admin ? this.state.offlineDiagnostics : null}
						/>
					)}
					{this.props.route.name === "My Feed" &&
						this.getRecipeList().length === 0 &&
						!this.state.renderOfflineMessage &&
						this.state.renderNoRecipesMessage &&
						this.state.searchTerm.length == 0 && (
							<OfflineMessage
								message={`There's nothing to show here at the moment.${"\n"}Touch here to go to All Recipes &${"\n"}Chefs and find some chefs to follow.${"\n"}(or clear your filters)`}
								topOffset={"10%"}
								clearOfflineMessage={() => {
									this.setState({ renderNoRecipesMessage: false });
								}}
								delay={20000}
								action={() => this.props.navigation.navigate("BrowseRecipesCover")}
								testID={"myFeedMessage"}
							/>
						)}
					{this.getRecipeList().length == 0 && (
						<View style={centralStyles.swipeDownContainer}>
							<Icon
								name="gesture-swipe-down"
								size={responsiveHeight(5)}
								style={centralStyles.swipeDownIcon}
							/>
							<Text style={centralStyles.swipeDownText}>Swipe down to refresh</Text>
						</View>
					)}
					{(this.getRecipeList().length > 0 || this.state.searchTerm != "") && (
						<Animated.View
							style={{
								position: "absolute",
								zIndex: this.state.searchBarZIndex,
								transform: [
									{
										translateY: this.state.yOffset.interpolate({
											inputRange: [
												this.state.currentYTop,
												this.state.currentYTop + responsiveHeight(7),
											],
											outputRange: [0, -responsiveHeight(7)],
											extrapolate: "clamp",
										}),
									},
								],
								// backgroundColor: 'red'
							}}
						>
							<SearchBar
								text={"Search for Recipes"}
								searchTerm={this.state.searchTerm}
								setSearchTerm={this.setSearchTerm}
								searchBar={this.searchBar}
								onBlur={() => {
									if (this.state.currentYTop === 0) {
										this.setState({ searchBarZIndex: 0 });
									}
								}}
							/>
						</Animated.View>
					)}
					<AnimatedFlatList
						ListHeaderComponent={() => {
							let searchBarIsDisplayed = this.getRecipeList().length > 0 || this.state.searchTerm != "";
							return (
								<TouchableOpacity
									style={{
										height: searchBarIsDisplayed ? responsiveHeight(7) : responsiveHeight(70),
									}}
									onPress={searchBarIsDisplayed ? this.handleSearchBarFocus : this.refresh}
								>
									{this.state.searchTerm.length > 0 ? (
										<SearchBarClearButton setSearchTerm={this.setSearchTerm} />
									) : null}
								</TouchableOpacity>
							);
						}}
						//stickyHeaderIndices={[0]}
						data={this.getRecipeList()}
						ref={(list) => (this.recipeFlatList = list)}
						//extraData={this.props.recipes_details}
						style={{ minHeight: responsiveHeight(70) }}
						renderItem={this.renderRecipeListItem}
						keyExtractor={(item) => item.id.toString()}
						//onRefresh={this.refresh}
						//refreshing={false}
						refreshControl={
							<RefreshControl
								refreshing={false}
								onRefresh={this.refresh}
								colors={["#104e01"]}
								progressBackgroundColor={"#fff59b"}
								tintColor={"#fff59b"}
							/>
						}
						onEndReached={this.onEndReached}
						onEndReachedThreshold={2.5}
						initialNumToRender={this.getRecipeList().length}
						scrollEventThrottle={16}
						onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.yOffset } } }], {
							useNativeDriver: true,
							listener: (e) => {
								const y = e.nativeEvent.contentOffset.y;
								const isIncreasing =
									Platform.OS === "ios" ? y > previousScrollViewOffset : e.nativeEvent.velocity.y > 0;
								if (y <= 0) {
									this.setState({
										currentYTop: 0,
										searchBarZIndex: 0,
									});
								}
								// //if bigger than max input range and getting bigger
								if (y > 0 && y > this.state.currentYTop + responsiveHeight(7) && isIncreasing) {
									this.setState({
										currentYTop: y - responsiveHeight(7),
										searchBarZIndex: 1,
									});
								}
								//if smaller than min input range and getting smaller
								if (y > 0 && y < this.state.currentYTop - responsiveHeight(7) && !isIncreasing) {
									this.setState({
										currentYTop: y,
										searchBarZIndex: 1,
									});
								}
								Platform.OS === "ios" && (previousScrollViewOffset = y);
							},
						})}
						nestedScrollEnabled={true}
						listKey={this.getRecipeList()}
					/>
					{this.state.filterDisplayed && (
						<FilterMenu
							handleFilterButton={this.handleFilterButton}
							refresh={this.refresh}
							closeFilterAndRefresh={this.closeFilterAndRefresh}
							confirmButtonText={"Apply \n& Close"}
							title={"Apply filters to recipes list"}
							listChoice={this.getRecipeListName()}
							fetchFilterChoices={this.fetchFilterChoices}
							clearSearchTerm={() => this.setState({ searchTerm: "" })}
							cuisineOptions={this.state.cuisineOptions}
							selectedCuisine={this.state.selectedCuisine}
							setSelectedCuisine={this.setSelectedCuisine}
							servesOptions={this.state.servesOptions}
							selectedServes={this.state.selectedServes}
							setSelectedServes={this.setSelectedServes}
							filterOptions={this.state.filterOptions}
							filterSettings={this.state.filterSettings}
							setFilterSetting={this.setFilterSetting}
							clearFilterSettings={this.clearFilterSettings}
						/>
					)}
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.filterButton}
					activeOpacity={0.7}
					onPress={this.handleFilterButton}
					testID={"filterButton"}
					accessibilityLabel={"display filter options"}
				>
					{anyFilterActive && (
						<Icon
							name="checkbox-blank-circle"
							size={responsiveHeight(2.5)}
							style={styles.filterActiveIcon}
						/>
					)}
					<Icon name="filter" size={responsiveHeight(3.5)} style={styles.filterIcon} />
				</TouchableOpacity>
			</SpinachAppContainer>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RecipesList);
