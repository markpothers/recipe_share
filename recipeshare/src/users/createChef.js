import React from 'react'
import { Platform, Text, TouchableOpacity, TextInput, View, Switch, Linking, Keyboard } from 'react-native'
import { countries } from '../dataComponents/countries'
import { connect } from 'react-redux'
import { postChef } from '../fetches/postChef'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PicSourceChooser from '../picSourceChooser/picSourceChooser'
import { TextPopUp } from '../textPopUp/textPopUp'
import DualOSPicker from '../dualOSPicker/DualOSPicker'
import { termsAndConditions } from '../dataComponents/termsAndConditions'
import { privacyPolicy } from '../dataComponents/privacyPolicy'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
import OfflineMessage from '../offlineMessage/offlineMessage'
import NetInfo from '@react-native-community/netinfo';
import { AlertPopUp } from '../alertPopUp/alertPopUp'

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
	clearNewUserDetails: () => {
		return dispatch => {
			dispatch({ type: 'CLEAR_NEW_USER_DETAILS' })
		}
	},
	loginChefToSTate: (id, username) => {
		return dispatch => {
			dispatch({ type: 'LOG_IN_CHEF', id: id, username: username })
		}
	}
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
		}

		componentDidMount() {

		}

		handleTextInput = (e, parameter) => {
			this.props.saveChefDetails(parameter, e.nativeEvent.text)
		}

		choosePicture = () => {
			this.setState({ choosingPicture: true })
		}

		sourceChosen = () => {
			this.setState({ choosingPicture: false })
		}

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
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
				// console.log("sending new user details")
				try {
					const chef = await postChef(this.props.username, this.props.e_mail, this.props.password, this.props.password_confirmation, this.props.country, this.props.image_url, this.props.profile_text)
					if (!chef.error) {
						this.props.clearNewUserDetails()
						this.setState({
							awaitingServer: false,
							thanksForRegisteringPopUpShowing: true
						})
					} else {
						this.setState({ errors: chef.message })
						await this.setState({ awaitingServer: false })
					}
				} catch (e) {
					this.setState({
						renderOfflineMessage: true,
						awaitingServer: false
					})
				}
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		renderEmailError = () => {
			const emailErrors = this.state.errors.filter(message => message.startsWith("E mail"))
			return emailErrors.map(error => (
				<View style={centralStyles.formErrorView} key={error}>
					<Text maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>{error}</Text>
				</View>
			))
		}

		renderUsernameError = () => {
			const usernameErrors = this.state.errors.filter(message => message.startsWith("Username"))
			return usernameErrors.map(error => (
				<View style={centralStyles.formErrorView} key={error}>
					<Text maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>{error}</Text>
				</View>
			))
		}

		renderPasswordError = () => {
			const passwordErrors = this.state.errors.filter(message => message.startsWith("Password"))
			return passwordErrors.map(error => (
				<View style={centralStyles.formErrorView} key={error}>
					<Text maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>{error}</Text>
				</View>
			))
		}

		onCountryChange = (choice) => {
			this.props.saveChefDetails("country", choice)
		}

		handleTandCSwitch = () => {
			this.setState({ tAndCAgreed: !this.state.tAndCAgreed })
		}

		handlePrivacyPolicySwitch = () => {
			this.setState({ privacyPolicyAgreed: !this.state.privacyPolicyAgreed })
		}

		renderThanksForRegisteringAlertPopUp = () => {
			return (
				<AlertPopUp
					// close={() => this.setState({ thanksForRegisteringPopUpShowing: false })}
					title={"Thanks so much for registering. Please confirm your e-mail address by clicking the link in your welcome e-mail and log in."}
					onYes={() => {
						this.setState({thanksForRegisteringPopUpShowing: false})
						this.props.navigation.navigate('Login')
					}}
					yesText={"Ok"}
				/>
			)
		}

		render() {
			// console.log(this.props.saveChefDetails)
			return (
				<SpinachAppContainer scrollingEnabled={true} awaitingServer={this.state.awaitingServer}>
					{this.state.thanksForRegisteringPopUpShowing && this.renderThanksForRegisteringAlertPopUp()}
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
							/>)
						}
						{this.state.choosingPicture ? this.renderPictureChooser() : null}
						<View style={[centralStyles.formContainer, { marginTop: responsiveHeight(5) }]}>
							{/* title */}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<Text maxFontSizeMultiplier={2} style={centralStyles.formTitle}>Please register and click the link in your confirmation e-mail!</Text>
								</View>
							</View>
							{/* e-mail*/}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<View style={centralStyles.formInputWhiteBackground}>
										<TextInput maxFontSizeMultiplier={2} style={centralStyles.formInput} value={this.props.e_mail} placeholder="e-mail" keyboardType="email-address" autoCapitalize="none" onChange={(e) => this.handleTextInput(e, "e_mail")} />
									</View>
								</View>
								{this.renderEmailError()}
							</View>
							{/* username*/}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<View style={centralStyles.formInputWhiteBackground}>
										<TextInput maxFontSizeMultiplier={2} style={centralStyles.formInput} value={this.props.username} placeholder="username" autoCapitalize="none" onChange={(e) => this.handleTextInput(e, "username")} />
									</View>
								</View>
								{this.renderUsernameError()}
							</View>
							{/* country */}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<View style={[centralStyles.pickerContainer, (this.state.pickerFocused ? { height: 170 } : { height: 44 })]}>
										<DualOSPicker
											onChoiceChange={this.onCountryChange}
											options={countries}
											selectedChoice={this.props.country}
											textAlignment={"flex-start"}
										/>
									</View>
								</View>
							</View>
							{/* profile*/}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<View style={[centralStyles.formInputWhiteBackground, { minHeight: responsiveHeight(12) }]}>
										<TextInput maxFontSizeMultiplier={2} style={centralStyles.formInput} value={this.props.profile_text} placeholder="about me" multiline={true} numberOfLines={3} onChange={(e) => this.handleTextInput(e, "profile_text")} />
									</View>
								</View>
							</View>
							{/* password*/}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<View style={centralStyles.formInputWhiteBackground}>
										<TextInput maxFontSizeMultiplier={2} style={centralStyles.formInput} value={this.props.password} placeholder="password" autoCapitalize="none" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password")} />
									</View>
								</View>
							</View>
							{/* password confirmation*/}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<View style={centralStyles.formInputWhiteBackground}>
										<TextInput maxFontSizeMultiplier={2} style={centralStyles.formInput} value={this.props.password_confirmation} placeholder="password confirmation" autoCapitalize="none" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password_confirmation")} />
									</View>
								</View>
								{this.renderPasswordError()}
							</View>
							{/* view terms and conditions*/}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<TouchableOpacity style={[centralStyles.formTextBoxContainer, { width: responsiveWidth(48) }]} activeOpacity={0.7} onPress={() => this.setState({ viewingTermsAndConditions: true })}>
										<Text maxFontSizeMultiplier={2} style={centralStyles.formTextBox}>{`View Terms & Conditions`}</Text>
									</TouchableOpacity>
									<TouchableOpacity activeOpacity={1} style={[centralStyles.yellowRectangleButton, { minWidth: responsiveWidth(30), maxWidth: responsiveWidth(30) }]} onPress={this.handleTandCSwitch}>
										<View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
											<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>I accept</Text>
											<Switch
												// style={(Platform.OS === 'ios' ? { transform: [{ scaleX: .7 }, { scaleY: .7 }] } : null)}
												value={this.state.tAndCAgreed}
												onChange={this.handleTandCSwitch}
												trackColor={{ true: '#4b714299'}}
												thumbColor={this.state.tAndCAgreed ? "#4b7142" : "#ececec"}
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
									<TouchableOpacity style={[centralStyles.formTextBoxContainer, { width: responsiveWidth(48) }]} activeOpacity={0.7} onPress={() => this.setState({ viewingPrivacyPolicy: true })}>
										<Text maxFontSizeMultiplier={2} style={centralStyles.formTextBox}>{`View Privacy Policy`}</Text>
									</TouchableOpacity>
									<TouchableOpacity activeOpacity={1} style={[centralStyles.yellowRectangleButton, { minWidth: responsiveWidth(30), maxWidth: responsiveWidth(30) }]} onPress={this.handlePrivacyPolicySwitch}>
										<View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
											<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>I accept</Text>
											<Switch
												style={(Platform.OS === 'ios' ? { transform: [{ scaleX: .7 }, { scaleY: .7 }] } : null)}
												value={this.state.privacyPolicyAgreed}
												onChange={this.handlePrivacyPolicySwitch}
												trackColor={{ true: '#4b714299' }}
												thumbColor={this.state.privacyPolicyAgreed ? "#4b7142" : "#ececec"}
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
									<TouchableOpacity style={[centralStyles.yellowRectangleButton, { justifyContent: 'center', maxWidth: '100%', width: '100%' }]} activeOpacity={0.7} onPress={this.choosePicture}>
										<Icon style={centralStyles.greenButtonIcon} size={25} name='camera'></Icon>
										<Text maxFontSizeMultiplier={2} style={[centralStyles.greenButtonText, { marginLeft: responsiveWidth(3) }]}>Add profile picture</Text>
									</TouchableOpacity>
								</View>
							</View>
							{/* return / log in */}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('Login')}>
										<Icon style={centralStyles.greenButtonIcon} size={25} name='login'></Icon>
										<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>Return to{"\n"} login screen</Text>
									</TouchableOpacity>
									<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={(this.state.tAndCAgreed && this.state.privacyPolicyAgreed ? (e) => this.submitChef(e) : null)}>
										<Icon style={centralStyles.greenButtonIcon} size={25} name='login'></Icon>
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
