import React from "react"
import { Text, View, TouchableOpacity, Platform, Linking, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { centralStyles } from "../centralStyleSheet" //eslint-disable-line no-unused-vars
import SpinachAppContainer from "../spinachAppContainer/SpinachAppContainer"
import { responsiveWidth, responsiveHeight, responsiveFontSize } from "react-native-responsive-dimensions" //eslint-disable-line no-unused-vars
import { styles } from "./aboutStyleSheet"
import { termsAndConditions } from "../dataComponents/termsAndConditions"
import { privacyPolicy } from "../dataComponents/privacyPolicy"
import { SoftwareLicenses } from "./softwareLicenses"
import Constants from "expo-constants"

export default class About extends React.Component {

	scrollView = React.createRef()
	state = {
		awaitingServer: false,
		displayingTermsAndConditions: true,
		displayingPrivacyPolicy: false,
		displayingLicenses: false
	}

	componentDidMount = async () => {

	}

	componentWillUnmount = () => {

	}

	viewTermsAndConditions = () => {
		this.setState({
			displayingTermsAndConditions: true,
			displayingPrivacyPolicy: false,
			displayingLicenses: false
		})
		this.scrollView.scrollTo({y: 0, animated: false})
	}

	viewPrivacyPolicy = () => {
		this.setState({
			displayingTermsAndConditions: false,
			displayingPrivacyPolicy: true,
			displayingLicenses: false
		})
		this.scrollView.scrollTo({y: 0, animated: false})
	}

	viewLicenses = () => {
		this.setState({
			displayingTermsAndConditions: false,
			displayingPrivacyPolicy: false,
			displayingLicenses: true
		})
		this.scrollView.scrollTo({y: 0, animated: false})
	}


	render() {
		return (
			<SpinachAppContainer awaitingServer={this.state.awaitingServer} scrollingEnabled={false}>
				<View style={centralStyles.formSection}>
					<View style={centralStyles.formInputContainer}>
						<View style={[centralStyles.formInputWhiteBackground, { justifyContent: "space-between" }]}>
							<Text maxFontSizeMultiplier={2} style={styles.text}>App Version:</Text>
							{Platform.OS == "ios" ? (
								<Text maxFontSizeMultiplier={2} style={styles.text}>{`${Constants.manifest.version}.${Constants.manifest.ios.buildNumber}`}</Text>
							) : (
								<Text maxFontSizeMultiplier={2} style={styles.text}>{`${Constants.manifest.version}.${Constants.manifest.android.versionCode}`}</Text>
							)}
						</View>
					</View>
				</View>
				<View style={[centralStyles.formSection, styles.viewButtonContainer]}>
					<View style={centralStyles.formInputContainer}>
						{this.state.displayingTermsAndConditions ? (
							<View style={[centralStyles.greenRectangleButton, styles.viewButton]}>
								<Icon style={centralStyles.yellowButtonIcon} size={responsiveHeight(4)} name='information'></Icon>
								<Text maxFontSizeMultiplier={2} style={[centralStyles.yellowButtonText, { fontSize: responsiveFontSize(2.2) }]}>View terms and conditions</Text>
							</View>
						) : (
							<TouchableOpacity style={[centralStyles.yellowRectangleButton, styles.viewButton]} activeOpacity={0.7} onPress={this.viewTermsAndConditions}>
								<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='information'></Icon>
								<Text maxFontSizeMultiplier={2} style={[centralStyles.greenButtonText, { fontSize: responsiveFontSize(2.2) }]}>View terms and conditions</Text>
							</TouchableOpacity>
						)}
					</View>
				</View>
				<View style={[centralStyles.formSection, styles.viewButtonContainer]}>
					<View style={centralStyles.formInputContainer}>
						{this.state.displayingPrivacyPolicy ? (
							<View style={[centralStyles.greenRectangleButton, styles.viewButton]}>
								<Icon style={centralStyles.yellowButtonIcon} size={responsiveHeight(4)} name='information-outline'></Icon>
								<Text maxFontSizeMultiplier={2} style={[centralStyles.yellowButtonText, { fontSize: responsiveFontSize(2.2) }]}>View privacy policy</Text>
							</View>
						) : (
							<TouchableOpacity style={[centralStyles.yellowRectangleButton, styles.viewButton]} activeOpacity={0.7} onPress={this.viewPrivacyPolicy}>
								<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='information-outline'></Icon>
								<Text maxFontSizeMultiplier={2} style={[centralStyles.greenButtonText, { fontSize: responsiveFontSize(2.2) }]}>View privacy policy</Text>
							</TouchableOpacity>
						)}
					</View>
				</View>
				<View style={[centralStyles.formSection, styles.viewButtonContainer]}>
					<View style={centralStyles.formInputContainer}>
						{this.state.displayingLicenses ? (
							<View style={[centralStyles.greenRectangleButton, styles.viewButton]}>
								<Icon style={centralStyles.yellowButtonIcon} size={responsiveHeight(4)} name='cellphone-information'></Icon>
								<Text maxFontSizeMultiplier={2} style={[centralStyles.yellowButtonText, { fontSize: responsiveFontSize(2.2) }]}>View licenses</Text>
							</View>
						) : (
							<TouchableOpacity style={[centralStyles.yellowRectangleButton, styles.viewButton]} activeOpacity={0.7} onPress={this.viewLicenses}>
								<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='cellphone-information'></Icon>
								<Text maxFontSizeMultiplier={2} style={[centralStyles.greenButtonText, { fontSize: responsiveFontSize(2.2) }]}>View licenses</Text>
							</TouchableOpacity>
						)}
					</View>
				</View>
				<View style={[centralStyles.formSection, { flex: 1 }]}>
					<View style={[centralStyles.formInputContainer, { flex: 1 }]}>
						<ScrollView
							ref={(ref) => this.scrollView = ref}
							style={{
								backgroundColor: "white",
								borderWidth: 1,
								borderColor: "#104e01",
								borderRadius: responsiveWidth(1.5),
								flexDirection: "column",
								flex: 1
							}}
						>
							{this.state.displayingTermsAndConditions && (
								<View>
									<Text maxFontSizeMultiplier={2} style={styles.text}>{termsAndConditions}</Text>
									<TouchableOpacity
										onPress={() => Linking.openURL("mailto:admin@recipe-share.com?subject=Terms%20And%20Conditions%20Question")}
									// testID={'emailTAndCButton'}
									>
										<Text style={{ color: "blue", fontSize: responsiveFontSize(2.2), marginBottom: responsiveWidth(4) }}>admin@recipe-share.com</Text>
									</TouchableOpacity>
								</View>
							)}
							{this.state.displayingPrivacyPolicy && (
								<View>
									<Text maxFontSizeMultiplier={2} style={styles.text}>{privacyPolicy}</Text>
									<View style={{ flexDirection: "row", marginLeft: responsiveWidth(2) }}>
										<Text style={{ fontSize: responsiveFontSize(2.2) }}>* By email: </Text>
										<TouchableOpacity
											onPress={() => Linking.openURL("mailto:admin@recipe-share.com?subject=Privacy%20Policy%20Question")}
										// testID={'emailPrivacyPolicyButton'}
										><Text style={{ color: "blue", fontSize: responsiveFontSize(2.2), marginBottom: responsiveWidth(4) }}>admin@recipe-share.com</Text>
										</TouchableOpacity>
									</View>
								</View>
							)}
							{this.state.displayingLicenses && (<SoftwareLicenses />)}
						</ScrollView>
					</View>
				</View>
			</SpinachAppContainer>
		)
	}
}
