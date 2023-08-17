import { Image, Text, TextInput, View } from "react-native";

import React from "react";
import { styles } from "../recipeDetailsStyleSheet";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultChefImage = require("../../dataComponents/default-chef.jpg");

type OwnProps = {
	image_url: string;
	username: string;
	commentText: string;
	handleCommentTextInput: (text: string) => void;
	// scrollToNewComment: () => void;
};

const RecipeNewComment = ({
	image_url,
	username,
	commentText,
	handleCommentTextInput,
	// scrollToNewComment,
}: OwnProps) => {
	const imageUrl = image_url ? { uri: image_url } : defaultChefImage;
	return (
		<View style={styles.commentContainer}>
			<View style={styles.commentLeftContainer}>
				<Image style={styles.avatarThumbnail} source={imageUrl} />
			</View>
			<View style={styles.commentRightContainer}>
				<Text maxFontSizeMultiplier={2} style={styles.detailsContentsHeader}>
					{username}:
				</Text>
				<TextInput
					style={styles.detailsContents}
					value={commentText}
					multiline={true}
					numberOfLines={2}
					placeholder="Type comment here..."
					onChangeText={(text) => handleCommentTextInput(text)}
					autoFocus={true}
					// onFocus={scrollToNewComment}
					maxFontSizeMultiplier={2}
				/>
			</View>
		</View>
	);
};

export default RecipeNewComment;
