import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import OfflineMessage from "../components/offlineMessage/offlineMessage";
import React from "react";
import { databaseURL } from "../constants/databaseURL";
import { styles } from "./chefListStyleSheet";

export default class ChefCard extends React.PureComponent {
	render() {
		return (
			<View style={styles.chefCard}>
				{this.props.renderOfflineMessage?.includes(this.props.id) && (
					<OfflineMessage
						message={`Sorry, can't see chef right now.${"\n"}You appear to be offline.`}
						topOffset={"25%"}
						clearOfflineMessage={() => {
							this.props.clearOfflineMessage(this.props.id);
						}}
					/>
				)}
				<TouchableOpacity
					style={styles.chefCardTopContainer}
					onPress={() => this.props.navigateToChefDetails(this.props.id)}
				>
					<View style={styles.chefCardTopLeftContainer}>
						<View style={styles.chefCardTopLeftUpperContainer}>
							<View activeOpacity={0.7}>
								<Text maxFontSizeMultiplier={2} style={styles.chefCardHighlighted}>
									{this.props.username}
								</Text>
							</View>
						</View>
						<View style={styles.chefCardTopLeftMiddleContainer}>
							<View>
								<Text maxFontSizeMultiplier={2} style={styles.chefCardTopItalic}>
									{this.props.country}
								</Text>
							</View>
						</View>
						<ScrollView nestedScrollEnabled={true} style={styles.chefCardTopLeftLowerContainer}>
							<Text maxFontSizeMultiplier={2} style={styles.chefCardTopOther}>
								{this.props.profile_text}
							</Text>
						</ScrollView>
					</View>
					<View style={styles.chefCardTopRightContainer}>
						<AvatarImage chefimage_url={this.props.image_url} />
					</View>
				</TouchableOpacity>
				<View style={styles.chefCardBottomContainer}>
					<TouchableOpacity
						style={styles.chefCardBottomSubContainers}
						onPress={
							parseInt(this.props.user_chef_following) > 0
								? () => this.props.unFollowChef(this.props.id)
								: () => this.props.followChef(this.props.id)
						}
					>
						{parseInt(this.props.user_chef_following) > 0 ? (
							<Icon name="account-multiple-minus" size={responsiveHeight(3.5)} style={styles.icon} />
						) : (
							<Icon
								name="account-multiple-plus-outline"
								size={responsiveHeight(3.5)}
								style={styles.icon}
							/>
						)}
						<Text maxFontSizeMultiplier={2} style={styles.chefCardBottomOther}>
							{this.props.followers === null ? 0 : this.props.followers}
						</Text>
					</TouchableOpacity>
					<View style={styles.chefCardBottomSubContainers}>
						<Icon name="food" size={responsiveHeight(3.5)} style={styles.icon} />
						<Text maxFontSizeMultiplier={2} style={styles.chefCardBottomOther}>
							{this.props.recipe_count ?? 0}
						</Text>
					</View>
					<View style={styles.chefCardBottomSubContainers}>
						<Icon name="heart" size={responsiveHeight(3.5)} style={styles.icon} />
						<Text maxFontSizeMultiplier={2} style={styles.chefCardBottomOther}>
							{this.props.recipe_likes_received === null ? 0 : this.props.recipe_likes_received}
						</Text>
					</View>
				</View>
			</View>
		);
	}
}

function AvatarImage(chefimage_url) {
	const URL = chefimage_url.chefimage_url;
	if (!URL) {
		return (
			<Image
				style={styles.avatarThumbnail}
				source={require("../../assets/images/default-chef.jpg")}
				resizeMode={"cover"}
			/>
		);
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
