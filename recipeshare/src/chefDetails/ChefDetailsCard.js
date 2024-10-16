import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import { databaseURL } from "../constants/databaseURL";
import { styles } from "./chefDetailsStyleSheet";

export default class ChefDetailsCard extends React.PureComponent {
	renderFollowButton = () => {
		return (
			<React.Fragment>
				<TouchableOpacity
					style={styles.chefRecipesFollowContainer}
					onPress={
						this.props.chef_followed === true
							? () => this.props.unFollowChef(this.props.chef.id)
							: () => this.props.followChef(this.props.chef.id)
					}
				>
					{this.props.chef_followed === true ? (
						<Icon name="account-multiple-minus" size={responsiveHeight(3.5)} style={styles.icon} />
					) : (
						<Icon name="account-multiple-plus-outline" size={responsiveHeight(3.5)} style={styles.icon} />
					)}
				</TouchableOpacity>
				<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRecipesFollowNumber}>
					{this.props.followers.length}
				</Text>
			</React.Fragment>
		);
	};

	render() {
		// console.log(responsiveHeight(4))
		return (
			<View>
				<View style={styles.chefCard}>
					<View style={styles.chefCardTopContainer}>
						<View style={styles.chefCardTopLeftContainer}>
							<View style={styles.chefCardTopLeftUpperContainer}>
								<View style={styles.nameContainer}>
									<Text maxFontSizeMultiplier={2} style={styles.chefCardHighlighted}>
										{this.props.chef.username}
									</Text>
								</View>
							</View>
							<View style={styles.chefCardTopLeftMiddleContainer}>
								<View>
									<Text maxFontSizeMultiplier={2} style={styles.chefCardTopItalic}>
										{this.props.chef.country}
									</Text>
								</View>
							</View>
							<ScrollView nestedScrollEnabled={true} style={styles.chefCardTopLeftLowerContainer}>
								<Text maxFontSizeMultiplier={2} style={styles.chefCardTopOther}>
									{this.props.chef.profile_text}
								</Text>
							</ScrollView>
						</View>
						<View style={styles.chefCardTopRightContainer}>
							<AvatarImage chefimage_url={this.props.chef.image_url} />
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
							{this.props.recipes}
						</Text>
						{/* {this.props.notProfile ? this.renderFollowButton() : null} */}
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
						{this.props.chef_shared === true ? (
							<Icon name="share" size={responsiveHeight(3.5)} style={styles.icon} />
						) : (
							<Icon name="share-outline" size={responsiveHeight(3.5)} style={styles.icon} />
						)}
						<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowTitle}>
							Recipe re-shares:
						</Text>
						<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
							{this.props.re_shares}
						</Text>
						<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
							{this.props.re_shares_received}
						</Text>
					</View>
					<View style={styles.chefDetailsStats}>
						{this.props.chef_liked === true ? (
							<Icon name="heart" size={responsiveHeight(3.5)} style={styles.icon} />
						) : (
							<Icon name="heart-outline" size={responsiveHeight(3.5)} style={styles.icon} />
						)}
						<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowTitle}>
							Recipe likes:
						</Text>
						<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
							{this.props.recipe_likes}
						</Text>
						<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
							{this.props.recipe_likes_received}
						</Text>
					</View>
					{/* <View style={styles.chefDetailsStats}>
                    {this.props.chef_made === true ? <Icon name='food-off' size={responsiveHeight(3.5)} style={styles.icon}/> : <Icon name='food' size={responsiveHeight(3.5)} style={styles.icon}/> }
                    <Text style={[styles.chefDetailsRowTitle]}>Recipes made:</Text>
                    <Text style={[styles.chefDetailsRowContents]}>{this.props.recipe_makes.length}</Text>
                    <Text style={[styles.chefDetailsRowContents]}>{this.props.recipe_makes_received.length}</Text>
                  </View> */}
					<View style={styles.chefDetailsStats}>
						{this.props.chef_followed === true ? (
							<Icon name="account-multiple" size={responsiveHeight(3.5)} style={styles.icon} />
						) : (
							<Icon name="account-multiple-outline" size={responsiveHeight(3.5)} style={styles.icon} />
						)}
						<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowTitle}>
							Follows:
						</Text>
						<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
							{this.props.following}
						</Text>
						<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
							{this.props.followers}
						</Text>
					</View>
					<View style={styles.chefDetailsStats}>
						{this.props.chef_commented === true ? (
							<Icon name="comment" size={responsiveHeight(3.5)} style={styles.icon} />
						) : (
							<Icon name="comment-outline" size={responsiveHeight(3.5)} style={styles.icon} />
						)}
						<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowTitle}>
							Comments:
						</Text>
						<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
							{this.props.comments}
						</Text>
						<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
							{this.props.comments_received}
						</Text>
					</View>
					<View style={styles.chefDetailsStats}>
						{this.props.chef_chef_make_piced === true ? (
							<Icon name="image" size={responsiveHeight(3.5)} style={styles.icon} />
						) : (
							<Icon name="image-outline" size={responsiveHeight(3.5)} style={styles.icon} />
						)}
						<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowTitle}>
							Pictures:
						</Text>
						<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
							{this.props.make_pics}
						</Text>
						<Text maxFontSizeMultiplier={2} style={styles.chefDetailsRowContents}>
							{this.props.make_pics_received}
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
