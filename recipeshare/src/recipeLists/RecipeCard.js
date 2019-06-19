import React from 'react'
import { Image, View, TouchableOpacity, Text } from 'react-native'
import { styles } from './recipeListStyleSheet'
import { databaseURL } from '../dataComponents/databaseURL'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default   class RecipeCard extends React.PureComponent {
    render() {
        // console.log(props.item.sharer_id)
        return (
            <View style={styles.recipeCard} >
                {this.props.item.sharer_id? <PostedBy username={this.props.item.sharer_username} chefID={this.props.item.sharer_id} /> : null }
                <View style={styles.recipeCardTopContainer}>
                    <View style={styles.recipeCardTopLeftContainer}>
                        <View style={styles.recipeCardTopLeftUpperContainer}>
                            <Text style={styles.recipeCardHighlighted}>{this.props.item.name}</Text>
                        </View>
                        <View style={styles.recipeCardTopLeftLowerContainer}>
                            <Text style={styles.recipeCardTopOther} >Prep time: {this.props.item.time}</Text>
                            <Text style={styles.recipeCardTopOther} >Difficulty: {this.props.item.difficulty}/10</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.recipeCardTopRightContainer} onPress={() => this.props.navigateToChefDetails(this.props.listChoice, this.props.item.chef_id)}>
                        <AvatarImage chefImageURL={this.props.item.chefImageURL}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.recipeCardImageContainer} activeOpacity={0.7} onPress={() => this.props.navigateToRecipeDetails(this.props.item.id)}>
                    <Image style={styles.thumbnail} source={{uri: `${databaseURL}${this.props.item.imageURL}`}} />
                </TouchableOpacity>
                <View style={styles.recipeCardBottomContainer}>
                    <TouchableOpacity style={styles.recipeCardBottomSubContainers} onPress={this.props.item.chef_shared === 0 ? () => this.props.reShareRecipe(this.props.item.id) : null }>
                        {this.props.item.chef_shared === 0 ? <Icon name='share-outline' size={23} style={styles.icon}/> : <Icon name='share' size={23} style={styles.icon}/> }
                        <Text style={styles.recipeCarBottomOther} >{this.props.item.sharesCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.recipeCardBottomSubContainers} onPress={this.props.item.chef_liked === 0 ? () => this.props.likeRecipe(this.props.item.id) : () => this.props.unlikeRecipe(this.props.item.id) }>
                        {this.props.item.chef_liked === 0 ? <Icon name='heart-outline' size={23} style={styles.icon}/> : <Icon name='heart' size={23} style={styles.icon}/> }
                        <Text style={styles.recipeCarBottomOther} >{this.props.item.likesCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.recipeCardBottomSubContainers} onPress={this.props.item.chef_made === 0 ? () => this.props.makeRecipe(this.props.item.id) : null }>
                        {this.props.item.chef_made === 0 ? <Icon name='food' size={23} style={styles.icon}/> : <Icon name='food-off' size={23} style={styles.icon}/> }
                        <Text style={styles.recipeCarBottomOther} >{this.props.item.makesCount}</Text>
                    </TouchableOpacity>
                    <View style={styles.recipeCardBottomSubContainers}>
                        {this.props.item.chef_commented === 0 ? <Icon name='comment-outline' size={23} style={styles.icon}/> : <Icon name='comment' size={23} style={styles.icon}/> }
                        <Text style={styles.recipeCarBottomOther} >{this.props.item.commentsCount}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

function AvatarImage(chefImageURL) {
    const URL = chefImageURL.chefImageURL
    if (URL == null) {
        return (
            <Image style={styles.avatarThumbnail} source={require("../dataComponents/peas.jpg")} />
        )
    } else {
    return (
        <Image style={styles.avatarThumbnail} source={URL.startsWith("http") ? {uri: URL} : {uri: `${databaseURL}${URL}`}} />
        )
    }
}

function PostedBy(props) {
    return (
            <View style={styles.recipeCardTopPostedByContainer}>
                <Text style={styles.recipeCardHighlighted}>Re-shared by {props.username}</Text>
            </View>
    )
}