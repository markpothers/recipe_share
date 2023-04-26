import React, { useRef } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../newRecipeStyleSheet";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { centralStyles } from "../../centralStyleSheet"; //eslint-disable-line no-unused-vars
import { responsiveWidth, responsiveHeight, responsiveFontSize } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

type OwnProps = {
	index: number;
	handleInstructionSizeChange: (index: number, height: number) => void;
	handleInstructionChange: (text: string, index: number) => void;
	item: string;
	chooseInstructionPicture: (index: number) => void;
	instructionImagePresent: boolean;
	removeInstruction: (index: number) => void;
	onMicrophonePressIn: (index: number) => void;
	onMicrophonePressOut: (index: number) => void;
	inputToFocus: boolean;
	setNextInstructionInput: (element: TextInput) => void
};

export const InstructionRow = ({
	index,
	handleInstructionSizeChange,
	handleInstructionChange,
	item,
	chooseInstructionPicture,
	instructionImagePresent,
	removeInstruction,
	onMicrophonePressIn,
	onMicrophonePressOut,
	inputToFocus,
	setNextInstructionInput
}: OwnProps) => {
	const textInput = useRef(null);

	return (
		<View style={[centralStyles.formInputContainer, { width: responsiveWidth(100) }]}>
			<View style={[styles.deleteInstructionContainer, { width: responsiveWidth(12) }]}>
				<Icon name="menu" size={responsiveHeight(3.5)} style={styles.ingredientTrashCan} />
			</View>
			<View
				style={[centralStyles.formInputWhiteBackground, { width: "57%" }]}
				ref={textInput}
				onLayout={(event) => {
					const { height } = event.nativeEvent.layout;
					handleInstructionSizeChange(index, height);
				}}
			>
				<TextInput
					maxFontSizeMultiplier={2}
					style={styles.instructionInput}
					multiline={true}
					numberOfLines={1}
					scrollEnabled={false}
					value={item}
					placeholder={`Instructions: step ${index + 1}`}
					onChangeText={(text) => {
						handleInstructionChange(text, index);
						textInput.current.measureInWindow((x, y, width, height) => {
							handleInstructionSizeChange(index, height);
						});
					}}
					ref={(element) => {
						if (inputToFocus) setNextInstructionInput(element);
					}}
				/>
			</View>
			<TouchableOpacity
				style={[styles.deleteInstructionContainer, { width: "9%" }]}
				onPressIn={() => onMicrophonePressIn(index)}
				onPressOut={() => onMicrophonePressOut(index)}
				activeOpacity={0.7}
			>
				<Icon name="microphone" size={responsiveHeight(3.5)} style={styles.ingredientTrashCan} />
			</TouchableOpacity>
			<TouchableOpacity
				style={[
					styles.deleteInstructionContainer,
					{ width: "9%", backgroundColor: instructionImagePresent ? "#505050" : "white" },
				]}
				activeOpacity={0.7}
				onPress={() => chooseInstructionPicture(index)}
				testID={`photo-instruction${index + 1}`}
			>
				<Icon
					name="camera"
					size={responsiveHeight(3.5)}
					style={[
						styles.ingredientTrashCan,
						{ color: instructionImagePresent ? "white" : "#505050" },
					]}
				/>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.deleteInstructionContainer, { width: "9%" }]}
				onPress={() => removeInstruction(index)}
				activeOpacity={0.7}
				testID={`delete-instruction${index + 1}`}
			>
				<Icon name="trash-can-outline" size={responsiveHeight(3.5)} style={styles.ingredientTrashCan} />
			</TouchableOpacity>
		</View>
	);
};
