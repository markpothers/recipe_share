import React from 'react'
import { Modal, Text, View, ScrollView, KeyboardAvoidingView, TouchableOpacity, Dimensions, TextInput, Platform } from 'react-native'
import { styles } from './chefEditorStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux'
import { countries } from '../dataComponents/countries'
import { patchChef } from '../fetches/patchChef'
import DualOSPicker from '../functionalComponents/DualOSPicker'
import { centralStyles } from '../centralStyleSheet'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

const mapStateToProps = (state) => ({
	username: state.newUserDetails.username,
	password: state.newUserDetails.password,
	password_confirmation: state.newUserDetails.password_confirmation,
	country: state.newUserDetails.country,
	imageBase64: state.newUserDetails.image_url,
	profile_text: state.newUserDetails.profile_text,
	loggedInChef: state.loggedInChef,
	stayingLoggedIn: state.stayLoggedIn,
})

const mapDispatchToProps = {
	saveChefDetails: (parameter, content) => {
		return dispatch => {
			dispatch({ type: 'UPDATE_NEW_USER_DETAILS', parameter: parameter, content: content })
		}
	},
	clearNewUserDetails: () => {
		return dispatch => {
			dispatch({ type: 'CLEAR_NEW_USER_DETAILS' })
		}
	},
	updateLoggedInChefInState: (id, username, auth_token, image_url, is_admin) => {
		return dispatch => {
			dispatch({ type: 'UPDATE_LOGGED_IN_CHEF', id: id, username: username, auth_token: auth_token, image_url: image_url, is_admin: is_admin })
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	class chefEditor extends React.PureComponent {

		state = {
			errors: [],
			updatingPassword: false,
			updateModalVisible: true,
		}

		componentDidMount = () => {
			this.populateBoxes()
		}

		populateBoxes = () => {
			this.props.username == "" ? this.updateChef(this.props.chef.username, "username") : null
			this.props.profile_text == "" ? this.updateChef(this.props.chef.profile_text, "profile_text") : null
			this.props.country == "United States" ? this.updateChef(this.props.chef.country, "country") : null
		}

		renderPasswordError = () => {
			const passwordErrors = this.state.errors.filter(message => message.startsWith("Password"))
			return passwordErrors.map(error => (
				<View style={[centralStyles.formErrorView, { width: '90%' }]} key={error}>
					<Text maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>{error}</Text>
				</View>
			))
		}

		renderNewPasswordOptions = () => {
			return (
				<React.Fragment>
					<View style={[centralStyles.formSection, { width: '90%' }]}>
						<View style={centralStyles.formInputContainer} >
							<TextInput maxFontSizeMultiplier={2} style={centralStyles.formInput} value={this.props.password} placeholder="password" autoCapitalize="none" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password")} />
						</View>
					</View>
					<View style={[centralStyles.formSection, { width: '90%' }]}>
						<View style={centralStyles.formInputContainer} >
							<TextInput maxFontSizeMultiplier={2} style={centralStyles.formInput} value={this.props.password_confirmation} placeholder="confirm password" autoCapitalize="none" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password_confirmation")} />
						</View>
					</View>
				</React.Fragment>
			)
		}

		renderNewPasswordButton = () => {
			return (
				<View style={[centralStyles.formSection, { width: '90%' }]}>
					<View style={[centralStyles.formInputContainer, { justifyContent: 'center' }]}>
						<TouchableOpacity style={[centralStyles.yellowRectangleButton]} activeOpacity={0.7} title="clearFilters" onPress={this.handleChangePasswordButton}>
							<Icon style={centralStyles.greenButtonIcon} size={25} name='lock-open' />
							<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>Update{"\n"}password</Text>
						</TouchableOpacity>
					</View>
				</View>
			)
		}

		handleChangePasswordButton = () => {
			this.setState({ updatingPassword: true })
		}

		handleTextInput = (e, parameter) => {
			this.props.saveChefDetails(parameter, e.nativeEvent.text)
		}

		updateChef = (value, parameter) => {
			this.props.saveChefDetails(parameter, value)
		}

		cancelUpdate = () => {
			this.props.clearNewUserDetails()
			this.props.chefUpdated(false)
		}

		saveUpdatedChef = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				const chef = this.props.loggedInChef
				const updatedChef = await patchChef(chef.id, chef.auth_token, this.props.username, this.props.profile_text, this.props.country, this.state.updatingPassword, this.props.password, this.props.password_confirmation, this.props.imageBase64)
				if (updatedChef) {
					// console.log(updatedChef)
					if (updatedChef.error) {
						this.setState({ errors: updatedChef.message })
					} else {
						if (this.state.stayingLoggedIn) {
							AsyncStorage.setItem('chef', JSON.stringify(updatedChef), () => {
								AsyncStorage.getItem('chef', (err, res) => {
									console.log(err)
									this.props.updateLoggedInChefInState(updatedChef.id, updatedChef.username, updatedChef.auth_token, updatedChef.image_url, updatedChef.is_admin, updatedChef.is_member)
									this.props.clearNewUserDetails()
									this.props.chefUpdated()
								})
							})
						} else {
							this.props.updateLoggedInChefInState(updatedChef.id, updatedChef.username, updatedChef.auth_token, updatedChef.image_url, updatedChef.is_admin, updatedChef.is_member)
							this.props.clearNewUserDetails()
							this.props.chefUpdated(true)
						}
					}
				}
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		closeDeleteChefOption = () => {
			this.setState({ deleteChefOptionVisible: false })
		}

		onCountryChange = (choice) => {
			this.props.saveChefDetails("country", choice)
		}

		closeIOSPicker = () => {
			this.setState({ IOSPickerShowing: false })
		}

		renderContents = () => {
			return (
				<ScrollView>
					{this.state.renderOfflineMessage && (
						<OfflineMessage
							message={`Sorry, can't do that right now.${"\n"}You appear to be offline.`}
							topOffset={'10%'}
							clearOfflineMessage={() => this.setState({ renderOfflineMessage: false })}
						/>)
					}
					<View style={[styles.modalFullScreenContainer, {
						height: Dimensions.get('window').height,
						width: Dimensions.get('window').width,
					}]}>
						<View style={styles.contentsContainer}>
							<View style={styles.titleContainer}>
								<Text maxFontSizeMultiplier={2} style={styles.title}>Update your profile & password</Text>
							</View>
							<View style={[centralStyles.formSection, { width: '90%' }]}>
								<View style={centralStyles.formInputContainer}>
									<TextInput maxFontSizeMultiplier={2} style={centralStyles.formInput} value={this.props.username} placeholder="username" autoCapitalize="none" onChange={(e) => this.handleTextInput(e, "username")} />
								</View>
							</View>
							<View style={[centralStyles.formSection, { width: '90%' }]}>
								<View style={centralStyles.formInputContainer} >
									<TextInput maxFontSizeMultiplier={2} style={[centralStyles.formInput, {}]} value={this.props.profile_text} placeholder="about me" multiline={true} numberOfLines={3} onChange={(e) => this.handleTextInput(e, "profile_text")} />
								</View>
							</View>
							<View style={[centralStyles.formSection, { width: '90%' }]}>
								<View picker style={styles.countryPicker}>
									<DualOSPicker
										onChoiceChange={this.onCountryChange}
										options={countries}
										selectedChoice={this.props.country} />
								</View>
							</View>
							{this.state.updatingPassword ? this.renderNewPasswordOptions() : null}
							{!this.state.updatingPassword ? this.renderNewPasswordButton() : null}
							{this.renderPasswordError()}
							<View style={[centralStyles.formSection, { width: '90%' }]}>
								<View style={centralStyles.formInputContainer}>
									<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} title="change_picture" onPress={this.props.choosePicture}>
										<Icon style={centralStyles.greenButtonIcon} size={25} name='camera' />
										<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>Update{"\n"}picture</Text>
									</TouchableOpacity>
									<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} title="clearFilters" onPress={this.props.showDeleteChefOption}>
										<Icon style={centralStyles.greenButtonIcon} size={25} name='account-remove' />
										<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>Delete {"\n"} account</Text>
									</TouchableOpacity>
								</View>
							</View>
							<View style={[centralStyles.formSection, { width: '90%' }]}>
								<View style={centralStyles.formInputContainer}>
									<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} title="clearFilters" onPress={this.cancelUpdate}>
										<Icon style={centralStyles.greenButtonIcon} size={25} name='cancel' />
										<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>Cancel</Text>
									</TouchableOpacity>
									<TouchableOpacity style={centralStyles.greenRectangleButton} activeOpacity={0.7} title="applyFilters" onPress={this.saveUpdatedChef}>
										<Icon style={centralStyles.yellowButtonIcon} size={25} name='check' />
										<Text maxFontSizeMultiplier={2} style={centralStyles.yellowButtonText}>Save</Text>
									</TouchableOpacity>
								</View>
							</View>
							<View style={styles.bottomSpacer}>
							</View>
						</View>
					</View>
				</ScrollView>
			)
		}

		render() {
			// console.log(this.props)
			if (Platform.OS === 'ios') {
				return (
					<Modal
						animationType="fade"
						transparent={true}
						visible={this.state.updateModalVisible}
					>
						<KeyboardAvoidingView>
							{this.renderContents()}
						</KeyboardAvoidingView>
					</Modal>
				)
			} else {
				return (
					<Modal
						animationType="fade"
						transparent={true}
						visible={this.state.updateModalVisible}
					>
						{this.renderContents()}
					</Modal>
				)
			}
		}
	}
)
