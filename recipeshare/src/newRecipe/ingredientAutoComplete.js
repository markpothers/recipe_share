import React from 'react'
import { Text, TextInput, View, Keyboard, Platform, TouchableOpacity } from 'react-native'
import { styles } from './newRecipeStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Autocomplete from 'react-native-autocomplete-input';
import { units } from '../dataComponents/units'
import DualOSPicker from '../functionalComponents/DualOSPicker'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { centralStyles } from '../centralStyleSheet'

export default class IngredientAutoComplete extends React.Component {

  renderAutoIngredientsListItem = (item, ingredientIndex, ingredient) => {
    return (
      <TouchableOpacity style={{padding: 5, zIndex: 2}}
        key={item.item.id.toString()}
        onPress={() => this.handleListItemTouch(ingredientIndex, item.item.name, ingredient.quantity, ingredient.unit)}
      >
        <Text>{item.item.name}</Text>
      </TouchableOpacity>
    )
  }

  renderTextInput = () => {
    return (
      <TextInput
        // multiline={true}
        maxFontSizeMultiplier={2}
        style={styles.autoCompleteInput}
        value={this.props.ingredient.name}
        placeholder={`Ingredient ${this.props.index+1}`}
        onChangeText={(text) => this.props.updateIngredientEntry(this.props.index, text, this.props.ingredient.quantity, this.props.ingredient.unit)}
        onFocus={() => this.props.thisAutocompleteIsFocused(this.props.index)}
        onBlur={() => this.props.thisAutocompleteIsFocused(null)}
      >
      </TextInput>
    )
  }

  handleListItemTouch = (ingredientIndex, name, quantity, unit) => {
    this.props.updateIngredientEntry(ingredientIndex, name, quantity, unit)
    this.props.thisAutocompleteIsFocused(null)
    Keyboard.dismiss()
  }

  handlePickerChange = (ingredientIndex, name, quantity, unit) =>{
    // if(name !== ""){
      this.props.updateIngredientEntry(ingredientIndex, name, quantity, unit)
    // }
  }

  onChoiceChange = (choice) => {
    this.handlePickerChange(this.props.ingredientIndex, this.props.ingredient.name, this.props.ingredient.quantity, choice)
  }

  render(){
    const { ingredient, index, ingredientsLength, ingredientIndex } = this.props
    let autocompleteList = this.props.ingredientsList.sort((a, b) => (a.name > b.name) ? 1 : -1).filter(ing => ing.name.toLowerCase().startsWith(ingredient.name.toLowerCase()))
    let expandBackgroundTouchCollector = this.props.focused == index && autocompleteList.length > 0 && ingredient.name.length > 1
    // console.log(this.props.focused == index)
      return (
        <View
          style={[
            styles.autoCompleteRowContainer,
            (expandBackgroundTouchCollector && {height: responsiveHeight(100)}),
            // (Platform.OS == 'ios' ? {zIndex: (ingredientsLength - index) } : null)
          ]}
        >
          <View style={[styles.ingredientSortContainer]}>
            <Icon name='menu' size={24} style={styles.ingredientTrashCan}/>
          </View>
          <TouchableOpacity //this Touchable records touches around the list view to close it out in an intuitive way
            style={[
              // {backgroundColor: 'red'},
              {flexDirection:'row'},
              (expandBackgroundTouchCollector && {height: responsiveHeight(65), top: -responsiveHeight(15)}),
            ]}
            activeOpacity={1}
            onPress={() => {
              this.props.thisAutocompleteIsFocused(null)
              Keyboard.dismiss()
            }}
          >
            <View
              style={[styles.nameAndUnitsContainer,
              (Platform.OS == 'ios' && {zIndex: (ingredientsLength - index)}),
              (expandBackgroundTouchCollector && {top: responsiveHeight(15)}),
              ]}
            >
              <View
                style={[
                  styles.autoCompleteContainer,
                  {zIndex: (ingredientsLength - index)},
                ]}
              >
                <Autocomplete
                  data={autocompleteList}
                  defaultValue={''}
                  // onChange={(e) => this.props.updateIngredientEntry(ingredientIndex, e.nativeEvent.text, ingredient.quantity, ingredient.unit)}
                  renderItem={e => this.renderAutoIngredientsListItem(e, ingredientIndex, ingredient)}
                  keyExtractor={(item) => item.id.toString()}
                  autoCapitalize="none"
                  // placeholder={`Ingredient ${index+1}`}
                  autoCorrect={false}
                  // value={ingredient.name}
                  hideResults={expandBackgroundTouchCollector && ingredient.name.length > 1 ? false : true}
                  containerStyle={styles.autoCompleteOuterContainerStyle}
                  inputContainerStyle={styles.autoCompleteInputContainerStyle}
                  listStyle={[styles.autoCompleteList]}
                  // style={styles.autoCompleteInput}
                  // onFocus={() => this.props.thisAutocompleteIsFocused(index)}
                  // onBlur={() => this.props.thisAutocompleteIsFocused(null)}
                  flatListProps={{nestedScrollEnabled: true, keyboardShouldPersistTaps: 'always'}}
                  renderTextInput={this.renderTextInput}
                />
              </View>
                <View style={styles.quantityAndUnitContainer} >
                  <View style={styles.addIngredientQuantityInputBox}>
                    <TextInput
                      maxFontSizeMultiplier={2}
                      style={styles.ingredientTextAdjustment}
                      placeholder="Qty"
                      keyboardType="phone-pad"
                      onChange={(e) => this.props.updateIngredientEntry(ingredientIndex, ingredient.name, e.nativeEvent.text, ingredient.unit)}
                      value={ingredient.quantity}
                    />
                  </View>
                  <View style={styles.addIngredientUnitInputBox}>
                    <DualOSPicker
                      onChoiceChange={this.onChoiceChange}
                      options={units}
                      selectedChoice={ingredient.unit}/>
                  </View>
                </View>
            </View>
            <TouchableOpacity 
              style={[
                styles.deleteIngredientContainer,
                (expandBackgroundTouchCollector && {top: responsiveHeight(15)}),
              ]}
              onPress={() => this.props.removeIngredient(index)}
              activeOpacity={0.7}
            >
              <Icon name='trash-can-outline' size={24} style={styles.ingredientTrashCan}/>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )
  }
}