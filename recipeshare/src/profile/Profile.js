import React from 'react';
import { connect } from 'react-redux'
import { styles } from './profileStyleSheet'
import { centralStyles } from '../centralStyleSheet'
import { View, ImageBackground, TouchableOpacity, ActivityIndicator, AsyncStorage, Platform } from 'react-native'
import ChefDetailsCard from '../chefDetails/ChefDetailsCard'
import { getChefDetails } from '../fetches/getChefDetails'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ChefEditor from './chefEditor'
import { getDatabaseBackup } from '../fetches/getDatabaseBackup'
import { getDatabaseRestore } from '../fetches/getDatabaseRestore'
import DeleteChefOption from './deleteChefOption'
import PicSourceChooser from '../functionalComponents/picSourceChooser'
import { destroyChef } from '../fetches/destroyChef'
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import OfflineMessage from '../offlineMessage/offlineMessage'
import NetInfo from '@react-native-community/netinfo';

const mapStateToProps = (state) => ({
	loggedInChef: state.loggedInChef,
	chefs_details: state.chefs_details,
	imageBase64: state.newUserDetails.image_url,
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
		}

		componentDidMount = () => {
			this.fetchChefDetails()
			this._unsubscribeFocus = this.props.navigation.addListener('focus', () => {
				this.respondToFocus()
			})
		}

		componentWillUnmount = () => {
			this._unsubscribeFocus()
		}

		respondToFocus = async () => {
			await this.fetchChefDetails()
		}

		fetchChefDetails = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
				const chef_details = await getChefDetails(this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
				if (chef_details) {
					this.props.storeChefDetails(chef_details)
				}
				await this.setState({ awaitingServer: false })
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		editingChef = async() => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				this.setState({ editingChef: true })
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		chefUpdated = (chefChanged) => {
			this.setState({ editingChef: false })
			chefChanged ? this.fetchChefDetails() : null
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
				editingChef: true
			})
		}

		renderDeleteChefOption = () => {
			return (
				<DeleteChefOption
					// deleteAndLeaveRecipes={this.deleteAndLeaveRecipes}
					deleteChefAccount={this.deleteChefAccount}
					closeDeleteChefOptions={this.closeDeleteChefOption}
					closeDeleteChefOption={this.closeDeleteChefOption}
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
			})
		}

		saveImage = async (image) => {
			if (image.cancelled === false) {
				this.props.saveChefDetails("image_url", image.base64)
			}
		}

		renderPictureChooser = () => {
			let imageSource
			if (this.props.imageBase64 != '') {
				imageSource = `data:image/jpeg;base64,${this.props.imageBase64}`
			} else if (typeof this.props.chefs_details[`chef${this.props.loggedInChef.id}`].chef == 'object' && this.props.chefs_details[`chef${this.props.loggedInChef.id}`].chef.image_url.length > 0) {
				imageSource = this.props.chefs_details[`chef${this.props.loggedInChef.id}`].chef.image_url
			} else {
				imageSource = 'data:image/jpeg;base64,'
			}
			return <PicSourceChooser saveImage={this.saveImage} sourceChosen={this.sourceChosen} key={"pic-chooser"} imageSource={imageSource} />
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
				/>
			)
		}

		deleteChefAccount = async (deleteRecipes) => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				const chef = this.props.loggedInChef
				const deletedChef = await destroyChef(chef.auth_token, chef.id, deleteRecipes)
				if (deletedChef) {
					AsyncStorage.removeItem('chef', () => { })
					this.props.navigation.navigate('Login')
				}
			} else {
				this.setState({ renderOfflineMessage: true })
			}
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
				return (
					<SpinachAppContainer awaitingServer={this.state.awaitingServer} scrollingEnabled={true}>
						{this.state.renderOfflineMessage && (
							<OfflineMessage
								message={`Sorry, can't do that right now.${"\n"}You appear to be offline.`}
								topOffset={'10%'}
								clearOfflineMessage={() => this.setState({ renderOfflineMessage: false })}
							/>)
						}
						{this.state.editingChef ? this.renderChefEditor() : null}
						{/* {this.props.loggedInChef.is_admin ? this.renderDatabaseButtons() : null} */}
						{this.state.choosingPicture ? this.renderPictureChooser() : null}
						{this.state.deleteChefOptionVisible ? this.renderDeleteChefOption() : null}
						<ChefDetailsCard editChef={this.editingChef} myProfile={true} {...chef_details} image_url={chef_details.chef.image_url} />
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
