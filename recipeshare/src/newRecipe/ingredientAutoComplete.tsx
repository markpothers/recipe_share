import { Ingredient, RecipeIngredient, Unit } from "../centralTypes";
import { Keyboard, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import Autocomplete from "react-native-autocomplete-input";
import { DualOSPicker } from "../components";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import { styles } from "./newRecipeStyleSheet";
import { units } from "../constants/units";

type OwnProps = {
	ingredient: RecipeIngredient;
	index: number;
	updateIngredientEntry: (ingredientIndex: number, name: string, quantity: string, unit: Unit) => void;
	ingredientIndex: number;
	thisAutocompleteIsFocused: (index: number) => void;
	inputToFocus: boolean;
	setNextIngredientInput: (element: TextInput) => void;
	focused: number;
	ingredientsLength: number;
	ingredientsList: Ingredient[];
	removeIngredient: (index: number) => void;
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

	const renderTextInput = () => {
		return (
			<TextInput
				// multiline={true}
				maxFontSizeMultiplier={2}
				style={styles.autoCompleteInput}
				value={ingredient.name}
				placeholder={`Ingredient ${index + 1}`}
				onChangeText={(text) => updateIngredientEntry(index, text, ingredient.quantity, ingredient.unit)}
				onFocus={() => thisAutocompleteIsFocused(index)}
				onBlur={() => thisAutocompleteIsFocused(null)}
				ref={(element) => inputToFocus && setNextIngredientInput(element)}
			></TextInput>
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
		focused == index && autocompleteList.length > 0 && ingredient.name.length > 1;
	// console.log(focused == index)
	return (
		<View
			style={[
				styles.autoCompleteRowContainer,
				expandBackgroundTouchCollector && { height: responsiveHeight(100) },
				// (Platform.OS == 'ios' ? {zIndex: (ingredientsLength - index) } : null)
			]}
		>
			<View style={styles.ingredientSortContainer}>
				<Icon name="menu" size={responsiveHeight(3.5)} style={styles.ingredientTrashCan} />
			</View>
			<TouchableOpacity //this Touchable records touches around the list view to close it out in an intuitive way
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
						Platform.OS == "ios" && { zIndex: ingredientsLength - index },
						expandBackgroundTouchCollector && { top: responsiveHeight(15) },
					]}
				>
					<View style={[styles.autoCompleteContainer, { zIndex: ingredientsLength - index }]}>
						<Autocomplete
							data={autocompleteList}
							defaultValue={""}
							// onChange={(e) => updateIngredientEntry(ingredientIndex, e.nativeEvent.text, ingredient.quantity, ingredient.unit)}
							// renderItem={(e) => renderAutoIngredientsListItem(e, ingredientIndex, ingredient)}
							flatListProps={{
								keyExtractor: (item) => item.id.toString(),
								renderItem: ({ item }) =>
									renderAutoIngredientsListItem(item, ingredientIndex, ingredient),
								nestedScrollEnabled: true,
								keyboardShouldPersistTaps: "always",
								showsVerticalScrollIndicator: true,
								style: styles.autoCompleteList,
							}}
							// keyExtractor={(item) => item.id.toString()}
							autoCapitalize="none"
							// placeholder={`Ingredient ${index+1}`}
							autoCorrect={false}
							// value={ingredient.name}
							hideResults={expandBackgroundTouchCollector && ingredient.name.length > 1 ? false : true}
							containerStyle={styles.autoCompleteOuterContainerStyle}
							inputContainerStyle={styles.autoCompleteInputContainerStyle}
							// listStyle={styles.autoCompleteList}
							// style={styles.autoCompleteInput}
							// onFocus={() => thisAutocompleteIsFocused(index)}
							// onBlur={() => thisAutocompleteIsFocused(null)}
							// flatListProps={{ nestedScrollEnabled: true, keyboardShouldPersistTaps: "always" }}
							renderTextInput={renderTextInput}
						/>
					</View>
					<View style={styles.quantityAndUnitContainer}>
						<View style={styles.addIngredientQuantityInputBox}>
							<TextInput
								maxFontSizeMultiplier={2}
								style={styles.ingredientTextAdjustment}
								placeholder="Qty"
								keyboardType="decimal-pad"
								onChangeText={(text) =>
									updateIngredientEntry(ingredientIndex, ingredient.name, text, ingredient.unit)
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
					onPress={() => removeIngredient(index)}
					activeOpacity={0.7}
					testID={`delete-ingredient${index + 1}`}
					accessibilityLabel={`delete ingredient${index + 1}`}
				>
					<Icon name="trash-can-outline" size={responsiveHeight(3.5)} style={styles.ingredientTrashCan} />
				</TouchableOpacity>
			</TouchableOpacity>
		</View>
	);
};

export default IngredientAutoComplete;
