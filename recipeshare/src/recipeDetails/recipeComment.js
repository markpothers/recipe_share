import React from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { styles } from './recipeDetailsStyleSheet'
import { databaseURL } from '../dataComponents/databaseURL'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class RecipeComment extends React.PureComponent {

  renderCommentDeleteButton = () => {
    if (this.props.loggedInChefID === this.props.chef_id || this.props.is_admin) {
      return (
        <TouchableOpacity style={styles.commentTrashCanButton} onPress={() => this.props.deleteComment(this.props.id)}>
        <Icon name='trash-can-outline' size={24} style={[styles.icon, styles.commentTrashCan]}/>
      </TouchableOpacity>
      )
    }
  }

  render() {
      // console.log(this.props)
      return (
        <View style={styles.commentContainer}>
          <View style={styles.commentLeftContainer}>
            <Image style={styles.avatarThumbnail} source={( this.props.imageURL !== null ? ({uri: this.props.imageURL}) : require("../dataComponents/peas.jpg") )}/>
          </View>
          <View style={styles.commentRightContainer}>
            <View style={styles.commentRightTopContainer}>
              <Text style={[styles.detailsContentsHeader]}>{this.props.username}:</Text>
              {this.renderCommentDeleteButton()}
            </View>
            <View>
              <Text style={[styles.detailsContents]}>{this.props.comment}</Text>
            </View>
          </View>
        </View>
      )
    }
}

