import React from 'react'
import { Image, View, TouchableOpacity, Text } from 'react-native'
import { styles } from './recipeListStyleSheet'
import { databaseURL } from '../dataComponents/databaseURL'

export default function RecipeCard(props) {
    // console.log(props)
    return (
        <View style={styles.recipeCard} >
            <View style={styles.recipeCardTopContainer}>
                <View style={styles.recipeCardTopLeftContainer}>
                    <View style={styles.recipeCardTopLeftUpperContainer}>
                        <Text style={styles.recipeCardHighlighted}>{props.item.name}</Text>
                    </View>
                    <View style={styles.recipeCardTopLeftLowerContainer}>
                        <Text style={styles.recipeCardOther} >Prep time: {props.item.time}</Text>
                        <Text style={styles.recipeCardOther} >Difficulty: {props.item.difficulty}/10</Text>
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
                <Text style={styles.recipeCardOther} >Bottom Content</Text>
            </View>
        </View>



        // <TouchableOpacity activeOpacity={0.7} style={styles.recipeCard} onPress={() => props.navigateToRecipeDetails(props.item.id)}>
        //     <View style={styles.recipeCardRightContent} >
        //         <Image style={styles.thumbnail} source={{uri: `${databaseURL}${props.item.imageURL}`}} />
        //     </View>
        //     <View style={styles.recipeCardRightContent} >
        //         <Text style={styles.recipeCardName}>{props.item.name}</Text>
        //         <Text style={styles.recipeCardOtherTop} numberOfLines={1}>Prep time: {props.item.time}</Text>
        //         <Text style={styles.recipeCardOtherBottom} numberOfLines={1}>Difficulty: {props.item.difficulty}/10</Text>
        //     </View>
        // </TouchableOpacity>
    )
}