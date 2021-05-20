import React from 'react'
import { FlatList, TouchableOpacity, AsyncStorage, Animated, Keyboard, Platform } from 'react-native'
import RecipeCard from './RecipeCard'
import { connect } from 'react-redux'
import { getRecipeList } from '../fetches/getRecipeList'
import { getAvailableFilters } from '../fetches/getAvailableFilters'
import { postRecipeLike } from '../fetches/postRecipeLike'
import { postReShare } from '../fetches/postReShare'
import { postRecipeMake } from '../fetches/postRecipeMake'
import { destroyRecipeLike } from '../fetches/destroyRecipeLike'
import { destroyReShare } from '../fetches/destroyReShare'
import { styles } from './recipeListStyleSheet'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import FilterMenu from '../filterMenu/filterMenu'
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import { getRecipeDetails } from '../fetches/getRecipeDetails'
import saveRecipeDetailsLocally from '../auxFunctions/saveRecipeDetailsLocally'
import saveChefDetailsLocally from '../auxFunctions/saveChefDetailsLocally'
import { getChefDetails } from '../fetches/getChefDetails'
import OfflineMessage from '../offlineMessage/offlineMessage'
import NetInfo from '@react-native-community/netinfo'
import SearchBar from '../searchBar/SearchBar.js'
// import { apiCall } from '../auxFunctions/apiCall'

// import Constants from 'expo-constants';

const startingLimit = 5
const startingOffset = 0
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

const mapStateToProps = (state) => ({
	all_Recipes: state.recipes.all,
	chef_Recipes: state.recipes.chef,
	chef_feed_Recipes: state.recipes.chef_feed,
	chef_liked_Recipes: state.recipes.chef_liked,
	chef_made_Recipes: state.recipes.chef_made,
	global_ranks_Recipes: state.recipes.global_ranks,
	most_liked_Recipes: state.recipes.most_liked,
	most_made_Recipes: state.recipes.most_made,
	search_Recipes: state.recipes.search,
	recipes_details: state.recipes_details,
	loggedInChef: state.loggedInChef,
	global_ranking: state.global_ranking,
	filter_settings: state.filter_settings,
	filterCuisines: state.filterCuisines,
	serves: state.serves,
})

const mapDispatchToProps = {
	// changeRanking: () => {
	//   return dispatch => {
	//     dispatch({ type: 'CHANGE_GLOBAL_RANKING'})
	//   }
	// },
	storeRecipeList: (listChoice, recipes) => {
		return dispatch => {
			dispatch({ type: 'STORE_RECIPE_LISTS', recipeType: listChoice, recipeList: recipes })
		}
	},
	appendToRecipeList: (listChoice, new_recipes) => {
		return dispatch => {
			dispatch({ type: 'APPEND_TO_RECIPE_LISTS', recipeType: listChoice, recipeList: new_recipes })
		}
	},
	storeRecipeDetails: (recipe_details) => {
		return dispatch => {
			dispatch({ type: 'STORE_RECIPE_DETAILS', recipe_details: recipe_details })
		}
	},
	storeChefDetails: (chef_details) => {
		return dispatch => {
			dispatch({ type: 'STORE_CHEF_DETAILS', chefID: `chef${chef_details.chef.id}`, chef_details: chef_details })
		}
	},
	storeCuisinesChoices: (listChoice, cuisines) => {
		// console.log(cuisines)
		return dispatch => {
			dispatch({ type: 'STORE_CUISINES_CHOICES', listChoice: listChoice, cuisines: cuisines })
		}
	},
	storeServesChoices: (listChoice, serves) => {
		return dispatch => {
			dispatch({ type: 'STORE_SERVES_CHOICES', listChoice: listChoice, serves: serves })
		}
	},
	storeFilterChoices: (listChoice, filters) => {
		return dispatch => {
			dispatch({ type: 'STORE_FILTER_CHOICES', listChoice: listChoice, filters: filters })
		}
	}
	// clearListedRecipes: (listChoice) => {
	//   return dispatch => {
	//     dispatch({ type: 'CLEAR_LISTED_RECIPES', recipeType: listChoice})
	//   }
	// },
}

//variable to synchronously record FlatList y offset on ios since velocity is not available
let previousScrollViewOffset = 0;

export class RecipesList extends React.Component {

