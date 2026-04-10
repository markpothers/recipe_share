import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { OfflineMessage } from "../components";
import React from "react";
import { ListChef } from "../centralTypes";
import { databaseURL } from "../constants/databaseURL";
import defaultChef from "../../assets/images/default-chef.jpg";
import { styles } from "./chefListStyleSheet";

type OwnProps = ListChef & {
	navigateToChefDetails: (chefID: number) => void;
	followChef: (chefID: number) => void;
	unFollowChef: (chefID: number) => void;
	renderOfflineMessage: number[];
	clearOfflineMessage: (chefID: number) => void;
};

function AvatarImage({ chefimage_url }: { chefimage_url: string | { uri: string } | null }) {
	const URL = chefimage_url;
	if (!URL) {
		return <Image style={styles.avatarThumbnail} source={defaultChef} resizeMode={"cover"} />;
	} else if (typeof URL === "object") {
		return (
			<Image
				style={styles.avatarThumbnail}
				source={URL.uri.startsWith("http") ? { uri: URL.uri } : { uri: `${databaseURL}${URL.uri}` }}
				resizeMode={"cover"}
			/>
		);
	} else {
		return (
			<Image
				style={styles.avatarThumbnail}
				source={URL.startsWith("http") ? { uri: URL } : { uri: `${databaseURL}${URL}` }}
				resizeMode={"cover"}
			/>
		);
	}
}

export default function ChefCard(props: OwnProps) {
	return (
		<View style={styles.chefCard}>
			{props.renderOfflineMessage?.includes(props.id) && (
				<OfflineMessage
					message={`Sorry, can't see chef right now.${"\n"}You appear to be offline.`}
					topOffset={"25%"}
					clearOfflineMessage={() => {
						props.clearOfflineMessage(props.id);
					}}
				/>
			)}
			<TouchableOpacity style={styles.chefCardTopContainer} onPress={() => props.navigateToChefDetails(props.id)}>
				<View style={styles.chefCardTopLeftContainer}>
					<View style={styles.chefCardTopLeftUpperContainer}>
						<View activeOpacity={0.7}>
							<Text maxFontSizeMultiplier={2} style={styles.chefCardHighlighted}>
								{props.username}
							</Text>
						</View>
					</View>
					<View style={styles.chefCardTopLeftMiddleContainer}>
						<View>
							<Text maxFontSizeMultiplier={2} style={styles.chefCardTopItalic}>
								{props.country}
							</Text>
						</View>
					</View>
					<ScrollView nestedScrollEnabled={true} style={styles.chefCardTopLeftLowerContainer}>
						<Text maxFontSizeMultiplier={2} style={styles.chefCardTopOther}>
							{props.profile_text}
						</Text>
					</ScrollView>
				</View>
				<View style={styles.chefCardTopRightContainer}>
					<AvatarImage chefimage_url={props.image_url} />
				</View>
			</TouchableOpacity>
			<View style={styles.chefCardBottomContainer}>
				<TouchableOpacity
					style={styles.chefCardBottomSubContainers}
					onPress={
						props.user_chef_following > 0 ? () => props.unFollowChef(props.id) : () => props.followChef(props.id)
					}
				>
					{props.user_chef_following > 0 ? (
						<Icon name="account-multiple-minus" size={responsiveHeight(3.5)} style={styles.icon} />
					) : (
						<Icon
							name="account-multiple-plus-outline"
							size={responsiveHeight(3.5)}
							style={styles.icon}
						/>
					)}
					<Text maxFontSizeMultiplier={2} style={styles.chefCardBottomOther}>
						{props.followers === null ? 0 : props.followers}
					</Text>
				</TouchableOpacity>
				<View style={styles.chefCardBottomSubContainers}>
					<Icon name="food" size={responsiveHeight(3.5)} style={styles.icon} />
					<Text maxFontSizeMultiplier={2} style={styles.chefCardBottomOther}>
						{props.recipe_count ?? 0}
					</Text>
				</View>
				<View style={styles.chefCardBottomSubContainers}>
					<Icon name="heart" size={responsiveHeight(3.5)} style={styles.icon} />
					<Text maxFontSizeMultiplier={2} style={styles.chefCardBottomOther}>
						{props.recipe_likes_received === null ? 0 : props.recipe_likes_received}
					</Text>
				</View>
			</View>
		</View>
	);
}
