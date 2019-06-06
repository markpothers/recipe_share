import React from 'react'
import { Image, View, TouchableOpacity, Text } from 'react-native'
import { styles } from './RSStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNavigation } from 'react-navigation'

class BrowseRecipesHeader extends React.Component {
    render () {
        console.log(this.props.navigation)
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity >
                    <Icon name='menu' size={40} onPress={() => this.props.navigation.toggleDrawer()}/>
                </TouchableOpacity>
                <Text style={{fontSize: 24}}>Mark's Header</Text>
                <TouchableOpacity >
                    <Icon name='plus' size={40} onPress={() => this.props.navigation.navigate('NewRecipe')}/>
                </TouchableOpacity>
            </View>
            )
    }
}

export default withNavigation(BrowseRecipesHeader)