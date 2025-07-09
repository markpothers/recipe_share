import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Ingredient } from "../centralTypes";
import React from "react";
import { responsiveHeight } from "react-native-responsive-dimensions";

type IngredientAutocompleteBarProps = {
	visible: boolean;
	suggestions: Ingredient[];
	onSelect: (ingredient: Ingredient) => void;
	onRequestClose: () => void;
	keyboardHeight?: number;
};

export const IngredientAutocompleteBar: React.FC<IngredientAutocompleteBarProps> = ({
	visible,
	suggestions,
	onSelect,
	onRequestClose,
	keyboardHeight = 0,
}) => {
	if (!visible) return null;

	return (
		<View style={[styles.container, { bottom: keyboardHeight }]}>
			{/* Move above keyboard */}
			<TouchableOpacity
				style={styles.closeIconButton}
				onPress={onRequestClose}
				activeOpacity={0.7}
				accessibilityLabel="Close autocomplete"
			>
				<Icon name="close" size={24} color="#888" />
			</TouchableOpacity>
			<FlatList
				data={suggestions}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.item}
						onPress={() => onSelect(item)}
						activeOpacity={0.7}
					>
						<Text style={styles.text}>{item.name}</Text>
					</TouchableOpacity>
				)}
				keyboardShouldPersistTaps="always"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "#fff",
		borderTopWidth: 1,
		borderColor: "#ccc",
		maxHeight: responsiveHeight(20),
		zIndex: 100,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 10,
	},
	closeIconButton: {
		position: "absolute",
		top: 6,
		right: 8,
		zIndex: 101,
		padding: 4,
		backgroundColor: "transparent",
	},
	item: {
		padding: responsiveHeight(1.5),
		borderBottomWidth: 0.5,
		borderBottomColor: "#eee",
		backgroundColor: "#fff", // ensure white background for each item
	},
	text: {
		fontSize: 16,
	},
});
