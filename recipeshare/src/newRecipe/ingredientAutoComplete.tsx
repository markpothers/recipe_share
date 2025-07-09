import { Ingredient, RecipeIngredient, Unit } from "../centralTypes";
import { Platform, TextInput, TouchableOpacity, View } from "react-native";

import { DualOSPicker } from "../components";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { styles } from "./newRecipeStyleSheet";
import { units } from "../constants/units";

// Type assertion for Icon component to fix TypeScript issues
const IconComponent = Icon as React.ComponentType<{
	name: string;
	size: number;
	style: object;
}>;

type OwnProps = {
	ingredient: RecipeIngredient;
	index: number;
	updateIngredientEntry: (ingredientId: string, name: string, quantity: string, unit: Unit) => void;
	thisAutocompleteIsFocused: (id: string | null) => void;
	inputToFocus: boolean;
	setNextIngredientInput: (element: TextInput) => void;
	ingredientsLength: number;
	removeIngredient: (ingredientId: string) => void;
	onLongPress?: () => void;
	isActive?: boolean;
	// New prop: suggestions for this ingredient
	ingredientSuggestions: Ingredient[];
	// New prop: id of the ingredient whose autocomplete is currently open
	autocompleteOpenIngredientId: string | null;
	// Add new blur handler prop
	onIngredientNameBlur?: () => void;
};

const IngredientAutoComplete = ({
	ingredient,
	index,
	updateIngredientEntry,
	thisAutocompleteIsFocused,
	inputToFocus,
	setNextIngredientInput,
	ingredientsLength,
	removeIngredient,
	onLongPress,
	isActive,
	onIngredientNameFocus,
	onIngredientNameBlur,
	onIngredientNameChange,
	onAutocompleteIconPress,
	ingredientSuggestions,
	autocompleteOpenIngredientId,
}: OwnProps & {
	onIngredientNameFocus: (ingredientId: string, currentName: string) => void;
	onIngredientNameChange: (newName: string) => void;
	onAutocompleteIconPress: (ingredientId: string, currentName: string) => void;
}) => {
	const showChevron = ingredientSuggestions.length > 1;
	const isOpen = autocompleteOpenIngredientId === ingredient.id;
	return (
		<View style={[styles.autoCompleteRowContainer, isActive ? { opacity: 0.5 } : null]}>
			<TouchableOpacity
				style={styles.ingredientSortContainer}
				onLongPress={onLongPress}
				disabled={!onLongPress}
				activeOpacity={0.9}
			>
				<IconComponent name="menu" size={responsiveHeight(3.5)} style={styles.ingredientTrashCan} />
			</TouchableOpacity>
			<View
				style={[
					styles.nameAndUnitsContainer,
					Platform.OS == "ios" && { zIndex: Math.min(10, ingredientsLength - index) },
				]}
			>
				<View
					style={[
						styles.autoCompleteContainer,
						{ zIndex: Math.min(10, ingredientsLength - index), position: "relative" },
					]}
				>
					<TextInput
						maxFontSizeMultiplier={2}
						style={[styles.autoCompleteInput, { flex: 1, paddingRight: 32 }]}
						value={ingredient.name}
						placeholder={`Ingredient ${index + 1}`}
						onChangeText={(text) => {
							updateIngredientEntry(ingredient.id!, text, ingredient.quantity, ingredient.unit);
							if (onIngredientNameChange) {
								onIngredientNameChange(text);
							}
						}}
						onFocus={() => onIngredientNameFocus(ingredient.id!, ingredient.name)}
						onBlur={() => {
							if (onIngredientNameBlur) onIngredientNameBlur();
							thisAutocompleteIsFocused(null);
						}}
						ref={(element) => inputToFocus && setNextIngredientInput(element)}
					/>
					{/* Only show chevron if more than one autocomplete option is available for this ingredient */}
					{showChevron && (
						<TouchableOpacity
							onPress={() => onAutocompleteIconPress(ingredient.id!, ingredient.name)}
							style={{
								padding: 4,
								position: "absolute",
								right: 8,
								top: 0,
								bottom: 0,
								justifyContent: "center",
							}}
							accessibilityLabel={isOpen ? "Hide ingredient suggestions" : "Show ingredient suggestions"}
						>
							<Icon
								name={isOpen ? "chevron-down" : "chevron-left"}
								size={22}
								color={isOpen ? "#4b7142" : "#888"}
							/>
						</TouchableOpacity>
					)}
				</View>
				<View style={styles.quantityAndUnitContainer}>
					<View style={styles.addIngredientQuantityInputBox}>
						<TextInput
							maxFontSizeMultiplier={2}
							style={styles.ingredientTextAdjustment}
							placeholder="Qty"
							keyboardType="decimal-pad"
							onChangeText={(text) =>
								updateIngredientEntry(ingredient.id!, ingredient.name, text, ingredient.unit)
							}
							value={ingredient.quantity}
						/>
					</View>
					<View style={styles.addIngredientUnitInputBox}>
						<DualOSPicker
							onChoiceChange={(choice) =>
								updateIngredientEntry(ingredient.id!, ingredient.name, ingredient.quantity, choice)
							}
							options={units}
							selectedChoice={ingredient.unit}
							testID={`ingredient${index + 1}`}
							accessibilityLabel={`ingredient${index + 1} unit picker`}
						/>
					</View>
				</View>
			</View>
			<TouchableOpacity
				style={styles.deleteIngredientContainer}
				onPress={() => removeIngredient(ingredient.id!)}
				activeOpacity={0.7}
				testID={`delete-ingredient${index + 1}`}
				accessibilityLabel={`delete ingredient${index + 1}`}
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

export default IngredientAutoComplete;
