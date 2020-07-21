import React from 'react';
import { Image, ScrollView, View, ImageBackground, Text, TextInput } from 'react-native';
import { styles } from './recipeDetailsStyleSheet'
import { databaseURL } from '../dataComponents/databaseURL'

export default class RecipeNewComment extends React.PureComponent {

	render() {
		// console.log(this.props)
		return (
			<View style={styles.commentContainer}>
				<View style={styles.commentLeftContainer}>
					<Image style={styles.avatarThumbnail} source={(this.props.image_url !== null ? ({ uri: this.props.image_url }) : require("../dataComponents/peas.jpg"))} />
				</View>
				<View style={styles.commentRightContainer}>
					<Text maxFontSizeMultiplier={2} style={[styles.detailsContentsHeader]}>{this.props.username}:</Text>
					<TextInput
						style={styles.detailsContents}
						value={this.props.commentText}
						multiline={true}
						numberOfLines={2}
						placeholder="Type comment here..."
						onChangeText={text => this.props.handleCommentTextInput(text)}
						autoFocus={true}
						onFocus={this.props.scrollToNewComment}
						maxFontSizeMultiplier={2}
					/>
				</View>
			</View>
		)
	}
}

