import React, { useState, useEffect } from 'react'
import { Text, Animated } from 'react-native'
import { styles } from './offlineMessageStyleSheet'

export default OfflineMessage = (props) => {
    const [fadeOpacity, setFadeOpacity] = useState(new Animated.Value(0))

    useEffect(() => {
        Animated.timing(
            fadeOpacity,
            {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }
        ).start(() => {
            setTimeout(() => {
                Animated.timing(
                    fadeOpacity,
                    {
                        toValue: 0,
                        duration: 250,
                        useNativeDriver: true,
                    }
                ).start(() => {
                    props.clearOfflineMessage()
                })
            }, 1000)
        })
    })

    return (
        <Animated.View
            style={[styles.messageContainer
            ,{opacity: fadeOpacity}
            ,{top: props.topOffset}
            ]}
        >
            <Text
                style={styles.messageText}
            >
                {props.message}
            </Text>
        </Animated.View>
    )
}