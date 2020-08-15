import React from 'react';
import { Image, View, Text, TextInput } from 'react-native';
import { styles } from './recipeDetailsStyleSheet'

const peasImage = require("../dataComponents/peas.jpg")

export default class RecipeNewComment extends React.PureComponent {

	render() {
		// console.log(this.props)
		const imageUrl = this.props.image_url ? { uri: this.props.image_url } : peasImage
		return (
			<View style={styles.commentContainer}>
				<View style={styles.commentLeftContainer}>
					<Image style={styles.avatarThumbnail} source={imageUrl} />
				</View>
				<View style={styles.commentRightContainer}>
					<Text maxFontSizeMultiplier={2} style={styles.detailsContentsHeader}>{this.props.username}:</Text>
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

