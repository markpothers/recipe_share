import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, AsyncStorage } from 'react-native'
// import { DrawerItems, SafeAreaView } from 'react-navigation';
import { styles } from './drawerStyleSheet'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import { DrawerContentScrollView } from '@react-navigation/drawer';
import * as Device from 'expo-device';

const mapStateToProps = (state) => ({
	loggedInChef: state.loggedInChef,
})

const mapDispatchToProps = {
}

export default (connect(mapStateToProps, mapDispatchToProps)(
	class CustomDrawer extends React.PureComponent {
		
		state = {
			isTablet: false
		}

		componentDidMount = async() => {
			let deviceType = await Device.getDeviceTypeAsync()
			if (deviceType === 2){
				this.setState({isTablet: true})
			}
		}

		logout = () => {
			AsyncStorage.removeItem('chef', () => {
				this.props.setLoadedAndLoggedIn({ loaded: true, loggedIn: false })
			})
		}

		render() {
			return (
				<DrawerContentScrollView {...this.props}>
					<View style={[styles.mainPageContainer, { height: responsiveHeight(90) }]}>
						<View style={styles.headerContainer}>
							<View style={styles.headerTopContainer}>
								<Image style={styles.logo} resizeMode="contain" source={require('../src/dataComponents/greenLogo.png')} />
							</View>
						</View>
						<View style={styles.horizontalRule}></View>
						<ScrollView style={styles.routesContainer}>
							<TouchableOpacity style={styles.routeLink} onPress={() => this.props.navigation.navigate('BrowseRecipes')}>
								<Icon name='food' size={responsiveHeight(3.5)} style={styles.icon} />
								<View style={styles.routeNameContainer}>
									<Text style={[styles.routeName, {fontSize: this.state.isTablet ? responsiveFontSize(2) : responsiveFontSize(2.7)}]} maxFontSizeMultiplier={2}>All recipes {"&"} chefs</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity style={styles.routeLink} onPress={() => this.props.navigation.navigate('MyRecipeBook')}>
								<Icon name='book-open-page-variant' size={responsiveHeight(3.5)} style={styles.icon} />
								<View style={styles.routeNameContainer}>
									<Text style={[styles.routeName, {fontSize: this.state.isTablet ? responsiveFontSize(2) : responsiveFontSize(2.7)}]} maxFontSizeMultiplier={2}>My recipe book</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity style={styles.routeLink} onPress={() => this.props.navigation.navigate('Profile')}>
								<Icon name='account' size={responsiveHeight(3.5)} style={styles.icon} />
								<View style={styles.routeNameContainer}>
									<Text style={[styles.routeName, {fontSize: this.state.isTablet ? responsiveFontSize(2) : responsiveFontSize(2.7)}]} maxFontSizeMultiplier={2}>My profile</Text>
								</View>
							</TouchableOpacity>
						</ScrollView>
						<View style={styles.horizontalRule}></View>
						<View style={styles.bottomContainer}>
							<View style={styles.bottomLeftContainer}>
								<Text style={[styles.userNameHeader, {fontSize: this.state.isTablet ? responsiveFontSize(1.7) : responsiveFontSize(2.5)}]} maxFontSizeMultiplier={1.5}>Logged in as:</Text>
								<TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
								<Text style={[styles.userName, {fontSize: this.state.isTablet ? responsiveFontSize(1.9) : responsiveFontSize(2.9)}]} maxFontSizeMultiplier={1.5}>{this.props.loggedInChef.username}</Text>
								</TouchableOpacity>
							</View>
							<TouchableOpacity style={styles.bottomRightContainer} onPress={() => this.props.navigation.navigate('Profile')}>
								<AvatarImage image_url={this.props.loggedInChef.image_url} />
							</TouchableOpacity>
						</View>
						<View style={styles.horizontalRule}></View>
						<View style={styles.logoutContainer}>
							<TouchableOpacity style={[styles.routeLink, { height: responsiveHeight(8) }]} onPress={this.logout}>
								<Icon name='logout' size={responsiveHeight(3.5)} style={styles.icon} />
								<View style={styles.routeNameContainer}>
									<Text style={[styles.routeName, {fontSize: this.state.isTablet ? responsiveFontSize(2) : responsiveFontSize(2.7)}]} maxFontSizeMultiplier={2}>Logout</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</DrawerContentScrollView>
			)
		}
	}))

function AvatarImage(props) {
	// console.log(props)
	const URL = props.image_url
	if (!URL) {
		return (
			<Image style={styles.avatarThumbnail} source={require("../src/dataComponents/spinach-low.jpg")} />
		)
	} else {
		return (
			<Image style={styles.avatarThumbnail} source={{ uri: URL }} />
		)
	}
}