	constructor(props) {
		super(props)
		this.searchBar = React.createRef()
		this.recipeFlatList = React.createRef()
		this.abortController = new AbortController()
		this.state = {
			limit: startingLimit,
			offset: startingOffset,
			isDisplayed: true,
			filterDisplayed: false,
			awaitingServer: false,
			dataICantGet: [],
			renderOfflineMessage: false,
			renderNoRecipesMessage: false,
			searchTerm: "",
			yOffset: new Animated.Value(0),
			currentYTop: 0,
			searchBarZIndex: 0,
		}
	}

	componentDidMount = async () => {
		await this.fetchRecipeList()
		this.props.navigation.addListener('focus', this.respondToFocus)
		this.props.navigation.addListener('blur', this.respondToBlur)
		// if (Platform.OS === 'ios'){
		// 	this.state.yOffset.addListener(({value}) => this.setState({previousScrollViewOffset: value}))
		// }
	}

	componentWillUnmount = () => {
		// console.log(this.abortController)
		this.abortController.abort('aborted')
		this.props.navigation.removeListener('focus', this.respondToFocus)
		this.props.navigation.removeListener('blur', this.respondToBlur)
	}

	// componentDidUpdate = () => {
	// 	// console.log(this.props.route)
	// 	if (this.props.route.params?.name != "home"){
	// 	this.props.navigation.setParams({
	// 		name: 'home',
	// 	})
	// 	}
	// }

	shouldComponentUpdate = () => { return this.state.isDisplayed }

	respondToBlur = () => {
		this.setState({
			isDisplayed: false,
			filterDisplayed: false
		})
	}

	respondToFocus = async () => {
		this.setState({
			offset: startingOffset,
			isDisplayed: true,
			awaitingServer: true
		}, async () => {
			await this.fetchRecipeList()
			this.setState({ awaitingServer: false })
		})
	}

