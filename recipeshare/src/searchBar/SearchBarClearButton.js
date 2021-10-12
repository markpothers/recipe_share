import React from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars


export default function SearchBarClearButton(props) {

	return (
		<TouchableOpacity
			style={{
				width: responsiveWidth(10),
				height: '100%',
				justifyContent: 'center',
				alignItems: 'center',
				// backgroundColor: 'red',
				alignSelf: 'flex-end'
			}}
			onPress={() => props.setSearchTerm("")}
			testID={'deleteSearchTermButton'}
		>
			{props.displayIcon && (
			<Icon
				name='close'
				size={responsiveHeight(3.5)}
				style={{ color: '#505050' }}
			/>
			)}
		</TouchableOpacity>
	)
}
