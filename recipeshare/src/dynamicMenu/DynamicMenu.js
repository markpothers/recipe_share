import React, { useState, useEffect } from 'react'
import { Modal, Text, TouchableOpacity, Animated } from 'react-native'
import { styles } from './dynamicMenuStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

export default function DynamicMenu(props) {
	const [menuHeight] = useState(new Animated.Value(0))
	const [menuWidth] = useState(new Animated.Value(0))
	const [menuTop] = useState(new Animated.Value(-((props.buttons?.length * responsiveHeight(7)) / 2) + 10))
	const [menuLeft] = useState(new Animated.Value(responsiveWidth(40)))

	useEffect(() => {
		Animated.timing(
			menuHeight,
			{
				toValue: 1,
				duration: 150,
				useNativeDriver: true,
			},
		).start(() => { })
		Animated.timing(
			menuWidth,
			{
				toValue: 1,
				duration: 100,
				useNativeDriver: true,
			},
		).start(() => { })
		Animated.timing(
			menuTop,
			{
				toValue: 10,
				duration: 150,
				useNativeDriver: true,
			},
		).start(() => { })
		Animated.timing(
			menuLeft,
			{
				toValue: 0,
				duration: 100,
				useNativeDriver: true,
			},
		).start(() => { })
	})

	const handleButtonPress = (buttonAction) => {
		// console.log(buttonAction)
		// props.closeDynamicMenu()
		buttonAction()
	}

	const renderButtons = () => {
		if (props.buttons?.length > 0) {
			return props.buttons.map((button, index) => {
				return (
					<TouchableOpacity style={styles.buttonContainer} onPress={() => handleButtonPress(button.action)} key={index.toString()}>
						<Icon style={styles.buttonIcon} name={button.icon} size={25} />
						<Text style={styles.buttonText}>{button.text}</Text>
					</TouchableOpacity>
				)
			})
		}

	}

	// console.log(props.buttons)
	return (
		<Modal
			animationType="none"
			transparent={true}
			visible={true}
		>
			<TouchableOpacity
				style={styles.dynamicMenuOuterContainer}
				onPress={props.closeDynamicMenu}
			>
				<Animated.View
					style={[styles.dynamicMenuContainer,
					{
						height: props.buttons?.length * responsiveHeight(7),
						scaleY: menuHeight,
						translateY: menuTop,
						scaleX: menuWidth,
						translateX: menuLeft
					}
					]}
				>
					{renderButtons()}
				</Animated.View>
			</TouchableOpacity>
		</Modal >
	)
}
