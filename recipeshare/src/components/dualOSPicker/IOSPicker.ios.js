import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Picker, PickerIOS } from "@react-native-picker/picker";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import React from "react";
import { styles } from "./dualOSPickerStyleSheet";

let IOSPickerTimer; // this variable makes the timer available across methods

export default class IOSPicker extends React.PureComponent {
	choicesPicker = () => {
		return this.props.choices.map((option) => {
			return <Picker.Item style={styles.pickerText} key={option} label={option} value={option} />;
		});
	};

	touchStart = () => {
		clearTimeout(IOSPickerTimer);
	};

	choose = (choice) => {
		this.props.onChoiceChange(choice);
		IOSPickerTimer = setTimeout(() => this.props.closeIOSPicker(), 750);
	};

	render() {
		return (
			<Modal animationType="fade" transparent={true} visible={true}>
				<View style={styles.contentsContainer}>
					<View style={styles.choicesPicker} onTouchStart={this.touchStart}>
						<PickerIOS
							mode="dropdown"
							onValueChange={(choice) => this.choose(choice)}
							selectedValue={this.props.selectedChoice}
							itemStyle={styles.iosPickerText}
							style={styles.IOSSelectedChoiceTextBox}
							testID="iosPicker"
						>
							{this.choicesPicker()}
						</PickerIOS>
					</View>
					<TouchableOpacity
						style={styles.iosCloseButton}
						activeOpacity={0.7}
						onPress={() => this.props.closeIOSPicker()}
					>
						<Text maxFontSizeMultiplier={1.5} style={styles.iosCloseButtonText}>
							Close
						</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		);
	}
}
