import React from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { styles } from './recipeDetailsStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

const defaultChefImage = require("../dataComponents/default-chef.jpg")
export default class RecipeComment extends React.PureComponent {

	renderCommentDeleteButton = () => {
		if (this.props.loggedInChefID == this.props.chef_id || this.props.is_admin) {
			return (
				<TouchableOpacity style={styles.commentTrashCanButton} onPress={() => this.props.askDeleteComment(this.props.id)}>
					<Icon name='trash-can-outline' size={responsiveHeight(3.5)} style={[styles.icon, styles.commentTrashCan]} />
				</TouchableOpacity>
			)
		}
	}

	render() {
		// console.log(this.props)
		const imageUrl = this.props.image_url ? { uri: this.props.image_url } : defaultChefImage
		return (
			<View style={styles.commentContainer}>
				<View style={styles.commentLeftContainer}>
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => this.props.navigateToChefDetails(this.props.chef_id)}
					>
						<Image style={styles.avatarThumbnail} source={imageUrl} />
					</TouchableOpacity>
				</View>
				<View style={styles.commentRightContainer}>
					<View style={styles.commentRightTopContainer}>
						<TouchableOpacity
							onPress={() => this.props.navigateToChefDetails(this.props.chef_id)}
							activeOpacity={0.7}
						>
							<Text maxFontSizeMultiplier={2} style={styles.detailsContentsHeader}>{this.props.username}:</Text>
						</TouchableOpacity>
						{this.renderCommentDeleteButton()}
					</View>
					<View>
						<Text maxFontSizeMultiplier={2} style={[styles.detailsContents, { paddingLeft: 0 }]}>{this.props.comment}</Text>
					</View>
				</View>
			</View>
		)
	}
}

