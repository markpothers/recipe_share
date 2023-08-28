import { Image, Text, TouchableOpacity, View } from "react-native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import OfflineMessage from "../../offlineMessage/offlineMessage";
import React from "react";
import { getTimeStringFromMinutes } from "../../auxFunctions/getTimeStringFromMinutes";
import { styles } from "../recipeListStyleSheet";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultRecipeImage = require("../../dataComponents/default-recipe.jpg");

type OwnProps = {
	navigateToChefDetails: (chefID: number, recipeID: number) => void;
	navigateToRecipeDetails: (recipeID: number, commenting?: boolean) => void;
	id: number;
	image_url?: string;
	renderOfflineMessage?: number[];
	clearOfflineMessage: (recipeID: number) => void;
	sharer_id?: number;
	sharer_username: string;
	chef_id: number;
	username: string;
	total_time: number;
	difficulty: number;
	chefimage_url: string;
	chef_shared: number;
	reShareRecipe: (recipeID: number) => void;
	unReShareRecipe: (recipeID: number) => void;
	shares_count: number;
	chef_liked: number;
	likeRecipe: (recipeID: number) => void;
	unlikeRecipe: (recipeID: number) => void;
	likes_count: number;
	chef_made: number;
	makeRecipe: (recipeID: number) => void;
	makes_count: number;
	chef_commented: number;
	comments_count: number;
	name: string;
};

