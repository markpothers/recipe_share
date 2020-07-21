import React from 'react'
import { Modal, View, PickerIOS, Dimensions, Picker } from 'react-native'
import { styles } from './DualOSPickerStyleSheet'

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
				<View style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width }}>
					<View style={styles.contentsContainer}>
						<View
							style={styles.choicesPicker}
							onTouchStart={this.touchStart}
						>
							<PickerIOS style={styles.IOSPicker}
								mode="dropdown"
								onValueChange={choice => this.choose(choice)}
								selectedValue={this.props.selectedChoice}
							>
								{this.choicesPicker()}
							</PickerIOS>
						</View>
					</View>
				</View>
			</Modal>
		)
	}
}
