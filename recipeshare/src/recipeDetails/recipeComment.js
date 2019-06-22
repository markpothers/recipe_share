import React from 'react';
import { Image, ScrollView, View, ImageBackground, Text } from 'react-native';
import { styles } from './recipeDetailsStyleSheet'

export default class RecipeComment extends React.PureComponent {
    render() {
        // console.log(this.props)
        return (
          <View style={styles.commentContainer}>
            <View style={styles.commentLeftContainer}>
              <Image style={styles.avatarThumbnail} source={{uri: this.props.imageURL}}/>
            </View>
            <View style={styles.commentRightContainer}>
              <Text style={[styles.detailsContentsHeader]}>{this.props.username}:</Text>
              <Text style={[styles.detailsContents]}>{this.props.comment}</Text>
            </View>
          </View>
        )
    }
}

