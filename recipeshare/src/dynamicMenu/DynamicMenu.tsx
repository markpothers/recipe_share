import React, { useState, useEffect } from "react"
import { Modal, Text, TouchableOpacity, Animated, SafeAreaView } from "react-native"
import { styles } from "./dynamicMenuStyleSheet"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { responsiveWidth, responsiveHeight, responsiveFontSize } from "react-native-responsive-dimensions" //eslint-disable-line no-unused-vars

type Props = {
	buttons: {
		action: () => void;
		icon: string;
		text: string;
	}[],
	closeDynamicMenu: () => void
}

export default function DynamicMenu(props: Props) {
	const { buttons, closeDynamicMenu } = props
	const [menuHeight] = useState(new Animated.Value(0))
	const [menuWidth] = useState(new Animated.Value(0))
	const [menuTop] = useState(new Animated.Value(0))
	const [menuLeft] = useState(new Animated.Value(0))

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
				duration: 150,
				useNativeDriver: true,
			},
		).start(() => { })
		Animated.timing(
			menuTop,
			{
				toValue: 10 + ((buttons?.length * responsiveHeight(7)) / 2),
				duration: 150,
				useNativeDriver: true,
			},
		).start(() => { })
		Animated.timing(
			menuLeft,
			{
				toValue: - (5 + responsiveWidth(25)),
				duration: 150,
				useNativeDriver: true,
			},
		).start(() => { })
	})

	const handleButtonPress = (buttonAction) => {
		buttonAction()
	}

	// console.log(((buttons?.length * responsiveHeight(7)) / 2))
	const renderButtons = () => {
		if (buttons?.length > 0) {
			return buttons.map((button, index) => {
				return (
					<TouchableOpacity style={styles.buttonContainer} onPress={() => handleButtonPress(button.action)} key={index.toString()} accessibilityRole="button">
						<Icon style={styles.buttonIcon} name={button.icon} size={responsiveHeight(4)} />
						<Text
							style={styles.buttonText}
							maxFontSizeMultiplier={2}
						>
							{button.text}
						</Text>
					</TouchableOpacity>
				)
			})
		}

	}

	// console.log(menuHeight)
	return (
		<Modal
			animationType="none"
			transparent={true}
			visible={true}
		>
			<SafeAreaView style={{ flex: 1 }}>
				<TouchableOpacity
					style={styles.dynamicMenuOuterContainer}
					onPress={closeDynamicMenu}
					accessibilityRole="button"
					accessibilityHint="Close menu"
				>
					<Animated.View
						style={[styles.dynamicMenuContainer,
						{
							height: buttons?.length * responsiveHeight(7),
							top: (-(10 + (buttons?.length * responsiveHeight(7))) / 2),
							left: responsiveWidth(25),
							transform: [
								{ scaleY: menuHeight },
								{ translateY: menuTop },
								{ scaleX: menuWidth },
								{ translateX: menuLeft }
							]
						}
						]}
					>
						{renderButtons()}
					</Animated.View>
				</TouchableOpacity>
			</SafeAreaView>
		</Modal >
	)
}
