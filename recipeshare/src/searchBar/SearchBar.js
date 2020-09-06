import React from 'react'
import { View, TextInput } from 'react-native'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function SearchBar(props) {

	// console.log(props)
	return (
		<View
			style={[centralStyles.formContainer,
			{
				width: responsiveWidth(100),
				marginLeft: 0,
				marginBottom: responsiveHeight(0.25),
				// borderWidth: 1
			}
			]}>
			<View style={centralStyles.formSection}>
				<View style={[centralStyles.formInputContainer,
				{
					flexDirection: 'column',
					backgroundColor: 'blue',
					flexWrap: 'nowrap',
					// borderWidth: 1,
					alignItems: null
				}
				]}>
					<TextInput
						maxFontSizeMultiplier={2}
						style={[centralStyles.formInput, { position: 'absolute' }]}
						value={props.searchTerm}
						placeholder={props.text}
						keyboardType="default"
						autoCapitalize="none"
						onChangeText={(text) => props.setSearchTerm(text)}
						ref={props.searchBar}
						// onFocus={props.onFocus}
						onBlur={props.onBlur}
					/>
					{props.searchTerm.length > 0 && (
						<TouchableOpacity style={{
							// backgroundColor: 'red',
							left: responsiveWidth(87),
							width: responsiveWidth(10),
							height: '100%',
							justifyContent: 'center',
							alignItems: 'center',
						}}
							onPress={() => props.setSearchTerm("")}
						>
							<Icon name='close' size={responsiveHeight(3.5)} style={{ color: '#505050' }} />
						</TouchableOpacity>
					)}
				</View>

			</View>
		</View>
	)
}
