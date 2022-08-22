import React from "react";
import { Platform, TouchableOpacity, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "./DualOSPickerStyleSheet";
import IOSPicker from "./IOSPicker.ios";
import Icon from "react-native-vector-icons/FontAwesome";
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

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
						testID={`${this.props.testID}-picker`}
					>
						<Text
							maxFontSizeMultiplier={2}
							style={styles.IOSSelectedChoiceTextBox}
							testID={`${this.props.testID}-picker-value`}
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
