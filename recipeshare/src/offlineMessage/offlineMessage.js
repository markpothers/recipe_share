import React, { useState, useEffect } from 'react'
import { Text, Animated } from 'react-native'
import { styles } from './offlineMessageStyleSheet'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

const OfflineMessage = (props) => {
	const [fadeOpacity] = useState(new Animated.Value(0))

	useEffect(() => {
		const renderDuration = props.delay ? props.delay : 5000
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
					style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}
				>
					<Text
						maxFontSizeMultiplier={2.5}
						style={styles.messageText}
					>
						{props.message}
					</Text>
					<Icon
						name='forwardburger'
						size={responsiveHeight(5)}
						style={{ color: '#fff59b', marginRight: responsiveWidth(2) }}
					/>
				</TouchableOpacity>
			) : (
					<Text
						maxFontSizeMultiplier={2.5}
						style={styles.messageText}
					>
						{props.message}
					</Text>
				)}
		</Animated.View>
	)
}

export default OfflineMessage
