import React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from './newRecipeStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { centralStyles } from '../centralStyleSheet'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';

export default class InstructionRow extends React.Component {

	state = {
		text: ""
	}

	componentDidMount = () => {
		this.setState({ text: this.props.item })
	}

	render() {
		return (
			<View style={[centralStyles.formInputContainer, { width: responsiveWidth(100) }]}>
				<View style={[styles.deleteInstructionContainer, { width: responsiveWidth(12) }]}>
					<Icon name='menu' size={responsiveHeight(3.5)} style={styles.ingredientTrashCan} />
				</View>
				<TextInput
					maxFontSizeMultiplier={2}
					style={styles.instructionInput}
					multiline={true}
					numberOfLines={1}
					value={this.state.text}
					placeholder={`Step ${this.props.index + 1}`}
					ref={ref => this.textInput = ref}
					onChangeText={(text) => {
						this.textInput.measureInWindow((x, y, width, height) => {
							this.props.handleInstructionSizeChange(this.props.index, height)
						})
						this.setState({ text: text })
					}}
					onLayout={(event) => {
						var { x, y, width, height } = event.nativeEvent.layout
						this.props.handleInstructionSizeChange(this.props.index, height)
					}
					}
					onBlur={() => this.props.handleInstructionChange(this.state.text, this.props.index)}
				/>
				{/* <TouchableOpacity style={[styles.deleteInstructionContainer, { width: '9%' }]} onPress={this.voice} activeOpacity={0.7}>
					<Icon name='microphone' size={responsiveHeight(3.5)} style={styles.ingredientTrashCan} />
				</TouchableOpacity> */}
				<TouchableOpacity style={[styles.deleteInstructionContainer, { width: '9%', backgroundColor: this.props.instructionImagePresent ? '#505050' : 'white' }]} activeOpacity={0.7} onPress={() => this.props.chooseInstructionPicture(this.props.index)}>
					<Icon name='camera' size={responsiveHeight(3.5)} style={[styles.ingredientTrashCan, { color: this.props.instructionImagePresent ? 'white' : '#505050' }]} />
				</TouchableOpacity>
				<TouchableOpacity style={[styles.deleteInstructionContainer, { width: '9%' }]} onPress={() => this.props.removeInstruction(this.props.index)} activeOpacity={0.7}>
					<Icon name='trash-can-outline' size={responsiveHeight(3.5)} style={styles.ingredientTrashCan} />
				</TouchableOpacity>
			</View>
		)
	}
}
