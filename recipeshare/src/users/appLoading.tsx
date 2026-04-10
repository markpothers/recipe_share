import * as Device from "expo-device";

import { Image, ImageBackground, View } from "react-native";
import React, { useEffect } from "react";
import { initializeAuthBootstrap, useAppDispatch } from "../redux";

import { setDeviceType } from "../redux/rootReducer";
import { styles } from "./usersStyleSheet";
import spinachJpg from "../../assets/images/spinach.jpg";
import yellowLogo from "../../assets/images/yellowLogo.png";

export default function AppLoading() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		const getDeviceType = async () => {
			const deviceType = await Device.getDeviceTypeAsync();
			dispatch(setDeviceType(deviceType));
		};
		getDeviceType();
		dispatch(initializeAuthBootstrap());
	}, [dispatch]);

	return (
		<View style={styles.mainPageContainer}>
			<ImageBackground
				source={spinachJpg}
				style={styles.background}
				imageStyle={styles.backgroundImageStyle}
			>
				<View style={styles.logoContainer}>
					<Image
						style={styles.logo}
						resizeMode={"contain"}
						source={yellowLogo}
						testID={"yellowLogo"}
					/>
				</View>
			</ImageBackground>
		</View>
	);
}
