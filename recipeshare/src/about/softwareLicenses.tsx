import { Linking, Platform, Text, TouchableOpacity, View } from "react-native"

import React from "react"
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions"
import { softwarePackages } from "../constants/softwarePackages"

export const SoftwareLicenses = () => {

	return (
		<View
			style={{ width: "100%", padding: responsiveWidth(2), height: "100%" }}
		>
			<Text style={{ fontSize: responsiveFontSize(2.2) }}>Recipe-Share for {Platform.OS}</Text>
			<Text style={{ fontSize: responsiveFontSize(2.2) }}>Copyright &#169; {new Date().getFullYear()} Recipe-Share LLC. All rights reserved.</Text>
			<Text style={{ fontSize: responsiveFontSize(2.2) }}>Recipe-Share for {Platform.OS} is built using these open-source packages and their licenses:</Text>
			{softwarePackages.map((item, index) => {
				return (
					<View style={{
						flexDirection: "row",
						flexWrap: "wrap",
						marginHorizontal: responsiveWidth(2),
						marginVertical: responsiveWidth(1)
					}}
						key={index.toString()}
					>
						<Text style={{ fontSize: responsiveFontSize(2.2) }}>&#8226; {item.name}; </Text>
						<Text style={{ fontSize: responsiveFontSize(2.2) }}>{item.copyright}; </Text>
						<TouchableOpacity
							onPress={() => Linking.openURL(item.url)}
							activeOpacity={0.7}
						>
							<Text style={{ color: "blue", fontSize: responsiveFontSize(2.2) }}>license</Text>
						</TouchableOpacity>
					</View>
				)
			})}
		</View>
	)
}
