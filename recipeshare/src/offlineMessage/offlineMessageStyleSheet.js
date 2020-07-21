import React from 'react'
import { StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions'

export const styles = StyleSheet.create({
	messageContainer: {
		borderRadius: 5,
		position: 'absolute',
		alignSelf: 'center',
		top: '25%',
		zIndex: 2,
		backgroundColor: '#104e01',
		borderWidth: 1,
		borderColor: '#fff59b',
		justifyContent: 'center',
		alignItems: 'center'
	},
	messageText: {
		color: '#fff59b',
		paddingHorizontal: responsiveWidth(2),
		paddingVertical: responsiveHeight(1),
		textAlign: 'center',
		fontSize: responsiveFontSize(2)
	}
});
