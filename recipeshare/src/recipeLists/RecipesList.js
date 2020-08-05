import React from 'react'
import { FlatList, TouchableOpacity, AsyncStorage } from 'react-native'
import RecipeCard from './RecipeCard'
import { connect } from 'react-redux'
import { getRecipeList } from '../fetches/getRecipeList'
import { postRecipeLike } from '../fetches/postRecipeLike'
import { postReShare } from '../fetches/postReShare'
import { postRecipeMake } from '../fetches/postRecipeMake'
import { destroyRecipeLike } from '../fetches/destroyRecipeLike'
import { destroyReShare } from '../fetches/destroyReShare'
import { styles } from './recipeListStyleSheet'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars //eslint-disable-line no-unused-vars
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import FilterMenu from '../functionalComponents/filterMenu'
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import { getRecipeDetails } from '../fetches/getRecipeDetails'
import saveRecipeDetailsLocally from '../functionalComponents/saveRecipeDetailsLocally'
import saveChefDetailsLocally from '../functionalComponents/saveChefDetailsLocally'
import { getChefDetails } from '../fetches/getChefDetails'
import OfflineMessage from '../offlineMessage/offlineMessage'
import NetInfo from '@react-native-community/netinfo'

const mapStateToProps = (state) => ({
	all_Recipes: state.recipes.all,
	chef_Recipes: state.recipes.chef,
	chef_feed_Recipes: state.recipes.chef_feed,
	chef_liked_Recipes: state.recipes.chef_liked,
	chef_made_Recipes: state.recipes.chef_made,
	global_ranks_Recipes: state.recipes.global_ranks,
	most_liked_Recipes: state.recipes.most_liked,
	most_made_Recipes: state.recipes.most_made,
	recipes_details: state.recipes_details,
	loggedInChef: state.loggedInChef,
	global_ranking: state.global_ranking,
	filter_settings: state.filter_settings,
	cuisine: state.cuisine,
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
	// clearListedRecipes: (listChoice) => {
	//   return dispatch => {
	//     dispatch({ type: 'CLEAR_LISTED_RECIPES', recipeType: listChoice})
	//   }
	// },
}

export default connect(mapStateToProps, mapDispatchToProps)(
	class RecipesList extends React.Component {

		state = {
			limit: 20,
			offset: 0,
			isDisplayed: true,
			filterDisplayed: false,
			awaitingServer: false,
			dataICantGet: [],
			renderOfflineMessage: false
		}

		componentDidMount = async () => {
			await this.setState({ awaitingServer: true })
			await this.fetchRecipeList()
			this._unsubscribeFocus = this.props.navigation.addListener('focus', () => {
				this.respondToFocus()
			})
			this._unsubscribeBlur = this.props.navigation.addListener('blur', () => {
				this.respondToBlur()
			})
			await this.setState({ awaitingServer: false })
		}

		componentWillUnmount = () => {
			this._unsubscribeFocus()
			this._unsubscribeBlur()
		}

		shouldComponentUpdate = () => {
			return (
				this.state.isDisplayed
			)
		}

		respondToBlur = () => {
			this.setState({ isDisplayed: false })
		}

		respondToFocus = async () => {
			await this.setState({
				offset: 0,
				isDisplayed: true,
				awaitingServer: true
			})
			this.fetchRecipeList()
			await this.setState({ awaitingServer: false })
		}

		fetchRecipeList = async () => {
			try {
				const queryChefID = this.props.queryChefID ? this.props.queryChefID : this.props.loggedInChef.id
				let recipes = await getRecipeList(this.props["listChoice"], queryChefID, this.state.limit, this.state.offset, this.props.global_ranking, this.props.loggedInChef.auth_token, this.props.filter_settings, this.props.cuisine, this.props.serves)
				this.props.storeRecipeList(this.props["listChoice"], recipes)
			}
			catch (e) {
				if (this.props[this.props["listChoice"] + `_Recipes`]?.length == 0) {
					console.log('failed to get recipes. Loading from async storage.')
					AsyncStorage.getItem('locallySavedListData', (err, res) => {
						if (res != null) {
							const locallySavedListData = JSON.parse(res)
							this.props.storeRecipeList(this.props["listChoice"], locallySavedListData[this.props["listChoice"] + `_Recipes`])
						} else {
							this.setState({ renderOfflineMessage: true })
						}
					})
				}
			}
		}

		fetchAdditionalRecipesForList = async () => {
			await this.setState({ awaitingServer: true })
			try {
				const queryChefID = this.props.queryChefID ? this.props.queryChefID : this.props.loggedInChef.id
				const new_recipes = await getRecipeList(this.props["listChoice"], queryChefID, this.state.limit, this.state.offset, this.props.global_ranking, this.props.loggedInChef.auth_token, this.props.filter_settings, this.props.cuisine, this.props.serves)
				this.props.appendToRecipeList(this.props["listChoice"], new_recipes)
			}
			catch (e) {
				console.log('failed to get ADDITIONAL recipes')
			}
			await this.setState({ awaitingServer: false })
		}

		navigateToRecipeDetails = async (recipeID, commenting = false) => {
			await this.setState({ awaitingServer: true, })
			try {
				const recipeDetails = await getRecipeDetails(recipeID, this.props.loggedInChef.auth_token)
				if (recipeDetails) {
					// console.log(recipeDetails)
					saveRecipeDetailsLocally(recipeDetails, this.props.loggedInChef.id)
					await this.props.storeRecipeDetails(recipeDetails)
					await this.setState({
						awaitingServer: false,
						filterDisplayed: false
					})
					this.props.navigation.navigate('RecipeDetails', { recipeID: recipeID, commenting: commenting })
				}
			} catch (e) {
				// console.log('looking for local recipes')
				AsyncStorage.getItem('localRecipeDetails', (err, res) => {
					if (res != null) {
						let localRecipeDetails = JSON.parse(res)
						let thisRecipeDetails = localRecipeDetails.find(recipeDetails => recipeDetails.recipe.id === recipeID)
						if (thisRecipeDetails) {
							this.props.storeRecipeDetails(thisRecipeDetails)
							this.setState({ awaitingServer: false })
							this.props.navigation.navigate('RecipeDetails', { recipeID: recipeID, commenting: commenting })
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
			await this.setState({ awaitingServer: false })
		}

		navigateToChefDetails = async (chefID, recipeID) => {
			await this.setState({ awaitingServer: true })
			try {
				const chefDetails = await getChefDetails(chefID, this.props.loggedInChef.auth_token)
				if (chefDetails) {
					this.props.storeChefDetails(chefDetails)
					saveChefDetailsLocally(chefDetails, this.props.loggedInChef.id)
					await this.setState({ awaitingServer: false })
					this.props.navigation.navigate('ChefDetails', { chefID: chefID })
				}
			} catch (e) {
				// console.log('looking for local chefs')
				AsyncStorage.getItem('localChefDetails', (err, res) => {
					if (res != null) {
						// console.log('found some local chefs')
						let localChefDetails = JSON.parse(res)
						let thisChefDetails = localChefDetails.find(chefDetails => chefDetails.chef.id === chefID)
						if (thisChefDetails) {
							this.props.storeChefDetails(thisChefDetails)
							this.setState({ awaitingServer: false })
							this.props.navigation.navigate('ChefDetails', { chefID: chefID })
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
			await this.setState({ awaitingServer: false })
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
			await this.setState({ limit: 20, offset: 0 })
			this.fetchRecipeList()
		}

		onEndReached = async () => {
			await this.setState({ offset: this.state.offset + 20 })
			this.fetchAdditionalRecipesForList()
		}

		// onScroll = (e) => {
		//   e.persist()
		//   this.props.respondToListScroll(e)
		// }

		likeRecipe = async (recipeID) => {
			// console.log
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
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
						this.props.storeRecipeList(this.props["listChoice"], recipes)
						this.props.fetchChefDetails && this.props.fetchChefDetails()
					}
				} catch {
					await this.setState(state => {
						return ({
							dataICantGet: [...state.dataICantGet, recipeID],
							awaitingServer: false
						})
					})
				}
				await this.setState({ awaitingServer: false })
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		unlikeRecipe = async (recipeID) => {
			// console.log
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
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
				} catch {
					await this.setState(state => {
						return ({
							dataICantGet: [...state.dataICantGet, recipeID],
							awaitingServer: false
						})
					})
				}
				await this.setState({ awaitingServer: false })
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		makeRecipe = async (recipeID) => {
			// console.log
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
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
				} catch {
					await this.setState(state => {
						return ({
							dataICantGet: [...state.dataICantGet, recipeID],
							awaitingServer: false
						})
					})
				}
				await this.setState({ awaitingServer: false })
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		reShareRecipe = async (recipeID) => {
			// console.log
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
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
				} catch {
					await this.setState(state => {
						return ({
							dataICantGet: [...state.dataICantGet, recipeID],
							awaitingServer: false
						})
					})
				}
				await this.setState({ awaitingServer: false })
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		unReShareRecipe = async (recipeID) => {
			// console.log
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
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
				} catch {
					await this.setState(state => {
						return ({
							dataICantGet: [...state.dataICantGet, recipeID],
							awaitingServer: false
						})
					})
				}
				await this.setState({ awaitingServer: false })
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		handleFilterButton = () => {
			this.setState({ filterDisplayed: true })
		}

		closeFilterAndRefresh = () => {
			this.setState({ filterDisplayed: false })
			this.refresh()
		}

		render() {
			return (
				<SpinachAppContainer awaitingServer={this.state.awaitingServer}>
					{this.state.renderOfflineMessage && (
						<OfflineMessage
							message={`Sorry, can't do that right now.${"\n"}You appear to be offline.`}
							topOffset={'10%'}
							clearOfflineMessage={() => this.setState({ renderOfflineMessage: false })}
						/>)
					}
					<TouchableOpacity style={styles.filterButton} activeOpacity={0.7} onPress={this.handleFilterButton} testID={"filterButton"}>
						<Icon name='filter' size={responsiveHeight(3.5)} style={styles.filterIcon} />
					</TouchableOpacity>
					<FlatList
						data={this.props[this.props["listChoice"] + `_Recipes`]}
						extraData={this.props.recipes_details}
						renderItem={this.renderRecipeListItem}
						keyExtractor={(item) => item.id.toString()}
						onRefresh={this.refresh}
						refreshing={false}
						onEndReached={this.onEndReached}
						onEndReachedThreshold={1}
						// initialNumToRender={200}
						// onScroll={e => this.onScroll(e)}
						// scrollEventThrottle={16}
						nestedScrollEnabled={true}
						listKey={this.props[this.props["listChoice"] + `_Recipes`]}
					/>
					{this.state.filterDisplayed ? <FilterMenu handleFilterButton={this.handleFilterButton} refresh={this.refresh} closeFilterAndRefresh={this.closeFilterAndRefresh} confirmButtonText={`Apply \n& Close`} title={"Apply filters to recipes list"} /> : null}
				</SpinachAppContainer>
			)
		}
	}
)
