import React from 'react'
import { Image, View, TouchableOpacity, Text } from 'react-native'
import { styles } from './recipeListStyleSheet'
import { databaseURL } from '../dataComponents/databaseURL'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class RecipeCard extends React.PureComponent {
    navigateToSharer = (chefID) => {
        this.props.navigateToChefDetails(this.props.listChoice, chefID)
    }

    render() {
        // console.log(this.props)
        return (
            <View style={styles.recipeCard} >
                {this.props.sharer_id? <PostedBy navigateToSharer={this.navigateToSharer} username={this.props.sharer_username} chefID={this.props.sharer_id} /> : null }
                <View style={styles.recipeCardTopContainer}>
                    <View style={styles.recipeCardTopLeftContainer}>
                        <View style={styles.recipeCardTopLeftUpperContainer}>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigateToRecipeDetails(this.props.id)}>
                                <Text style={styles.recipeCardHighlighted}>{this.props.name}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.recipeCardTopLeftMiddleContainer}>
                            <Text style={styles.recipeCardTopItalic}>Created by: </Text>
                            <TouchableOpacity onPress={() => this.props.navigateToChefDetails(this.props.chef_id)}>
                                <Text style={styles.recipeCardTopItalic}>{this.props.username}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.recipeCardTopLeftLowerContainer}>
                            <Text style={styles.recipeCardTopOther} >Prep time: {this.props.time}</Text>
                            <Text style={styles.recipeCardTopOther} >Difficulty: {this.props.difficulty}/10</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.recipeCardTopRightContainer} onPress={() => this.props.navigateToChefDetails(this.props.chef_id)}>
                        <AvatarImage chefImageURL={this.props.chefImageURL}/>
                    </TouchableOpacity>
                </View>
                    <TouchableOpacity style={styles.recipeCardImageContainer} activeOpacity={0.7} onPress={() => this.props.navigateToRecipeDetails(this.props.id)}>
                        <Image style={styles.thumbnail} source={{uri: `${databaseURL}${this.props.imageURL}`}} />
                    </TouchableOpacity>
                    <View style={styles.recipeCardBottomContainer}>
                    <TouchableOpacity style={styles.recipeCardBottomSubContainers} onPress={this.props.chef_shared === 0 ? () => this.props.reShareRecipe(this.props.id) : null }>
                        {this.props.chef_shared === 0 ? <Icon name='share-outline' size={24} style={styles.icon}/> : <Icon name='share' size={24} style={styles.icon}/> }
                        <Text style={styles.recipeCardBottomOther} >{this.props.sharesCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.recipeCardBottomSubContainers} onPress={this.props.chef_liked === 0 ? () => this.props.likeRecipe(this.props.id) : () => this.props.unlikeRecipe(this.props.id) }>
                        {this.props.chef_liked === 0 ? <Icon name='heart-outline' size={24} style={styles.icon}/> : <Icon name='heart' size={24} style={styles.icon}/> }
                        <Text style={styles.recipeCardBottomOther} >{this.props.likesCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.recipeCardBottomSubContainers} onPress={this.props.chef_made === 0 ? () => this.props.makeRecipe(this.props.id) : null }>
                        {this.props.chef_made === 0 ? <Icon name='food' size={24} style={styles.icon}/> : <Icon name='food-off' size={24} style={styles.icon}/> }
                        <Text style={styles.recipeCardBottomOther} >{this.props.makesCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.recipeCardBottomSubContainers} onPress={() => this.props.navigateToRecipeDetailsAndComment(this.props.id)}>
                        {this.props.chef_commented === 0 ? <Icon name='comment-outline' size={24} style={styles.icon}/> : <Icon name='comment' size={24} style={styles.icon}/> }
                        <Text style={styles.recipeCardBottomOther} >{this.props.commentsCount}</Text>
                    </TouchableOpacity>
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
                <Text style={styles.recipeCardTopItalic} >Re-shared by: </Text>
                <TouchableOpacity onPress={() => props.navigateToSharer(props.sharer_id)}>
                    <Text style={styles.recipeCardTopItalic} >{props.username}</Text>
                </TouchableOpacity>
            </View>
    )
}