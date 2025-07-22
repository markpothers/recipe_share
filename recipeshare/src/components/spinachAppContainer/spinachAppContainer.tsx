import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from "react-native";
import React, { useState } from "react";

import StyledActivityIndicator from "../styledActivityIndicator/styledActivityIndicator";
import { centralStyles } from "../../centralStyleSheet"; //eslint-disable-line no-unused-vars
import spinachJpg from "../../../assets/images/spinach.jpg";

type OwnProps = {
	scrollingEnabled: boolean;
	awaitingServer: boolean;
	children?: React.ReactElement | React.ReactElement[];
};

const SpinachAppContainer = ({ scrollingEnabled, awaitingServer, children }: OwnProps) => {
	// export default class SpinachAppContainer extends React.Component {
	const [stateScrollingEnabled] = useState(true);

	if (scrollingEnabled) {
		return (
			<SafeAreaView style={centralStyles.fullPageSafeAreaView}>
				<KeyboardAvoidingView
					style={centralStyles.fullPageKeyboardAvoidingView}
					// @ts-ignore
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
				>
					<Image
						source={spinachJpg}
						style={centralStyles.spinachFullBackground}
						resizeMode={"cover"}
					/>
					{awaitingServer && <StyledActivityIndicator />}
					<ScrollView
						style={centralStyles.fullPageScrollView}
						nestedScrollEnabled={true}
						scrollEnabled={stateScrollingEnabled}
						keyboardShouldPersistTaps={"always"}
						// ref={(c) => { this.scrollView = c }}
					>
						{children}
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		);
	} else {
		return (
			<SafeAreaView style={centralStyles.fullPageSafeAreaView}>
				<Image
					source={spinachJpg}
					style={centralStyles.spinachFullBackground}
					resizeMode={"cover"}
				/>
				{awaitingServer && <StyledActivityIndicator />}
				{children}
			</SafeAreaView>
		);
	}
};

export default SpinachAppContainer;
