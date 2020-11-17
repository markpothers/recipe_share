import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { styles } from './navigationStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNavigation } from '@react-navigation/compat'
import { centralStyles } from '../src/centralStyleSheet' //eslint-disable-line no-unused-vars
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

class AppHeader extends React.PureComponent {

	renderDrawerButton = () => {
		return (
			<View style={centralStyles.headerButtonContainer}>
				<TouchableOpacity
					style={styles.headerDrawerButton}
					activeOpacity={0.7}
					onPress={() => this.props.navigation.toggleDrawer()}
				>
					<Icon name='menu' style={styles.headerIcon} size={responsiveWidth(9)} />
				</TouchableOpacity>
			</View>
		)
	}

	renderBackButton = () => {
		return (
			<View style={centralStyles.headerButtonContainer}>
				<TouchableOpacity
					style={styles.headerDrawerButton}
					activeOpacity={0.7}
					onPress={() => this.props.navigation.goBack()}>
					<Icon name='arrow-left' style={styles.headerIcon} size={responsiveWidth(9)} />
				</TouchableOpacity>
			</View>
		)
	}

	render() {
		// console.log(this.props.route?.params?.buttons)
		// console.log("rendering header")
		// console.log(this.props.navigation.state.routeName === "MyRecipeBook") //NB: Using this test should NOT WORK!!!!
		// you should be using this.props.navigation.dangerouslyGetParent().state.index but this doesn't POP properly after
		// the stack height gets higher than 3 for reasons I can't figure out (once it gets higher than 3 it never goes below 1!).
		//  However, the same bug results in the route name
		// changing back to MyRecipeBook early in the goBack sequence so testing for this displays the drawer button correctly.
		// I don't understand this at all and honestly believe it's a bug in react navigation.
		// I think this might have been fixed with react-navigation 5 but it seems to be working as is
		return (
			<View style={styles.headerContainer}>
				<View style={styles.headerEnd}>
					{this.props.navigation.state.routeName !== "ChefDetails" && this.props.navigation.state.routeName !== "NewRecipe" && this.props.navigation.state.routeName !== "RecipeDetails" ? this.renderDrawerButton() : this.renderBackButton()}
				</View>
				<View style={styles.headerMiddle} >
					<Text style={styles.headerText} maxFontSizeMultiplier={1.3}>{this.props.text}</Text>
				</View>
			</View>
		)
	}
}

export default withNavigation(AppHeader)
