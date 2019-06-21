import React from 'react'
import { View, Text } from 'react-native'
import { styles } from './recipeListStyleSheet'

export default class PostedBy extends React.PureComponent {
    render(){
        return (
                <View style={styles.recipeCardTopPostedByContainer}>
                    <Text style={styles.recipeCardHighlighted}>Re-shared by {this.props.username}</Text>
                </View>
        )
    }
}