const RecipeCard = ({
	navigateToChefDetails,
	navigateToRecipeDetails,
	id,
	image_url,
	renderOfflineMessage,
	clearOfflineMessage,
	sharer_username,
	sharer_id,
	chef_id,
	username,
	total_time,
	difficulty,
	chefimage_url,
	chef_shared,
	reShareRecipe,
	unReShareRecipe,
	shares_count,
	chef_liked,
	likeRecipe,
	unlikeRecipe,
	likes_count,
	// chef_made,
	// makeRecipe,
	// makes_count,
	chef_commented,
	comments_count,
	name,
}: OwnProps) => {
	// export default class RecipeCard extends React.PureComponent {
	const navigateToSharer = (chefID) => {
		navigateToChefDetails(chefID, id);
	};

	// render() {
	const imageSource = image_url ? { uri: image_url } : defaultRecipeImage;
	return (
		<View style={styles.recipeCard} testID={"recipeCard"}>
			{renderOfflineMessage?.includes(id) && (
				<OfflineMessage
					message={`Sorry, can't do that right now.${"\n"}You appear to be offline.`}
					topOffset={"35%"}
					clearOfflineMessage={() => {
						clearOfflineMessage(id);
					}}
				/>
			)}
			{sharer_id && (
				<PostedBy navigateToSharer={navigateToSharer} username={sharer_username} sharer_id={sharer_id} />
			)}
			<View style={styles.recipeCardTopContainer}>
				<View style={styles.recipeCardTopLeftContainer}>
					<TouchableOpacity
						testID={"recipeNameButton"}
						style={styles.recipeCardTopLeftUpperContainer}
						activeOpacity={0.7}
						onPress={() => navigateToRecipeDetails(id)}
					>
						<Text maxFontSizeMultiplier={2} style={styles.recipeCardHighlighted}>
							{name}
						</Text>
					</TouchableOpacity>
					<View style={styles.recipeCardTopLeftMiddleContainer}>
						<Text maxFontSizeMultiplier={2} style={styles.recipeCardTopItalic}>
							Created by:{" "}
						</Text>
						<TouchableOpacity testID={"chefNameButton"} onPress={() => navigateToChefDetails(chef_id, id)}>
							<Text maxFontSizeMultiplier={2} style={styles.recipeCardTopItalic}>
								{username}
							</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.recipeCardTopLeftLowerContainer}>
						<Text maxFontSizeMultiplier={2} style={styles.recipeCardTopOther}>
							Total time: {getTimeStringFromMinutes(total_time)}
						</Text>
						<Text maxFontSizeMultiplier={2} style={styles.recipeCardTopOther}>
							Difficulty: {difficulty}/10
						</Text>
					</View>
				</View>
				<TouchableOpacity
					testID={"chefImageButton"}
					style={styles.recipeCardTopRightContainer}
					onPress={() => navigateToChefDetails(chef_id, id)}
				>
					<AvatarImage chefimage_url={chefimage_url} />
				</TouchableOpacity>
			</View>
			<TouchableOpacity
				testID={"recipeImageButton"}
				style={styles.recipeCardImageContainer}
				activeOpacity={0.7}
				onPress={() => navigateToRecipeDetails(id)}
				accessibilityLabel={"picture of recipe"}
			>
				<Image style={styles.thumbnail} source={imageSource} />
			</TouchableOpacity>
			<View style={styles.recipeCardBottomContainer}>
				<TouchableOpacity
					testID={"reShareButton"}
					style={styles.recipeCardBottomSubContainers}
					onPress={chef_shared == 0 ? () => reShareRecipe(id) : () => unReShareRecipe(id)}
				>
					{chef_shared == 0 ? (
						<Icon
							name="share-outline"
							size={responsiveHeight(3.5)}
							style={styles.icon}
							accessibilityLabel={"share recipe with followers"}
						/>
					) : (
						<Icon
							name="share"
							size={responsiveHeight(3.5)}
							style={styles.icon}
							accessibilityLabel={"remove share"}
						/>
					)}
					<Text
						maxFontSizeMultiplier={2}
						style={styles.recipeCardBottomOther}
						accessibilityLabel={"shares count"}
					>
						{shares_count}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					testID={"likeButton"}
					style={styles.recipeCardBottomSubContainers}
					onPress={chef_liked == 0 ? () => likeRecipe(id) : () => unlikeRecipe(id)}
				>
					{chef_liked == 0 ? (
						<Icon
							name="heart-outline"
							size={responsiveHeight(3.5)}
							style={styles.icon}
							accessibilityLabel={"like recipe"}
						/>
					) : (
						<Icon
							name="heart"
							size={responsiveHeight(3.5)}
							style={styles.icon}
							accessibilityLabel={"unlike recipe"}
						/>
					)}
					<Text
						maxFontSizeMultiplier={2}
						style={styles.recipeCardBottomOther}
						accessibilityLabel={"likes count"}
					>
						{likes_count}
					</Text>
				</TouchableOpacity>
				{/* <TouchableOpacity style={styles.recipeCardBottomSubContainers} onPress={chef_made === 0 ? () => makeRecipe(id) : null }>
                            {chef_made === 0 ? <Icon name='food' size={responsiveHeight(3.5)} style={styles.icon}/> : <Icon name='food-off' size={responsiveHeight(3.5)} style={styles.icon}/> }
                            <Text style={styles.recipeCardBottomOther} >{makes_count}</Text>
                        </TouchableOpacity> */}
				<TouchableOpacity
					testID={"commentButton"}
					style={styles.recipeCardBottomSubContainers}
					onPress={() => navigateToRecipeDetails(id, true)}
				>
					{chef_commented == 0 ? (
						<Icon
							name="comment-outline"
							size={responsiveHeight(3.5)}
							style={styles.icon}
							accessibilityLabel={"comment on recipe"}
						/>
					) : (
						<Icon
							name="comment"
							size={responsiveHeight(3.5)}
							style={styles.icon}
							accessibilityLabel={"comment on recipe"}
						/>
					)}
					<Text
						maxFontSizeMultiplier={2}
						style={styles.recipeCardBottomOther}
						accessibilityLabel={"comments count"}
					>
						{comments_count}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default RecipeCard;

function AvatarImage(chefimage_url: { chefimage_url: string }) {
	const URL = chefimage_url.chefimage_url;
	if (!URL) {
		return (
			<Image
				style={styles.avatarThumbnail}
				source={require("../../dataComponents/default-chef.jpg")}
				accessibilityLabel={"picture of chef"}
			/>
		);
	} else {
		return <Image style={styles.avatarThumbnail} source={{ uri: URL }} accessibilityLabel={"picture of chef"} />;
	}
}

type PostedByProps = {
	navigateToSharer: (chefID: number) => void;
	username: string;
	sharer_id: number;
};

function PostedBy({ navigateToSharer, sharer_id, username }: PostedByProps) {
	return (
		<View testID={"postedByElement"} style={styles.recipeCardTopPostedByContainer}>
			<Icon name="share" size={responsiveHeight(3.5)} style={styles.reSharedIcon} />
			<Text maxFontSizeMultiplier={2} style={[styles.recipeCardTopItalic, { maxWidth: responsiveWidth(28) }]}>
				Re-shared by:{" "}
			</Text>
			<TouchableOpacity
				testID={"sharerNameButton"}
				style={styles.recipeCardTopPostedByTouchable}
				onPress={() => navigateToSharer(sharer_id)}
			>
				<Text maxFontSizeMultiplier={2} style={styles.recipeCardTopItalic}>
					{username}
				</Text>
			</TouchableOpacity>
		</View>
	);
}
