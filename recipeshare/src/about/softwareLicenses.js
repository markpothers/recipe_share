import React from 'react'
import { Text, View, Platform, TouchableOpacity, Linking } from 'react-native'
import { responsiveWidth } from 'react-native-responsive-dimensions'
import { softwarePackages } from '../dataComponents/softwarePackages'

export const SoftwareLicenses = () => {

	return (
		<View
			style={{ width: '100%', padding: responsiveWidth(2), height: '100%' }}
		>
			<Text>Recipe-Share for {Platform.OS}</Text>
			<Text>Copyright &#169; {new Date().getFullYear()} Recipe-Share LLC. All rights reserved.</Text>
			<Text>Recipe-Share for {Platform.OS} is built using these open-source packages and their licenses:</Text>
			{softwarePackages.map((item, index) => {
				return (
					<View style={{
						flexDirection: 'row',
						flexWrap: 'wrap',
						marginHorizontal: responsiveWidth(2),
						marginVertical: responsiveWidth(1)
					}}
						key={index.toString()}
					>
						<Text>&#8226; {item.name}; </Text>
						<Text>{item.copyright}; </Text>
						<TouchableOpacity
							onPress={() => Linking.openURL(item.url)}
							activeOpacity={0.7}
						>
							<Text style={{ color: 'blue' }}>license</Text>
						</TouchableOpacity>
					</View>
				)
			})}
		</View>
	)
}
