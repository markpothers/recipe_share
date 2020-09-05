import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { centralStyles } from '../src/centralStyleSheet' //eslint-disable-line no-unused-vars

export default function AppHeaderRight(props) {
	return (
		<View style={centralStyles.dynamicMenuButtonContainer}>
			<View style={centralStyles.headerButtonContainer}>
				<TouchableOpacity style={centralStyles.dynamicMenuButton} activeOpacity={0.7} onPress={() => props.buttonAction(true)} >
					<Icon name='dots-vertical' style={centralStyles.dynamicMenuIcon} size={33} />
				</TouchableOpacity>
			</View>
		</View>
	)
}
