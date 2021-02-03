import React from 'react'
import { Text, Image, View, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { connect } from 'react-redux'
import { styles } from './usersStyleSheet'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getNewPassword } from '../fetches/getNewPassword'
import { loginChef } from '../fetches/loginChef'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
import OfflineMessage from '../offlineMessage/offlineMessage'
import SwitchSized from '../switchSized/switchSized'
import { AlertPopUp } from '../alertPopUp/alertPopUp'
import { apiCall } from '../auxFunctions/apiCall'

const mapStateToProps = (state) => ({
	e_mail: state.loginUserDetails.e_mail,
	password: state.loginUserDetails.password,
	loggedInChef: state.loggedInChef,
	stayingLoggedIn: state.stayLoggedIn,
})

const mapDispatchToProps = {
	saveLoginChefDetails: (parameter, content) => {
		return dispatch => {
			dispatch({ type: 'UPDATE_LOGIN_USER_DETAILS', parameter: parameter, content: content })
		}
	},
	clearLoginUserDetails: () => {
		return dispatch => {
			dispatch({ type: 'CLEAR_LOGIN_USER_DETAILS' })
		}
	},
	stayLoggedIn: (value) => {
		return dispatch => {
			dispatch({ type: 'STAY_LOGGED_IN', value: value })
		}
	},
	updateLoggedInChefInState: (id, e_mail, username, auth_token, image_url, is_admin) => {
		return dispatch => {
			dispatch({ type: 'UPDATE_LOGGED_IN_CHEF', id: id, e_mail: e_mail, username: username, auth_token: auth_token, image_url: image_url, is_admin: is_admin })
		}
	},
	clearNewUserDetails: () => {
		return dispatch => {
			dispatch({ type: 'CLEAR_NEW_USER_DETAILS' })
		}
	},
}

