import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import { Chef } from "../centralTypes";
import { databaseURL } from "../constants/databaseURL";
import defaultChef from "../../assets/images/default-chef.jpg";
import { styles } from "./chefDetailsStyleSheet";

type OwnProps = Chef & {
	followChef: (chefID: number) => void;
	unFollowChef: (chefID: number) => void;
	notProfile: boolean;
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

export default function ChefDetailsCard(props: OwnProps) {
	const renderFollowButton = () => {
		return (
			<React.Fragment>
				<TouchableOpacity
					style={styles.chefRecipesFollowContainer}
					onPress={
						props.chef_followed === true
							? () => props.unFollowChef(props.chef.id)
							: () => props.followChef(props.chef.id)
					}
				>
					{props.chef_followed === true ? (
						<Icon name="account-multiple-minus" size={responsiveHeight(3.5)} style={styles.icon} />
					) : (
						<Icon name="account-multiple-plus-outline" size={responsiveHeight(3.5)} style={styles.icon} />
					)}
				</TouchableOpacity>
				<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRecipesFollowNumber}>
					{props.followers}
				</Text>
			</React.Fragment>
		);
	};

	return (
		<View>
			<View style={styles.chefCard}>
				<View style={styles.chefCardTopContainer}>
					<View style={styles.chefCardTopLeftContainer}>
						<View style={styles.chefCardTopLeftUpperContainer}>
							<View style={styles.nameContainer}>
								<Text maxFontSizeMultiplier={2} style={styles.chefCardHighlighted}>
									{props.chef.username}
								</Text>
							</View>
						</View>
						<View style={styles.chefCardTopLeftMiddleContainer}>
							<View>
								<Text maxFontSizeMultiplier={2} style={styles.chefCardTopItalic}>
									{props.chef.country}
								</Text>
							</View>
						</View>
						<ScrollView nestedScrollEnabled={true} style={styles.chefCardTopLeftLowerContainer}>
							<Text maxFontSizeMultiplier={2} style={styles.chefCardTopOther}>
								{props.chef.profile_text}
							</Text>
						</ScrollView>
					</View>
					<View style={styles.chefCardTopRightContainer}>
						<AvatarImage chefimage_url={props.chef.image_url} />
					</View>
				</View>
			</View>
			<View>
				<View style={[styles.chefDetailsStats, { justifyContent: "flex-start" }]}>
					<Icon name="food" size={responsiveHeight(3.5)} style={styles.icon} />
					<Text maxFontSizeMultiplier={2} style={styles.chefRecipesRowContents}>
						Recipes created:
					</Text>
					<Text maxFontSizeMultiplier={2} style={styles.chefRecipesRowContents}>
						{props.recipes}
					</Text>
					{/* {props.notProfile ? renderFollowButton() : null} */}
				</View>
				<View style={[styles.chefDetailsStats, { justifyContent: "flex-end" }]}>
					<Text
						maxFontSizeMultiplier={1.5}
						style={[styles.chefDetailsColumnHeaders, { marginRight: responsiveWidth(3) }]}
					>
						Given:
					</Text>
					<Text
						maxFontSizeMultiplier={1.5}
						style={[styles.chefDetailsColumnHeaders, { marginRight: responsiveWidth(1) }]}
					>
						Received:
					</Text>
				</View>
				<View style={styles.chefDetailsStats}>
					{props.chef_shared === true ? (
						<Icon name="share" size={responsiveHeight(3.5)} style={styles.icon} />
					) : (
						<Icon name="share-outline" size={responsiveHeight(3.5)} style={styles.icon} />
					)}
					<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowTitle}>
						Recipe re-shares:
					</Text>
					<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
						{props.re_shares}
					</Text>
					<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
						{props.re_shares_received}
					</Text>
				</View>
				<View style={styles.chefDetailsStats}>
					{props.chef_liked === true ? (
						<Icon name="heart" size={responsiveHeight(3.5)} style={styles.icon} />
					) : (
						<Icon name="heart-outline" size={responsiveHeight(3.5)} style={styles.icon} />
					)}
					<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowTitle}>
						Recipe likes:
					</Text>
					<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
						{props.recipe_likes}
					</Text>
					<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
						{props.recipe_likes_received}
					</Text>
				</View>
				<View style={styles.chefDetailsStats}>
					{props.chef_followed === true ? (
						<Icon name="account-multiple" size={responsiveHeight(3.5)} style={styles.icon} />
					) : (
						<Icon name="account-multiple-outline" size={responsiveHeight(3.5)} style={styles.icon} />
					)}
					<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowTitle}>
						Follows:
					</Text>
					<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
						{props.following}
					</Text>
					<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
						{props.followers}
					</Text>
				</View>
				<View style={styles.chefDetailsStats}>
					{props.chef_commented === true ? (
						<Icon name="comment" size={responsiveHeight(3.5)} style={styles.icon} />
					) : (
						<Icon name="comment-outline" size={responsiveHeight(3.5)} style={styles.icon} />
					)}
					<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowTitle}>
						Comments:
					</Text>
					<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
						{props.comments}
					</Text>
					<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
						{props.comments_received}
					</Text>
				</View>
				<View style={styles.chefDetailsStats}>
					{props.chef_make_piced === true ? (
						<Icon name="image" size={responsiveHeight(3.5)} style={styles.icon} />
					) : (
						<Icon name="image-outline" size={responsiveHeight(3.5)} style={styles.icon} />
					)}
					<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowTitle}>
						Pictures:
					</Text>
					<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
						{props.make_pics}
					</Text>
					<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
						{props.make_pics_received}
					</Text>
				</View>
			</View>
		</View>
	);
}
