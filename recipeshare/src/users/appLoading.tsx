import React, { useEffect, useCallback } from "react";
import { View, ImageBackground, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadToken } from "../auxFunctions/saveLoadToken";
import { styles } from "./usersStyleSheet";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

type OwnProps = {
	setLoadedAndLoggedIn: (loadedAndLoggedIn: { loaded: boolean; loggedIn: boolean }) => void;
};

export default function AppLoading({ setLoadedAndLoggedIn }: OwnProps) {
	const stayLoggedIn = useAppSelector(state => state.stayLoggedIn);
	const dispatch = useAppDispatch();

	const setStayLoggedIn = useCallback(
		(value) => {
			dispatch({ type: "STAY_LOGGED_IN", value: value });
		},
		[dispatch]
	);

	const updateLoggedInChefInState = useCallback(
		(id, e_mail, username, auth_token, image_url, is_admin, is_member) => {
			dispatch({
				type: "UPDATE_LOGGED_IN_CHEF",
				id: id,
				e_mail: e_mail,
				username: username,
				auth_token: auth_token,
				image_url: image_url,
				is_admin: is_admin,
				is_member: is_member,
			});
		},
		[dispatch]
	);

	useEffect(() => {
		const checkLoggedIn = async () => {
			const token = await loadToken();
			if (token) {
				const storedChef = JSON.parse(await AsyncStorage.getItem("chef"));
				if (storedChef != null) {
					const { id, e_mail, username, auth_token, image_url, is_admin, is_member } = storedChef;
					storedChef.auth_token = token;
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
	}, [stayLoggedIn, setStayLoggedIn, updateLoggedInChefInState, setLoadedAndLoggedIn]);

	return (
		<View style={styles.mainPageContainer}>
			<ImageBackground
				source={require("../dataComponents/spinach.jpg")}
				style={styles.background}
				imageStyle={styles.backgroundImageStyle}
			>
				<View style={styles.logoContainer}>
					<Image
						style={styles.logo}
						resizeMode={"contain"}
						source={require("../dataComponents/yellowLogo.png")}
						testID={"yellowLogo"}
					/>
				</View>
			</ImageBackground>
		</View>
	);
}
