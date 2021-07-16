import React from 'react'
import { View, ActivityIndicator, Platform } from 'react-native';
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars

export default function StyledActivityIndicator() {


	return (
		<View style={centralStyles.activityIndicatorContainer}>
			<ActivityIndicator
				style={(Platform.OS === 'ios' ? centralStyles.activityIndicator : {})}
				size="large"
				color="#104e01"
			/>
		</View>
	)
}
