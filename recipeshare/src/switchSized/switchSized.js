import React, { useState, useEffect } from 'react'
import { Switch, Platform } from 'react-native'
import * as Device from 'expo-device';

export default function SwitchSized(props) {
    let [deviceType, setDeviceType] = useState('')

    useEffect(() => {
        Device.getDeviceTypeAsync().then(deviceType => setDeviceType(deviceType))
    }, [])

    return (
        <Switch
            //reduce size on iPhones (deviceType == 1 ) but not on anything elseiPads
            style={(Platform.OS === 'ios' && deviceType == 1 ? { transform: [{ scaleX: .7 }, { scaleY: .7 }] } : null)}
            value={props.value}
            onChange={props.onChange}
            trackColor={{ true: '#4b714299' }}
            thumbColor={(Platform.OS === 'ios' ? (props.value ? "#4b7142" : null) : (props.value ? "#4b7142" : '#ececec'))}
        />
    )
}