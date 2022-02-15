import React, { useState, useEffect } from 'react'
import { Switch, Platform } from 'react-native'
import * as Device from 'expo-device';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

export default function SwitchSized(props) {
	let [deviceType, setDeviceType] = useState(0)

	useEffect(() => {
		const getDeviceType = async () => {
			let deviceType = await Device.getDeviceTypeAsync()
			setDeviceType(deviceType)
		}
		getDeviceType()
	}, [])

	return (
		<Switch
			//reduce size on iPhones (deviceType == 1 ) but not on anything else
			style={[
				(Platform.OS === 'ios' && deviceType == 1 ? { transform: [{ scaleX: .7 }, { scaleY: .7 }] } : null),
				(props.disabled && Platform.OS == 'android' ? { opacity: 0.5 } : null),
				(Platform.OS == 'android' ? {height: responsiveHeight(3.5), marginVertical: responsiveHeight(0.5) } : null)
			]}
			value={props.value}
			onValueChange={props.onValueChange}
			trackColor={props.trackColor ? props.trackColor : ({ true: '#5c8a5199', false: Platform.OS == 'ios' ? null : '#64715599' })}
			thumbColor={props.thumbColor ? props.thumbColor : (Platform.OS === 'ios' ? null : (props.value ? "#4b7142" : '#eaeaea'))}
			disabled={props.disabled}
		/>
	)
}
