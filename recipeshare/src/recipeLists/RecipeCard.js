import React from 'react'
import { Image, View, TouchableOpacity, Text } from 'react-native'
import { styles } from './recipeListStyleSheet'
import { databaseURL } from '../dataComponents/databaseURL'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import OfflineMessage from '../offlineMessage/offlineMessage'
export default class RecipeCard extends React.PureComponent {

	navigateToSharer = (chefID) => {
		this.props.navigateToChefDetails(chefID, this.props.id)
	}

	render() {
		// console.log(this.props)
		return (
			<View style={styles.recipeCard} >
				{this.props.renderOfflineMessage.includes(this.props.id) && (
					<OfflineMessage
						message={`Sorry, can't do that right now.${"\n"}You appear to be offline.`}
						topOffset={'35%'}
						clearOfflineMessage={() => { this.props.clearOfflineMessage(this.props.id) }}
					/>)}
				{this.props.sharer_id && <PostedBy navigateToSharer={this.navigateToSharer} username={this.props.sharer_username} sharer_id={this.props.sharer_id} />}
				<View style={styles.recipeCardTopContainer}>
					<View style={styles.recipeCardTopLeftContainer}>
						<TouchableOpacity style={styles.recipeCardTopLeftUpperContainer} activeOpacity={0.7} onPress={() => this.props.navigateToRecipeDetails(this.props.id)}>
							<Text maxFontSizeMultiplier={2} style={styles.recipeCardHighlighted}>{this.props.name}</Text>
						</TouchableOpacity>
						<View style={styles.recipeCardTopLeftMiddleContainer}>
							<Text maxFontSizeMultiplier={2} style={styles.recipeCardTopItalic}>Created by: </Text>
							<TouchableOpacity onPress={() => this.props.navigateToChefDetails(this.props.chef_id, this.props.id)}>
								<Text maxFontSizeMultiplier={2} style={styles.recipeCardTopItalic}>{this.props.username}</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.recipeCardTopLeftLowerContainer}>
							<Text maxFontSizeMultiplier={2} style={styles.recipeCardTopOther}>Prep time: {this.props.time}</Text>
							<Text maxFontSizeMultiplier={2} style={styles.recipeCardTopOther}>Difficulty: {this.props.difficulty}/10</Text>
						</View>
					</View>
					<TouchableOpacity style={styles.recipeCardTopRightContainer} onPress={() => this.props.navigateToChefDetails(this.props.chef_id, this.props.id)}>
						<AvatarImage chefimage_url={this.props.chefimage_url} />
					</TouchableOpacity>
				</View>
				<TouchableOpacity style={styles.recipeCardImageContainer} activeOpacity={0.7} onPress={() => this.props.navigateToRecipeDetails(this.props.id)}>
					<Image style={styles.thumbnail} source={{ uri: this.props.image_url }} />
				</TouchableOpacity>
				<View style={styles.recipeCardBottomContainer}>
					<TouchableOpacity style={styles.recipeCardBottomSubContainers} onPress={this.props.chef_shared == 0 ? () => this.props.reShareRecipe(this.props.id) : () => this.props.unReShareRecipe(this.props.id)}>
						{this.props.chef_shared == 0 ? <Icon name='share-outline' size={responsiveHeight(3.5)} style={styles.icon} /> : <Icon name='share' size={responsiveHeight(3.5)} style={styles.icon} />}
						<Text maxFontSizeMultiplier={2} style={styles.recipeCardBottomOther} >{this.props.shares_count}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.recipeCardBottomSubContainers} onPress={this.props.chef_liked == 0 ? () => this.props.likeRecipe(this.props.id) : () => this.props.unlikeRecipe(this.props.id)}>
						{this.props.chef_liked == 0 ? <Icon name='heart-outline' size={responsiveHeight(3.5)} style={styles.icon} /> : <Icon name='heart' size={responsiveHeight(3.5)} style={styles.icon} />}
						<Text maxFontSizeMultiplier={2} style={styles.recipeCardBottomOther} >{this.props.likes_count}</Text>
					</TouchableOpacity>
					{/* <TouchableOpacity style={styles.recipeCardBottomSubContainers} onPress={this.props.chef_made === 0 ? () => this.props.makeRecipe(this.props.id) : null }>
                            {this.props.chef_made === 0 ? <Icon name='food' size={responsiveHeight(3.5)} style={styles.icon}/> : <Icon name='food-off' size={responsiveHeight(3.5)} style={styles.icon}/> }
                            <Text style={styles.recipeCardBottomOther} >{this.props.makes_count}</Text>
                        </TouchableOpacity> */}
					<TouchableOpacity style={styles.recipeCardBottomSubContainers} onPress={() => this.props.navigateToRecipeDetails(this.props.id, true)}>
						{this.props.chef_commented == 0 ? <Icon name='comment-outline' size={responsiveHeight(3.5)} style={styles.icon} /> : <Icon name='comment' size={responsiveHeight(3.5)} style={styles.icon} />}
						<Text maxFontSizeMultiplier={2} style={styles.recipeCardBottomOther} >{this.props.comments_count}</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

function AvatarImage(chefimage_url) {
	const URL = chefimage_url.chefimage_url
	if (URL == null) {
		return (
			<Image style={styles.avatarThumbnail} source={require("../dataComponents/peas.jpg")} />
		)
	} else {
		return (
			<Image style={styles.avatarThumbnail} source={URL.startsWith("http") ? { uri: URL } : { uri: `${databaseURL}${URL}` }} />
		)
	}
}

function PostedBy(props) {
	return (
		<View style={styles.recipeCardTopPostedByContainer}>
			<Text maxFontSizeMultiplier={2} style={styles.recipeCardTopItalic}>Re-shared by: </Text>
			<TouchableOpacity onPress={() => props.navigateToSharer(props.sharer_id)}>
				<Text maxFontSizeMultiplier={2} style={styles.recipeCardTopItalic} >{props.username}</Text>
			</TouchableOpacity>
		</View>
	)
}
