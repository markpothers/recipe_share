import React from 'react'
import { Text, Image, View, TextInput, TouchableOpacity } from 'react-native'
import { styles } from './usersStyleSheet'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SpinachAppContainer from './spinachAppContainer/SpinachAppContainer'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import SwitchSized from '../switchSized/switchSized'
import { apiCall } from '../auxFunctions/apiCall'

export default class Templates extends React.Component {
	static navigationOptions = {
		header: null,
	};

	state = {
		loginError: 'Invalid credentials',
		awaitingServer: false,
		forgottenPasswordMessage: ''
	}

	handleTextInput = (e, parameter) => {
		this.props.saveLoginChefDetails(parameter, e.nativeEvent.text)
	}

	makeAnAPICall = async () => {
		this.setState(() => ({ awaitingServer: true }))
		let response = await apiCall(getNewPassword, this.props.e_mail)
		if (response.fail) {
			this.setState({ renderOfflineMessage: true })
		} else if (response.error) {
			this.setState(() => ({
				loginError: true,
				error: response.message
			}))
	} else {
	//do whatever you should do when things work out.
}
this.setState(state => ({ awaitingServer: false }))
	}

render() {
	// console.log(this.props.e_mail)
	return (
		<SpinachAppContainer awaitingServer={this.state.awaitingServer} scrollingEnabled={true}>
			{/* logo   */}
			<View style={styles.logoContainer}>
				<Image style={styles.logo} resizeMode={"contain"} source={require('../dataComponents/yellowLogo.png')} />
			</View>

			{/* form */}
			<View style={centralStyles.formContainer}>

				{/* form title */}
				<View style={centralStyles.formSection}>
					<View style={centralStyles.formInputContainer}>
						<Text style={centralStyles.formTitle}>Welcome, chef!{"\n"} Please log in or register</Text>
					</View>
				</View>

				{/* form section with error*/}
				<View style={centralStyles.formSection}>
					<View style={centralStyles.formInputContainer}>
						<TextInput style={centralStyles.formInput} value={this.props.e_mail} placeholder="e-mail" keyboardType="email-address" autoCapitalize="none" onChange={(e) => this.handleTextInput(e, "e_mail")} />
					</View>
					{this.state.loginError !== '' && (
						<View style={centralStyles.formErrorView}>
							<Text style={centralStyles.formErrorText}>{this.state.loginError}</Text>
						</View>
					)}
				</View>

				{/* form section without error*/}
				<View style={centralStyles.formSection}>
					<View style={centralStyles.formInputContainer}>
						<TextInput style={centralStyles.formInput} value={this.props.password} placeholder="password" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password")} />
					</View>
				</View>

				{/* row with 1 full width button */}
				<View style={centralStyles.formSection}>
					<View style={centralStyles.formInputContainer}>
						<TouchableOpacity style={[centralStyles.yellowRectangleButton, { width: '100%' }]} activeOpacity={0.7} onPress={this.choosePicture}>
							<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='camera'></Icon>
							<Text style={centralStyles.greenButtonText}>Add profile picture</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* row with two buttons*/}
				<View style={centralStyles.formSection}>
					<View style={centralStyles.formInputContainer}>
						<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={this.forgotPassword}>
							<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='lock-open'></Icon>
							<Text style={centralStyles.greenButtonText}>Reset{"\n"}password</Text>
						</TouchableOpacity>
						<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={e => this.loginChef(e)}>
							<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='login'></Icon>
							<Text style={centralStyles.greenButtonText}>Login</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* row with a button and a switch*/}
				<View style={centralStyles.formSection}>
					<View style={centralStyles.formInputContainer}>
						<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('CreateChef')}>
							<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='account-plus'></Icon>
							<Text style={centralStyles.greenButtonText}>Register</Text>
						</TouchableOpacity>
						<View style={centralStyles.yellowRectangleButton}>
							<Text style={centralStyles.greenButtonText}>Stay{"\n"}logged in</Text>
							<SwitchSized
								value={this.props.stayingLoggedIn}
								onValueChange={(value) => this.props.stayLoggedIn(value)}
							/>
						</View>
					</View>
				</View>

				{/* text box and switch*/}
				<View style={centralStyles.formSection}>
					<View style={centralStyles.formInputContainer}>
						<TouchableOpacity style={{ width: responsiveWidth(49) }} activeOpacity={0.7} onPress={() => this.setState({ viewingTermsAndConditions: true })}>
							<View style={centralStyles.formTextBoxContainer}>
								<Text style={centralStyles.formTextBox}>{`View Terms & Conditions`}</Text>
							</View>
						</TouchableOpacity>
						<View style={[centralStyles.yellowRectangleButton, { width: responsiveWidth(30) }]}>
							<Text style={centralStyles.greenButtonText}>I accept</Text>
							<SwitchSized
								value={this.props.stayingLoggedIn}
								onValueChange={(value) => this.props.stayLoggedIn(value)}
							/>
						</View>
					</View>
				</View>









			</View>

		</SpinachAppContainer>

	)
}

}
