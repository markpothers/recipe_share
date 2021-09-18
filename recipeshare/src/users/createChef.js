import React from 'react'
import { Text, TouchableOpacity, TextInput, View, Linking, Keyboard } from 'react-native'
import { countries } from '../dataComponents/countries'
import { connect } from 'react-redux'
import { postChef } from '../fetches/postChef'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import PicSourceChooser from '../picSourceChooser/picSourceChooser'
import { TextPopUp } from '../textPopUp/textPopUp'
import DualOSPicker from '../dualOSPicker/DualOSPicker'
import { termsAndConditions } from '../dataComponents/termsAndConditions'
import { privacyPolicy } from '../dataComponents/privacyPolicy'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions' //eslint-disable-line no-unused-vars
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
import OfflineMessage from '../offlineMessage/offlineMessage'
import SwitchSized from '../customComponents/switchSized/switchSized'
import { apiCall } from '../auxFunctions/apiCall'

const mapStateToProps = (state) => ({
	first_name: state.newUserDetails.first_name,
	last_name: state.newUserDetails.last_name,
	username: state.newUserDetails.username,
	e_mail: state.newUserDetails.e_mail,
	password: state.newUserDetails.password,
	password_confirmation: state.newUserDetails.password_confirmation,
	country: state.newUserDetails.country,
	image_url: state.newUserDetails.image_url,
	profile_text: state.newUserDetails.profile_text,
	loggedInChef: state.loggedInChef
})

const mapDispatchToProps = {
	saveChefDetails: (parameter, content) => {
		return dispatch => {
			dispatch({ type: 'UPDATE_NEW_USER_DETAILS', parameter: parameter, content: content })
		}
	},
	saveLoginChefDetails: (parameter, content) => {
		return dispatch => {
			dispatch({ type: 'UPDATE_LOGIN_USER_DETAILS', parameter: parameter, content: content })
		}
	},
}

