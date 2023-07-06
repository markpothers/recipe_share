import { Image, Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LoginNavigationProps, LoginRouteProps } from "../../navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
	clearLoginUserDetails,
	clearNewUserDetails,
	stayLoggedIn,
	updateLoggedInChef,
	updateLoginUserDetails,
	useAppDispatch,
	useAppSelector,
} from "../redux";
import { getLoggedInUserDetails, getStayLoggedIn } from "../redux/selectors";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import { AlertPopup } from "../alertPopup/alertPopup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import OfflineMessage from "../offlineMessage/offlineMessage";
import SpinachAppContainer from "../spinachAppContainer/SpinachAppContainer";
import SwitchSized from "../customComponents/switchSized/switchSized";
import { centralStyles } from "../centralStyleSheet"; //eslint-disable-line no-unused-vars
import { getNewPassword } from "../fetches/getNewPassword";
import { postLoginChef } from "../fetches/loginChef";
import { saveToken } from "../auxFunctions/saveLoadToken";
import { styles } from "./usersStyleSheet";

// import { apiCall } from "../auxFunctions/apiCall";

// import { ApiError } from "../centralTypes";

type OwnProps = {
	navigation: LoginNavigationProps;
	route: LoginRouteProps;
	setLoadedAndLoggedIn: (args: { loaded: boolean; loggedIn: boolean }) => void;
};

