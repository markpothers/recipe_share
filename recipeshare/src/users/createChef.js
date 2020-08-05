import React from 'react'
import { Platform, Text, TouchableOpacity, TextInput, View, Switch } from 'react-native'
import { countries } from '../dataComponents/countries'
import { connect } from 'react-redux'
import { postChef } from '../fetches/postChef'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PicSourceChooser from '../functionalComponents/picSourceChooser'
import { TextPopUp } from '../textPopUp/textPopUp'
import DualOSPicker from '../functionalComponents/DualOSPicker'
import { termsAndConditions } from '../dataComponents/termsAndConditions'
import { privacyPolicy } from '../dataComponents/privacyPolicy'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
import OfflineMessage from '../offlineMessage/offlineMessage'
import NetInfo from '@react-native-community/netinfo';

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
			let imageSource = `data:image/jpeg;base64,${this.props.image_url}`
			return <PicSourceChooser saveImage={this.saveImage} sourceChosen={this.sourceChosen} key={"pic-chooser"} imageSource={imageSource} />
		}

		saveImage = async (image) => {
			if (image.cancelled === false) {
				this.props.saveChefDetails("image_url", image.base64)
			}
		}

		submitChef = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
				// console.log("sending new user details")
				const chef = await postChef(this.props.username, this.props.e_mail, this.props.password, this.props.password_confirmation, this.props.country, this.props.image_url, this.props.profile_text)
				if (!chef.error) {
					this.props.clearNewUserDetails()
					this.props.navigation.navigate('Login')
				} else {
					this.setState({ errors: chef.message })
					await this.setState({ awaitingServer: false })
				}
			} else {
				this.setState({
					renderOfflineMessage: true,
					awaitingServer: false
				})
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

		render() {
			// console.log(this.props.saveChefDetails)
			return (
				<SpinachAppContainer scrollingEnabled={true} awaitingServer={this.state.awaitingServer}>
					{this.state.renderOfflineMessage && (
						<OfflineMessage
							message={`Sorry, can't do right now.${"\n"}You appear to be offline.`}
							topOffset={'10%'}
							clearOfflineMessage={() => this.setState({ renderOfflineMessage: false })}
						/>)
					}
					{this.state.choosingPicture ? this.renderPictureChooser() : null}
					<View style={[centralStyles.formContainer, { marginTop: responsiveHeight(10) }]}>
						{/* title */}
						<View style={centralStyles.formSection}>
							<View style={centralStyles.formInputContainer}>
								<Text maxFontSizeMultiplier={2} style={centralStyles.formTitle}>Please register and click the link in your confirmation e-mail!</Text>
							</View>
						</View>
						{/* e-mail*/}
						<View style={centralStyles.formSection}>
							<View style={centralStyles.formInputContainer}>
								<TextInput maxFontSizeMultiplier={2} style={centralStyles.formInput} value={this.props.e_mail} placeholder="e-mail" keyboardType="email-address" autoCapitalize="none" onChange={(e) => this.handleTextInput(e, "e_mail")} />
							</View>
							{this.renderEmailError()}
						</View>
						{/* username*/}
						<View style={centralStyles.formSection}>
							<View style={centralStyles.formInputContainer}>
								<TextInput maxFontSizeMultiplier={2} style={centralStyles.formInput} value={this.props.username} placeholder="username" autoCapitalize="none" onChange={(e) => this.handleTextInput(e, "username")} />
							</View>
							{this.renderUsernameError()}
						</View>
						{/* country */}
						<View style={centralStyles.formSection}>
							<View style={centralStyles.formInputContainer}>
								<View picker style={[centralStyles.pickerContainer, (this.state.pickerFocused ? { height: 170 } : { height: 44 })]}>
									<DualOSPicker
										onChoiceChange={this.onCountryChange}
										options={countries}
										selectedChoice={this.props.country} />
								</View>
							</View>
						</View>
						{/* profile*/}
						<View style={centralStyles.formSection}>
							<View style={centralStyles.formInputContainer}>
								<TextInput maxFontSizeMultiplier={2} style={[centralStyles.formInput, { minHeight: responsiveHeight(12), maxHeight: responsiveHeight(25) }]} value={this.props.profile_text} placeholder="about me" multiline={true} numberOfLines={3} onChange={(e) => this.handleTextInput(e, "profile_text")} />
							</View>
						</View>
						{/* password*/}
						<View style={centralStyles.formSection}>
							<View style={centralStyles.formInputContainer}>
								<TextInput maxFontSizeMultiplier={2} style={centralStyles.formInput} value={this.props.password} placeholder="password" autoCapitalize="none" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password")} />
							</View>
						</View>
						{/* password confirmation*/}
						<View style={centralStyles.formSection}>
							<View style={centralStyles.formInputContainer}>
								<TextInput maxFontSizeMultiplier={2} style={centralStyles.formInput} value={this.props.password_confirmation} placeholder="password confirmation" autoCapitalize="none" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password_confirmation")} />
							</View>
							{this.renderPasswordError()}
						</View>
						{/* view terms and conditions*/}
						<View style={centralStyles.formSection}>
							<View style={centralStyles.formInputContainer}>
								<TouchableOpacity style={[centralStyles.formTextBoxContainer, { width: responsiveWidth(48) }]} activeOpacity={0.7} onPress={() => this.setState({ viewingTermsAndConditions: true })}>
									{/* <View style={centralStyles.formTextBoxContainer}> */}
									<Text maxFontSizeMultiplier={2} style={centralStyles.formTextBox}>{`View Terms & Conditions`}</Text>
									{/* </View> */}
								</TouchableOpacity>
								<TouchableOpacity activeOpacity={1} style={[centralStyles.yellowRectangleButton, { minWidth: responsiveWidth(30), maxWidth: responsiveWidth(30) }]} onPress={this.handleTandCSwitch}>
									<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>I accept</Text>
									<Switch style={(Platform.OS === 'ios' ? { transform: [{ scaleX: .7 }, { scaleY: .7 }] } : null)} value={this.state.tAndCAgreed} onChange={this.handleTandCSwitch} />
								</TouchableOpacity>
								{this.state.viewingTermsAndConditions && (
									<TextPopUp
										close={() => this.setState({ viewingTermsAndConditions: false })}
										title={`Terms and Conditions`}
										text={termsAndConditions}
									/>
								)}
							</View>
						</View>
						{/* view privacy policy*/}
						<View style={centralStyles.formSection}>
							<View style={centralStyles.formInputContainer}>
								<TouchableOpacity style={[centralStyles.formTextBoxContainer, { width: responsiveWidth(48) }]} activeOpacity={0.7} onPress={() => this.setState({ viewingPrivacyPolicy: true })}>
									{/* <View style={centralStyles.formTextBoxContainer}> */}
									<Text maxFontSizeMultiplier={2} style={centralStyles.formTextBox}>{`View Privacy Policy`}</Text>
									{/* </View> */}
								</TouchableOpacity>
								<TouchableOpacity activeOpacity={1} style={[centralStyles.yellowRectangleButton, { minWidth: responsiveWidth(30), maxWidth: responsiveWidth(30) }]} onPress={this.handlePrivacyPolicySwitch}>
									<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>I accept</Text>
									<Switch style={(Platform.OS === 'ios' ? { transform: [{ scaleX: .7 }, { scaleY: .7 }] } : null)} value={this.state.privacyPolicyAgreed} onChange={this.handlePrivacyPolicySwitch} />
								</TouchableOpacity>
								{this.state.viewingPrivacyPolicy && (
									<TextPopUp
										close={() => this.setState({ viewingPrivacyPolicy: false })}
										title={`Privacy Policy`}
										text={privacyPolicy}
									/>
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
				</SpinachAppContainer>
			)
		}
	}
)
