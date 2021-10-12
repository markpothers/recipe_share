import React from 'react'
import { FlatList, Animated, TouchableOpacity, Keyboard, Platform, View, Text, RefreshControl } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ChefCard from './ChefCard'
import { connect } from 'react-redux'
import { getChefList } from '../fetches/getChefList'
import { postFollow } from '../fetches/postFollow'
import { destroyFollow } from '../fetches/destroyFollow'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
import { saveChefListsLocally, loadLocalChefLists } from '../auxFunctions/saveChefListsLocally'
import saveChefDetailsLocally from '../auxFunctions/saveChefDetailsLocally'
import { getChefDetails } from '../fetches/getChefDetails'
import OfflineMessage from '../offlineMessage/offlineMessage'
import NetInfo from '@react-native-community/netinfo';
NetInfo.configure({ reachabilityShortTimeout: 5 }) //5ms
import SearchBar from '../searchBar/SearchBar.js'
import SearchBarClearButton from '../searchBar/SearchBarClearButton'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import AppHeaderActionButton from '../../navigation/appHeaderActionButton'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

const mapStateToProps = (state) => ({
	allChefLists: state.allChefLists,
	// all_chefs: state.chefs.all_chefs,
	// followed_chefs: state.chefs.followed,
	loggedInChef: state.loggedInChef,
	chefs_details: state.chefs_details,
	// most_liked_chefs: state.chefs.most_liked_chefs,
	// most_made_chefs: state.chefs.most_made_chefs,
	// chef_followees: state.chefs.chef_followees,
	// chef_followers: state.chefs.chef_followers
})

const mapDispatchToProps = {
	// changeRanking: () => {
	//   return dispatch => {
	//     dispatch({ type: 'CHANGE_GLOBAL_RANKING'})
	//   }
	// },
	updateSingleChefList: (listKey, chefList) => {
		return dispatch => {
			dispatch({ type: 'UPDATE_SINGLE_CHEF_LIST', listKey: listKey, chefList: chefList })
		}
	},
	updateAllChefLists: (allChefLists) => {
		return dispatch => {
			dispatch({ type: 'UPDATE_ALL_CHEF_LISTS', allChefLists: allChefLists })
		}
	},
	// storeChefList: (listChoice, chefs) => {
	// 	return dispatch => {
	// 		dispatch({ type: 'STORE_CHEF_LIST', chefType: listChoice, chefList: chefs })
	// 	}
	// },
	// appendToChefList: (listChoice, new_chefs) => {
	// 	return dispatch => {
	// 		dispatch({ type: 'APPEND_TO_CHEF_LISTS', chefType: listChoice, chefList: new_chefs })
	// 	}
	// },
	// clearListedChefs: (listChoice) => {
	// 	return dispatch => {
	// 		dispatch({ type: 'CLEAR_LISTED_CHEFS', chefType: listChoice })
	// 	}
	// },
	storeChefDetails: (chef_details) => {
		return dispatch => {
			dispatch({ type: 'STORE_CHEF_DETAILS', chefID: `chef${chef_details.chef.id}`, chef_details: chef_details })
		}
	},
}

//variable to synchronously record FlatList y offset on ios since velocity is not available
let previousScrollViewOffset = 0;

