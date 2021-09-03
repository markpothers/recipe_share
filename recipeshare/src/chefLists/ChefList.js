import React from 'react'
import { FlatList, Animated, TouchableOpacity, Keyboard, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ChefCard from './ChefCard'
import { connect } from 'react-redux'
import { getChefList } from '../fetches/getChefList'
import { postFollow } from '../fetches/postFollow'
import { destroyFollow } from '../fetches/destroyFollow'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
import saveChefDetailsLocally from '../auxFunctions/saveChefDetailsLocally'
import { getChefDetails } from '../fetches/getChefDetails'
import OfflineMessage from '../offlineMessage/offlineMessage'
import NetInfo from '@react-native-community/netinfo';
import SearchBar from '../searchBar/SearchBar.js'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import AppHeaderActionButton from '../../navigation/appHeaderActionButton'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

const mapStateToProps = (state) => ({
	all_chefs: state.chefs.all_chefs,
	followed_chefs: state.chefs.followed,
	loggedInChef: state.loggedInChef,
	chefs_details: state.chefs_details,
	most_liked_chefs: state.chefs.most_liked_chefs,
	most_made_chefs: state.chefs.most_made_chefs,
	chef_followees: state.chefs.chef_followees,
	chef_followers: state.chefs.chef_followers
})

const mapDispatchToProps = {
	// changeRanking: () => {
	//   return dispatch => {
	//     dispatch({ type: 'CHANGE_GLOBAL_RANKING'})
	//   }
	// },
	storeChefList: (listChoice, chefs) => {
		return dispatch => {
			dispatch({ type: 'STORE_CHEF_LIST', chefType: listChoice, chefList: chefs })
		}
	},
	appendToChefList: (listChoice, new_chefs) => {
		return dispatch => {
			dispatch({ type: 'APPEND_TO_CHEF_LISTS', chefType: listChoice, chefList: new_chefs })
		}
	},
	clearListedChefs: (listChoice) => {
		return dispatch => {
			dispatch({ type: 'CLEAR_LISTED_CHEFS', chefType: listChoice })
		}
	},
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
		}

		shouldComponentUpdate = () => { return this.state.isDisplayed }

		respondToFocus = async () => {
			this.setupHeaderScrollTopTopButton()
			this.setState({
				awaitingServer: false,
				// offset: 0,
				isDisplayed: true
			}, async () => {
				// await this.fetchChefList()
				// this.setState({ awaitingServer: false })
			})
		}

		respondToBlur = () => { this.setState({ isDisplayed: false }) }

		setupHeaderScrollTopTopButton = () => {
			this.props.navigation.dangerouslyGetParent().setOptions({
				headerLeft: () => <AppHeaderActionButton buttonAction={() => this.chefFlatList.scrollToOffset({ offset: 0, animated: true })} />
			})
		}

		fetchChefList = async () => {
			try {
				// console.log(this.state.offset)
				const queryChefID = this.props.queryChefID ? this.props.queryChefID : this.props.loggedInChef.id
				let chefs = await getChefList(this.props["listChoice"], queryChefID, this.state.limit, this.state.offset, this.props.loggedInChef.auth_token, this.state.searchTerm)
				this.props.storeChefList(this.props["listChoice"], chefs)
			}
			catch (e) {
				if (e.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
				if (this.props[this.props["listChoice"]]?.length == 0) {
					// console.log('failed to get chefs. Loading from async storage.')
					AsyncStorage.getItem('locallySavedListData', (err, res) => {
						if (res != null) {
							const locallySavedListData = JSON.parse(res)
							if (locallySavedListData[this.props["listChoice"]].length > 0) {
								this.props.storeChefList(this.props["listChoice"], locallySavedListData[this.props["listChoice"]])
							}
							else {
								this.setState({ renderOfflineMessage: true })
							}
						} else {
							this.setState({ renderOfflineMessage: true })
						}
					})
				}
			}
		}

		fetchAdditionalChefs = async () => {
			try {
				const queryChefID = this.props.queryChefID ? this.props.queryChefID : this.props.loggedInChef.id
				const new_chefs = await getChefList(this.props["listChoice"], queryChefID, this.state.limit, this.state.offset, this.props.loggedInChef.auth_token, this.state.searchTerm)
				this.props.appendToChefList(this.props["listChoice"], new_chefs)
			}
			catch (e) {
				if (e.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
				// console.log('failed to get ADDITIONAL chefs')
			}
		}

		renderChefListItem = (item) => {
			return <ChefCard
				listChoice={this.props["listChoice"]}
				key={item.index.toString()}
				{...item.item}
				navigateToChefDetails={this.navigateToChefDetails}
				followChef={this.followChef}
				unFollowChef={this.unFollowChef}
				renderOfflineMessage={this.state.chefsICantGet}
				clearOfflineMessage={this.removeChefFromCantGetList}
			/>
		}

		followChef = async (followee_id) => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				this.setState({ awaitingServer: true }, async () => {
					try {
						const followPosted = await postFollow(this.props.loggedInChef.id, followee_id, this.props.loggedInChef.auth_token)
						if (followPosted) {
							let updatedChefs = this.props[this.props["listChoice"]].map(chef => {
								if (chef['id'] === followee_id) {
									chef['followers'] = parseInt(chef['followers']) + 1
									chef['user_chef_following'] = 1
									return chef
								} else {
									return chef
								}
							})
							this.props.storeChefList(this.props["listChoice"], updatedChefs)
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
							let updatedChefs = this.props[this.props["listChoice"]].map(chef => {
								if (chef['id'] === followee_id) {
									chef['followers'] = parseInt(chef['followers']) - 1
									chef['user_chef_following'] = 0
									return chef
								} else {
									return chef
								}
							})
							this.props.storeChefList(this.props["listChoice"], updatedChefs)
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
				this.props.clearListedChefs(this.props["listChoice"])
				this.fetchChefList()
			})
		}

		onEndReached = async () => {
			if (this.props[this.props["listChoice"]].length % 10 == 0) {
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
			this.setState({ searchTerm: searchTerm }, this.fetchChefList)
		}

		handleSearchBarFocus = () => {
			this.setState({ searchBarZIndex: 1 }, () => {
				this.searchBar.current.focus()
			})
		}

		render() {
			//   console.log(this.props[this.props["listChoice"]])
			return (
				<SpinachAppContainer awaitingServer={this.state.awaitingServer}>
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
						{(this.props[this.props["listChoice"]].length > 0 || this.state.searchTerm != '') && (
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
							ref={(list) => this.chefFlatList = list}
							data={this.props[this.props["listChoice"]]}
							renderItem={this.renderChefListItem}
							keyExtractor={(item) => item.id.toString()}
							onRefresh={this.refresh}
							refreshing={false}
							onEndReached={this.onEndReached}
							onEndReachedThreshold={0.3}
							listKey={this.props[this.props["listChoice"]]}
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
						/>
					</TouchableOpacity>
				</SpinachAppContainer>
			)
		}
	}
)
