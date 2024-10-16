import * as Device from "expo-device";

import { AppLoadingNavigationProps, AppLoadingRouteProps } from "../navigation";
import { Image, ImageBackground, View } from "react-native";
import React, { useCallback, useEffect } from "react";
import { stayLoggedIn, updateLoggedInChef, useAppDispatch } from "../redux";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginChef } from "../centralTypes";
import { loadToken } from "../auxFunctions/saveLoadToken";
import { setDeviceType } from "../redux/rootReducer";
import { styles } from "./usersStyleSheet";

type OwnProps = {
	navigation: AppLoadingNavigationProps;
	route: AppLoadingRouteProps;
	setLoadedAndLoggedIn: (args: { loaded: boolean; loggedIn: boolean }) => void;
};
export default function AppLoading({ setLoadedAndLoggedIn }: OwnProps) {
	// const stayLoggedIn = useAppSelector((state) => state.stayLoggedIn);
	const dispatch = useAppDispatch();

	const setStayLoggedIn = useCallback(
		(value: boolean) => {
			// dispatch({ type: "STAY_LOGGED_IN", value: value });
			dispatch(stayLoggedIn(value));
		},
		[dispatch]
	);

	const updateLoggedInChefInState = useCallback(
		(
			id: number,
			e_mail: string,
			username: string,
			auth_token: string,
			image_url: string,
			is_admin: boolean,
			is_member: boolean
		) => {
			// dispatch({
			// 	type: "UPDATE_LOGGED_IN_CHEF",
			// 	id: id,
			// 	e_mail: e_mail,
			// 	username: username,
			// 	auth_token: auth_token,
			// 	image_url: image_url,
			// 	is_admin: is_admin,
			// 	is_member: is_member,
			// });
			dispatch(
				updateLoggedInChef({
					id: id,
					e_mail: e_mail,
					username: username,
					auth_token: auth_token,
					image_url: image_url,
					is_admin: is_admin,
					is_member: is_member,
				})
			);
		},
		[dispatch]
	);

	useEffect(() => {
		const getDeviceType = async () => {
			const deviceType = await Device.getDeviceTypeAsync();
			dispatch(setDeviceType(deviceType));
		};
		getDeviceType();
		const checkLoggedIn = async () => {
			const token = await loadToken();
			if (token) {
				const storedChef: LoginChef = JSON.parse(await AsyncStorage.getItem("chef"));
				if (storedChef != null) {
					storedChef.auth_token = token;
					const { id, e_mail, username, auth_token, image_url, is_admin, is_member } = storedChef;
					setStayLoggedIn(true);
					updateLoggedInChefInState(id, e_mail, username, auth_token, image_url, is_admin, is_member);
					await setLoadedAndLoggedIn({ loaded: true, loggedIn: true });
				} else {
					await setLoadedAndLoggedIn({ loaded: true, loggedIn: false });
				}
			} else {
				await setLoadedAndLoggedIn({ loaded: true, loggedIn: false });
			}
		};
		checkLoggedIn();
	}, [dispatch, setStayLoggedIn, updateLoggedInChefInState, setLoadedAndLoggedIn]);

	return (
		<View style={styles.mainPageContainer}>
			<ImageBackground
				source={require("../../assets/images/spinach.jpg")}
				style={styles.background}
				imageStyle={styles.backgroundImageStyle}
			>
				<View style={styles.logoContainer}>
					<Image
						style={styles.logo}
						resizeMode={"contain"}
						source={require("../../assets/images/yellowLogo.png")}
						testID={"yellowLogo"}
					/>
				</View>
			</ImageBackground>
		</View>
	);
}
