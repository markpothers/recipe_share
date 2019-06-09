import React from 'react'
import { Image, View, TouchableOpacity, Text } from 'react-native'
import { styles } from './RSStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNavigation } from 'react-navigation'

class BrowseRecipesHeader extends React.Component {
    render () {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.headerDrawerButton}>
                    <Icon name='menu' style={styles.headerIcon} size={33} onPress={() => this.props.navigation.toggleDrawer()}/>
                </TouchableOpacity>
                <Text style={styles.headerText}>Browse Recipes</Text>
                <TouchableOpacity style={styles.headerNewButton}>
                    <Icon name='plus' style={styles.headerIcon} size={33} onPress={() => this.props.navigation.navigate('NewRecipe')}/>
                </TouchableOpacity>
            </View>
            )
    }
}

export default withNavigation(BrowseRecipesHeader)