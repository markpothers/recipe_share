import React from 'react';
import { connect } from 'react-redux'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import AsyncStorage from '@react-native-async-storage/async-storage'
import ChefDetailsCard from '../chefDetails/ChefDetailsCard'
import { getChefDetails } from '../fetches/getChefDetails'
import ChefEditor from './chefEditor'
// import { getDatabaseBackup } from '../fetches/getDatabaseBackup'
// import { getDatabaseRestore } from '../fetches/getDatabaseRestore'
import DeleteChefOption from './deleteChefOption'
import PicSourceChooser from '../picSourceChooser/picSourceChooser'
import { destroyChef } from '../fetches/destroyChef'
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import OfflineMessage from '../offlineMessage/offlineMessage'
import NetInfo from '@react-native-community/netinfo';
NetInfo.configure({reachabilityShortTimeout: 5}) //5ms
import { AlertPopUp } from '../alertPopUp/alertPopUp'
import DynamicMenu from '../dynamicMenu/DynamicMenu.js'
import AppHeaderRight from '../../navigation/appHeaderRight'

const mapStateToProps = (state) => ({
	loggedInChef: state.loggedInChef,
	chefs_details: state.chefs_details,
	imageBase64: state.newUserDetails.image_url,
	stayingLoggedIn: state.stayLoggedIn,
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
	saveChefDetails: (parameter, content) => {
		return dispatch => {
			dispatch({ type: 'UPDATE_NEW_USER_DETAILS', parameter: parameter, content: content })
		}
	},
}

export default connect(mapStateToProps, mapDispatchToProps)(
	class Profile extends React.Component {

		state = {
			awaitingServer: false,
			editingChef: false,
			choosingPicture: false,
			deleteChefOptionVisible: false,
			renderOfflineMessage: false,
			offlineDiagnostics: '',
			imageFileUri: '',
			chefUpdatedMessageShowing: false,
			headerButtons: null,
			dynamicMenuShowing: false,
			areYouSureDeleteEverythingMessageShowing: false,
			areYouSureLeaveRecipesMessageShowing: false
		}

		generateHeaderButtonList = async () => {
			let headerButtons = [
				{
					icon: "food",
					text: "Create new recipe",
					action: (() => {
						this.setState({ dynamicMenuShowing: false }, () => {
							this.props.navigation.navigate('NewRecipe')
						})
					})
				},
				{
					icon: "playlist-edit",
					text: "Edit Profile",
					action: (() => {
						this.setState({ dynamicMenuShowing: false }, this.editingChef)
					})
				},
				{
					icon: "trash-can-outline",
					text: "Delete Profile",
					action: (() => {
						this.setState({ dynamicMenuShowing: false }, this.showDeleteChefOption)
					})
				},
				{
					icon: "information-outline",
					text: "About",
					action: (() => {
						this.setState({ dynamicMenuShowing: false }, () => {
							this.props.navigation.navigate('About')
						})
					})
				},
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
			if (this.props.route.params?.logout) {
				AsyncStorage.removeItem('chef', () => { })
				this.props.setLoadedAndLoggedIn({ loaded: true, loggedIn: false })
			}
			await this.generateHeaderButtonList()
			this.addDynamicMenuButtonsToHeader()
			this.fetchChefDetails()
			this.props.navigation.addListener('focus', this.respondToFocus)
			this.setState({ image: this.props.imageBase64 })
		}

		componentWillUnmount = () => {
			this.props.navigation.removeListener('focus', this.respondToFocus)
		}

		respondToFocus = async () => {
			await this.fetchChefDetails()
		}

		fetchChefDetails = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				this.setState({ awaitingServer: true }, async () => {
					const chef_details = await getChefDetails(this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
					if (chef_details) {
						this.props.storeChefDetails(chef_details)
					}
					this.setState({ awaitingServer: false })
				})
			} else {
				this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState })
			}
		}

		editingChef = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				this.setState({ editingChef: true })
			} else {
				this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState })
			}
		}

		chefUpdated = (chefChanged) => {
			this.setState({
				editingChef: false,
				awaitingServer: false
			}, async () => {
				if (chefChanged) {
					await this.fetchChefDetails()
					this.setState({ chefUpdatedMessageShowing: true })
				}
			})
		}

		showDeleteChefOption = () => {
			this.setState({
				deleteChefOptionVisible: true,
				editingChef: false
			})
		}

		closeDeleteChefOption = () => {
			this.setState({
				deleteChefOptionVisible: false,
				// editingChef: true
			})
		}

		renderDeleteChefOption = () => {
			return (
				<DeleteChefOption
					// deleteAndLeaveRecipes={this.deleteAndLeaveRecipes}
					deleteEverything={() => this.setState({
						deleteChefOptionVisible: false,
						areYouSureDeleteEverythingMessageShowing: true
					})}
					leaveRecipes={() => this.setState({
						deleteChefOptionVisible: false,
						areYouSureLeaveRecipesMessageShowing: true
					})}
					closeDeleteChefOption={() => this.setState({ deleteChefOptionVisible: false })}
				/>
			)
		}

		choosePicture = () => {
			this.setState({
				choosingPicture: true,
				editingChef: false
			})
		}

		sourceChosen = () => {
			this.setState({
				choosingPicture: false,
				editingChef: true
			}, () => {
				this.props.saveChefDetails("image_url", this.state.imageFileUri)
			})
		}

		saveImage = async (image) => {
			if (image.uri == '') {
				this.setState({ imageFileUri: 'DELETED' })
			} else if (image.cancelled === false) {
				this.setState({ imageFileUri: image.uri })
			}
		}

		cancelChooseImage = () => {
			this.setState({ imageFileUri: '' })
		}

		renderPictureChooser = () => {
			let imageSource = ''
			if (this.state.imageFileUri == 'DELETED') {
				imageSource = ''
			} else if (this.state.imageFileUri != 'DELETED' && this.state.imageFileUri != '') {
				imageSource = this.state.imageFileUri
			}
			else if (typeof this.props.chefs_details[`chef${this.props.loggedInChef.id}`].chef == 'object' && this.props.chefs_details[`chef${this.props.loggedInChef.id}`].chef.image_url?.length > 0) {
				imageSource = this.props.chefs_details[`chef${this.props.loggedInChef.id}`].chef.image_url
			}
			return (
				<PicSourceChooser
					saveImage={this.saveImage}
					sourceChosen={this.sourceChosen}
					key={"pic-chooser"}
					imageSource={imageSource}
					originalImage={imageSource}
					cancelChooseImage={this.cancelChooseImage}
				/>
			)
		}

		renderChefEditor = () => {
			const chef_details = this.props.chefs_details[`chef${this.props.loggedInChef.id}`]
			return (
				<ChefEditor
					editingChef={this.editingChef}
					{...chef_details}
					chefUpdated={this.chefUpdated}
					deleteChefAccount={this.deleteChefAccount}
					closeDeleteChefOption={this.closeDeleteChefOption}
					showDeleteChefOption={this.showDeleteChefOption}
					choosePicture={this.choosePicture}
					isAwaitingServer={this.isAwaitingServer}
					stayingLoggedIn={this.props.stayingLoggedIn}
					imageFileUri={this.state.imageFileUri}
				/>
			)
		}

		isAwaitingServer = (isAwaitingServer) => (
			this.setState({ awaitingServer: isAwaitingServer })
		)

		deleteChefAccount = async (deleteRecipes) => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				const chef = this.props.loggedInChef
				const deletedChef = await destroyChef(chef.auth_token, chef.id, deleteRecipes)
				if (deletedChef) {
					AsyncStorage.removeItem('chef', () => { })
					this.props.setLoadedAndLoggedIn({ loaded: true, loggedIn: false })
				}
			} else {
				this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState })
			}
		}

		renderChefUpdatedAlertPopUp = () => {
			return (
				<AlertPopUp
					// close={() => this.setState({ chefUpdatedMessageShowing: false })}
					title={"Your profile has been updated"}
					yesText={"Ok"}
					onYes={() => this.setState({ chefUpdatedMessageShowing: false })}
				/>
			)
		}

		renderAreYouSureDeleteEverythingAlertPopUp = () => {
			return (
				<AlertPopUp
					close={() => this.setState({ areYouSureDeleteEverythingMessageShowing: false })}
					title={"Last Chance! Are you sure you close your account?"}
					onYes={() => this.deleteChefAccount(true)}
				/>
			)
		}

		renderAreYouSureLeaveRecipesAlertPopUp = () => {
			return (
				<AlertPopUp
					close={() => this.setState({ areYouSureLeaveRecipesMessageShowing: false })}
					title={"Last Chance! Are you sure you close your account?"}
					onYes={() => this.deleteChefAccount(false)}
				/>
			)
		}

		// manualBackupDatabase = async () => {
		// 	const confirmation = await getDatabaseBackup(this.props.loggedInChef.auth_token, "manual")
		// 	confirmation ? console.log("database manually backed up") : console.log("database backup failed or not permitted")
		// }

		// autoBackupDatabase = async () => {
		// 	const confirmation = await getDatabaseBackup(this.props.loggedInChef.auth_token, "auto")
		// 	confirmation ? console.log("database auto backup cycle started") : console.log("database auto backup cycle failed or not permitted")
		// }

		// autoBackupDatabaseStop = async() => {
		//   const confirmation = await getDatabaseBackup(this.props.loggedInChef.auth_token, "stop")
		//   confirmation ? console.log("database auto backup cycle stopped") : console.log("database auto backup stop failed or not permitted")
		// }

		// restorePrimaryDatabase = async () => {
		// 	const confirmation = await getDatabaseRestore(this.props.loggedInChef.auth_token, "primary")
		// 	confirmation ? console.log("database restored from primary backup") : console.log("primary backup restore failed or not permitted")
		// }

		// restoreSecondaryDatabase = async () => {
		// 	const confirmation = await getDatabaseRestore(this.props.loggedInChef.auth_token, "secondary")
		// 	confirmation ? console.log("database restored from secondary backup") : console.log("secondary backup restore failed or not permitted")
		// }

		// renderDatabaseButtons = () => {
		// 	return (
		// 		<React.Fragment>
		// 			<TouchableOpacity style={styles.dbManualBackupButton} activeOpacity={0.7} onPress={this.manualBackupDatabase}>
		// 				<Icon name='database-plus' size={responsiveHeight(3.5)} style={styles.filterIcon} />
		// 			</TouchableOpacity>
		// 			<TouchableOpacity style={styles.dbAutoBackupButton} activeOpacity={0.7} onPress={this.autoBackupDatabase}>
		// 				<Icon name='database-refresh' size={responsiveHeight(3.5)} style={styles.filterIcon} />
		// 			</TouchableOpacity>
		// 			{/* <TouchableOpacity style={styles.dbAutoBackupStopButton} activeOpacity={0.7} onPress={this.autoBackupDatabaseStop}>
		//         <Icon name='database-remove' size={responsiveHeight(3.5)} style={styles.filterIcon}/>
		//       </TouchableOpacity> */}
		// 			<TouchableOpacity style={styles.dbPrimaryRestoreButton} activeOpacity={0.7} onPress={this.restorePrimaryDatabase}>
		// 				<Icon name='database-export' size={responsiveHeight(3.5)} style={styles.filterIcon} />
		// 			</TouchableOpacity>
		// 			<TouchableOpacity style={styles.dbSecondaryRestoreButton} activeOpacity={0.7} onPress={this.restoreSecondaryDatabase}>
		// 				<Icon name='database-import' size={responsiveHeight(3.5)} style={styles.filterIcon} />
		// 			</TouchableOpacity>
		// 		</React.Fragment>

		// 	)
		// }

		render() {
			if (this.props.chefs_details[`chef${this.props.loggedInChef.id}`] !== undefined) {
				const chef_details = this.props.chefs_details[`chef${this.props.loggedInChef.id}`]
				// console.log(chef_details.chef)
				return (
					<SpinachAppContainer awaitingServer={this.state.awaitingServer} scrollingEnabled={true}>
						{this.state.renderOfflineMessage && (
							<OfflineMessage
								message={`Sorry, can't do that right now.${"\n"}You appear to be offline.`}
								topOffset={'10%'}
								clearOfflineMessage={() => this.setState({ renderOfflineMessage: false })}
								diagnostics={this.props.loggedInChef.is_admin ? this.state.offlineDiagnostics : null}
							/>)
						}
						{this.state.dynamicMenuShowing && this.renderDynamicMenu()}
						{this.state.chefUpdatedMessageShowing && this.renderChefUpdatedAlertPopUp()}
						{this.state.editingChef && this.renderChefEditor()}
						{/* {this.props.loggedInChef.is_admin ? this.renderDatabaseButtons() : null} */}
						{this.state.choosingPicture && this.renderPictureChooser()}
						{this.state.deleteChefOptionVisible && this.renderDeleteChefOption()}
						{this.state.areYouSureDeleteEverythingMessageShowing && this.renderAreYouSureDeleteEverythingAlertPopUp()}
						{this.state.areYouSureLeaveRecipesMessageShowing && this.renderAreYouSureLeaveRecipesAlertPopUp()}
						<ChefDetailsCard
							{...chef_details}
							email={chef_details.chef.email}
							image_url={chef_details.chef.image_url}
						/>
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
