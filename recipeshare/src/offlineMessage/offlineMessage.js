import React, { useState, useEffect } from 'react'
import { Text, Animated } from 'react-native'
import { styles } from './offlineMessageStyleSheet'
import { TouchableOpacity } from 'react-native-gesture-handler'

const OfflineMessage = (props) => {
	const [fadeOpacity] = useState(new Animated.Value(0))

	useEffect(() => {
		const renderDuration = props.delay ? props.delay : 1000
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
			}, renderDuration)
		})
	})

	return (
		<Animated.View
			style={[styles.messageContainer
				, { opacity: fadeOpacity }
				, { top: props.topOffset }
			]}
		>
			{props.action ? (
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={props.action}
				>
					<Text
						style={styles.messageText}
					>
						{props.message}
					</Text>
				</TouchableOpacity>
			) : (
					<Text
						style={styles.messageText}
					>
						{props.message}
					</Text>
				)}
		</Animated.View>
	)
}

export default OfflineMessage
