import React from 'react'
import { Picker, Platform, TouchableOpacity, Text, View } from 'react-native'
import { styles } from './DualOSPickerStyleSheet'
import IOSPicker from './IOSPicker'

export default class DualOSPicker extends React.PureComponent {

	state = {
		IOSPickerShowing: false
	}

	choicesPicker = () => {
		return this.props.options.map(option => {
			return <Picker.Item style={styles.pickerText} key={option} label={option} value={option} />
		})
	}

	closeIOSPicker = () => {
		this.setState({ IOSPickerShowing: false })
	}

	render() {
		if (Platform.OS === 'ios') {
			return (
				<View style={styles.pickerContainer}>
					<TouchableOpacity style={styles.IOSSelectedChoiceContainer} onPress={() => this.setState({ IOSPickerShowing: true })}>
						<Text maxFontSizeMultiplier={2} style={styles.IOSSelectedChoiceTextBox}>{this.props.selectedChoice}</Text>
					</TouchableOpacity>
					{this.state.IOSPickerShowing ? <IOSPicker choices={this.props.options} selectedChoice={this.props.selectedChoice} onChoiceChange={this.props.onChoiceChange} closeIOSPicker={this.closeIOSPicker} /> : null}
				</View>
			)
		} else {
			return (
				<View style={styles.pickerContainer}>
					<Picker
						style={styles.androidPicker}
						mode="dropdown"
						onValueChange={choice => this.props.onChoiceChange(choice)}
						selectedValue={this.props.selectedChoice}
					>
						{this.choicesPicker()}
					</Picker>
				</View>
			)
		}
	}
}
