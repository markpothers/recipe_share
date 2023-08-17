import { Image, Text, TouchableOpacity, View } from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import { responsiveHeight } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars
import { styles } from "../recipeDetailsStyleSheet";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultChefImage = require("../../dataComponents/default-chef.jpg");

type OwnProps = {
	loggedInChefID: number;
	chef_id: number;
	is_admin: boolean;
	id: number;
	image_url: string;
	username: string;
	comment: string;
	navigateToChefDetails: (chef_id: number) => void;
	askDeleteComment: (comment_id: number) => void;
};

const RecipeComment = ({
	loggedInChefID,
	chef_id,
	is_admin,
	id,
	image_url,
	username,
	comment,
	navigateToChefDetails,
	askDeleteComment,
}: OwnProps) => {
	// export default class RecipeComment extends React.PureComponent {
	const renderCommentDeleteButton = () => {
		if (loggedInChefID == chef_id || is_admin) {
			return (
				<TouchableOpacity
					style={styles.commentTrashCanButton}
					onPress={() => askDeleteComment(id)}
					testID={"deleteCommentButton"}
					accessibilityLabel="delete comment"
				>
					<Icon
						name="trash-can-outline"
						size={responsiveHeight(3.5)}
						style={[styles.icon, styles.commentTrashCan]}
					/>
				</TouchableOpacity>
			);
		}
	};

	// render() {
	// console.log(this.props)
	const imageUrl = image_url ? { uri: image_url } : defaultChefImage;
	return (
		<View style={styles.commentContainer}>
			<View style={styles.commentLeftContainer}>
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => navigateToChefDetails(chef_id)}
					testID={"navigateToChefImageButton"}
				>
					<Image style={styles.avatarThumbnail} source={imageUrl} />
				</TouchableOpacity>
			</View>
			<View style={styles.commentRightContainer}>
				<View style={styles.commentRightTopContainer}>
					<TouchableOpacity
						onPress={() => navigateToChefDetails(chef_id)}
						activeOpacity={0.7}
						testID={"navigateToChefUsernameButton"}
					>
						<Text maxFontSizeMultiplier={2} style={styles.detailsContentsHeader}>
							{username}:
						</Text>
					</TouchableOpacity>
					{renderCommentDeleteButton()}
				</View>
				<View>
					<Text maxFontSizeMultiplier={2} style={[styles.detailsContents, { paddingLeft: 0 }]}>
						{comment}
					</Text>
				</View>
			</View>
		</View>
	);
};

export default RecipeComment;
