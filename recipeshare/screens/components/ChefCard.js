import React from 'react'
import { Image, View, TouchableOpacity, Text } from 'react-native'
import { styles } from '../functionalComponents/RSStyleSheet'

export default function ChefCard(props) {
    // console.log(props.listChoice)
        return (
            <TouchableOpacity activeOpacity={0.7} style={styles.recipeCard} onPress={() => props.navigation(props.listChoice, props.item.id)}>
                <View style={styles.recipeCardRightContent} >
                    <Image style={styles.thumbnail} source={props.imageURL} />
                </View>
                <View style={styles.recipeCardRightContent} >
                <Text style={styles.recipeCardName}>{props.item.id}: {props.item.username}</Text>
                    <Text style={styles.recipeCardOther} numberOfLines={1}>From: {props.item.country}</Text>
                </View>
            </TouchableOpacity>
        )
}