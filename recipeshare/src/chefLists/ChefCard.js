import React from 'react'
import { Image, View, TouchableOpacity, Text, ScrollView } from 'react-native'
import { styles } from './chefListStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { databaseURL } from '../dataComponents/databaseURL'

export default class ChefCard extends React.PureComponent {

    render(){
    // console.log(this.props)
        return (
            <View style={styles.chefCard}>
                <View style={styles.chefCardTopContainer}>
                    <View style={styles.chefCardTopLeftContainer}>
                        <View style={styles.chefCardTopLeftUpperContainer}>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigateToChefDetails(this.props.id)}>
                                <Text style={styles.chefCardHighlighted}>{this.props.username}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.chefCardTopLeftMiddleContainer}>
                            <View>
                                <Text style={styles.chefCardTopItalic}>{this.props.country}</Text>
                            </View>
                        </View>
                        <ScrollView nestedScrollEnabled={true} style={styles.chefCardTopLeftLowerContainer}>
                            <Text style={styles.chefCardTopOther} >{this.props.profile_text}</Text>
                        </ScrollView>
                    </View>
                    <TouchableOpacity style={styles.chefCardTopRightContainer} onPress={() => this.props.navigateToChefDetails(this.props.id)}>
                        <AvatarImage chefImageURL={this.props.imageURL}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.chefCardBottomContainer}>
                    <TouchableOpacity style={styles.chefCardBottomSubContainers}  onPress={(this.props.user_chef_following > 0 ? (e => this.props.unFollowChef(this.props.id)) : (e => this.props.followChef(this.props.id)))}>
                        {/* <Icon name='account-multiple-plus' size={24} style={styles.icon}/> */}
                        {this.props.user_chef_following > 0 ? <Icon name='account-multiple-minus' size={24} style={styles.icon}/> : <Icon name='account-multiple-plus-outline' size={24} style={styles.icon}/> }
                        <Text style={styles.chefCardBottomOther} >{this.props.followers === null ? 0 : this.props.followers}</Text>
                    </TouchableOpacity>
                    <View style={styles.chefCardBottomSubContainers} >
                        <Icon name='heart' size={24} style={styles.icon}/>
                        <Text style={styles.chefCardBottomOther} >{this.props.recipe_likes_received === null ? 0 : this.props.recipe_likes_received}</Text>
                    </View>
                    <View style={styles.chefCardBottomSubContainers} >
                        <Icon name='food' size={24} style={styles.icon}/>
                        <Text style={styles.chefCardBottomOther} >{this.props.recipe_makes_received === null ? 0 : this.props.recipe_makes_received}</Text>
                    </View>
                    <TouchableOpacity style={styles.chefCardBottomSubContainers}>
                        <Icon name='comment-outline' size={24} style={styles.icon}/>
                        {/* {this.props.chef_commented === 0 ? <Icon name='comment-outline' size={24} style={styles.icon}/> : <Icon name='comment' size={24} style={styles.icon}/> } */}
                        <Text style={styles.chefCardBottomOther} >{this.props.comments_received === null ? 0 : this.props.comments_received}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

function AvatarImage(chefImageURL) {
    const URL = chefImageURL.chefImageURL
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