	fetchRecipeList = async () => {
		// console.log('refrshing')
		// console.log(this.state.awaitingServer)
		this.setState({ awaitingServer: true }, async () => {
			try {
				const queryChefID = this.props.queryChefID ? this.props.queryChefID : this.props.loggedInChef.id
				let result = await getRecipeList(this.props["listChoice"], queryChefID, this.state.limit, this.state.offset, this.props.global_ranking, this.props.loggedInChef.auth_token, this.props.filter_settings, this.props.filterCuisines[this.props.listChoice], this.props.serves, this.state.searchTerm, this.abortController)
				if (result.recipes.length == 0) {
					this.setState({ renderNoRecipesMessage: true })
				}
				this.props.storeRecipeList(this.props["listChoice"], result.recipes)
				this.props.storeCuisinesChoices(this.props["listChoice"], result.cuisines)
				this.props.storeServesChoices(this.props["listChoice"], result.serves)
				this.props.storeFilterChoices(this.props["listChoice"], result.filters)
				// console.log('here')
				this.setState({ awaitingServer: false })
			}
			catch (e) {
				switch (e.name) {
					case 'Logout': { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) } break
					case 'AbortError': break
					case 'Timeout':
						if (this.props[this.props["listChoice"] + `_Recipes`]?.length == 0) {
							// console.log('failed to get recipes. Loading from async storage.')
							AsyncStorage.getItem('locallySavedListData', async (err, res) => {
								if (res != null) {
									const locallySavedListData = JSON.parse(res)
									if (locallySavedListData[this.props["listChoice"] + `_Recipes`].length > 0) {
										this.props.storeRecipeList(this.props["listChoice"], locallySavedListData[this.props["listChoice"] + `_Recipes`])
									}
									else {
										this.setState({ renderOfflineMessage: true })
									}
								} else {
									this.setState({ renderOfflineMessage: true })
								}
							})
						}
						this.setState({ awaitingServer: false })
						break
					default: break
				}
			}
		})
	}

	fetchFilterChoices = async () => {
		try {
			const queryChefID = this.props.queryChefID ? this.props.queryChefID : this.props.loggedInChef.id
			let result = await getAvailableFilters(this.props["listChoice"], queryChefID, this.state.limit, this.state.offset, this.props.global_ranking, this.props.loggedInChef.auth_token, this.props.filter_settings, this.props.filterCuisines[this.props.listChoice], this.props.serves, this.state.searchTerm, this.abortController)
			this.props.storeCuisinesChoices(this.props["listChoice"], result.cuisines)
			this.props.storeServesChoices(this.props["listChoice"], result.serves)
			this.props.storeFilterChoices(this.props["listChoice"], result.filters)
		}
		catch (e) {
			switch (e.name) {
				case 'Logout': { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) } break
				default: break
			}
		}
	}

	fetchAdditionalRecipesForList = async () => {
		// this.setState({ awaitingServer: true }, async() => {
			try {
				const queryChefID = this.props.queryChefID ? this.props.queryChefID : this.props.loggedInChef.id
				const result = await getRecipeList(this.props["listChoice"], queryChefID, this.state.limit, this.state.offset, this.props.global_ranking, this.props.loggedInChef.auth_token, this.props.filter_settings, this.props.filterCuisines[this.props.listChoice], this.props.serves, this.state.searchTerm, this.abortController)
				this.props.appendToRecipeList(this.props["listChoice"], result.recipes)
				this.props.storeCuisinesChoices(this.props["listChoice"], result.cuisines)
				// this.setState({ awaitingServer: false })
			}
			catch (e) {
				if (e.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
				// console.log('failed to get ADDITIONAL recipes')
				// console.log(e)
				// this.setState({ awaitingServer: false })
			}
		// })
	}

	navigateToRecipeDetails = async (recipeID, commenting = false) => {
		this.setState({ awaitingServer: true }, async () => {
			try {
				const recipeDetails = await getRecipeDetails(recipeID, this.props.loggedInChef.auth_token)
				if (recipeDetails) {
					// console.log(recipeDetails.recipe)
					saveRecipeDetailsLocally(recipeDetails, this.props.loggedInChef.id)
					await this.props.storeRecipeDetails(recipeDetails)
					this.setState({
						awaitingServer: false,
						filterDisplayed: false
					}, () => {
						this.props.navigation.navigate('RecipeDetails', { recipeID: recipeID, commenting: commenting })
					})
				}
			} catch (e) {
				if (e.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
				// console.log('looking for local recipes')
				AsyncStorage.getItem('localRecipeDetails', (err, res) => {
					if (res != null) {
						let localRecipeDetails = JSON.parse(res)
						let thisRecipeDetails = localRecipeDetails.find(recipeDetails => recipeDetails.recipe.id === recipeID)
						if (thisRecipeDetails) {
							this.props.storeRecipeDetails(thisRecipeDetails)
							this.setState({ awaitingServer: false }, () => {
								this.props.navigation.navigate('RecipeDetails', { recipeID: recipeID, commenting: commenting })
							})
						} else {
							// console.log('recipe not present in saved list')
							this.setState(state => {
								return ({
									dataICantGet: [...state.dataICantGet, recipeID],
									awaitingServer: false
								})
							})
						}
					} else {
						// console.log('no recipes saved')
						this.setState(state => {
							return ({
								dataICantGet: [...state.dataICantGet, recipeID],
								awaitingServer: false
							})
						})
					}
				})
			}
			this.setState({ awaitingServer: false })
		})
	}

	navigateToChefDetails = async (chefID, recipeID) => {
		this.setState({ awaitingServer: true }, async () => {
			try {
				const chefDetails = await getChefDetails(chefID, this.props.loggedInChef.auth_token)
				if (chefDetails) {
					this.props.storeChefDetails(chefDetails)
					saveChefDetailsLocally(chefDetails, this.props.loggedInChef.id)
					this.setState({ awaitingServer: false }, () => {
						this.props.navigation.navigate('ChefDetails', { chefID: chefID })
					})
				}
			} catch (e) {
				if (e.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
				// console.log('looking for local chefs')
				AsyncStorage.getItem('localChefDetails', (err, res) => {
					if (res != null) {
						// console.log('found some local chefs')
						let localChefDetails = JSON.parse(res)
						let thisChefDetails = localChefDetails.find(chefDetails => chefDetails.chef.id === chefID)
						if (thisChefDetails) {
							this.props.storeChefDetails(thisChefDetails)
							this.setState({ awaitingServer: false }, () => {
								this.props.navigation.navigate('ChefDetails', { chefID: chefID })
							})
						} else {
							// console.log('recipe not present in saved list')
							this.setState(state => {
								return ({
									dataICantGet: [...state.dataICantGet, recipeID],
									awaitingServer: false
								})
							})
						}
					} else {
						// console.log('no recipes saved')
						this.setState(state => {
							return ({
								dataICantGet: [...state.dataICantGet, recipeID],
								awaitingServer: false
							})
						})
					}
				})
			}
			this.setState(() => ({ awaitingServer: false }))
		})
	}

	removeDataFromCantGetList = (recipeID) => {
		this.setState(state => {
			let newDataICantGet = state.dataICantGet.filter(data => data != recipeID)
			return ({
				dataICantGet: newDataICantGet,
			})
		})
	}

	renderRecipeListItem = (item) => {
		return (
			<RecipeCard listChoice={this.props["listChoice"]}
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
		)
	}

	refresh = async () => {
		this.setState({ limit: startingLimit, offset: startingOffset, awaitingServer: true },
			async () => {
				await this.fetchRecipeList()
				this.setState({ awaitingServer: false })
			}
		)
	}

	onEndReached = () => {
		if (this.props[this.props["listChoice"] + `_Recipes`].length % startingLimit == 0) {
			this.setState((state) => ({ offset: state.offset + startingLimit }),
				this.fetchAdditionalRecipesForList
			)
		}
	}

	// onScroll = (e) => {
	//   e.persist()
	//   this.props.respondToListScroll(e)
	// }

	// likeRecipe2 = async () => {
	// 	this.setState(() => ({ awaitingServer: true }))
	// 	let response = await apiCall(postRecipeLike, recipeID, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
	// 	if (response.fail) { //internet connection or timeout
	// 		this.setState({
	// 			renderOfflineMessage: true,
	// 			awaitingServer: false
	// 		})
	// 	} else if (response.error) { //error from api
	// 		if (response.error.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
	// 		await this.setState(state => {
	// 			return ({
	// 				dataICantGet: [...state.dataICantGet, recipeID],
	// 				awaitingServer: false
	// 			})
	// 		})
	// 	} else { //success
	// 		const recipes = this.props[this.props["listChoice"] + `_Recipes`].map((recipe) => {
	// 			if (recipe['id'] === recipeID) {
	// 				recipe['likes_count'] = parseInt(recipe['likes_count']) + 1
	// 				recipe['chef_liked'] = 1
	// 				return recipe
	// 			} else {
	// 				return recipe
	// 			}
	// 		})
	// 		this.props.storeRecipeList(this.props["listChoice"], recipes)
	// 		this.props.fetchChefDetails && this.props.fetchChefDetails()
	// 	}
	// }

	likeRecipe = async (recipeID) => {
		let netInfoState = await NetInfo.fetch()
		if (netInfoState.isConnected) {
			this.setState({ awaitingServer: true }, async () => {
				try {
					const likePosted = await postRecipeLike(recipeID, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
					if (likePosted) {
						const recipes = this.props[this.props["listChoice"] + `_Recipes`].map((recipe) => {
							if (recipe['id'] === recipeID) {
								recipe['likes_count'] = parseInt(recipe['likes_count']) + 1
								recipe['chef_liked'] = 1
								return recipe
							} else {
								return recipe
							}
						})
						await this.props.storeRecipeList(this.props["listChoice"], recipes)
						this.props.fetchChefDetails && await this.props.fetchChefDetails()
					}
				} catch (e) {
					if (e.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
					this.setState(state => ({ dataICantGet: [...state.dataICantGet, recipeID] }))
				}
				this.setState({ awaitingServer: false })
			})
		} else {
			this.setState({ renderOfflineMessage: true })
		}
	}

	// updateRecipePropCounts = (currentRecipes, property, add) => {

	// }

	unlikeRecipe = async (recipeID) => {
		// console.log
		let netInfoState = await NetInfo.fetch()
		if (netInfoState.isConnected) {
			this.setState({ awaitingServer: true }, async () => {
				try {
					const unlikePosted = await destroyRecipeLike(recipeID, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
					if (unlikePosted) {
						const recipes = this.props[this.props["listChoice"] + `_Recipes`].map((recipe) => {
							if (recipe['id'] === recipeID) {
								recipe['likes_count'] = parseInt(recipe['likes_count']) - 1
								recipe['chef_liked'] = 0
								return recipe
							} else {
								return recipe
							}
						})
						this.props.storeRecipeList(this.props["listChoice"], recipes)
						this.props.fetchChefDetails && this.props.fetchChefDetails()
					}
				} catch (e) {
					if (e.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
					await this.setState(state => ({ dataICantGet: [...state.dataICantGet, recipeID] }))
				}
				this.setState({ awaitingServer: false })
			})
		} else {
			this.setState({ renderOfflineMessage: true })
		}
	}

	makeRecipe = async (recipeID) => {
		// console.log
		let netInfoState = await NetInfo.fetch()
		if (netInfoState.isConnected) {
			this.setState({ awaitingServer: true }, async () => {
				try {
					const makePosted = await postRecipeMake(recipeID, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
					if (makePosted) {
						const recipes = this.props[this.props["listChoice"] + `_Recipes`].map((recipe) => {
							if (recipe['id'] === recipeID) {
								recipe['makes_count'] = parseInt(recipe['makes_count']) + 1
								recipe['chef_made'] = 1
								return recipe
							} else {
								return recipe
							}
						})
						this.props.storeRecipeList(this.props["listChoice"], recipes)
					}
				} catch (e) {
					if (e.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
					await this.setState(state => ({ dataICantGet: [...state.dataICantGet, recipeID] }))
				}
				this.setState({ awaitingServer: false })
			})
		} else {
			this.setState({ renderOfflineMessage: true })
		}
	}

	reShareRecipe = async (recipeID) => {
		// console.log
		let netInfoState = await NetInfo.fetch()
		if (netInfoState.isConnected) {
			this.setState({ awaitingServer: true }, async () => {
				try {
					const reSharePosted = await postReShare(recipeID, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
					if (reSharePosted) {
						const recipes = this.props[this.props["listChoice"] + `_Recipes`].map((recipe) => {
							if (recipe['id'] === recipeID) {
								recipe['shares_count'] = parseInt(recipe['shares_count']) + 1
								recipe['chef_shared'] = 1
								return recipe
							} else {
								return recipe
							}
						})
						this.props.storeRecipeList(this.props["listChoice"], recipes)
						this.props.fetchChefDetails && this.props.fetchChefDetails()
					}
				} catch (e) {
					if (e.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
					await this.setState(state => ({ dataICantGet: [...state.dataICantGet, recipeID] }))
				}
				this.setState({ awaitingServer: false })
			})
		} else {
			this.setState({ renderOfflineMessage: true })
		}
	}

	unReShareRecipe = async (recipeID) => {
		let netInfoState = await NetInfo.fetch()
		if (netInfoState.isConnected) {
			this.setState({ awaitingServer: true }, async () => {
				try {
					const unReShared = await destroyReShare(recipeID, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
					if (unReShared) {
						const recipes = this.props[this.props["listChoice"] + `_Recipes`].map((recipe) => {
							if (recipe['id'] === recipeID) {
								recipe['shares_count'] = parseInt(recipe['shares_count']) - 1
								recipe['chef_shared'] = 0
								return recipe
							} else {
								return recipe
							}
						})
						this.props.storeRecipeList(this.props["listChoice"], recipes)
						this.props.fetchChefDetails && this.props.fetchChefDetails()
					}
				} catch (e) {
					if (e.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
					await this.setState(state => ({ dataICantGet: [...state.dataICantGet, recipeID] }))
				}
				this.setState({ awaitingServer: false })
			})
		} else {
			this.setState({ renderOfflineMessage: true })
		}
	}

	handleFilterButton = () => {
		this.setState({ filterDisplayed: true })
	}

	closeFilterAndRefresh = () => {
		this.setState({ filterDisplayed: false }, this.refresh)
	}

	setSearchTerm = (searchTerm) => {
		this.setState({
			searchTerm: searchTerm,
			limit: startingLimit,
			offset: startingOffset
		}, () => {
			this.recipeFlatList.scrollToOffset({ animated: true, offset: 0 })
			this.fetchRecipeList()
		})
	}

	handleSearchBarFocus = () => {
		this.setState({ searchBarZIndex: 1 }, () => { this.searchBar.current.focus() })
	}

	render() {
		// console.log(this.props[this.props["listChoice"] + `_Recipes`][0])
		// console.log(this.props)
		// console.log('list start')
		// console.log('rendering')
		// console.log(this.recipeFlatList.scrollToOffset({ animated: true, offset: 0 }))
		return (
			<SpinachAppContainer awaitingServer={this.state.awaitingServer}>
				<TouchableOpacity
					activeOpacity={1}
					onPress={Keyboard.dismiss}
				>
					{this.state.renderOfflineMessage && (
						<OfflineMessage
							message={`Sorry, can't do that right now.${"\n"}You appear to be offline.`}
							topOffset={'10%'}
							clearOfflineMessage={() => this.setState({ renderOfflineMessage: false })}
						/>)
					}
					{(this.props.route.name === "My Feed"
						&& this.props[this.props["listChoice"] + `_Recipes`].length === 0
						&& !this.state.renderOfflineMessage
						&& this.state.renderNoRecipesMessage
						&& this.state.searchTerm.length == 0) && (
							<OfflineMessage
								message={`There's nothing to show here at the moment.${"\n"}Touch here to go to All Recipes &${"\n"}Chefs and find some chefs to follow.${"\n"}(or clear your filters)`}
								topOffset={'10%'}
								clearOfflineMessage={() => { this.setState({ renderNoRecipesMessage: false }) }}
								delay={20000}
								action={() => this.props.navigation.navigate('BrowseRecipes')}
								testID={'myFeedMessage'}
							/>
						)}

					{(this.props[this.props["listChoice"] + `_Recipes`].length > 0 || this.state.searchTerm != '') && (
						<Animated.View
							style={{
								position: 'absolute',
								zIndex: this.state.searchBarZIndex,
								transform: [
									{
										translateY: this.state.yOffset.interpolate({
											inputRange: [this.state.currentYTop, this.state.currentYTop + responsiveHeight(7)],
											outputRange: [0, -responsiveHeight(7)],
											extrapolate: "clamp"
										})
									},
								]
							}}
						>
							<SearchBar
								text={"Search for Recipes"}
								searchTerm={this.state.searchTerm}
								setSearchTerm={this.setSearchTerm}
								searchBar={this.searchBar}
								onBlur={() => {
									if (this.state.currentYTop === 0) {
										this.setState({ searchBarZIndex: 0 })
									}
								}}
							/>
						</Animated.View>
					)}
					<AnimatedFlatList
						ListHeaderComponent={() => (
							<TouchableOpacity
								style={{
									height: responsiveHeight(7),
									// backgroundColor: 'red'
								}}
								onPress={this.handleSearchBarFocus}
							>
							</TouchableOpacity>
						)}
						data={this.props[this.props["listChoice"] + `_Recipes`]}
						ref={(list) => this.recipeFlatList = list}
						extraData={this.props.recipes_details}
						renderItem={this.renderRecipeListItem}
						keyExtractor={(item) => item.id.toString()}
						onRefresh={this.refresh}
						refreshing={false}
						onEndReached={this.onEndReached}
						onEndReachedThreshold={7}
						initialNumToRender={5}
						scrollEventThrottle={16}
						onScroll={Animated.event(
							[{ nativeEvent: { contentOffset: { y: this.state.yOffset } } }],
							{
								useNativeDriver: true,
								listener: (e) => {
									const y = e.nativeEvent.contentOffset.y
									const isIncreasing = Platform.OS === 'ios' ? y > previousScrollViewOffset : e.nativeEvent.velocity.y > 0
									if (y <= 0) {
										this.setState({
											currentYTop: 0,
											searchBarZIndex: 0,
										})
									}
									// //if bigger than max input range and getting bigger
									if (y > this.state.currentYTop + responsiveHeight(7) && isIncreasing) {
										this.setState({
											currentYTop: y - responsiveHeight(7),
											searchBarZIndex: 1,
										})
									}
									//if smaller than min input range and getting smaller
									if (y < this.state.currentYTop - responsiveHeight(7) && !isIncreasing) {
										this.setState({
											currentYTop: y,
											searchBarZIndex: 1,
										})
									}
									Platform.OS === 'ios' && (previousScrollViewOffset = y)
								}
							},
						)}
						nestedScrollEnabled={true}
						listKey={this.props[this.props["listChoice"] + `_Recipes`]}
					/>
					{this.state.filterDisplayed && (
						<FilterMenu
							handleFilterButton={this.handleFilterButton}
							refresh={this.refresh}
							closeFilterAndRefresh={this.closeFilterAndRefresh}
							confirmButtonText={`Apply \n& Close`}
							title={"Apply filters to recipes list"}
							listChoice={this.props["listChoice"]}
							fetchFilterChoices={this.fetchFilterChoices}
							clearSearchTerm={async () => this.setState({ searchTerm: "" })}
						/>
					)}
				</TouchableOpacity>
				<TouchableOpacity style={styles.filterButton} activeOpacity={0.7} onPress={this.handleFilterButton} testID={"filterButton"}>
					<Icon name='filter' size={responsiveHeight(3.5)} style={styles.filterIcon} />
				</TouchableOpacity>
			</SpinachAppContainer>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RecipesList)
