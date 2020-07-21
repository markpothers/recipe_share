import React from 'react'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
	contentsContainer: {
		position: 'absolute',
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
		backgroundColor: '#fff59b',
		bottom: 0,
		height: '35%',
		width: '100%',
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	choicesPicker: {
		width: '100%',
		height: '100%',
		top: 15,
		zIndex: 2,
	},
	androidPicker: {
		height: '100%',
		width: '100%',
		justifyContent: 'center',
	},
	IOSPicker: {
		height: '100%',
		width: '100%',
		bottom: '8%',
		justifyContent: 'center',
	},
	IOSSelectedChoiceTextBox: {
		marginLeft: 8,
	},
	pickerContainer: {
		height: '100%',
		width: '100%',
	},
	IOSSelectedChoiceContainer: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
	}
})