export default connect(mapStateToProps, mapDispatchToProps)(
	class LoginScreen extends React.Component {

		state = {
			loginError: false,
			error: 'invalid ',
			awaitingServer: false,
			rememberEmail: false,
			renderOfflineMessage: false,
			passwordVisible: false,
			isFocused: true,
			thanksForRegisteringPopUpShowing: false,
			thanksForRegisteringPopUpCleared: false,
		}

		handleTextInput = (text, parameter) => {
			this.props.saveLoginChefDetails(parameter, text)
		}

		componentDidMount = async () => {
			let storedEmail = await AsyncStorage.getItem('rememberedEmail')
			if (storedEmail) {
				await this.handleTextInput(storedEmail, "e_mail")
				this.setState({ rememberEmail: true })
			}
			this.props.navigation.addListener('focus', this.respondToFocus)
			this.props.navigation.addListener('blur', this.respondToBlur)
		}

		componentDidUpdate = () => {
			if (!this.state.thanksForRegisteringPopUpShowing && !this.state.thanksForRegisteringPopUpCleared
				&& this.props.route.params?.successfulRegistration === true) {
				this.setState({ thanksForRegisteringPopUpShowing: true })
			}
		}

		respondToFocus = () => {
			this.setState({ isFocused: true })
		}

		respondToBlur = () => {
			this.setState({ isFocused: false })
		}

		componentWillUnmount = () => {
			this.props.navigation.removeListener('focus', this.respondToFocus)
			this.props.navigation.removeListener('blur', this.respondToBlur)
		}

		loginChef = async () => {
			await this.setState({ awaitingServer: true })
			if (this.state.rememberEmail) {
				AsyncStorage.setItem('rememberedEmail', this.props.e_mail)
			} else {
				AsyncStorage.removeItem('rememberedEmail')
			}
			let response = await apiCall(loginChef, this.props)
			if (response.fail) {
				this.setState({
					renderOfflineMessage: true,
					awaitingServer: false
				})
			} else if (response.error) {
				await this.setState({
					loginError: true,
					error: response.message,
					awaitingServer: false
				})
			} else { // we don't want to differentiate between response and response.error for security reasons
				if (this.props.stayingLoggedIn) {
					AsyncStorage.setItem('chef', JSON.stringify(response), () => {
						this.props.clearLoginUserDetails()
						this.props.updateLoggedInChefInState(response.id, response.e_mail, response.username, response.auth_token, response.image_url, response.is_admin, response.is_member)
						this.props.navigation.navigate("CreateChef", { successfulLogin: true }) //thisnavigate command is used to trigger Apple Keychain.  CreateChef will immediately perform the required actions to login.

					})
				} else {
					this.props.updateLoggedInChefInState(response.id, response.e_mail, response.username, response.auth_token, response.image_url, response.is_admin, response.is_member)
					this.props.clearLoginUserDetails()
					this.props.navigation.navigate("CreateChef", { successfulLogin: true }) //thisnavigate command is used to trigger Apple Keychain.  CreateChef will immediately perform the required actions to login.
				}
			}
		}

		forgotPassword = async () => {
			await this.setState({ awaitingServer: true })
			if (this.props.e_mail.length > 0) {
				let response = await apiCall(getNewPassword, this.props.e_mail)
				if (response.fail) {
					await this.setState({ renderOfflineMessage: true })
				} else { // we don't want to differentiate between response and response.error for security reasons
					await this.setState({
						loginError: true,
						error: response.message
					})
				}
			} else {
				await this.setState({
					loginError: true,
					error: 'forgotPassword'
				})
			}
			await this.setState({ awaitingServer: false })
		}

		renderThanksForRegisteringAlertPopUp = () => {
			return (
				<AlertPopUp
					title={"Thanks so much for registering. Please confirm your e-mail address by clicking the link in your welcome e-mail and log in."}
					onYes={() => {
						this.setState({
							thanksForRegisteringPopUpShowing: false,
							thanksForRegisteringPopUpCleared: true
						})
						this.props.clearNewUserDetails()
					}}
					yesText={"Ok"}
				/>
			)
		}

		render() {
			// console.log(this.state)
			return (
				<SpinachAppContainer scrollingEnabled={true} awaitingServer={this.state.awaitingServer} >
					{
						this.state.renderOfflineMessage && (
							<OfflineMessage
								message={`Sorry, can't log in right now.${"\n"}You appear to be offline.`}
								topOffset={'10%'}
								clearOfflineMessage={() => this.setState({ renderOfflineMessage: false })}
							/>)
					}
					{ this.state.thanksForRegisteringPopUpShowing && this.renderThanksForRegisteringAlertPopUp()}
					< TouchableOpacity
						activeOpacity={1}
						onPress={Keyboard.dismiss}
						style={{ flex: 1 }}
					>
						<View style={styles.logoContainer}>
							<Image style={styles.logo} resizeMode={"contain"} source={require('../dataComponents/yellowLogo.png')} />
						</View>
						<View style={[centralStyles.formContainer, { marginTop: responsiveHeight(15) }]}>
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<View style={centralStyles.formInputWhiteBackground}>
										<Text style={centralStyles.formTitle} maxFontSizeMultiplier={1.5}>Welcome, chef!{"\n"} Please log in or register</Text>
									</View>
								</View>
							</View>
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
											onChangeText={(text) => this.handleTextInput(text, "e_mail")}
											testID={"usernameInput"}
										/>
									</View>
								</View>
							</View>
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<View style={centralStyles.formInputWhiteBackground}>
										{this.state.isFocused && ( //this conditional helps ios properly recognise both password fields in the createchef form
											<TextInput
												maxFontSizeMultiplier={2}
												style={centralStyles.formInput}
												value={this.props.password}
												placeholder="password"
												autoCapitalize="none"
												autoCompleteType="password"
												textContentType="password"
												secureTextEntry={!this.state.passwordVisible}
												onChangeText={(text) => this.handleTextInput(text, "password")}
												testID={"passwordInput"}
											/>
										)}
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
								{this.state.loginError && (
									<View style={centralStyles.formErrorView}>
										{this.state.error === 'invalid' && <Text testID={'invalidErrorMessage'} maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>e-mail and password combination not recognized</Text>}
										{this.state.error === 'password_expired' && <Text testID={'passwordExpiredErrorMessage'} maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>Automatically generated password has expired.  Please reset your password.</Text>}
										{this.state.error === 'activation' && <Text testID={'activationErrorMessage'} maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>Account not yet activated.  Please click the link in your confirmation e-mail. (Don&apos;t forget to check spam!)</Text>}
										{this.state.error === 'deactivated' && <Text testID={'deactivatedErrorMessage'} maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>This account was deactivated.  Reset your password to reactivate your account.</Text>}
										{this.state.error === 'forgotPassword' && this.props.e_mail.length > 0 && <Text testID={'forgotPasswordErrorMessage'} maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>Thanks.  If this e-mail address has an account we&apos;ll send you a new password.  Please check your e-mail.</Text>}
										{this.state.error === 'forgotPassword' && this.props.e_mail.length == 0 && <Text testID={'noUsernameForgotPasswordErrorMessage'} maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>Please enter your e-mail and hit the &apos;Forgot Password&apos; button again.</Text>}
										{this.state.error === 'reactivate' && <Text testID={'reactivateErrorMessage'} maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>We&apos;ve e-mailed you a link to re-activate your account.</Text>}
									</View>
								)}
							</View>
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<TouchableOpacity
										activeOpacity={1}
										style={centralStyles.yellowRectangleButton}
										onPress={() => this.setState({ rememberEmail: !this.state.rememberEmail })}
										testID={'rememberEmailButton'}
									>
										<Text style={centralStyles.greenButtonText} maxFontSizeMultiplier={1.25}>Remember{"\n"}email</Text>
										<SwitchSized
											value={this.state.rememberEmail}
											onValueChange={(value) => this.setState({ rememberEmail: value })}
											testID={'rememberEmailToggle'}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										activeOpacity={1}
										style={centralStyles.yellowRectangleButton}
										onPress={() => this.props.stayLoggedIn(!this.props.stayingLoggedIn)}
										testID={'stayLoggedInButton'}
									>
										<Text style={centralStyles.greenButtonText} maxFontSizeMultiplier={1.5}>Stay{"\n"} logged in</Text>
										<SwitchSized
											value={this.props.stayingLoggedIn}
											onValueChange={(value) => this.props.stayLoggedIn(value)}
											testID={'stayLoggedInToggle'}
										/>
									</TouchableOpacity>
								</View>
							</View>
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<TouchableOpacity
										style={centralStyles.yellowRectangleButton}
										activeOpacity={0.7}
										onPress={() => this.props.navigation.navigate('CreateChef')}
										testID={'registerButton'}
									>
										<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='account-plus'></Icon>
										<Text style={centralStyles.greenButtonText} maxFontSizeMultiplier={1.5}>Register</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={centralStyles.yellowRectangleButton}
										activeOpacity={0.7}
										onPress={this.forgotPassword}
										testID={'forgotPasswordButton'}
									>
										<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='lock-open'></Icon>
										<Text style={centralStyles.greenButtonText} maxFontSizeMultiplier={1.7}>Forgot{"\n"}password</Text>
									</TouchableOpacity>
								</View>
							</View>
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<TouchableOpacity
										style={[centralStyles.yellowRectangleButton, { maxWidth: '100%', width: '100%', justifyContent: 'center' }]}
										activeOpacity={0.7}
										onPress={e => this.loginChef(e)}
										testID={'loginButton'}
									>
										<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='login'></Icon>
										<Text style={[centralStyles.greenButtonText, { marginLeft: responsiveWidth(4) }]} maxFontSizeMultiplier={2}>Login</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</TouchableOpacity >
				</SpinachAppContainer >
			)
		}
	}
)
