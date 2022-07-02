import React from "react"
import { Modal, View, PickerIOS, TouchableOpacity, Text } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { styles } from "./DualOSPickerStyleSheet"
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions" //eslint-disable-line no-unused-vars

let IOSPickerTimer  // this variable makes the timer available across methods

export default class IOSPicker extends React.PureComponent {

	choicesPicker = () => {
		return this.props.choices.map(option => {
			return <Picker.Item style={styles.pickerText} key={option} label={option} value={option} />
		})
	}

	touchStart = () => {
		clearTimeout(IOSPickerTimer)
	}

	choose = (choice) => {
		this.props.onChoiceChange(choice)
		IOSPickerTimer = setTimeout(() => this.props.closeIOSPicker(), 750)
	}

	render() {
		return (
			<Modal
				animationType="fade"
				transparent={true}
				visible={true}
			>
				<View style={styles.contentsContainer}>
					<View
						style={styles.choicesPicker}
						onTouchStart={this.touchStart}
					>
						<PickerIOS 
							mode="dropdown"
							onValueChange={choice => this.choose(choice)}
							selectedValue={this.props.selectedChoice}
							itemStyle={styles.iosPickerText}
							style={styles.IOSSelectedChoiceTextBox}
						>
							{this.choicesPicker()}
						</PickerIOS>
					</View>
					<TouchableOpacity
						style={styles.iosCloseButton}
						activeOpacity={0.7}
						onPress={() => this.props.closeIOSPicker()}
					>
						<Text maxFontSizeMultiplier={1.5} style={styles.iosCloseButtonText}>Close</Text>
					</TouchableOpacity>

				</View>
			</Modal>
		)
	}
}