export default function Login(props: OwnProps) {
	const { e_mail, password } = useAppSelector(getLoggedInUserDetails);
	const stayingLoggedIn = useAppSelector(getStayLoggedIn);
	const dispatch = useAppDispatch();
	const [loginError, setLoginError] = useState<boolean>(false);
	const [error, setError] = useState<string>("invalid");
	const [awaitingServer, setAwaitingServer] = useState<boolean>(false);
	const [rememberEmail, setRememberEmail] = useState<boolean>(false);
	const [renderOfflineMessage, setRenderOfflineMessage] = useState<boolean>(false);
	const [offlineDiagnostics, setOfflineDiagnostics] = useState<unknown>("");
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
	const [isFocused, setIsFocused] = useState<boolean>(true);
	const [thanksForRegisteringPopupShowing, setThanksForRegisteringPopupShowing] = useState<boolean>(false);
	const [thanksForRegisteringPopupCleared, setThanksForRegisteringPopupCleared] = useState<boolean>(false);

	const handleTextInput = useCallback(
		(text: string, parameter: string) => {
			setLoginError(false);
			dispatch(updateLoginUserDetails({ parameter, content: text }));
		},
		[dispatch]
	);

	const respondToFocus = () => {
		setIsFocused(true);
	};

	const respondToBlur = () => {
		setIsFocused(false);
	};

	useEffect(() => {
		const focusListener = props.navigation.addListener("focus", respondToFocus);
		const blurListener = props.navigation.addListener("blur", respondToBlur);
		const setRememberedEmail = async () => {
			const storedEmail = await AsyncStorage.getItem("rememberedEmail");
			if (storedEmail) {
				handleTextInput(storedEmail, "e_mail");
				setRememberEmail(true);
			}
		};
		setRememberedEmail();
		return () => {
			if (focusListener) {
				focusListener();
			}
			if (blurListener) {
				blurListener();
			}
		};
	}, [props.navigation, handleTextInput]);

	useEffect(() => {
		if (
			!thanksForRegisteringPopupShowing &&
			!thanksForRegisteringPopupCleared &&
			props.route.params?.successfulRegistration === true
		) {
			setThanksForRegisteringPopupShowing(true);
		}
	}, [thanksForRegisteringPopupShowing, thanksForRegisteringPopupCleared, props.route]);

	const loginChef = async () => {
		setAwaitingServer(true);
		if (rememberEmail) {
			AsyncStorage.setItem("rememberedEmail", e_mail);
		} else {
			AsyncStorage.removeItem("rememberedEmail");
		}
		try {
			const response = await postLoginChef({ e_mail, password });
			if ("error" in response) {
				setLoginError(true);
				setError(response.message);
				setAwaitingServer(false);
			} else {
				if (stayingLoggedIn) {
					dispatch(clearLoginUserDetails());
					dispatch(
						updateLoggedInChef({
							id: response.id,
							e_mail: response.e_mail,
							username: response.username,
							auth_token: response.auth_token,
							image_url: response.image_url,
							is_admin: response.is_admin,
							is_member: response.is_member,
						})
					);
					saveToken(response.auth_token);
					delete response.auth_token;
					AsyncStorage.setItem("chef", JSON.stringify(response), () => {
						props.navigation.navigate("CreateChef", { successfulLogin: true }); //this navigate command is used to trigger Apple Keychain.  CreateChef will immediately perform the required actions to login.
					});
				} else {
					dispatch(
						updateLoggedInChef({
							id: response.id,
							e_mail: response.e_mail,
							username: response.username,
							auth_token: response.auth_token,
							image_url: response.image_url,
							is_admin: response.is_admin,
							is_member: response.is_member,
						})
					);
					dispatch(clearLoginUserDetails());
					props.navigation.navigate("CreateChef", { successfulLogin: true }); //thisnavigate command is used to trigger Apple Keychain.  CreateChef will immediately perform the required actions to login.
				}
			}
		} catch (error) {
			setRenderOfflineMessage(true);
			setOfflineDiagnostics(error);
			setAwaitingServer(false);
		}
		// const response = await apiCall(postLoginChef, { e_mail, password });
		// if (response.fail) {
		// 	setRenderOfflineMessage(true);
		// 	setOfflineDiagnostics(response);
		// 	setAwaitingServer(false);
		// } else if (response.error) {
		// 	setLoginError(true);
		// 	setError(response.message);
		// 	setAwaitingServer(false);
		// } else {
		// 	// we don't want to differentiate between response and response.error for security reasons
		// 	if (stayingLoggedIn) {
		// 		dispatch(clearLoginUserDetails());
		// 		dispatch(
		// 			updateLoggedInChef({
		// 				id: response.id,
		// 				e_mail: response.e_mail,
		// 				username: response.username,
		// 				auth_token: response.auth_token,
		// 				image_url: response.image_url,
		// 				is_admin: response.is_admin,
		// 				is_member: response.is_member,
		// 			})
		// 		);
		// 		saveToken(response.auth_token);
		// 		delete response.auth_token;
		// 		AsyncStorage.setItem("chef", JSON.stringify(response), () => {
		// 			props.navigation.navigate("CreateChef", { successfulLogin: true }); //this navigate command is used to trigger Apple Keychain.  CreateChef will immediately perform the required actions to login.
		// 		});
		// 	} else {
		// 		dispatch(
		// 			updateLoggedInChef({
		// 				id: response.id,
		// 				e_mail: response.e_mail,
		// 				username: response.username,
		// 				auth_token: response.auth_token,
		// 				image_url: response.image_url,
		// 				is_admin: response.is_admin,
		// 				is_member: response.is_member,
		// 			})
		// 		);
		// 		dispatch(clearLoginUserDetails());
		// 		props.navigation.navigate("CreateChef", { successfulLogin: true }); //thisnavigate command is used to trigger Apple Keychain.  CreateChef will immediately perform the required actions to login.
		// 	}
		// }
	};

	const forgotPassword = async () => {
		setAwaitingServer(true);
		if (e_mail.length > 0) {
			try {
				const response = await getNewPassword(e_mail);
				setLoginError(true);
				setError(response.message);
			} catch {
				setRenderOfflineMessage(true);
			}
			// const response = await getNewPassword(e_mail);
			// // const response = await apiCall(getNewPassword, e_mail);
			// if (response.fail) {
			// 	setRenderOfflineMessage(true);
			// } else {
			// 	setLoginError(true);
			// 	setError(response.message);
			// }
		} else {
			setLoginError(true);
			setError("forgotPassword");
		}
		setAwaitingServer(false);
	};

	const renderThanksForRegisteringAlertPopup = () => {
		return (
			<AlertPopup
				title={
					"Thanks so much for registering. Please confirm your e-mail address by clicking the link in your welcome e-mail and log in."
				}
				onYes={() => {
					setThanksForRegisteringPopupShowing(false);
					setThanksForRegisteringPopupCleared(true);
					dispatch(clearNewUserDetails());
				}}
				yesText={"Ok"}
			/>
		);
	};

	return (
		<SpinachAppContainer scrollingEnabled={true} awaitingServer={awaitingServer}>
			{renderOfflineMessage && (
				<OfflineMessage
					message={`Sorry, can't log in right now.${"\n"}You appear to be offline.`}
					topOffset={"10%"}
					clearOfflineMessage={() => setRenderOfflineMessage(false)}
					// diagnostics={offlineDiagnostics}
				/>
			)}
			{thanksForRegisteringPopupShowing && renderThanksForRegisteringAlertPopup()}
			<TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{ flex: 1 }}>
				<View style={styles.logoContainer}>
					<Image
						style={styles.logo}
						resizeMode={"contain"}
						source={require("../dataComponents/yellowLogo.png")}
					/>
				</View>
				<View style={[centralStyles.formContainer, { marginTop: responsiveHeight(15) }]}>
					<View style={centralStyles.formSection}>
						<View style={centralStyles.formInputContainer}>
							<View style={centralStyles.formInputWhiteBackground}>
								<Text style={centralStyles.formTitle} maxFontSizeMultiplier={1.5}>
									Welcome, chef!{"\n"} Please log in or register
								</Text>
							</View>
						</View>
					</View>
					<View style={centralStyles.formSection}>
						<View style={centralStyles.formInputContainer}>
							<View style={centralStyles.formInputWhiteBackground}>
								<TextInput
									maxFontSizeMultiplier={2}
									style={centralStyles.formInput}
									value={e_mail}
									placeholder="e-mail"
									keyboardType="email-address"
									autoCapitalize="none"
									autoComplete="email"
									textContentType="username"
									onChangeText={(text) => handleTextInput(text, "e_mail")}
									testID={"usernameInput"}
								/>
							</View>
						</View>
					</View>
					<View style={centralStyles.formSection}>
						<View style={centralStyles.formInputContainer}>
							<View style={centralStyles.formInputWhiteBackground}>
								{isFocused && ( //this conditional helps ios properly recognise both password fields in the createchef form
									<TextInput
										maxFontSizeMultiplier={2}
										style={centralStyles.formInput}
										value={password}
										placeholder="password"
										autoCapitalize="none"
										autoComplete="password"
										textContentType="password"
										secureTextEntry={!passwordVisible}
										onChangeText={(text) => handleTextInput(text, "password")}
										testID={"passwordInput"}
									/>
								)}
								<TouchableOpacity
									style={centralStyles.hiddenToggle}
									onPress={() => setPasswordVisible(!passwordVisible)}
									testID={"visibilityButton"}
								>
									<Icon
										style={centralStyles.hiddenToggleIcon}
										size={responsiveHeight(4)}
										name={passwordVisible ? "eye-off" : "eye"}
									></Icon>
								</TouchableOpacity>
							</View>
						</View>
						{loginError && (
							<View style={centralStyles.formErrorView}>
								{error === "invalid" && (
									<Text
										testID={"invalidErrorMessage"}
										maxFontSizeMultiplier={2}
										style={centralStyles.formErrorText}
									>
										e-mail and password combination not recognized
									</Text>
								)}
								{error === "password_expired" && (
									<Text
										testID={"passwordExpiredErrorMessage"}
										maxFontSizeMultiplier={2}
										style={centralStyles.formErrorText}
									>
										Automatically generated password has expired. Please reset your password.
									</Text>
								)}
								{error === "activation" && (
									<Text
										testID={"activationErrorMessage"}
										maxFontSizeMultiplier={2}
										style={centralStyles.formErrorText}
									>
										Account not yet activated. Please click the link in your confirmation e-mail.
										(Don&apos;t forget to check spam!)
									</Text>
								)}
								{error === "deactivated" && (
									<Text
										testID={"deactivatedErrorMessage"}
										maxFontSizeMultiplier={2}
										style={centralStyles.formErrorText}
									>
										This account was deactivated. Reset your password to reactivate your account.
									</Text>
								)}
								{error === "forgotPassword" && e_mail.length > 0 && (
									<Text
										testID={"forgotPasswordErrorMessage"}
										maxFontSizeMultiplier={2}
										style={centralStyles.formErrorText}
									>
										Thanks. If this e-mail address has an account we&apos;ll send you a new
										password. Please check your e-mail.
									</Text>
								)}
								{error === "forgotPassword" && e_mail.length == 0 && (
									<Text
										testID={"noUsernameForgotPasswordErrorMessage"}
										maxFontSizeMultiplier={2}
										style={centralStyles.formErrorText}
									>
										Please enter your e-mail and hit the &apos;Forgot Password&apos; button again.
									</Text>
								)}
								{error === "reactivate" && (
									<Text
										testID={"reactivateErrorMessage"}
										maxFontSizeMultiplier={2}
										style={centralStyles.formErrorText}
									>
										We&apos;ve e-mailed you a link to re-activate your account.
									</Text>
								)}
							</View>
						)}
					</View>
					<View style={centralStyles.formSection}>
						<View style={centralStyles.formInputContainer}>
							<TouchableOpacity
								activeOpacity={1}
								style={centralStyles.yellowRectangleButton}
								onPress={() => setRememberEmail(!rememberEmail)}
								testID={"rememberEmailButton"}
							>
								<Text style={centralStyles.greenButtonText} maxFontSizeMultiplier={1.25}>
									Remember{"\n"}email
								</Text>
								<SwitchSized
									value={rememberEmail}
									onValueChange={(value) => setRememberEmail(value)}
									testID={"rememberEmailToggle"}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={1}
								style={centralStyles.yellowRectangleButton}
								onPress={() => dispatch(stayLoggedIn(!stayingLoggedIn))}
								testID={"stayLoggedInButton"}
							>
								<Text style={centralStyles.greenButtonText} maxFontSizeMultiplier={1.5}>
									Stay{"\n"} logged in
								</Text>
								<SwitchSized
									value={stayingLoggedIn}
									onValueChange={(value) => dispatch(stayLoggedIn(value))}
									testID={"stayLoggedInToggle"}
								/>
							</TouchableOpacity>
						</View>
					</View>
					<View style={centralStyles.formSection}>
						<View style={centralStyles.formInputContainer}>
							<TouchableOpacity
								style={centralStyles.yellowRectangleButton}
								activeOpacity={0.7}
								onPress={() => props.navigation.navigate("CreateChef")}
								testID={"registerButton"}
							>
								<Icon
									style={centralStyles.greenButtonIcon}
									size={responsiveHeight(4)}
									name="account-plus"
								></Icon>
								<Text style={centralStyles.greenButtonText} maxFontSizeMultiplier={1.5}>
									Register
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={centralStyles.yellowRectangleButton}
								activeOpacity={0.7}
								onPress={forgotPassword}
								testID={"forgotPasswordButton"}
							>
								<Icon
									style={centralStyles.greenButtonIcon}
									size={responsiveHeight(4)}
									name="lock-open"
								></Icon>
								<Text style={centralStyles.greenButtonText} maxFontSizeMultiplier={1.7}>
									Forgot{"\n"}password
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={centralStyles.formSection}>
						<View style={centralStyles.formInputContainer}>
							<TouchableOpacity
								style={[
									centralStyles.yellowRectangleButton,
									{ maxWidth: "100%", width: "100%", justifyContent: "center" },
								]}
								activeOpacity={0.7}
								onPress={() => loginChef()}
								testID={"loginButton"}
							>
								<Icon
									style={centralStyles.greenButtonIcon}
									size={responsiveHeight(4)}
									name="login"
								></Icon>
								<Text
									style={[centralStyles.greenButtonText, { marginLeft: responsiveWidth(4) }]}
									maxFontSizeMultiplier={2}
								>
									Login
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</SpinachAppContainer>
	);
}
