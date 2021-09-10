import React, { useState, useEffect } from 'react'
import { Switch, Platform } from 'react-native'
import * as Device from 'expo-device';

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
				(props.disabled ? {opacity: 0.3} : null)
			]}
			value={props.value}
			onValueChange={props.onValueChange}
			trackColor={props.trackColor ? props.trackColor : ({true: '#5c8a5199', false: Platform.OS == 'android' ? '#64715599' : '#d8dcd7' })}
			thumbColor={props.thumbColor ? props.thumbColor : (Platform.OS === 'ios' ? (props.value ? "#4b7142" : "#b0b0b0") : (props.value ? "#4b7142" : '#eaeaea'))}
			disabled={props.disabled}
		/>
	)
}
