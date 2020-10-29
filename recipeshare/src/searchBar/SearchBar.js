import React from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default function SearchBar(props) {

	// console.log(props)
	return (
		<View
			style={
				{
					justifyContent: 'center',
					alignItems: 'center',
					marginLeft: 0,
					marginBottom: responsiveHeight(0.25),
				}
			}>
			<View style={centralStyles.formSection}>
				<View style={
					{
						flexDirection: 'row',
						marginTop: responsiveHeight(0.5),
						width: responsiveWidth(100),
						justifyContent: 'space-between',
						alignItems: 'center',
						backgroundColor: 'white',
						borderRadius: 5,
						borderWidth: 1,
						borderColor: '#104e01',
						overflow: 'hidden',
					}
				}>
					<TextInput
						maxFontSizeMultiplier={2}
						style={{
							minHeight: responsiveHeight(6),
							backgroundColor: 'white',
							textAlign: 'left',
							textAlignVertical: 'center',
							paddingLeft: responsiveWidth(2),
							width: responsiveWidth(90),
						}}
						value={props.searchTerm}
						placeholder={props.text}
						keyboardType="default"
						autoCapitalize="none"
						onChangeText={(text) => props.setSearchTerm(text)}
						ref={props.searchBar}
						// onFocus={props.onFocus}
						onBlur={props.onBlur}
						testID={'searchTermInput'}
					/>
					{props.searchTerm.length > 0 && (
						<TouchableOpacity
							style={{
								width: responsiveWidth(10),
								height: '100%',
								justifyContent: 'center',
								alignItems: 'center',
							}}
							onPress={() => props.setSearchTerm("")}
							testID={'deleteSearchTermButton'}
						>
							<Icon
								name='close'
								size={responsiveHeight(3.5)}
								style={{ color: '#505050' }}
							/>
						</TouchableOpacity>
					)}
				</View>

			</View>
		</View>
	)
}
