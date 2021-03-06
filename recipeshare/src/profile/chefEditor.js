import React from 'react'
import { Modal, Text, View, ScrollView, KeyboardAvoidingView, TouchableOpacity, TextInput, Platform, AsyncStorage } from 'react-native'
import { styles } from './chefEditorStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux'
import { countries } from '../dataComponents/countries'
import { patchChef } from '../fetches/patchChef'
import DualOSPicker from '../dualOSPicker/DualOSPicker'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import NetInfo from '@react-native-community/netinfo';
import OfflineMessage from '../offlineMessage/offlineMessage'

const mapStateToProps = (state) => ({
	e_mail: state.newUserDetails.e_mail,
	username: state.newUserDetails.username,
	password: state.newUserDetails.password,
	password_confirmation: state.newUserDetails.password_confirmation,
	country: state.newUserDetails.country,
	image_url: state.newUserDetails.image_url,
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
	updateLoggedInChefInState: (id, e_mail, username, auth_token, image_url, is_admin) => {
		return dispatch => {
			dispatch({ type: 'UPDATE_LOGGED_IN_CHEF', id: id, e_mail: e_mail, username: username, auth_token: auth_token, image_url: image_url, is_admin: is_admin })
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	class chefEditor extends React.PureComponent {

		state = {
			errors: [],
			updatingPassword: false,
			updateModalVisible: true,
			passwordVisible: false,
			profileEditable: false,
			profileEditableButtonZIndex: 1
		}

		componentDidMount = () => {
			this.populateBoxes()
		}

		populateBoxes = () => {
			this.props.username == "" ? this.updateChef(this.props.chef.username, "username") : null
			this.props.e_mail == "" ? this.updateChef(this.props.loggedInChef.e_mail, "e_mail") : null
			this.props.profile_text == "" ? this.updateChef(this.props.chef.profile_text, "profile_text") : null
			this.props.country == "United States" ? this.updateChef(this.props.chef.country, "country") : null
		}

		renderUsernameError = () => {
			const usernameError = this.state.errors.filter(message => message.startsWith("Username"))
			return usernameError.map(error => (
				<View style={[centralStyles.formErrorView, { width: '86%' }]} key={error}>
					<Text maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>{error}</Text>
				</View>
			))
		}

		renderPasswordError = () => {
			const passwordErrors = this.state.errors.filter(message => message.startsWith("Password"))
			return passwordErrors.map(error => (
				<View style={[centralStyles.formErrorView, { width: '86%' }]} key={error}>
					<Text maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>{error}</Text>
				</View>
			))
		}

		renderNewPasswordOptions = () => {
			return (
				<React.Fragment>
					<View style={[centralStyles.formSection, { width: '86%' }]}>
						<View style={centralStyles.formInputContainer} >
							<View style={centralStyles.formInputWhiteBackground}>
								<TextInput
									maxFontSizeMultiplier={2}
									style={centralStyles.formInput}
									value={this.props.password}
									placeholder="password"
									autoCapitalize="none"
									autoCompleteType="password"
									textContentType="password"
									secureTextEntry={!this.state.passwordVisible}
									onChange={(e) => this.handleTextInput(e, "password")} />
								<TouchableOpacity
									style={centralStyles.hiddenToggle}
									onPress={() => this.setState({ passwordVisible: !this.state.passwordVisible })}
								>
									<Icon
										style={centralStyles.hiddenToggleIcon}
										size={responsiveHeight(4)}
										name={this.state.passwordVisible ? "eye-off" : "eye"}
									>
									</Icon>
								</TouchableOpacity>
							</View>
						</View>
					</View>
					<View style={[centralStyles.formSection, { width: '86%' }]}>
						<View style={centralStyles.formInputContainer} >
							<View style={centralStyles.formInputWhiteBackground}>
								<TextInput
									maxFontSizeMultiplier={2}
									style={centralStyles.formInput}
									value={this.props.password_confirmation}
									placeholder="confirm password"
									autoCapitalize="none"
									autoCompleteType="password"
									textContentType="newPassword"
									secureTextEntry={!this.state.passwordVisible}
									onChange={(e) => this.handleTextInput(e, "password_confirmation")}
								/>
							</View>
						</View>
					</View>
				</React.Fragment>
			)
		}

		renderNewPasswordButton = () => {
			return (
				<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} title="clearFilters" onPress={() => this.handleChangePasswordButton(true)}>
					<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='lock-open' />
					<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>Update{"\n"}password</Text>
				</TouchableOpacity>
			)
		}

		renderCancelPasswordButton = () => {
			return (
				<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} title="clearFilters" onPress={() => this.handleChangePasswordButton(false)}>
					<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='lock' />
					<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>Keep current{"\n"}password</Text>
				</TouchableOpacity>
			)
		}

		handleChangePasswordButton = (change) => {
			this.setState({ updatingPassword: change })
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
				await this.setState({ updateModalVisible: false })
				this.props.isAwaitingServer(true)
				const chef = this.props.loggedInChef
				const updatedChef = await patchChef(chef.id, chef.auth_token, this.props.e_mail, this.props.username, this.props.profile_text, this.props.country, this.state.updatingPassword, this.props.password, this.props.password_confirmation, this.props.image_url)
				if (updatedChef) {
					// console.log(updatedChef)
					if (updatedChef.error) {
						this.props.isAwaitingServer(false)
						this.setState({
							updateModalVisible: true,
							errors: updatedChef.message
						})
					} else {
						if (this.props.stayingLoggedIn) {
							AsyncStorage.setItem('chef', JSON.stringify(updatedChef), () => {
								this.props.updateLoggedInChefInState(updatedChef.id, chef.e_mail, updatedChef.username, updatedChef.auth_token, updatedChef.image_url, updatedChef.is_admin, updatedChef.is_member)
								this.props.clearNewUserDetails()
								this.props.chefUpdated(true)
							})
						} else {
							this.props.updateLoggedInChefInState(updatedChef.id, chef.e_mail, updatedChef.username, updatedChef.auth_token, updatedChef.image_url, updatedChef.is_admin, updatedChef.is_member)
							this.props.clearNewUserDetails()
							this.props.chefUpdated(true)
						}
					}
				} else {
					this.setState({ updateModalVisible: true })
				}
			} else {
				this.setState({
					renderOfflineMessage: true,
					updateModalVisible: true
				})
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
			// console.log(this.props.loggedInChef.username)
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
						height: responsiveHeight(100),
						width: responsiveWidth(100),
					}]}>
						<View style={styles.contentsContainer}>
							<View style={styles.titleContainer}>
								<Text maxFontSizeMultiplier={2} style={styles.title}>Update your profile & password</Text>
							</View>
							<View style={[centralStyles.formSection, { width: '86%' }]}>
								<View style={centralStyles.formInputContainer}>
									<View style={[centralStyles.formInputWhiteBackground, { backgroundColor: '#dadada' }]}>
										<TextInput //this textInput is present for ios autofill.  Disabling it breaks autofill so the covering text field is there to prevent it being focused
											maxFontSizeMultiplier={2}
											style={centralStyles.formInput}
											value={this.props.e_mail}
											editable={Platform.OS == 'ios' ? true : false}
											ref={ref => this.emailInput = ref}
											placeholder="e-mail"
											keyboardType="email-address"
											autoCapitalize="none"
											autoCompleteType="email"
											textContentType="username"
											caretHidden={true}
										// onChange={(e) => this.handleTextInput(e, "e_mail")}
										/>
										<Text //this field covers the above input to prevent it being focused since directly disabling it breaks ios autofill
											style={[
												centralStyles.formInput,
												{
													position: 'absolute',
													height: '100%'
												}
											]}
										>
										</Text>
									</View>
								</View>
							</View>
							<View style={[centralStyles.formSection, { width: '86%' }]}>
								<View style={centralStyles.formInputContainer}>
									<View style={centralStyles.formInputWhiteBackground}>
										<TextInput
											maxFontSizeMultiplier={2}
											style={centralStyles.formInput}
											value={this.props.username}
											placeholder="username"
											autoCapitalize="none"
											onChange={(e) => this.handleTextInput(e, "username")}
										/>
									</View>
								</View>
							</View>
							{this.renderUsernameError()}
							<View style={[centralStyles.formSection, { width: '86%' }]}>
								<View style={centralStyles.formInputContainer} >
									<View style={centralStyles.formInputWhiteBackground}>
										<TextInput
											maxFontSizeMultiplier={2}
											style={centralStyles.formInput}
											value={this.props.profile_text}
											ref={ref => this.profileInput = ref}
											placeholder="about me"
											autoCompleteType="off"
											textContentType="none"
											// autoCapitalize="none"
											multiline={true}
											numberOfLines={3}
											// onFocus={()=> this.setState({profileEditable: true})}
											onBlur={async () => {
												await this.setState({
													profileEditable: false,
													profileEditableButtonZIndex: 1
												})
												await this.emailInput.focus()
												await this.emailInput.blur()
											}}
											editable={Platform.OS == 'ios' ? this.state.profileEditable : true}
											onChange={(e) => this.handleTextInput(e, "profile_text")}
										/>
										<TouchableOpacity //this button covers the profile input.  The trick here is that the profile input must be disabled else it breaks ios autofill
											//this button therefore enables and focuses on the input which upone completion disables itself and focuses briefly on the email
											//all of this gives priority to the email input for ios autofill to make strong password generate and save properly
											style={{ position: 'absolute', height: '100%', width: '100%', zIndex: this.state.profileEditableButtonZIndex }}
											activeOpacity={1}
											onPress={async () => {
												await this.setState({
													profileEditable: true,
													profileEditableButtonZIndex: -1
												})
												this.profileInput.focus()
											}}
										>
										</TouchableOpacity>
									</View>
								</View>
							</View>
							<View style={[centralStyles.formSection, { width: '86%' }]}>
								<View picker style={styles.countryPicker}>
									<DualOSPicker
										onChoiceChange={this.onCountryChange}
										options={countries}
										selectedChoice={this.props.country}
										textAlignment={"flex-start"}
									/>
								</View>
							</View>
							{this.state.updatingPassword && this.renderNewPasswordOptions()}
							{this.state.updatingPassword && this.renderPasswordError()}
							<View style={[centralStyles.formSection, { width: '100%' }]}>
								<View style={[centralStyles.formInputContainer, { justifyContent: 'space-evenly' }]}>
									{!this.state.updatingPassword ? this.renderNewPasswordButton() : this.renderCancelPasswordButton()}
									<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} title="change_picture" onPress={this.props.choosePicture}>
										<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='camera' />
										<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>Update{"\n"}picture</Text>
									</TouchableOpacity>
								</View>
							</View>
							<View style={[centralStyles.formSection, { width: '100%' }]}>
								<View style={[centralStyles.formInputContainer, { justifyContent: 'space-evenly' }]}>
									<TouchableOpacity style={[centralStyles.yellowRectangleButton, { backgroundColor: '#720000' }]} activeOpacity={0.7} title="clearFilters" onPress={this.cancelUpdate}>
										<Icon style={[centralStyles.greenButtonIcon, { color: '#fff59b' }]} size={responsiveHeight(4)} name='cancel' />
										<Text maxFontSizeMultiplier={2} style={[centralStyles.greenButtonText, { color: '#fff59b' }]}>Cancel</Text>
									</TouchableOpacity>
									<TouchableOpacity style={centralStyles.greenRectangleButton} activeOpacity={0.7} title="applyFilters" onPress={this.saveUpdatedChef}>
										<Icon style={centralStyles.yellowButtonIcon} size={responsiveHeight(4)} name='check' />
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
			// console.log(this.props.loggedInChef)
			if (Platform.OS === 'ios') {
				return (
					<Modal
						animationType="fade"
						transparent={true}
						visible={this.state.updateModalVisible}
					>
						<KeyboardAvoidingView
							behavior={(Platform.OS === "ios" ? "padding" : "")}
						>
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
