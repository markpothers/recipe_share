import React from 'react'
import { Platform, Text, Image, View, TextInput, TouchableOpacity, Switch } from 'react-native'
import { styles } from './usersStyleSheet'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SpinachAppContainer from './spinachAppContainer/SpinachAppContainer'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

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
								<Icon style={centralStyles.greenButtonIcon} size={25} name='camera'></Icon>
								<Text style={centralStyles.greenButtonText}>Add profile picture</Text>
							</TouchableOpacity>
						</View>
					</View>

					{/* row with two buttons*/}
					<View style={centralStyles.formSection}>
						<View style={centralStyles.formInputContainer}>
							<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={this.forgotPassword}>
								<Icon style={centralStyles.greenButtonIcon} size={25} name='lock-open'></Icon>
								<Text style={centralStyles.greenButtonText}>Reset{"\n"}password</Text>
							</TouchableOpacity>
							<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={e => this.loginChef(e)}>
								<Icon style={centralStyles.greenButtonIcon} size={25} name='login'></Icon>
								<Text style={centralStyles.greenButtonText}>Login</Text>
							</TouchableOpacity>
						</View>
					</View>

					{/* row with a button and a switch*/}
					<View style={centralStyles.formSection}>
						<View style={centralStyles.formInputContainer}>
							<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('CreateChef')}>
								<Icon style={centralStyles.greenButtonIcon} size={25} name='account-plus'></Icon>
								<Text style={centralStyles.greenButtonText}>Register</Text>
							</TouchableOpacity>
							<View style={centralStyles.yellowRectangleButton}>
								<Text style={centralStyles.greenButtonText}>Stay{"\n"}logged in</Text>
								<Switch
									style={[(Platform.OS === 'ios' ? { transform: [{ scaleX: .7 }, { scaleY: .7 }] } : null), { marginLeft: responsiveWidth(2) }]}
									value={this.props.stayingLoggedIn}
									onChange={(e) => this.props.stayLoggedIn(e.nativeEvent.value)}
									trackColor={{ true: '#4b714299' }}
								// thumbColor={filtersList[category] ? "#104e01" : null}
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
								<Switch
									style={[(Platform.OS === 'ios' ? { transform: [{ scaleX: .7 }, { scaleY: .7 }] } : null), { marginLeft: responsiveWidth(2) }]}
									value={this.props.stayingLoggedIn}
									onChange={(e) => this.props.stayLoggedIn(e.nativeEvent.value)}
									trackColor={{ true: '#4b714299' }}
								// thumbColor={filtersList[category] ? "#104e01" : null}
								/>
							</View>
						</View>
					</View>









				</View>

			</SpinachAppContainer>

		)
	}

}
