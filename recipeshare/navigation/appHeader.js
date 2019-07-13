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
        // console.log("rendering header")
        // console.log(this.props.navigation.state.routeName === "MyRecipeBook") //NB: Using this test should NOT WORK!!!!
        // you should be using this.props.navigation.dangerouslyGetParent().state.index but this doesn't POP properly after
        // the stack height gets higher than 3 for reasons I can't figure out (once it gets higher than 3 it never goes below 1!).
        //  However, the same bug results in the route name
        // changing back to MyRecipeBook early in the goBack sequence so testing for this displays the drawer button correctly.
        // I don't understand this at all and honestly believe it's a bug in react navigation.
        return (
            <View style={styles.headerContainer}>
                {this.props.navigation.state.routeName !== "ChefDetails" && this.props.navigation.state.routeName !== "NewRecipe" ? this.renderDrawerButton() : null}
                <TouchableOpacity onPress={() => this.props.navigation.popToTop()}>
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