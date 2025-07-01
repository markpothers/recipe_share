import { FlatList, Keyboard, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ingredient, RecipeIngredient, Unit } from "../centralTypes";

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
	ingredientIndex: number;
	thisAutocompleteIsFocused: (id: string | null) => void;
	inputToFocus: boolean;
	setNextIngredientInput: (element: TextInput) => void;
	focused: string | null;
	ingredientsLength: number;
	ingredientsList: Ingredient[];
	removeIngredient: (ingredientId: string) => void;
	onLongPress?: () => void;
	isActive?: boolean;
};

const IngredientAutoComplete = ({
	ingredient,
	index,
	updateIngredientEntry,
	ingredientIndex,
	thisAutocompleteIsFocused,
	inputToFocus,
	setNextIngredientInput,
	focused,
	ingredientsLength,
	ingredientsList,
	removeIngredient,
	onLongPress,
	isActive,
}: OwnProps) => {
	const renderAutoIngredientsListItem = (item: Ingredient, ingredientIndex: number, ingredient: RecipeIngredient) => {
		return (
			<TouchableOpacity
				style={{ padding: 5, zIndex: 2 }}
				key={item.id.toString()}
				onPress={() => handleListItemTouch(ingredientIndex, item.name, ingredient.quantity, ingredient.unit)}
			>
				<Text style={styles.autocompleteListText}>{item.name}</Text>
			</TouchableOpacity>
		);
	};

	const handleListItemTouch = (ingredientIndex, name, quantity, unit) => {
		updateIngredientEntry(ingredientIndex, name, quantity, unit);
		thisAutocompleteIsFocused(null);
		Keyboard.dismiss();
	};

	const handlePickerChange = (ingredientIndex, name, quantity, unit) => {
		// if(name !== ""){
		updateIngredientEntry(ingredientIndex, name, quantity, unit);
		Keyboard.dismiss();
		// }
	};

	const onChoiceChange = (choice) => {
		handlePickerChange(ingredientIndex, ingredient.name, ingredient.quantity, choice);
	};

	const autocompleteList = ingredientsList
		.filter((ing) => ing.name.toLowerCase().startsWith(ingredient.name.toLowerCase()))
		.sort((a, b) => (a.name > b.name ? 1 : -1));
	const expandBackgroundTouchCollector =
		focused === ingredient.id && autocompleteList.length > 0 && ingredient.name.length > 1;
	// console.log(focused == index)
	return (
		<View
			style={[
				styles.autoCompleteRowContainer,
				expandBackgroundTouchCollector && { height: responsiveHeight(100) },
				isActive ? { opacity: 0.5 } : null,
			]}
		>
			<TouchableOpacity
				style={styles.ingredientSortContainer}
				onLongPress={onLongPress}
				disabled={!onLongPress}
				activeOpacity={0.9}
			>
				<IconComponent name="menu" size={responsiveHeight(3.5)} style={styles.ingredientTrashCan} />
			</TouchableOpacity>
			<TouchableOpacity
				style={[
					// {backgroundColor: 'red'},
					{ flexDirection: "row" },
					expandBackgroundTouchCollector && { height: responsiveHeight(65), top: -responsiveHeight(15) },
				]}
				activeOpacity={1}
				onPress={() => {
					thisAutocompleteIsFocused(null);
					Keyboard.dismiss();
				}}
			>
				<View
					style={[
						styles.nameAndUnitsContainer,
						Platform.OS == "ios" && { zIndex: Math.min(10, ingredientsLength - index) },
						expandBackgroundTouchCollector && { top: responsiveHeight(15) },
					]}
				>
					<View style={[styles.autoCompleteContainer, { zIndex: Math.min(10, ingredientsLength - index) }]}>
						<TextInput
							maxFontSizeMultiplier={2}
							style={styles.autoCompleteInput}
							value={ingredient.name}
							placeholder={`Ingredient ${index + 1}`}
							onChangeText={(text) =>
								updateIngredientEntry(ingredient.id!, text, ingredient.quantity, ingredient.unit)
							}
							onFocus={() => thisAutocompleteIsFocused(ingredient.id!)}
							onBlur={() => thisAutocompleteIsFocused(null)}
							ref={(element) => inputToFocus && setNextIngredientInput(element)}
						/>
						{expandBackgroundTouchCollector && (
							<FlatList
								data={autocompleteList}
								keyExtractor={(item) => item.id.toString()}
								renderItem={({ item }) =>
									renderAutoIngredientsListItem(item, ingredientIndex, ingredient)
								}
								nestedScrollEnabled={true}
								keyboardShouldPersistTaps="always"
								showsVerticalScrollIndicator={true}
								style={styles.autoCompleteList}
							/>
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
								onChoiceChange={onChoiceChange}
								options={units}
								selectedChoice={ingredient.unit}
								testID={`ingredient${index + 1}`}
								accessibilityLabel={`ingredient${index + 1} unit picker`}
							/>
						</View>
					</View>
				</View>
				<TouchableOpacity
					style={[
						styles.deleteIngredientContainer,
						expandBackgroundTouchCollector && { top: responsiveHeight(15) },
					]}
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
			</TouchableOpacity>
		</View>
	);
};

export default IngredientAutoComplete;
