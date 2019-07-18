import React from 'react'
import { Image, View, TouchableOpacity, Text, ScrollView } from 'react-native'
import { styles } from './chefDetailsStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { databaseURL } from '../dataComponents/databaseURL'

export default class ChefDetailsCard extends React.PureComponent {

    renderFollowButton = () => {
        return (
            <React.Fragment>
                <TouchableOpacity style={styles.chefRecipesFollowContainer} onPress={(this.props.chef_followed === true ? (e => this.props.unFollowChef(this.props.chef.id)) : (e => this.props.followChef(this.props.chef.id)))}>
                    {this.props.chef_followed === true ? <Icon name='account-multiple-plus' size={24} style={styles.icon}/> : <Icon name='account-multiple-plus-outline' size={24} style={styles.icon}/> }
                </TouchableOpacity>
                <Text style={styles.chefDetailsRecipesFollowNumber} >{this.props.followers.length}</Text>
            </React.Fragment>
        )
    }


    render(){
        return (
            <View>
                <View style={styles.chefCard}>
                    <View style={styles.chefCardTopContainer}>
                        <View style={styles.chefCardTopLeftContainer}>
                            <View style={styles.chefCardTopLeftUpperContainer}>
                                <View>
                                    <Text style={styles.chefCardHighlighted}>{this.props.chef.username}</Text>
                                </View>
                            </View>
                            <View style={styles.chefCardTopLeftMiddleContainer}>
                                <View>
                                    <Text style={styles.chefCardTopItalic}>{this.props.chef.country}</Text>
                                </View>
                            </View>
                            <ScrollView nestedScrollEnabled={true} style={styles.chefCardTopLeftLowerContainer}>
                                <Text style={styles.chefCardTopOther}>{this.props.chef.profile_text}</Text>
                            </ScrollView>
                        </View>
                        <View style={styles.chefCardTopRightContainer}>
                            <AvatarImage chefImageURL={this.props.chef.imageURL}/>
                        </View>
                    </View>
                </View>
                <View>
                  <View style={styles.chefDetailsStats}>
                    <Icon name='food' size={24} style={styles.icon}/>
                    <Text style={[styles.chefRecipesRowContents]}>Recipes created:   {this.props.recipes.length}</Text>
                        {this.props.notProfile ? this.renderFollowButton() : null}
                  </View>
                  <View style={styles.chefDetailsStats}>
                    <Text style={[styles.chefDetailsColumnHeaders]}>Given:   Received:</Text>
                  </View>
                  <View style={styles.chefDetailsStats}>
                    {this.props.chef_shared === true ? <Icon name='share' size={24} style={styles.icon}/> : <Icon name='share-outline' size={24} style={styles.icon}/> }
                    <Text style={[styles.chefDetailsRowTitle]}>Recipes re-shares:</Text>
                    <Text style={[styles.chefDetailsRowContents]}>{this.props.re_shares.length}</Text>
                    <Text style={[styles.chefDetailsRowContents]}>{this.props.re_shares_received.length}</Text>
                  </View>
                  <View style={styles.chefDetailsStats}>
                    {this.props.chef_liked === true ? <Icon name='heart' size={24} style={styles.icon}/> : <Icon name='heart-outline' size={24} style={styles.icon}/> }
                    <Text style={[styles.chefDetailsRowTitle]}>Recipes liked:</Text>
                    <Text style={[styles.chefDetailsRowContents]}>{this.props.recipe_likes.length}</Text>
                    <Text style={[styles.chefDetailsRowContents]}>{this.props.recipe_likes_received.length}</Text>
                  </View>
                  <View style={styles.chefDetailsStats}>
                    {this.props.chef_made === true ? <Icon name='food-off' size={24} style={styles.icon}/> : <Icon name='food' size={24} style={styles.icon}/> }
                    <Text style={[styles.chefDetailsRowTitle]}>Recipes made:</Text>
                    <Text style={[styles.chefDetailsRowContents]}>{this.props.recipe_makes.length}</Text>
                    <Text style={[styles.chefDetailsRowContents]}>{this.props.recipe_makes_received.length}</Text>
                  </View>
                  <View style={styles.chefDetailsStats}>
                    {this.props.chef_followed === true ? <Icon name='account-multiple' size={24} style={styles.icon}/> : <Icon name='account-multiple-outline' size={24} style={styles.icon}/> }
                    <Text style={[styles.chefDetailsRowTitle]}>Follows:</Text>
                    <Text style={[styles.chefDetailsRowContents]}>{this.props.following.length}</Text>
                    <Text style={[styles.chefDetailsRowContents]}>{this.props.followers.length}</Text>
                  </View>
                  <View style={styles.chefDetailsStats}>
                    {this.props.chef_commented === true ? <Icon name='comment' size={24} style={styles.icon}/> : <Icon name='comment-outline' size={24} style={styles.icon}/> }
                    <Text style={[styles.chefDetailsRowTitle]}>Comments:</Text>
                    <Text style={[styles.chefDetailsRowContents]}>{this.props.comments.length}</Text>
                    <Text style={[styles.chefDetailsRowContents]}>{this.props.comments_received.length}</Text>
                  </View>
                  <View style={styles.chefDetailsStats}>
                    {this.props.chef_chef_make_piced === true ? <Icon name='image' size={24} style={styles.icon}/> : <Icon name='image-outline' size={24} style={styles.icon}/> }
                    <Text style={[styles.chefDetailsRowTitle]}>Pictures:</Text>
                    <Text style={[styles.chefDetailsRowContents]}>{this.props.make_pics.length}</Text>
                    <Text style={[styles.chefDetailsRowContents]}>{this.props.make_pics_received.length}</Text>
                  </View>
                </View>
            </View>
        )
    }
}

function AvatarImage(chefImageURL) {
    // console.log(chefImageURL)
    const URL = chefImageURL.chefImageURL
    // console.log(typeof URL)
    if (URL === null || URL === undefined) {
        return (
            <Image style={styles.avatarThumbnail} source={require("../dataComponents/peas.jpg")} />
        )
    } else if (typeof URL === 'object'){
    return (
        <Image style={styles.avatarThumbnail} source={URL.uri.startsWith("http") ? {uri: URL.uri} : {uri: `${databaseURL}${URL.uri}`}} />
        )
    } else {
        return <Image style={styles.avatarThumbnail} source={URL.startsWith("http") ? {uri: URL} : {uri: `${databaseURL}${URL}`}} />
    }
}