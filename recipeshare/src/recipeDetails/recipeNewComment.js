import React from 'react';
import { Image, ScrollView, View, ImageBackground, Text, TextInput } from 'react-native';
import { styles } from './recipeDetailsStyleSheet'
import { databaseURL } from '../dataComponents/databaseURL'

export default class RecipeNewComment extends React.PureComponent {
    render() {
        // console.log(this.props.commentText)
        return (
          <View style={styles.commentContainer}>
            <View style={styles.commentLeftContainer}>
              <Image style={styles.avatarThumbnail} source={{uri: `${databaseURL}${this.props.imageURL}`}}/>
            </View>
            <View style={styles.commentRightContainer}>
              <Text style={[styles.detailsContentsHeader]}>{this.props.username}:</Text>
              <TextInput style={[styles.detailsContents]} value={this.props.commentText} multiline={true} numberOfLines={3} placeholder="Type comment here..." onChange={(e) => this.props.handleCommentTextInput(e.nativeEvent.text)}></TextInput>
            </View>
          </View>
        )
    }
}

