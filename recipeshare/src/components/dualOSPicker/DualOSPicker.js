import { Platform, Text, TouchableOpacity, View } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import IOSPicker from "./iOSPicker.ios";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { styles } from "./dualOSPickerStyleSheet";

export default class DualOSPicker extends React.PureComponent {
	state = {
		IOSPickerShowing: false,
	};

	choicesPicker = () => {
		return this.props.options.map((option) => {
			return <Picker.Item style={styles.pickerText} key={option} label={option} value={option} />;
		});
	};

	closeIOSPicker = () => {
		this.setState({ IOSPickerShowing: false });
	};

	render() {
		if (Platform.OS === "ios") {
			return (
				<View style={styles.pickerContainer}>
					<TouchableOpacity
						style={[
							styles.IOSSelectedChoiceContainer,
							{ justifyContent: this.props.textAlignment ?? "space-evenly" },
						]}
						onPress={() => this.setState({ IOSPickerShowing: true })}
						testID={`${this.props.testID} picker`}
					>
						<Text
							maxFontSizeMultiplier={2}
							style={styles.IOSSelectedChoiceTextBox}
							testID={`${this.props.accessibilityLabel} value`}
							accessibilityLabel={`${this.props.accessibilityLabel}`}
						>
							{this.props.selectedChoice}
						</Text>
						<Icon
							name="caret-down"
							size={responsiveHeight(3.5)}
							style={[
								styles.dropDownIcon,
								this.props.textAlignment ? { position: "absolute", right: 0, marginRight: "5%" } : null,
							]}
						/>
					</TouchableOpacity>
					{this.state.IOSPickerShowing ? (
						<IOSPicker
							choices={this.props.options}
							selectedChoice={this.props.selectedChoice}
							onChoiceChange={this.props.onChoiceChange}
							closeIOSPicker={this.closeIOSPicker}
						/>
					) : null}
				</View>
			);
		} else {
			return (
				<View style={styles.pickerContainer}>
					<Picker
						style={styles.androidPicker}
						mode="dropdown"
						onValueChange={(choice) => this.props.onChoiceChange(choice)}
						selectedValue={this.props.selectedChoice}
						testID="androidPicker"
					>
						{this.choicesPicker()}
					</Picker>
				</View>
			);
		}
	}
}