export default connect(mapStateToProps, mapDispatchToProps)(
	class ChefList extends React.Component {

		constructor(props) {
			super(props)
			this.searchBar = React.createRef()
			this.chefFlatList = React.createRef()
			this.state = {
				limit: 10,
				offset: 0,
				awaitingServer: false,
				isDisplayed: true,
				chefsICantGet: [],
				renderOfflineMessage: false,
				searchTerm: "",
				yOffset: new Animated.Value(0),
				currentYTop: 0,
				searchBarZIndex: 0,
				offlineDiagnostics: '',
			}
		}

		componentDidMount = async () => {
			this.setState({ awaitingServer: true }, async () => {
				this.props.navigation.addListener('focus', this.respondToFocus)
				this.props.navigation.addListener('blur', this.respondToBlur)
				await this.fetchChefList()
				this.setState({ awaitingServer: false })
			})
			this.setupHeaderScrollTopTopButton()
		}

		componentWillUnmount = () => {
			this.props.navigation.removeListener('focus', this.respondToFocus)
			this.props.navigation.removeListener('blur', this.respondToBlur)
			this.deleteChefList()
		}

		// shouldComponentUpdate = () => { return this.state.isDisplayed }

		respondToFocus = async () => {
			this.setupHeaderScrollTopTopButton()
			// this.setState({
			//awaitingServer: false,
			// offset: 0,
			// isDisplayed: true
			// }, async () => {
			// await this.fetchChefList()
			this.setState({ awaitingServer: false })
			// })
		}

		respondToBlur = () => {
			// this.setState({ isDisplayed: false })
		}

		setupHeaderScrollTopTopButton = () => {
			this.props.navigation.dangerouslyGetParent().setOptions({
				headerLeft: () => <AppHeaderActionButton buttonAction={() => this.chefFlatList.scrollToOffset({ offset: 0, animated: true })} />
			})
		}

		getQueryChefId = () => {
			let queryChefId = this.props.queryChefID ? this.props.queryChefID : this.props.loggedInChef.id
			return queryChefId
		}

		getChefListName = () => {
			return this.props["listChoice"]
			//return this.props.allRecipeLists[this.props.route.key]
		}

		getChefList = () => {
			//return this.props[this.getRecipeListName() + `_Recipes`]
			// return this.state.recipeList
			// console.log(this.props.allRecipeLists)
			return this.props.allChefLists[this.props.route.key] || []
		}

		fetchChefList = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				try {
					// console.log(this.state.offset)
					// const queryChefID = this.props.queryChefID ? this.props.queryChefID : this.props.loggedInChef.id
					let chefs = await getChefList(this.getChefListName(), this.getQueryChefId(), this.state.limit, this.state.offset, this.props.loggedInChef.auth_token, this.state.searchTerm)
					// this.props.updateSingleRecipeList(this.props["listChoice"], chefs)
					this.props.updateSingleChefList(this.props.route.key, chefs)
					saveChefListsLocally(this.getQueryChefId(), this.props.loggedInChef.id, this.getChefListName(), this.getChefList())

				}
				catch (e) {
					if (e.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
					if (this.getChefList()?.length == 0) {
						this.loadChefsLocally()

						// console.log('failed to get chefs. Loading from async storage.')
						// AsyncStorage.getItem('locallySavedListData', (err, res) => {
						// 	if (res != null) {
						// 		const locallySavedListData = JSON.parse(res)
						// 		if (locallySavedListData[this.props["listChoice"]].length > 0) {
						// 			this.props.storeChefList(this.props["listChoice"], locallySavedListData[this.props["listChoice"]])
						// 		}
						// 		else {
						// 			this.setState({ renderOfflineMessage: true })
						// 		}
						// 	} else {
						// 		this.setState({ renderOfflineMessage: true })
						// 	}
						// })
					}
				}
			} else {
				this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState })
			}
		}

		fetchAdditionalChefs = async () => {
			try {
				// const queryChefID = this.props.queryChefID ? this.props.queryChefID : this.props.loggedInChef.id
				const additionalChefs = await getChefList(this.getChefListName(), this.getQueryChefId(), this.state.limit, this.state.offset, this.props.loggedInChef.auth_token, this.state.searchTerm)
				this.props.updateSingleChefList(this.props.route.key, [...this.getChefList(), ...additionalChefs])
				// this.props.appendToChefList(this.getChefListName(), [...this.getChefList(), ,... newChefs])
				saveChefListsLocally(this.getQueryChefId(), this.props.loggedInChef.id, this.getChefListName(), [...this.getChefList(), ...additionalChefs])
			}
			catch (e) {
				if (e.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
				// console.log('failed to get ADDITIONAL chefs')
			}
		}

		loadChefsLocally = async () => {
			let localChefList = await loadLocalChefLists(this.getQueryChefId(), this.getChefListName())
			//console.log(localChefList.length)
			if (localChefList.length > 0) {
				this.props.updateSingleChefList(this.props.route.key, localChefList)
			}
			this.setState({ awaitingServer: false })
		}

		deleteChefList = () => {
			let newAllChefLists = this.props.allChefLists
			delete newAllChefLists[this.props.route.key]
			this.props.updateAllChefLists(newAllChefLists)
		}

		renderChefListItem = (item) => {
			return <ChefCard
				listChoice={this.getChefListName()}
				key={item.index.toString()}
				{...item.item}
				navigateToChefDetails={this.navigateToChefDetails}
				followChef={this.followChef}
				unFollowChef={this.unFollowChef}
				renderOfflineMessage={this.state.chefsICantGet}
				clearOfflineMessage={this.removeChefFromCantGetList}
			/>
		}

		updateAttributeCountInChefLists = (chefId, attribute, toggle, diff) => {
			let newAllChefLists = {}
			Object.keys(this.props.allChefLists).forEach(list => {
				let chefList = this.props.allChefLists[list].map(chef => {
					if (chef.id == chefId) {
						chef[attribute] += diff
						chef[toggle] = diff > 0 ? 1 : 0
						return chef
					} else {
						return chef
					}
				})
				newAllChefLists[list] = chefList
			})
			this.props.updateAllChefLists(newAllChefLists)
			// Object.keys(this.props.allChefLists).forEach(list => {
			// 	let newList = this.props.allChefLists[list].map(chef => {
			// 		if (chef.id == chefId) {
			// 			chef[attribute] += diff
			// 			chef[toggle] = diff > 0 ? 1 : 0
			// 			return chef
			// 		} else {
			// 			return chef
			// 		}
			// 	})
			// 	this.props.storeChefList(list, newList)
			// })
		}

		followChef = async (followee_id) => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				this.setState({ awaitingServer: true }, async () => {
					try {
						const followPosted = await postFollow(this.props.loggedInChef.id, followee_id, this.props.loggedInChef.auth_token)
						if (followPosted) {
							this.updateAttributeCountInChefLists(followee_id, "followers", "user_chef_following", 1)
						}
					} catch (e) {
						if (e.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
						this.setState({ renderOfflineMessage: true, offlineDiagnostics: e })
					}
					this.setState({ awaitingServer: false })
				})
			} else {
				this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState })
			}
		}

		unFollowChef = async (followee_id) => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				this.setState({ awaitingServer: true }, async () => {
					try {
						const followPosted = await destroyFollow(this.props.loggedInChef.id, followee_id, this.props.loggedInChef.auth_token)
						if (followPosted) {
							this.updateAttributeCountInChefLists(followee_id, "followers", "user_chef_following", -1)
						}
					} catch (e) {
						if (e.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
						this.setState({ renderOfflineMessage: true, offlineDiagnostics: e })
					}
					this.setState({ awaitingServer: false })
				})
			} else {
				this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState })
			}
		}

		refresh = () => {
			this.setState({ limit: 20, offset: 0 }, () => {
				//this.props.clearListedChefs(this.props["listChoice"])
				this.fetchChefList()
			})
		}

		onEndReached = async () => {
			if (this.getChefList().length % 10 == 0) {
				this.setState({ offset: this.state.offset + 10 }, this.fetchAdditionalChefs)
			}
		}

		navigateToChefDetails = async (chefID) => {
			// console.log('parent navigator?')
			// console.log(this.props)
			this.setState({ awaitingServer: true }, async () => {
				try {
					const chefDetails = await getChefDetails(chefID, this.props.loggedInChef.auth_token)
					if (chefDetails) {
						this.props.storeChefDetails(chefDetails)
						saveChefDetailsLocally(chefDetails, this.props.loggedInChef.id)
						this.setState(() => ({ awaitingServer: false }))
						this.props.navigation.push('ChefDetails', { chefID: chefID })
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
									this.props.navigation.push('ChefDetails', { chefID: chefID })
								})
							} else {
								// console.log('recipe not present in saved list')
								this.setState(state => {
									return ({
										chefsICantGet: [...state.chefsICantGet, chefID],
										awaitingServer: false
									})
								})
							}
						} else {
							// console.log('no chefs saved')
							this.setState(state => {
								return ({
									chefsICantGet: [...state.chefsICantGet, chefID],
									awaitingServer: false
								})
							})
						}
					})
					this.setState({ awaitingServer: false })
				}
			})
		}

		removeChefFromCantGetList = (chefID) => {
			this.setState((state) => {
				let newCantGetList = state.chefsICantGet.filter(chef => chef != chefID)
				return ({ chefsICantGet: newCantGetList })
			})
		}

		setSearchTerm = (searchTerm) => {
			this.setState({ searchTerm: searchTerm }, () => {
				this.setState({ awaitingServer: true }, async () => {
					await this.fetchChefList()
					this.setState({ awaitingServer: false })
				})
			})
		}

		handleSearchBarFocus = () => {
					this.setState({ searchBarZIndex: 1 }, () => {
						this.searchBar.current.focus()
					})
				}

		render() {
				//console.log(this.props["listChoice"])
				return(
				<SpinachAppContainer awaitingServer = { this.state.awaitingServer } >
						<TouchableOpacity
							activeOpacity={1}
							onPress={Keyboard.dismiss}
						>
							{this.state.renderOfflineMessage && (
								<OfflineMessage
									message={`Sorry, can't get recipes chefs now.${"\n"}You appear to be offline.`}
									topOffset={'10%'}
									clearOfflineMessage={() => this.setState({ renderOfflineMessage: false })}
									diagnostics={this.props.loggedInChef.is_admin ? this.state.offlineDiagnostics : null}
								/>)
							}
							{this.getChefList().length == 0 && (
								<View
									style={centralStyles.swipeDownContainer}
								>
									<Icon
										name='gesture-swipe-down'
										size={responsiveHeight(5)}
										style={centralStyles.swipeDownIcon} />
									<Text
										style={centralStyles.swipeDownText}
									>Swipe down to refresh</Text>
								</View>
							)}
							{(this.getChefList().length > 0 || this.state.searchTerm != '') && (
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
										text={"Search for Chefs"}
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
								ListHeaderComponent={() => {
									let searchBarIsDisplayed = this.getChefList().length > 0 || this.state.searchTerm != ''
									return (
										<TouchableOpacity
											style={{ height: searchBarIsDisplayed ? responsiveHeight(7) : responsiveHeight(70) }}
											onPress={searchBarIsDisplayed ? this.handleSearchBarFocus : this.refresh}
										>
											{this.state.searchTerm.length > 0 && (
												<SearchBarClearButton
													setSearchTerm={this.setSearchTerm}
												/>
											)}
										</TouchableOpacity>
									)
								}}
								ref={(list) => this.chefFlatList = list}
								data={this.getChefList()}
								renderItem={this.renderChefListItem}
								style={{ minHeight: responsiveHeight(70) }}
								keyExtractor={(item) => item.id.toString()}
								//onRefresh={this.refresh}
								//refreshing={false}
								refreshControl={
									<RefreshControl
										refreshing={false}
										onRefresh={this.refresh}
										colors={['#104e01']}
										progressBackgroundColor={'#fff59b'}
										tintColor={'#fff59b'}
									/>
								}
								onEndReached={this.onEndReached}
								onEndReachedThreshold={0.3}
								scrollEventThrottle={16}
								listKey={this.getChefList()}
								onScroll={Animated.event(
									[{ nativeEvent: { contentOffset: { y: this.state.yOffset } } }],
									{
										useNativeDriver: true,
										listener: (e) => {
											// console.log(previousScrollViewOffset)
											const y = e.nativeEvent.contentOffset.y
											// const isIncreasing = e.nativeEvent.velocity.y > 0
											const isIncreasing = Platform.OS === 'ios' ? y > previousScrollViewOffset : e.nativeEvent.velocity.y > 0
											if (y <= 0) {
												this.setState({
													currentYTop: 0,
													searchBarZIndex: 0,
												})
											}
											// //if bigger than max input range and getting bigger
											if (y > 0 && y > this.state.currentYTop + responsiveHeight(7) && isIncreasing) {
												this.setState({
													currentYTop: y - responsiveHeight(7),
													searchBarZIndex: 1,
												})
											}
											//if smaller than min input range and getting smaller
											if (y > 0 && y < this.state.currentYTop - responsiveHeight(7) && !isIncreasing) {
												this.setState({
													currentYTop: y,
													searchBarZIndex: 1,
												})
											}
											Platform.OS === 'ios' && (previousScrollViewOffset = y)
										}
									},
								)}
							/>
						</TouchableOpacity>
				</SpinachAppContainer>
			)
		}
	}
)
