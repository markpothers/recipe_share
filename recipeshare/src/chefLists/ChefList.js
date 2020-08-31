import React from 'react'
import { FlatList, AsyncStorage, Animated, TouchableOpacity } from 'react-native'
import ChefCard from './ChefCard'
import { connect } from 'react-redux'
import { getChefList } from '../fetches/getChefList'
import { postFollow } from '../fetches/postFollow'
import { destroyFollow } from '../fetches/destroyFollow'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
import saveChefDetailsLocally from '../functionalComponents/saveChefDetailsLocally'
import { getChefDetails } from '../fetches/getChefDetails'
import OfflineMessage from '../offlineMessage/offlineMessage'
import NetInfo from '@react-native-community/netinfo';
import SearchBar from '../searchBar/SearchBar.js'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

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

export default connect(mapStateToProps, mapDispatchToProps)(
	class ChefList extends React.Component {

		constructor(props) {
			super(props)
			this.searchBar = React.createRef()
			this.state = {
				limit: 20,
				offset: 0,
				awaitingServer: false,
				isDisplayed: true,
				chefsICantGet: [],
				renderOfflineMessage: false,
				searchTerm: "",
				yOffset: new Animated.Value(0),
				currentYTop: 0,
				searchBarZIndex: 0
			}
		}

		componentDidMount = async () => {
			await this.setState({ awaitingServer: true })
			await this.fetchChefList()
			await this.setState({ awaitingServer: false })
			this._unsubscribeFocus = this.props.navigation.addListener('focus', () => {
				this.respondToFocus()
			})
			this._unsubscribeBlur = this.props.navigation.addListener('blur', () => {
				this.respondToBlur()
			})
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

		respondToFocus = async () => {
			await this.setState({
				awaitingServer: true,
				offset: 0,
				isDisplayed: true
			})
			await this.fetchChefList()
			await this.setState({ awaitingServer: false })
		}

		respondToBlur = () => {
			this.setState({ isDisplayed: false })
		}

		fetchChefList = async () => {
			try {
				const queryChefID = this.props.queryChefID ? this.props.queryChefID : this.props.loggedInChef.id
				let chefs = await getChefList(this.props["listChoice"], queryChefID, this.state.limit, this.state.offset, this.props.loggedInChef.auth_token, this.state.searchTerm)
				this.props.storeChefList(this.props["listChoice"], chefs)
			}
			catch (e) {
				if (e === "logout") { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
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
			await this.setState({ awaitingServer: true })
			try {
				const queryChefID = this.props.queryChefID ? this.props.queryChefID : this.props.loggedInChef.id
				const new_chefs = await getChefList(this.props["listChoice"], queryChefID, this.state.limit, this.state.offset, this.props.loggedInChef.auth_token, this.state.searchTerm)
				this.props.appendToChefList(this.props["listChoice"], new_chefs)
			}
			catch (e) {
				if (e === "logout") { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
				// console.log('failed to get ADDITIONAL chefs')
			}
			await this.setState({ awaitingServer: false })
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
				await this.setState({ awaitingServer: true })
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
					if (e === "logout") { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
					this.setState({ awaitingServer: false })
				}
				await this.setState({ awaitingServer: false })
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		unFollowChef = async (followee_id) => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
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
					if (e === "logout") { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
					this.setState({ awaitingServer: false })
				}
				await this.setState({ awaitingServer: false })
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		refresh = async () => {
			await this.setState({ limit: 20, offset: 0 })
			this.props.clearListedChefs(this.props["listChoice"])
			this.fetchChefList()
		}

		onEndReached = async () => {
			await this.setState({ offset: this.state.offset + 20 })
			this.fetchAdditionalChefs()
		}

		navigateToChefDetails = async (chefID) => {
			// console.log('parent navigator?')
			// console.log(this.props)
			await this.setState({ awaitingServer: true })
			try {
				const chefDetails = await getChefDetails(chefID, this.props.loggedInChef.auth_token)
				if (chefDetails) {
					this.props.storeChefDetails(chefDetails)
					saveChefDetailsLocally(chefDetails, this.props.loggedInChef.id)
					await this.setState({ awaitingServer: false })
					this.props.navigation.push('ChefDetails', { chefID: chefID })
				}
			} catch (e) {
				if (e === "logout") { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
				// console.log('looking for local chefs')
				AsyncStorage.getItem('localChefDetails', (err, res) => {
					if (res != null) {
						// console.log('found some local chefs')
						let localChefDetails = JSON.parse(res)
						let thisChefDetails = localChefDetails.find(chefDetails => chefDetails.chef.id === chefID)
						if (thisChefDetails) {
							this.props.storeChefDetails(thisChefDetails)
							this.setState({ awaitingServer: false })
							this.props.navigation.push('ChefDetails', { chefID: chefID })
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
				await this.setState({ awaitingServer: false })
			}
		}

		removeChefFromCantGetList = (chefID) => {
			this.setState((state) => {
				let newCantGetList = state.chefsICantGet.filter(chef => chef != chefID)
				return ({ chefsICantGet: newCantGetList })
			})
		}

		setSearchTerm = async (searchTerm) => {
			await this.setState({ searchTerm: searchTerm })
			this.fetchChefList()
		}

		render() {
			//   console.log(this.props[this.props["listChoice"]])
			return (
				<SpinachAppContainer awaitingServer={this.state.awaitingServer}>
					{this.state.renderOfflineMessage && (
						<OfflineMessage
							message={`Sorry, can't get recipes chefs now.${"\n"}You appear to be offline.`}
							topOffset={'10%'}
							clearOfflineMessage={() => this.setState({ renderOfflineMessage: false })}
						/>)
					}
					<Animated.View
						style={{
							position: 'absolute',
							zIndex: this.state.searchBarZIndex,
							transform: [
								{
									translateY: this.state.yOffset.interpolate({
										inputRange: [this.state.currentYTop, this.state.currentYTop + responsiveHeight(6.25)],
										outputRange: [0, -responsiveHeight(6.25)],
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
							onFocus={() => { this.setState({ searchBarZIndex: 1 }) }}
							onBlur={() => {
								if (this.state.currentYTop === 0) {
									this.setState({ searchBarZIndex: 0 })
								}
							}}
						/>
					</Animated.View>
					<AnimatedFlatList
						ListHeaderComponent={() => (
							<TouchableOpacity
								style={{
									height: responsiveHeight(6.75),
									// backgroundColor: 'red'
								}}
								onPress={() => this.searchBar.current.focus()}
							>
							</TouchableOpacity>
						)}
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
									const y = e.nativeEvent.contentOffset.y
									const isIncreasing = e.nativeEvent.velocity.y > 0
									if (y <= 0) {
										this.setState({
											currentYTop: 0,
											searchBarZIndex: 0
										})
									}
									// //if bigger than max input range and getting bigger
									if (y > this.state.currentYTop + responsiveHeight(6.25) && isIncreasing) {
										this.setState({
											currentYTop: y - responsiveHeight(6.25),
											searchBarZIndex: 1
										})
									}
									//if smaller than min input range and getting smaller
									if (y < this.state.currentYTop - responsiveHeight(6.25) && !isIncreasing) {
										this.setState({
											currentYTop: y,
											searchBarZIndex: 1
										})
									}
								}
							},
						)}
					/>
				</SpinachAppContainer>
			)
		}
	}
)
