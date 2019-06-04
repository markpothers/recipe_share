import React from 'react'
import { Image, View, TouchableOpacity, Text } from 'react-native'
import { styles } from '../functionalComponents/RSStyleSheet'
import { databaseURL } from '../functionalComponents/databaseURL'

export default function RecipeCard(props) {
    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.recipeCard} onPress={() => props.navigation(props.listChoice, props.item.id)}>
            <View style={styles.recipeCardRightContent} >
                <Image style={styles.thumbnail} source={{uri: `${databaseURL}${props.item.imageURL}`}} />
            </View>
            <View style={styles.recipeCardRightContent} >
                <Text style={styles.recipeCardName}>{props.item.name}</Text>
                <Text style={styles.recipeCardOtherTop} numberOfLines={1}>Prep time: {props.item.time}</Text>
                <Text style={styles.recipeCardOtherBottom} numberOfLines={1}>Difficulty: {props.item.difficulty}/10</Text>
            </View>
        </TouchableOpacity>
    )
}