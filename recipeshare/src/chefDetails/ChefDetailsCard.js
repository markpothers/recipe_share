import React from 'react'
import { Image, View, TouchableOpacity, Text, ScrollView } from 'react-native'
import { styles } from './chefDetailsStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { databaseURL } from '../dataComponents/databaseURL'

export default class ChefDetailsCard extends React.PureComponent {

    render(){
    // console.log(this.props.chef_followed)
        return (
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
                <View style={styles.chefCardBottomContainer}>
                    <TouchableOpacity style={styles.chefCardBottomSubContainers} onPress={(this.props.chef_followed === true ? (e => this.props.unFollowChef(this.props.chef.id)) : (e => this.props.followChef(this.props.chef.id)))}>
                        {/* <Icon name='account-multiple-plus' size={24} style={styles.icon}/> */}
                        {this.props.chef_followed === true ? <Icon name='account-multiple-plus' size={24} style={styles.icon}/> : <Icon name='account-multiple-plus-outline' size={24} style={styles.icon}/> }
                        <Text style={styles.chefCardBottomOther} >{this.props.followers.length}</Text>
                    </TouchableOpacity>
                    <View style={styles.chefCardBottomSubContainers}>
                        <Icon name='heart' size={24} style={styles.icon}/>
                        <Text style={styles.chefCardBottomOther} >{this.props.recipe_likes_received.length}</Text>
                    </View>
                    <View style={styles.chefCardBottomSubContainers}>
                        <Icon name='food' size={24} style={styles.icon}/>
                        <Text style={styles.chefCardBottomOther} >{this.props.recipe_makes_received.length}</Text>
                    </View>
                    <View style={styles.chefCardBottomSubContainers}>
                        <Icon name='comment-outline' size={24} style={styles.icon}/>
                        {/* {this.props.chef_commented === 0 ? <Icon name='comment-outline' size={24} style={styles.icon}/> : <Icon name='comment' size={24} style={styles.icon}/> } */}
                        <Text style={styles.chefCardBottomOther} >{this.props.comments_received.length}</Text>
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