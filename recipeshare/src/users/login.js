import React from 'react'
import { Platform, Text, AsyncStorage, Image, View, TextInput, TouchableOpacity, Switch, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import { styles } from './usersStyleSheet'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getNewPassword } from '../fetches/getNewPassword'
import { loginChef } from '../fetches/loginChef'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'

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
	loginChefToState: (id, username) => {
		return dispatch => {
			dispatch({ type: 'LOG_IN_CHEF', id: id, username: username })
		}
	},
	stayLoggedIn: (value) => {
		return dispatch => {
			dispatch({ type: 'STAY_LOGGED_IN', value: value })
		}
	},
	updateLoggedInChefInState: (id, username, auth_token, image_url, is_admin) => {
		return dispatch => {
			dispatch({ type: 'UPDATE_LOGGED_IN_CHEF', id: id, username: username, auth_token: auth_token, image_url: image_url, is_admin: is_admin })
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	class LoginScreen extends React.Component {

		state = {
			loginError: false,
			error: 'invalid ',
			awaitingServer: false,
			rememberEmail: false,
		}

		handleTextInput = (e, parameter) => {
			this.props.saveLoginChefDetails(parameter, e.nativeEvent.text)
		}

		componentDidMount = () => {
			AsyncStorage.getItem('rememberedEmail', (err, res) => {
				if (res) {
					let email = { nativeEvent: { text: JSON.parse(res) } }
					this.handleTextInput(email, "e_mail")
					this.setState({rememberEmail: true})
				}
			})
		}
		loginChef = async () => {
			await this.setState({ awaitingServer: true })
			if (this.state.rememberEmail) {
				AsyncStorage.setItem('rememberedEmail', JSON.stringify(this.props.e_mail))
			} else {
				AsyncStorage.removeItem('rememberedEmail')
			}
			//   console.log("sending login")
			const chef = await loginChef(this.props)
			if (!chef.error) {
				if (this.props.stayingLoggedIn) {
					AsyncStorage.setItem('chef', JSON.stringify(chef), () => {
						// AsyncStorage.getItem('chef', (err, res) => {
						// console.log(err)
						this.props.clearLoginUserDetails()
						this.props.updateLoggedInChefInState(chef.id, chef.username, chef.auth_token, chef.image_url, chef.is_admin, chef.is_member)
						this.props.setLoadedAndLoggedIn({ loaded: true, loggedIn: true })
						// })
					})
				} else {
					this.props.updateLoggedInChefInState(chef.id, chef.username, chef.auth_token, chef.image_url, chef.is_admin, chef.is_member)
					this.props.clearLoginUserDetails()
					await this.setState({
						loginError: false,
						awaitingServer: false
					})
					this.props.setLoadedAndLoggedIn({ loaded: true, loggedIn: true })
				}
			} else {
				// console.log(chef.message)
				await this.setState({
					awaitingServer: false,
					loginError: true,
					error: chef.message
				})
			}
		}

		forgotPassword = async () => {
			await this.setState({ awaitingServer: true })
			const response = await getNewPassword(this.props.e_mail)
			if (!response.error) {
				await this.setState({
					loginError: true,
					error: 'forgotPassword'
				})
			}
			await this.setState({ awaitingServer: false })

		}

		render() {
			// console.log(this.props)
			return (
				<SpinachAppContainer scrollingEnabled={true} awaitingServer={this.state.awaitingServer}>
					<TouchableOpacity
						activeOpacity={1}
						onPress={Keyboard.dismiss}
						style={{flex:1}}
					>
						<View style={styles.logoContainer}>
							<Image style={styles.logo} resizeMode={"contain"} source={require('../dataComponents/yellowLogo.png')} />
						</View>
						<View style={centralStyles.formContainer}>
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<Text style={centralStyles.formTitle} maxFontSizeMultiplier={1.5}>Welcome, chef!{"\n"} Please log in or register</Text>
								</View>
							</View>
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<TextInput maxFontSizeMultiplier={2} style={centralStyles.formInput} value={this.props.e_mail} placeholder="e-mail" keyboardType="email-address" autoCapitalize="none" onChange={(e) => this.handleTextInput(e, "e_mail")} />
								</View>
							</View>
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<TextInput maxFontSizeMultiplier={2} style={centralStyles.formInput} value={this.props.password} placeholder="password" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password")} />
								</View>
								{this.state.loginError && (
									<View style={centralStyles.formErrorView}>
										{this.state.error === 'invalid' && <Text maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>Username and password combination not recognized</Text>}
										{this.state.error === 'password_expired' && <Text maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>Automatically generated password has expired.  Please reset your password.</Text>}
										{this.state.error === 'activation' && <Text maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>Account not yet activated.  Please click the link in your confirmation e-mail. (Don&apos;t forget to check spam!)</Text>}
										{this.state.error === 'deactivated' && <Text maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>This account was deactivated.  Reset your password to reactivate your account.</Text>}
										{this.state.error === 'forgotPassword' && <Text maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>Thanks.  If this e-mail address has an account we&apos;ll send you a new password.  Please check your e-mail.</Text>}
									</View>
								)}
							</View>
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<TouchableOpacity activeOpacity={1} style={centralStyles.yellowRectangleButton} onPress={() => this.setState({ rememberEmail: !this.state.rememberEmail })}>
										<Text style={centralStyles.greenButtonText} maxFontSizeMultiplier={1.25}>Remember{"\n"}email</Text>
										<Switch
											style={(Platform.OS === 'ios' ? { transform: [{ scaleX: .7 }, { scaleY: .7 }] } : null)}
											value={this.state.rememberEmail}
											onChange={(e) => this.setState({ rememberEmail: e.nativeEvent.value })}
											trackColor={{ true: '#4b714299' }}
											thumbColor={this.state.rememberEmail ? "#104e01" : null}
										/>
									</TouchableOpacity>
									<TouchableOpacity activeOpacity={1} style={centralStyles.yellowRectangleButton} onPress={() => this.props.stayLoggedIn(!this.props.stayingLoggedIn)}>
										<Text style={centralStyles.greenButtonText} maxFontSizeMultiplier={1.5}>Stay{"\n"} logged in</Text>
										<Switch
											style={(Platform.OS === 'ios' ? { transform: [{ scaleX: .7 }, { scaleY: .7 }] } : null)}
											value={this.props.stayingLoggedIn}
											onChange={(e) => this.props.stayLoggedIn(e.nativeEvent.value)}
											trackColor={{ true: '#4b714299' }}
											thumbColor={this.props.stayingLoggedIn ? "#104e01" : null}
										/>
									</TouchableOpacity>
								</View>
							</View>
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('CreateChef')}>
										<Icon style={centralStyles.greenButtonIcon} size={25} name='account-plus'></Icon>
										<Text style={centralStyles.greenButtonText} maxFontSizeMultiplier={1.5}>Register</Text>
									</TouchableOpacity>
									<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={this.forgotPassword}>
										<Icon style={centralStyles.greenButtonIcon} size={25} name='lock-open'></Icon>
										<Text style={centralStyles.greenButtonText} maxFontSizeMultiplier={1.7}>Forgot{"\n"}password</Text>
									</TouchableOpacity>
								</View>
							</View>
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<TouchableOpacity style={[centralStyles.yellowRectangleButton, { maxWidth: '100%', width: '100%', justifyContent: 'center' }]} activeOpacity={0.7} onPress={e => this.loginChef(e)}>
										<Icon style={centralStyles.greenButtonIcon} size={25} name='login'></Icon>
										<Text style={[centralStyles.greenButtonText, { marginLeft: responsiveWidth(4) }]} maxFontSizeMultiplier={2}>Login</Text>
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
