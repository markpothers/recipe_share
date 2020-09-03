import React from 'react'
import { View, TextInput } from 'react-native'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

export default function SearchBar(props) {

	// console.log(props)
	return (
		<View
			style={[centralStyles.formContainer,
			{
				width: responsiveWidth(100),
				marginLeft: 0,
				marginBottom: responsiveHeight(0.25),
			}
			]}>
			<View style={centralStyles.formSection}>
				<View style={centralStyles.formInputContainer}>
					<TextInput
						maxFontSizeMultiplier={2}
						style={centralStyles.formInput}
						value={props.searchTerm}
						placeholder={props.text}
						keyboardType="default"
						autoCapitalize="none"
						onChangeText={(text) => props.setSearchTerm(text)}
						ref={props.searchBar}
						// onFocus={props.onFocus}
						onBlur={props.onBlur}
					/>
				</View>
			</View>
		</View>
	)
}
