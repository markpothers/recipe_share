import React from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from './newRecipeStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

export default class InstructionRow extends React.Component {

	render() {
		return (
			<View style={[centralStyles.formInputContainer, { width: responsiveWidth(100) }]}>
				<View style={[styles.deleteInstructionContainer, { width: responsiveWidth(12) }]}>
					<Icon name='menu' size={responsiveHeight(3.5)} style={styles.ingredientTrashCan} />
				</View>
				<View
					style={[centralStyles.formInputWhiteBackground, { width: '67%' }]}
					ref={ref => this.textInput = ref}
					onLayout={(event) => {
						var { height } = event.nativeEvent.layout
						this.props.handleInstructionSizeChange(this.props.index, height)
					}}
				>
					<TextInput
						maxFontSizeMultiplier={2}
						style={styles.instructionInput}
						multiline={true}
						numberOfLines={1}
						value={this.props.item}
						placeholder={`Instructions: step ${this.props.index + 1}`}
						onChangeText={(text) => {
							this.props.handleInstructionChange(text, this.props.index)
							this.textInput.measureInWindow((x, y, width, height) => {
								this.props.handleInstructionSizeChange(this.props.index, height)
							})
						}}
						ref={(element) => this.props.inputToFocus && this.props.setNextInstructionInput(element)}
					/>
				</View>
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
