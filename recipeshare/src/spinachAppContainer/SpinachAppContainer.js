import React from 'react'
import { ScrollView, SafeAreaView, Image, KeyboardAvoidingView, View, ActivityIndicator, Platform } from 'react-native'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars

export default class SpinachAppContainer extends React.Component {
	static navigationOptions = {

	}

	state = {
		scrollingEnabled: true
	}

	render() {
		if (this.props.scrollingEnabled) {
			return (
				<SafeAreaView style={centralStyles.fullPageSafeAreaView}>
					<KeyboardAvoidingView
						style={centralStyles.fullPageKeyboardAvoidingView}
						behavior={(Platform.OS === "ios" ? "padding" : "")}
						keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
					>
						<Image
							source={require('../dataComponents/spinach.jpg')}
							style={centralStyles.spinachFullBackground}
							resizeMode={"cover"}
						/>
						{this.props.awaitingServer && <View style={centralStyles.activityIndicatorContainer}><ActivityIndicator style={(Platform.OS === 'ios' ? centralStyles.activityIndicator : {})} size="large" color="#104e01" /></View>}
						<ScrollView style={centralStyles.fullPageScrollView}
							nestedScrollEnabled={true}
							scrollEnabled={this.state.scrollingEnabled}
							keyboardShouldPersistTaps={'always'}
							ref={(c) => { this.scrollView = c; }}
						>
							{this.props.children}
						</ScrollView>
					</KeyboardAvoidingView>
				</SafeAreaView>
			)
		}
		else {
			return (
				<SafeAreaView style={centralStyles.fullPageSafeAreaView}>
					<Image
						source={require('../dataComponents/spinach.jpg')}
						style={centralStyles.spinachFullBackground}
						resizeMode={"cover"}
					/>
					{this.props.awaitingServer && <View style={centralStyles.activityIndicatorContainer}><ActivityIndicator style={(Platform.OS === 'ios' ? centralStyles.activityIndicator : {})} size="large" color="#104e01" /></View>}
					{this.props.children}
				</SafeAreaView>
			)
		}
	}
}
