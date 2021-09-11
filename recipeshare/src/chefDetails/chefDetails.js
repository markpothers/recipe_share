import React from 'react'
import { Image, ScrollView, View } from 'react-native';
import { connect } from 'react-redux'
import { styles } from './chefDetailsStyleSheet'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import { getChefDetails } from '../fetches/getChefDetails'
import ChefDetailsCard from './ChefDetailsCard'
import { ChefRecipeBookTabs } from './ChefDetailsNavigators'
import { postFollow } from '../fetches/postFollow'
import { destroyFollow } from '../fetches/destroyFollow'
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
import OfflineMessage from '../offlineMessage/offlineMessage'
import NetInfo from '@react-native-community/netinfo';
NetInfo.configure({reachabilityShortTimeout: 5}) //5ms

import DynamicMenu from '../dynamicMenu/DynamicMenu.js'
import AppHeaderRight from '../../navigation/appHeaderRight'

const mapStateToProps = (state) => ({
	loggedInChef: state.loggedInChef,
	allChefLists: state.chefs,
	chefs_details: state.chefs_details,
})

const mapDispatchToProps = {
	storeChefDetails: (chef_details) => {
		return dispatch => {
			dispatch({ type: 'STORE_CHEF_DETAILS', chefID: `chef${chef_details.chef.id}`, chef_details: chef_details })
		}
	},
	storeNewFollowers: (followee_id, followers) => {
		return dispatch => {
			dispatch({ type: 'STORE_NEW_FOLLOWERS', chefID: `chef${followee_id}`, followers: followers })
		}
	},
	clearChefDetails: () => {
		return dispatch => {
			dispatch({ type: 'CLEAR_CHEF_DETAILS' })
		}
	},
	storeChefList: (listChoice, chefs) => {
		return dispatch => {
			dispatch({ type: 'STORE_CHEF_LIST', chefType: listChoice, chefList: chefs })
		}
	},
}

