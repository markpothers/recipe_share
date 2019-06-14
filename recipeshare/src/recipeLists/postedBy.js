import React from 'react'
import { Image, View, TouchableOpacity, Text } from 'react-native'
import { styles } from './recipeListStyleSheet'
import { databaseURL } from '../dataComponents/databaseURL'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PostedBy(props) {
    // console.log(props)
    return (
            <View style={styles.recipeCardTopPostedByContainer}>
                <Text style={styles.recipeCardHighlighted}>Mentioned by Pothers</Text>
            </View>
    )
}