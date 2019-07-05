import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { styles } from './navigationStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNavigation } from 'react-navigation'

class AppHeader extends React.PureComponent {

    renderDrawerButton = () => {
        return (
            <TouchableOpacity style={styles.headerDrawerButton}>
                <Icon name='menu' style={styles.headerIcon} size={33} onPress={() => this.props.navigation.toggleDrawer()}/>
            </TouchableOpacity>
        )
    }

    render () {
        // console.log(this.props)
        return (
            <View style={styles.headerContainer}>
                {this.props.navigation.dangerouslyGetParent().state.index === 0 ? this.renderDrawerButton() : null}
                <TouchableOpacity>
                    <Text style={styles.headerText}>{this.props.text}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerNewButton}>
                    <Icon name='plus' style={styles.headerIcon} size={33} onPress={() => this.props.navigation.navigate('NewRecipe')}/>
                </TouchableOpacity>
            </View>
            )
    }
}

export default withNavigation(AppHeader)