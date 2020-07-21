import React from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { styles } from './recipeDetailsStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';

export default class RecipeComment extends React.PureComponent {

	renderCommentDeleteButton = () => {
		if (this.props.loggedInChefID == this.props.chef_id || this.props.loggedInChefID === this.props.is_admin) {
			return (
				<TouchableOpacity style={styles.commentTrashCanButton} onPress={() => this.props.deleteComment(this.props.id)}>
					<Icon name='trash-can-outline' size={responsiveHeight(3.5)} style={[styles.icon, styles.commentTrashCan]} />
				</TouchableOpacity>
			)
		}
	}

	render() {
		// console.log(this.props)
		return (
			<View style={styles.commentContainer}>
				<View style={styles.commentLeftContainer}>
					<Image style={styles.avatarThumbnail} source={(this.props.image_url !== null ? ({ uri: this.props.image_url }) : require("../dataComponents/peas.jpg"))} />
				</View>
				<View style={styles.commentRightContainer}>
					<View style={styles.commentRightTopContainer}>
						<Text maxFontSizeMultiplier={2} style={[styles.detailsContentsHeader]}>{this.props.username}:</Text>
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

