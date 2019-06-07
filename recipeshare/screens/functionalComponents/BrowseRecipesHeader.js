import React from 'react'
import { Image, View, TouchableOpacity, Text } from 'react-native'
import { styles } from './RSStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNavigation } from 'react-navigation'

class BrowseRecipesHeader extends React.Component {
    render () {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity >
                    <Icon name='menu' size={33} onPress={() => this.props.navigation.toggleDrawer()}/>
                </TouchableOpacity>
                <Text style={{fontSize: 24}}>Browse Recipes</Text>
                <TouchableOpacity >
                    <Icon name='plus' size={33} onPress={() => this.props.navigation.navigate('NewRecipe')}/>
                </TouchableOpacity>
            </View>
            )
    }
}

export default withNavigation(BrowseRecipesHeader)