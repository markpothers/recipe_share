import React from 'react'
import { Image, View, TouchableOpacity, Text } from 'react-native'
import { styles } from './recipeListStyleSheet'
import { databaseURL } from '../dataComponents/databaseURL'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PostedBy from './postedBy'

export default function RecipeCard(props) {
    // console.log(props)
    return (
        <View style={styles.recipeCard} >
            {/* <PostedBy/> */}
            <View style={styles.recipeCardTopContainer}>
                <View style={styles.recipeCardTopLeftContainer}>
                    <View style={styles.recipeCardTopLeftUpperContainer}>
                        <Text style={styles.recipeCardHighlighted}>{props.item.name}</Text>
                    </View>
                    <View style={styles.recipeCardTopLeftLowerContainer}>
                        <Text style={styles.recipeCardTopOther} >Prep time: {props.item.time}</Text>
                        <Text style={styles.recipeCardTopOther} >Difficulty: {props.item.difficulty}/10</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.recipeCardTopRightContainer} >
                    <Image style={styles.avatarThumbnail} source={{uri: `${databaseURL}${props.item.imageURL}`}} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.recipeCardImageContainer} activeOpacity={0.7} onPress={() => props.navigateToRecipeDetails(props.item.id)}>
                <Image style={styles.thumbnail} source={{uri: `${databaseURL}${props.item.imageURL}`}} />
            </TouchableOpacity>
            <View style={styles.recipeCardBottomContainer}>
                <TouchableOpacity style={styles.recipeCardBottomSubContainers}>
                    <Icon name='share-outline' size={23} style={styles.icon}/>
                    {/* <Icon name='share' size={23} style={styles.icon}/> */}
                    <Text style={styles.recipeCarBottomOther} >00</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.recipeCardBottomSubContainers}>
                    <Icon name='heart-outline' size={23} style={styles.icon}/>
                    {/* <Icon name='heart' size={23} style={styles.icon}/> */}
                    <Text style={styles.recipeCarBottomOther} >72</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.recipeCardBottomSubContainers}>
                    <Icon name='food' size={23} style={styles.icon}/>
                    {/* <Icon name='food-off' size={23} style={styles.icon}/> */}
                    <Text style={styles.recipeCarBottomOther} >107</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.recipeCardBottomSubContainers}>
                    <Icon name='comment-outline' size={23} style={styles.icon}/>
                    {/* <Icon name='comment' size={23} style={styles.icon}/> */}
                    <Text style={styles.recipeCarBottomOther} >2896</Text>
                </TouchableOpacity>
            </View>
        </View>



        // <TouchableOpacity activeOpacity={0.7} style={styles.recipeCard} onPress={() => props.navigateToRecipeDetails(props.item.id)}>
        //     <View style={styles.recipeCardRightContent} >
        //         <Image style={styles.thumbnail} source={{uri: `${databaseURL}${props.item.imageURL}`}} />
        //     </View>
        //     <View style={styles.recipeCardRightContent} >
        //         <Text style={styles.recipeCardName}>{props.item.name}</Text>
        //         <Text style={styles.recipeCarBottomOtherTop} numberOfLines={1}>Prep time: {props.item.time}</Text>
        //         <Text style={styles.recipeCardOtherBottom} numberOfLines={1}>Difficulty: {props.item.difficulty}/10</Text>
        //     </View>
        // </TouchableOpacity>
    )
}