export default connect(mapStateToProps, mapDispatchToProps)(
	class ChefDetails extends React.Component {

		state = {
			awaitingServer: false,
			renderOfflineMessage: false,
			headerButtons: null,
			dynamicMenuShowing: false,
			offlineDiagnostics: '',
		}

		generateHeaderButtonList = async () => {
			const chefDetails = this.props.chefs_details[`chef${this.props.route.params.chefID}`]
			let headerButtons = [
				{
					icon: !chefDetails.chef_followed ? "account-multiple-plus-outline" : "account-multiple-minus",
					text: !chefDetails.chef_followed ? "Follow chef" : "Stop following chef",
					action: !chefDetails.chef_followed ?
						(() => this.setState({ dynamicMenuShowing: false }, this.followChef)) :
						(() => this.setState({ dynamicMenuShowing: false }, this.unFollowChef))
				},
				{
					icon: "food",
					text: "Create new recipe",
					action: (() => {
						this.setState({ dynamicMenuShowing: false }, () => {
							this.props.navigation.navigate('NewRecipe')
						})
					})
				}
			]
			this.setState({ headerButtons: headerButtons })
		}

		renderDynamicMenu = () => {
			return (
				<DynamicMenu
					buttons={this.state.headerButtons}
					closeDynamicMenu={() => this.setState({ dynamicMenuShowing: false })}
				/>
			)
		}

		addDynamicMenuButtonsToHeader = () => {
			this.props.navigation.setOptions({
				headerRight: Object.assign(() => <AppHeaderRight buttonAction={() => this.setState({ dynamicMenuShowing: true })} />, { displayName: 'HeaderRight' }),
			});
		}

		componentDidMount = async () => {
			this.setState({ awaitingServer: true }, async () => {
				await this.generateHeaderButtonList()
				this.addDynamicMenuButtonsToHeader()
				// await this.fetchChefDetails()
				this.setState({ awaitingServer: false })
			})
		}

		componentDidUpdate = async (prevProps) => {
			const chefDetails = this.props.chefs_details[`chef${this.props.route.params.chefID}`]
			const prevChefDetails = prevProps.chefs_details[`chef${this.props.route.params.chefID}`]

			if (chefDetails.chef_followed != prevChefDetails.chef_followed) {
				await this.generateHeaderButtonList()
			}
		}

		respondToFocus = async () => {
			// this.setState(() => ({awaitingServer: true }))
			// await this.fetchChefDetails()
			// this.setState(() => ({awaitingServer: false}))
		}

		componentWillUnmount = () => {
			// console.log("unmounting")
			// this.props.clearChefDetails()
		}

		fetchChefDetails = async () => {
			const chefDetails = await getChefDetails(this.props.route.params.chefID, this.props.loggedInChef.auth_token)
			if (chefDetails) {
				this.props.storeChefDetails(chefDetails)
			}
		}

		renderChefImage = () => {
			const chef = this.props.chefs_details[`chef${this.props.route.params.chefID}`]
			if (chef != undefined) {
				if (chef.image_url != null) {
					return <Image style={{ width: '100%', height: '100%' }} source={{ uri: chef.image_url }}></Image>
				} else {
					return <Image style={{ width: '100%', height: '100%' }} source={require("../dataComponents/default-chef.jpg")}></Image>
				}
			}
		}

		navigateToRecipeDetails = (recipeID) => {
			this.props.navigation.navigate('RecipeDetails', { recipeID: recipeID })
		}

		updateAttributeCountInChefLists = (chefId, attribute, toggle, diff) => {
			Object.keys(this.props.allChefLists).forEach(list => {
				let newList = this.props.allChefLists[list].map(chef => {
					if (chef.id == chefId) {
						chef[attribute] += diff
						chef[toggle] = diff > 0 ? 1 : 0
						return chef
					} else {
						return chef
					}
				})
				this.props.storeChefList(list, newList)
			})
		}

		followChef = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				this.setState({ awaitingServer: true }, async () => {
					try {
						const followPosted = await postFollow(this.props.loggedInChef.id, this.props.route.params.chefID, this.props.loggedInChef.auth_token)
						if (followPosted) {
							this.updateAttributeCountInChefLists(this.props.route.params.chefID, "followers", "user_chef_following", 1)
							let newFollowers = this.props.chefs_details[`chef${this.props.route.params.chefID}`].followers + 1
							this.props.storeNewFollowers(this.props.route.params.chefID, newFollowers)
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

		unFollowChef = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				this.setState({ awaitingServer: true }, async () => {
					try {
						const followPosted = await destroyFollow(this.props.loggedInChef.id, this.props.route.params.chefID, this.props.loggedInChef.auth_token)
						if (followPosted) {
							this.updateAttributeCountInChefLists(this.props.route.params.chefID, "followers", "user_chef_following", -1)
							let newFollowers = this.props.chefs_details[`chef${this.props.route.params.chefID}`].followers - 1
							this.props.storeNewFollowers(this.props.route.params.chefID, newFollowers)
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

		render() {
			if (this.props.chefs_details[`chef${this.props.route.params.chefID}`] !== undefined) {
				const chef_details = this.props.chefs_details[`chef${this.props.route.params.chefID}`]
				// console.log(chef_details)
				return (
					<SpinachAppContainer awaitingServer={this.state.awaitingServer}>
						{this.state.renderOfflineMessage && (
							<OfflineMessage
								message={`Sorry, can't do that right now.${"\n"}You appear to be offline.`}
								topOffset={'10%'}
								clearOfflineMessage={() => this.setState({ renderOfflineMessage: false })}
								
								
							/>)
						}
						{this.state.dynamicMenuShowing && this.renderDynamicMenu()}
						<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
							<ChefDetailsCard
								{...chef_details}
								image_url={chef_details.chef.image_url}
								followChef={this.followChef}
								unFollowChef={this.unFollowChef}
								notProfile={true} />
							<View style={styles.recipeBookContainer}>
								<ChefRecipeBookTabs
									queryChefID={chef_details.chef.id}
									fetchChefDetails={this.fetchChefDetails}
								/>
							</View>
						</ScrollView>
					</SpinachAppContainer>
				)
			} else {
				return (
					<SpinachAppContainer awaitingServer={this.state.awaitingServer}>
					</SpinachAppContainer>
				)
			}
		}
	}
)

