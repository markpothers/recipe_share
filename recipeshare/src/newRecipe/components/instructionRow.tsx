import React, { useRef, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RecipeInstruction } from "../../centralTypes";
import { centralStyles } from "../../centralStyleSheet"; //eslint-disable-line no-unused-vars
import { styles } from "../newRecipeStyleSheet";

// Type assertion for Icon component to fix TypeScript issues
const IconComponent = Icon as React.ComponentType<{
	name: string;
	size: number;
	style: object;
}>;

type OwnProps = {
	index: number;
	handleInstructionSizeChange: (id: string, height: number) => void;
	handleInstructionChange: (text: string, id: string) => void;
	item: RecipeInstruction;
	chooseInstructionPicture: (id: string) => void;
	instructionImagePresent: boolean;
	removeInstruction: (id: string) => void;
	onInstructionMicrophonePress: (id: string) => void;
	inputToFocus: boolean;
	setNextInstructionInput: (element: TextInput) => void;
	isRecording: boolean;
	onLongPress?: () => void;
	isActive?: boolean;
};

export const InstructionRow = ({
	index,
	handleInstructionSizeChange,
	handleInstructionChange,
	item,
	chooseInstructionPicture,
	instructionImagePresent,
	removeInstruction,
	onInstructionMicrophonePress,
	inputToFocus,
	setNextInstructionInput,
	isRecording,
	onLongPress,
	isActive,
}: OwnProps) => {
	const textInput = useRef(null);
	const [inputHeight, setInputHeight] = useState(responsiveHeight(6)); // minimum height

	const minHeight = responsiveHeight(6);

	return (
		<View
			style={[
				centralStyles.formInputContainer,
				{ width: responsiveWidth(100), opacity: isActive ? 0.5 : 1, minHeight: inputHeight },
			]}
		>
			<TouchableOpacity
				style={[
					styles.deleteInstructionContainer,
					{ width: responsiveWidth(12), height: inputHeight, minHeight },
				]}
				onLongPress={onLongPress}
				disabled={!onLongPress}
				activeOpacity={0.8}
			>
				<IconComponent name="menu" size={responsiveHeight(3.5)} style={styles.ingredientTrashCan} />
			</TouchableOpacity>
			<View
				style={[centralStyles.formInputWhiteBackground, { width: "57%", minHeight: inputHeight }]}
				ref={textInput}
			>
				<TextInput
					maxFontSizeMultiplier={2}
					style={[styles.instructionInput, { minHeight: inputHeight, height: inputHeight }]}
					multiline={true}
					numberOfLines={1}
					scrollEnabled={false}
					value={item.text}
					placeholder={`Instructions: step ${index + 1}`}
					placeholderTextColor="#888"
					onChangeText={(text) => {
						handleInstructionChange(text, item.id);
					}}
					onContentSizeChange={(event) => {
						const newHeight = Math.max(minHeight, event.nativeEvent.contentSize.height);
						setInputHeight(newHeight);
						handleInstructionSizeChange(item.id, newHeight);
					}}
					ref={(element) => {
						if (inputToFocus) setNextInstructionInput(element);
					}}
				/>
			</View>
			<TouchableOpacity
				style={[
					styles.deleteInstructionContainer,
					{ width: "9%", backgroundColor: isRecording ? "#505050" : "white", height: inputHeight, minHeight },
				]}
				onPress={() => onInstructionMicrophonePress(item.id)}
				activeOpacity={0.7}
			>
				<IconComponent
					name="microphone"
					size={responsiveHeight(3.5)}
					style={[styles.ingredientTrashCan, { color: isRecording ? "white" : "#505050" }]}
				/>
			</TouchableOpacity>
			<TouchableOpacity
				style={[
					styles.deleteInstructionContainer,
					{
						width: "9%",
						backgroundColor: instructionImagePresent ? "#505050" : "white",
						height: inputHeight,
						minHeight,
					},
				]}
				activeOpacity={0.7}
				onPress={() => chooseInstructionPicture(item.id)}
				testID={`photo-instruction${index + 1}`}
			>
				<IconComponent
					name="camera"
					size={responsiveHeight(3.5)}
					style={[styles.ingredientTrashCan, { color: instructionImagePresent ? "white" : "#505050" }]}
				/>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.deleteInstructionContainer, { width: "9%", height: inputHeight, minHeight }]}
				onPress={() => removeInstruction(item.id)}
				activeOpacity={0.7}
				testID={`delete-instruction${index + 1}`}
			>
				<IconComponent
					name="trash-can-outline"
					size={responsiveHeight(3.5)}
					style={styles.ingredientTrashCan}
				/>
			</TouchableOpacity>
		</View>
	);
};
