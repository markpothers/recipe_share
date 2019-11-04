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
              <Image style={styles.avatarThumbnail} source={ (this.props.imageURL!==null ? ({uri: this.props.imageURL}) : require("../dataComponents/peas.jpg")) }/>
            </View>
            <View style={styles.commentRightContainer}>
              <Text style={[styles.detailsContentsHeader]}>{this.props.username}:</Text>
              <TextInput
                style={styles.detailsContents}
                value={this.props.commentText}
                multiline={true}
                numberOfLines={2}
                placeholder="Type comment here..."
                onChange={(e) => this.props.handleCommentTextInput(e.nativeEvent.text)}
                autoFocus={true}
                onFocus={this.props.scrollToNewComment}
                ></TextInput>
            </View>
          </View>
        )
    }
}

