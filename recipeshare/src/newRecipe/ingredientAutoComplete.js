import React from 'react'
import { Text, TextInput, TouchableOpacity, View, Picker, Keyboard } from 'react-native'
import { styles } from './newRecipeStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Autocomplete from 'react-native-autocomplete-input';

export default class IngredientAutoComplete extends React.Component {

  renderAutoIngredientsListItem = (item, ingredientIndex, ingredient) => {
    return (
      <TouchableOpacity style={{padding: 5, zIndex: 2}} key={item.item.id.toString()} onPress={(e) => this.handleListItemTouch(ingredientIndex, item.item.name, ingredient.quantity, ingredient.unit)}>
        <Text>{item.item.name}</Text>
      </TouchableOpacity>      )
  }

  handleListItemTouch = (ingredientIndex, name, quantity, unit) => {
    this.props.addIngredientToRecipeDetails(ingredientIndex, name, quantity, unit)
    Keyboard.dismiss()
  }

  handlePickerChange = (ingredientIndex, name, quantity, unit) =>{
    if(name !== ""){
      this.props.addIngredientToRecipeDetails(ingredientIndex, name, quantity, unit)
    }
  }

  render(){
    const { ingredient, index, ingredientsLength, ingredientIndex } = this.props
    // console.log(this.props.ingredientsList.filter(ing => ing.name.toLowerCase().startsWith(ingredient.name.toLowerCase())))
      return (
        <View style={styles.autoCompleteRowContainer} key={ingredientIndex}>
          <View style={[styles.autoCompleteContainer, {zIndex: (ingredientsLength - index) }]} key={ingredientIndex}>
            <Autocomplete
              data={this.props.ingredientsList.filter(ing => ing.name.toLowerCase().startsWith(ingredient.name.toLowerCase()))}
              defaultValue={''}
              onChangeText={(e) =>  this.props.addIngredientToRecipeDetails(ingredientIndex, e, ingredient.quantity, ingredient.unit)}
              renderItem={e => this.renderAutoIngredientsListItem(e, ingredientIndex, ingredient)}
              keyExtractor={(item) => item.id.toString()}
              autoCapitalize="none"
              placeholder={`Ingredient name`}
              autoCorrect={false}
              multiline={true}
              value={ingredient.name}
              hideResults={this.props.focused && ingredient.name.length > 1 ? false : true}
              containerStyle={styles.autoCompleteOuterContainerStyle}
              inputContainerStyle={styles.autoCompleteInputContainerStyle}
              listStyle={styles.autoCompleteList}
              style={styles.autoCompleteInput}
              onFocus={() => this.props.isFocused(ingredientIndex, true)}
              onBlur={() => this.props.isFocused(ingredientIndex, false)}
              flatListProps={{nestedScrollEnabled: true}}
            />
          </View>
            <View style={styles.quantityAndUnitContainer} key={`${ingredientIndex}quantity`}>
              <View style={styles.addIngredientQuantityInputBox} key={`${ingredientIndex}quantity`}>
                <TextInput style={styles.ingredientTextAdjustment} placeholder="Qty" keyboardType="phone-pad" onChange={(e) => this.props.addIngredientToRecipeDetails(ingredientIndex, ingredient.name, e.nativeEvent.text, ingredient.unit)} value={ingredient.quantity}/>
              </View>
              <View style={styles.addIngredientUnitInputBox} key={`${ingredientIndex}unit`}>
                    <Picker style={styles.unitPicker}
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      onValueChange={(e) => this.handlePickerChange(ingredientIndex, ingredient.name, ingredient.quantity, e)}
                      value={ingredient.unit}
                      >
                      <Picker.Item style={styles.ingredientTextAdjustment} key={`${ingredientIndex}unit`} label={ingredient.unit} value={ingredient.unit} />
                        {this.props.unitsPicker()}
                    </Picker>
              </View>
            </View>
            <View style={styles.deleteIngredientContainer} key={`${ingredientIndex}delete`}>
              <TouchableOpacity style={styles.ingredientDeleteTrashCanButton} onPress={() => this.props.removeIngredient(ingredientIndex)}>
                  <Icon name='trash-can-outline' size={24} style={styles.ingredientTrashCan}/>
                </TouchableOpacity>
            </View>
        </View>
      )
  }
}