import React from 'react'
import { Image, ScrollView, View } from 'react-native';
import { connect } from 'react-redux'
import { styles } from './chefDetailsStyleSheet'
import { centralStyles } from '../centralStyleSheet'
import { getChefDetails } from '../fetches/getChefDetails'
import ChefDetailsCard from './ChefDetailsCard'
import { MyRecipeBookTabs } from './ChefDetailsNavigators'
import { postFollow } from '../fetches/postFollow'
import { destroyFollow } from '../fetches/destroyFollow'
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
import OfflineMessage from '../offlineMessage/offlineMessage'
import NetInfo from '@react-native-community/netinfo';

const mapStateToProps = (state) => ({
	loggedInChef: state.loggedInChef,
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
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	class ChefDetails extends React.Component {

		state = {
			awaitingServer: false,
			renderOfflineMessage: false
		}

		componentDidMount = async () => {
			// await this.setState({awaitingServer: true})
			// await this.fetchChefDetails()
			// await this.setState({awaitingServer: false})
		}

		respondToFocus = async () => {
			// await this.setState({awaitingServer: true})
			// await this.fetchChefDetails()
			// await this.setState({awaitingServer: false})
		}

		componentWillUnmount = () => {
			// console.log("unmounting")
			// this.props.clearChefDetails()
		}

		fetchChefDetails = async () => {
			// const chef_details = await getChefDetails(this.props.route.params.chefID, this.props.loggedInChef.auth_token)
			// if (chef_details) {
			//   this.props.storeChefDetails(chef_details)
			// }
		}

		renderChefImage = () => {
			const chef = this.props.chefs_details[`chef${this.props.route.params.chefID}`]
			if (chef != undefined) {
				if (chef.image_url != null) {
					return <Image style={{ width: '100%', height: '100%' }} source={{ uri: chef.image_url }}></Image>
				} else {
					return <Image style={{ width: '100%', height: '100%' }} source={require("../dataComponents/peas.jpg")}></Image>
				}
			}
		}

		navigateToRecipeDetails = (recipeID) => {
			this.props.navigation.navigate('RecipeDetails', { recipeID: recipeID })
		}

		followChef = async (followee_id) => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
				try {
					const followPosted = await postFollow(this.props.loggedInChef.id, followee_id, this.props.loggedInChef.auth_token)
					if (followPosted) {
						let newFollowers = [...this.props.chefs_details[`chef${this.props.route.params.chefID}`].followers, followPosted]
						this.props.storeNewFollowers(followee_id, newFollowers)
					}
				} catch {
					await this.setState(state => ({ renderOfflineMessage: true }))
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
						let newFollowers = this.props.chefs_details[`chef${this.props.route.params.chefID}`].followers.filter(follower => follower.follower_id !== this.props.loggedInChef.id)
						this.props.storeNewFollowers(followee_id, newFollowers)
					}
				} catch {
					await this.setState(state => ({ renderOfflineMessage: true }))
				}
				await this.setState({ awaitingServer: false })
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		parentNavigator = (route, params) => {
			route === "ChefDetails" ? this.props.navigation.push(route, { chefID: params.chefID }) : this.props.navigation.navigate(route, params)
		}

		render() {
			if (this.props.chefs_details[`chef${this.props.route.params.chefID}`] !== undefined) {
				const chef_details = this.props.chefs_details[`chef${this.props.route.params.chefID}`]
				return (
					<SpinachAppContainer awaitingServer={this.state.awaitingServer}>
						{this.state.renderOfflineMessage && (
							<OfflineMessage
								message={`Sorry, can't do that right now.${"\n"}You appear to be offline.`}
								topOffset={'10%'}
								clearOfflineMessage={() => this.setState({ renderOfflineMessage: false })}
							/>)
						}
						<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
							<ChefDetailsCard
								{...chef_details}
								image_url={chef_details.chef.image_url}
								followChef={this.followChef}
								unFollowChef={this.unFollowChef}
								notProfile={true} />
							<View style={styles.recipeBookContainer}>
								<MyRecipeBookTabs
									parentNavigator={this.parentNavigator}
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