export default connect(mapStateToProps, mapDispatchToProps)(
	class CreateChef extends React.Component {

		state = {
			hasPermission: false,
			errors: [],
			choosingPicture: false,
			tAndCAgreed: false,
			privacyPolicyAgreed: false,
			viewingTermsAndConditions: false,
			viewingPrivacyPolicy: false,
			awaitingServer: false,
			thanksForRegisteringPopUpShowing: false,
			passwordVisible: false,
			renderOfflineMessage: false,
			offlineDiagnostics: '',
		}

		componentDidMount = () => {
			if (this.props.route.params?.successfulLogin == true) {
				this.props.setLoadedAndLoggedIn({ loaded: true, loggedIn: true })
			}
		}

		componentDidUpdate = () => {
			if (this.props.route.params?.successfulLogin == true) {
				this.props.setLoadedAndLoggedIn({ loaded: true, loggedIn: true })
			}
		}

		handleTextInput = (text, parameter) => {
			this.props.saveChefDetails(parameter, text)
			if (parameter == 'e_mail') {
				this.props.saveLoginChefDetails(parameter, text)
			}
		}

		choosePicture = () => { this.setState({ choosingPicture: true }) }

		sourceChosen = () => { this.setState({ choosingPicture: false }) }

		renderPictureChooser = () => {
			let imageSource = this.props.image_url
			return (
				<PicSourceChooser
					saveImage={this.saveImage}
					sourceChosen={this.sourceChosen}
					key={"pic-chooser"}
					imageSource={imageSource}
					originalImage={this.props.image_url}
					cancelChooseImage={this.cancelChooseImage}
				/>
			)
		}

		saveImage = async (image) => {
			if (image.cancelled === false) {
				this.props.saveChefDetails("image_url", image.uri)
			}
		}

		cancelChooseImage = (image) => {
			this.props.saveChefDetails("image_url", image)
		}

		submitChef = async () => {
			this.setState({ awaitingServer: true }, async () => {
				let response = await apiCall(postChef, this.props.username, this.props.e_mail, this.props.password, this.props.password_confirmation, this.props.country, this.props.image_url, this.props.profile_text)
				if (response.fail) {
					this.setState({
						renderOfflineMessage: true,
						offlineDiagnostics: response,
						awaitingServer: false
					})
				} else if (response.error) {
					this.setState({
						errors: response.messages,
						awaitingServer: false
					})
				} else {
					this.setState({ awaitingServer: false }, () => {
						this.props.navigation.navigate('Login', { successfulRegistration: true })
					})
				}
			})
		}

		renderEmailError = () => {
			const emailErrors = this.state.errors.filter(message => message.startsWith("E mail"))
			return emailErrors.map(error => (
				<View style={centralStyles.formErrorView} key={error}>
					<Text
						maxFontSizeMultiplier={2}
						style={centralStyles.formErrorText}
						testID={'emailError'}
					>{error}</Text>
				</View>
			))
		}

		renderUsernameError = () => {
			const usernameErrors = this.state.errors.filter(message => message.startsWith("Username"))
			return usernameErrors.map(error => (
				<View style={centralStyles.formErrorView} key={error}>
					<Text
						maxFontSizeMultiplier={2}
						style={centralStyles.formErrorText}
						testID={'usernameError'}
					>{error}</Text>
				</View>
			))
		}

		renderPasswordError = () => {
			const passwordErrors = this.state.errors.filter(message => message.startsWith("Password"))
			return passwordErrors.map(error => (
				<View style={centralStyles.formErrorView} key={error}>
					<Text
						maxFontSizeMultiplier={2}
						style={centralStyles.formErrorText}
						testID={'passwordError'}
					>{error}</Text>
				</View>
			))
		}

		onCountryChange = (choice) => {
			this.props.saveChefDetails("country", choice)
		}

		handleTandCSwitch = () => {
			this.setState(state => ({ tAndCAgreed: !state.tAndCAgreed }))
		}

		handlePrivacyPolicySwitch = () => {
			this.setState(state => ({ privacyPolicyAgreed: !state.privacyPolicyAgreed }))
		}

		render() {
			// console.log(this.props.saveChefDetails)
			return (
				<SpinachAppContainer scrollingEnabled={true} awaitingServer={this.state.awaitingServer}>
					<TouchableOpacity
						activeOpacity={1}
						onPress={Keyboard.dismiss}
						style={{ flex: 1 }}
					>
						{this.state.renderOfflineMessage && (
							<OfflineMessage
								message={`Sorry, can't do right now.${"\n"}You appear to be offline.`}
								topOffset={'10%'}
								clearOfflineMessage={() => this.setState({ renderOfflineMessage: false })}
								//diagnostics={this.state.offlineDiagnostics}
							/>)
						}
						{this.state.choosingPicture ? this.renderPictureChooser() : null}
						<View style={[centralStyles.formContainer, { marginTop: responsiveHeight(5) }]}>
							{/* title */}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<View style={centralStyles.formInputWhiteBackground}>
										<Text maxFontSizeMultiplier={2} style={centralStyles.formTitle}>Please register and click the link in your confirmation e-mail!</Text>
									</View>
								</View>
							</View>
							{/* e-mail*/}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<View style={centralStyles.formInputWhiteBackground}>
										<TextInput
											maxFontSizeMultiplier={2}
											style={centralStyles.formInput}
											value={this.props.e_mail}
											placeholder="e-mail"
											keyboardType="email-address"
											autoCapitalize="none"
											autoCompleteType="email"
											textContentType="username"
											onChangeText={text => this.handleTextInput(text, "e_mail")}
											testID={'emailInput'}
										/>
									</View>
								</View>
								{this.renderEmailError()}
							</View>
							{/* username*/}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<View style={centralStyles.formInputWhiteBackground}>
										<TextInput
											maxFontSizeMultiplier={2}
											style={centralStyles.formInput}
											value={this.props.username}
											placeholder="username"
											autoCapitalize="none"
											onChangeText={text => this.handleTextInput(text, "username")}
											testID={'usernameInput'}
										/>
									</View>
								</View>
								{this.renderUsernameError()}
							</View>
							{/* country */}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<View style={centralStyles.pickerContainer}>
										<DualOSPicker
											onChoiceChange={this.onCountryChange}
											options={countries}
											selectedChoice={this.props.country}
											textAlignment={"flex-start"}
											testID={'countryPicker'}
										/>
									</View>
								</View>
							</View>
							{/* profile*/}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<View style={[centralStyles.formInputWhiteBackground, { minHeight: responsiveHeight(12) }]}>
										<TextInput
											maxFontSizeMultiplier={2}
											style={centralStyles.formInput}
											value={this.props.profile_text}
											placeholder="about me"
											multiline={true}
											numberOfLines={3}
											onChangeText={text => this.handleTextInput(text, "profile_text")}
											testID={'profileInput'}
										/>
									</View>
								</View>
							</View>
							{/* password*/}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<View style={centralStyles.formInputWhiteBackground}>
										<TextInput
											maxFontSizeMultiplier={2}
											style={centralStyles.formInput}
											value={this.props.password}
											placeholder="password"
											textContentType="password"
											autoCapitalize="none"
											autoCompleteType="password"
											secureTextEntry={!this.state.passwordVisible}
											onChangeText={text => this.handleTextInput(text, "password")}
											testID={'passwordInput'}
										/>
										<TouchableOpacity
											style={centralStyles.hiddenToggle}
											onPress={() => this.setState({ passwordVisible: !this.state.passwordVisible })}
											testID={'visibilityButton'}
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
							{/* password confirmation*/}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<View style={centralStyles.formInputWhiteBackground}>
										<TextInput maxFontSizeMultiplier={2}
											style={centralStyles.formInput}
											value={this.props.password_confirmation}
											placeholder="password confirmation"
											autoCompleteType="password"
											textContentType="newPassword"
											autoCapitalize="none"
											secureTextEntry={!this.state.passwordVisible}
											onChangeText={text => this.handleTextInput(text, "password_confirmation")}
											testID={'passwordConfirmationInput'}
										/>
									</View>
								</View>
								{this.renderPasswordError()}
							</View>
							{/* view terms and conditions*/}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<TouchableOpacity
										style={[centralStyles.yellowRectangleButton, { maxWidth: responsiveWidth(49), width:responsiveWidth(49), justifyContent: 'flex-start', paddingHorizontal: responsiveWidth(1) }]}
										activeOpacity={0.7}
										onPress={() => this.setState({ viewingTermsAndConditions: true })}
										testID={'viewTAndCButton'}
									>
										<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>{`View Terms & Conditions`}</Text>
									</TouchableOpacity>
									<TouchableOpacity
										activeOpacity={1}
										style={[centralStyles.yellowRectangleButton, { minWidth: responsiveWidth(30), maxWidth: responsiveWidth(30) }]}
										onPress={this.handleTandCSwitch}
										testID={'tAndCAgreedButton'}
									>
										<View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
											<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>I accept</Text>
											<SwitchSized
												value={this.state.tAndCAgreed}
												onValueChange={this.handleTandCSwitch}
												testID={'tAndCAgreedToggle'}
											/>
										</View>
									</TouchableOpacity>
									{this.state.viewingTermsAndConditions && (
										<TextPopUp
											close={() => this.setState({ viewingTermsAndConditions: false })}
											title={`Terms and Conditions`}
											text={termsAndConditions}
										>
											<View style={{ flexDirection: 'row', marginLeft: responsiveWidth(2) }}>
												<TouchableOpacity
													onPress={() => Linking.openURL('mailto:admin@recipe-share.com?subject=Terms%20And%20Conditions%20Question')}
													testID={'emailTAndCButton'}
												>
													<Text style={{ color: 'blue' }}>admin@recipe-share.com{"\r\r"}</Text>
												</TouchableOpacity>
											</View>
										</TextPopUp>
									)}
								</View>
							</View>
							{/* view privacy policy*/}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<TouchableOpacity
										style={[centralStyles.yellowRectangleButton, { maxWidth: responsiveWidth(49), width:responsiveWidth(49), justifyContent: 'flex-start', paddingHorizontal: responsiveWidth(1) }]}
										activeOpacity={0.7}
										onPress={() => this.setState({ viewingPrivacyPolicy: true })}
										testID={'viewPrivacyPolicyButton'}
									>
										<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>{`View Privacy Policy`}</Text>
									</TouchableOpacity>
									<TouchableOpacity
										activeOpacity={1}
										style={[centralStyles.yellowRectangleButton, { minWidth: responsiveWidth(30), maxWidth: responsiveWidth(30) }]}
										onPress={this.handlePrivacyPolicySwitch}
										testID={'privacyPolicyAgreedButton'}
									>
										<View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
											<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>I accept</Text>
											<SwitchSized
												value={this.state.privacyPolicyAgreed}
												onValueChange={this.handlePrivacyPolicySwitch}
												testID={'privacyPolicyAgreedToggle'}
											/>
										</View>
									</TouchableOpacity>
									{this.state.viewingPrivacyPolicy && (
										<TextPopUp
											close={() => this.setState({ viewingPrivacyPolicy: false })}
											title={`Privacy Policy`}
											text={privacyPolicy}
										>
											<View style={{ flexDirection: 'row', marginLeft: responsiveWidth(2) }}>
												<Text>* By email: </Text>
												<TouchableOpacity
													onPress={() => Linking.openURL('mailto:admin@recipe-share.com?subject=Privacy%20Policy%20Question')}
													testID={'emailPrivacyPolicyButton'}
												><Text style={{ color: 'blue' }}>admin@recipe-share.com{"\r\r"}</Text>
												</TouchableOpacity>
											</View>
										</TextPopUp>
									)}
								</View>
							</View>
							{/* choose picture */}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<TouchableOpacity
										style={[centralStyles.yellowRectangleButton, { justifyContent: 'center', maxWidth: '100%', width: '100%' }]}
										activeOpacity={0.7}
										onPress={this.choosePicture}
										testID={'pictureButton'}
									>
										<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='camera'></Icon>
										<Text maxFontSizeMultiplier={2} style={[centralStyles.greenButtonText, { marginLeft: responsiveWidth(3) }]}>Add profile picture</Text>
									</TouchableOpacity>
								</View>
							</View>
							{/* return / log in */}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<TouchableOpacity
										style={centralStyles.yellowRectangleButton}
										activeOpacity={0.7}
										onPress={() => this.props.navigation.navigate('Login')}
										testID={'loginButton'}
									>
										<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='login'></Icon>
										<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>Return to{"\n"} login screen</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={centralStyles.yellowRectangleButton}
										activeOpacity={(this.state.tAndCAgreed && this.state.privacyPolicyAgreed ? 0.7 : 1)}
										onPress={(this.state.tAndCAgreed && this.state.privacyPolicyAgreed ? this.submitChef : null)}
										testID='submitButton'
									>
										<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='login'></Icon>
										<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>{(this.state.tAndCAgreed ? (this.state.privacyPolicyAgreed ? "Submit &\n go to log in" : "Please accept\nprivacy policy") : "Please\naccept T&C")}</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</TouchableOpacity>
				</SpinachAppContainer>
			)
		}
	}
)
