import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteToken } from "../src/auxFunctions/saveLoadToken";
import { styles } from "./drawerStyleSheet";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { responsiveWidth, responsiveHeight, responsiveFontSize } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars
import { DrawerContentScrollView } from "@react-navigation/drawer";
import * as Device from "expo-device";

const CustomDrawer = (props) => {
	const [isTablet, setIsTablet] = useState(false);
	const loggedInChef = useSelector((state) => state.loggedInChef);

	useEffect(() => {
		const getDeviceType = async () => {
			let deviceType = await Device.getDeviceTypeAsync();
			if (deviceType === 2) {
				setIsTablet(true);
			}
		};
		getDeviceType();
	}, []);

	const logout = () => {
		deleteToken();
		AsyncStorage.removeItem("chef", () => {
			props.setLoadedAndLoggedIn({ loaded: true, loggedIn: false });
		});
	};

	return (
		<DrawerContentScrollView {...props}>
			<View style={[styles.mainPageContainer, { height: responsiveHeight(90) }]}>
				<View style={styles.headerContainer}>
					<View style={styles.headerTopContainer}>
						<Image
							style={styles.logo}
							resizeMode="contain"
							source={require("../src/dataComponents/greenLogo.png")}
						/>
					</View>
				</View>
				<View style={styles.horizontalRule}></View>
				<ScrollView style={styles.routesContainer}>
					<TouchableOpacity
						style={styles.routeLink}
						onPress={() => props.navigation.navigate("MyRecipeBookCover")}
					>
						<Icon name="book-open-page-variant" size={responsiveHeight(3.5)} style={styles.icon} />
						<View style={styles.routeNameContainer}>
							<Text
								style={[
									styles.routeName,
									{ fontSize: isTablet ? responsiveFontSize(2) : responsiveFontSize(2.7) },
								]}
								maxFontSizeMultiplier={2}
							>
								My recipe book
							</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.routeLink}
						onPress={() => props.navigation.navigate("BrowseRecipesCover")}
					>
						<Icon name="food" size={responsiveHeight(3.5)} style={styles.icon} />
						<View style={styles.routeNameContainer}>
							<Text
								style={[
									styles.routeName,
									{ fontSize: isTablet ? responsiveFontSize(2) : responsiveFontSize(2.7) },
								]}
								maxFontSizeMultiplier={2}
							>
								All recipes {"&"} chefs
							</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.routeLink}
						onPress={() => props.navigation.navigate("ProfileCover")}
					>
						<Icon name="account" size={responsiveHeight(3.5)} style={styles.icon} />
						<View style={styles.routeNameContainer}>
							<Text
								style={[
									styles.routeName,
									{ fontSize: isTablet ? responsiveFontSize(2) : responsiveFontSize(2.7) },
								]}
								maxFontSizeMultiplier={2}
							>
								My profile
							</Text>
						</View>
					</TouchableOpacity>
				</ScrollView>
				<View style={styles.horizontalRule}></View>
				<View style={styles.bottomContainer}>
					<View style={styles.bottomLeftContainer}>
						<Text
							style={[
								styles.userNameHeader,
								{ fontSize: isTablet ? responsiveFontSize(1.7) : responsiveFontSize(2.5) },
							]}
							maxFontSizeMultiplier={1.5}
						>
							Logged in as:
						</Text>
						<TouchableOpacity onPress={() => props.navigation.navigate("Profile")}>
							<Text
								style={[
									styles.userName,
									{
										fontSize: isTablet ? responsiveFontSize(1.9) : responsiveFontSize(2.9),
									},
								]}
								maxFontSizeMultiplier={1.5}
							>
								{loggedInChef.username}
							</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity
						style={styles.bottomRightContainer}
						onPress={() => props.navigation.navigate("Profile")}
					>
						<AvatarImage image_url={loggedInChef.image_url} />
					</TouchableOpacity>
				</View>
				<View style={styles.horizontalRule}></View>
				<View style={styles.logoutContainer}>
					<TouchableOpacity style={[styles.routeLink, { height: responsiveHeight(8) }]} onPress={logout}>
						<Icon name="logout" size={responsiveHeight(3.5)} style={styles.icon} />
						<View style={styles.routeNameContainer}>
							<Text
								style={[
									styles.routeName,
									{ fontSize: isTablet ? responsiveFontSize(2) : responsiveFontSize(2.7) },
								]}
								maxFontSizeMultiplier={2}
							>
								Logout
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</DrawerContentScrollView>
	);
};

function AvatarImage(props) {
	const URL = props.image_url;
	if (!URL) {
		return <Image style={styles.avatarThumbnail} source={require("../src/dataComponents/default-chef.jpg")} />;
	} else {
		return <Image style={styles.avatarThumbnail} source={{ uri: URL }} />;
	}
}

export default CustomDrawer;
