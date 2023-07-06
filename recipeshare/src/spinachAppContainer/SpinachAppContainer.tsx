import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from "react-native"
import React, { useState } from "react"

import StyledActivityIndicator from "../customComponents/styledActivityIndicator/styledActivityIndicator"
import { centralStyles } from "../centralStyleSheet" //eslint-disable-line no-unused-vars

type OwnProps = {
	scrollingEnabled: boolean,
	awaitingServer: boolean,
	children: React.ReactElement[]
}

const SpinachAppContainer = ({scrollingEnabled, awaitingServer, children}: OwnProps) => {
// export default class SpinachAppContainer extends React.Component {
	const [ stateScrollingEnabled ] = useState(true)

		if (scrollingEnabled) {
			return (
				<SafeAreaView style={centralStyles.fullPageSafeAreaView}>
					<KeyboardAvoidingView
						style={centralStyles.fullPageKeyboardAvoidingView}
						// @ts-ignore
						behavior={(Platform.OS === "ios" ? "padding" : "")}
						keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
					>
						<Image
							source={require("../dataComponents/spinach.jpg")}
							style={centralStyles.spinachFullBackground}
							resizeMode={"cover"}
						/>
						{awaitingServer && <StyledActivityIndicator/>}
						<ScrollView style={centralStyles.fullPageScrollView}
							nestedScrollEnabled={true}
							scrollEnabled={stateScrollingEnabled}
							keyboardShouldPersistTaps={"always"}
							// ref={(c) => { this.scrollView = c }}
						>
							{children}
						</ScrollView>
					</KeyboardAvoidingView>
				</SafeAreaView>
			)
		}
		else {
			return (
				<SafeAreaView style={centralStyles.fullPageSafeAreaView}>
					<Image
						source={require("../dataComponents/spinach.jpg")}
						style={centralStyles.spinachFullBackground}
						resizeMode={"cover"}
					/>
					{awaitingServer && <StyledActivityIndicator/>}
					{children}
				</SafeAreaView>
			)
		}
	}

export default SpinachAppContainer
