import React from 'react'
import { ScrollView, Text, ImageBackground, TextInput, KeyboardAvoidingView, TouchableOpacity, View, Picker } from 'react-native'
import { ImagePicker } from 'expo'
import { connect } from 'react-redux'
import {Camera, Permissions, DangerZone } from 'expo'
import { styles } from './newRecipeStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { times } from '../dataComponents/times'
import { difficulties } from '../dataComponents/difficulties'
import { units } from '../dataComponents/units'
import { postRecipe } from '../fetches/postRecipe'
import { fetchIngredients } from '../fetches/fetchIngredients'
import IngredientAutoComplete from './ingredientAutoComplete'
import AppHeader from '../../navigation/appHeader'

const mapStateToProps = (state) => ({
  name: state.newRecipeDetails.name,
  instructions: state.newRecipeDetails.instructions,
  ingredients: state.newRecipeDetails.ingredients,
  difficulty: state.newRecipeDetails.difficulty,
  time: state.newRecipeDetails.time,
  imageBase64: state.newRecipeDetails.imageBase64,
  recipe_details: state.recipe_details,
  loggedInChef: state.loggedInChef
})

const mapDispatchToProps = {
  saveRecipeDetails: (parameter, content) => {
    return dispatch => {
      dispatch({ type: 'UPDATE_NEW_RECIPE_DETAILS', parameter: parameter, content: content})
    }
  },
  addIngredientToRecipeDetails: (ingredientIndex, ingredientName, ingredientQuantity, ingredientUnit) => {
    return dispatch => {
      dispatch({ type: 'UPDATE_RECIPE_INGREDIENTS', ingredientIndex: ingredientIndex, ingredientName: ingredientName, ingredientQuantity: ingredientQuantity, ingredientUnit: ingredientUnit})
    }
  },
  clearNewRecipeDetails: () => {
    return dispatch => {
      dispatch({ type: 'CLEAR_NEW_RECIPE_DETAILS'})
    }
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(
  class NewRecipe extends React.Component {
    static navigationOptions = {
      headerTitle: <AppHeader text={"Create a New Recipe"}/>,
    }

    state = {
      hasPermission: false,
      ingredientsList: [],
      ingredient1: false
    }

    // renderAutoIngredientsListItem = (item, ingredient) => {
    //   return (
    //     <TouchableOpacity style={{padding: 5, zIndex: 2}} key={item.item.id.toString()} onPress={(e) => this.addIngredientToList(ingredient, item.item.name, this.props.ingredients[ingredient].quantity, this.props.ingredients[ingredient].unit)}>
    //       <Text>{item.item.name}</Text>
    //     </TouchableOpacity>      )
    // }

  componentDidMount(){
    Permissions.askAsync(Permissions.CAMERA_ROLL)
        .then(permission => {
            this.setState({hasPermission: permission.status == 'granted'})
        })
        Permissions.askAsync(Permissions.CAMERA)
        .then(permission => {
            this.setState({hasPermission: permission.status == 'granted'})
        })
    this.fetchIngredientsForAutoComplete()
  }

  timesPicker = () => {
    return times.map( time => {
      return <Picker.Item style={styles.pickerText} key={time} label={time} value={time} />
    })
  }

  difficultiesPicker = () => {
    return difficulties.map( difficulty => {
      return <Picker.Item style={styles.pickerText} key={difficulty} label={difficulty} value={difficulty} />
    })
  }

  unitsPicker = () => {
    return units.map( unit => {
      return <Picker.Item style={styles.pickerText}key={unit} label={unit} value={unit} />
    })
  }

  isFocused = (ingredient, state) => {
    this.setState({[ingredient]: state})
  }

  fetchIngredientsForAutoComplete = async() => {
    const ingredients = await fetchIngredients(this.props.loggedInChef.auth_token)
    if (ingredients) {
      this.setState({ingredientsList: ingredients})
    }
  }

  renderIngredientsList = () =>{
     return Object.keys(this.props.ingredients).sort().map((ingredient, index) => {
        return (
          <IngredientAutoComplete key={ingredient} ingredientIndex={ingredient} ingredient={this.props.ingredients[ingredient]} ingredientsList={this.state.ingredientsList} focused={this.state[ingredient]} index={index} ingredientsLength={Object.keys(this.props.ingredients).length} isFocused={this.isFocused} addIngredientToList={this.addIngredientToList} unitsPicker={this.unitsPicker} />
          // <View style={styles.autCompleteRowContainer} key={ingredient}>
          //   <View style={[styles.autoCompleteContainer, {zIndex: (Object.keys(this.props.ingredients).length - index) }]} key={ingredient}>
          //   {/* <TextInput style={styles.ingredientTextAdjustment} placeholder={`Ingredient name`}  autoCapitalize="none" onChange={(e) => this.addIngredientToList(ingredient, e.nativeEvent.text, this.props.ingredients[ingredient].quantity, this.props.ingredients[ingredient].unit)} value={this.props.ingredients[ingredient].name} /> */}
          //     <Autocomplete
          //       data={this.state.ingredientsList.filter(ing => ing.name.toLowerCase().startsWith(this.props.ingredients[ingredient].name))}
          //       defaultValue={''}
          //       onChangeText={(e) =>  this.addIngredientToList(ingredient, e, this.props.ingredients[ingredient].quantity, this.props.ingredients[ingredient].unit)}
          //       renderItem={e => this.renderAutoIngredientsListItem(e, ingredient)}
          //       keyExtractor={(item) => item.id.toString()}
          //       autoCapitalize="none"
          //       placeholder={`Ingredient name`}
          //       autoCorrect={false}
          //       value={this.props.ingredients[ingredient].name}
          //       hideResults={this.state[ingredient] && this.props.ingredients[ingredient].name.length > 1 ? false : true}
          //       containerStyle={styles.autoCompleteOuterContainerStyle}
          //       inputContainerStyle={styles.autoCompleteInputContainerStyle}
          //       listStyle={styles.autoCompleteList}
          //       style={styles.autoCompleteInput}
          //       onFocus={() => this.isFocused(ingredient, true)}
          //       onBlur={() => this.isFocused(ingredient, false)}
          //       flatListProps={{nestedScrollEnabled: true}}
          //     />
          //   </View>
          //     <View style={styles.quantityAndUnitContainer}>
          //       <View style={styles.addIngredientQuantityInputBox} key={ingredient.quantity}>
          //         <TextInput style={styles.ingredientTextAdjustment} placeholder="Qty" keyboardType="phone-pad" onChange={(e) => this.addIngredientToList(ingredient, this.props.ingredients[ingredient].name, e.nativeEvent.text, this.props.ingredients[ingredient].unit)} value={this.props.ingredients[ingredient].quantity}/>
          //       </View>
          //       <View style={styles.addIngredientUnitInputBox} key={ingredient.unit}>
          //       <Picker style={styles.unitPicker}
          //               mode="dropdown"
          //               iosIcon={<Icon name="arrow-down" />}
          //               onValueChange={(e) => this.addIngredientToList(ingredient, this.props.ingredients[ingredient].name, this.props.ingredients[ingredient].quantity, e)} value={this.props.ingredients[ingredient].unit}
          //               >
          //               <Picker.Item style={styles.ingredientTextAdjustment} key={this.props.ingredients[ingredient].unit} label={this.props.ingredients[ingredient].unit} value={this.props.ingredients[ingredient].unit} />
          //               {this.unitsPicker()}
          //       </Picker>
          //     </View>
          //   </View>
          // </View>
        )
      })
  }

  renderNewIngredientItem = () => {
    const n = Object.keys(this.props.ingredients).length+1
    const newIngredient = {[`ingredient${n}`]: {
      name: "",
      quantity: "",
      unit: "Oz"
    }}
    return (
      <IngredientAutoComplete key={`ingredient${n}`} ingredientIndex={`ingredient${n}`} ingredient={newIngredient[`ingredient${n}`]} ingredientsList={this.state.ingredientsList} focused={this.state[`ingredient${n}`]} index={0} ingredientsLength={0} isFocused={this.isFocused} addIngredientToList={this.addIngredientToList} unitsPicker={this.unitsPicker} />

      // <View style={styles.autCompleteRowContainer} key={`ingredient${n}`}>
      //   <View style={[styles.autoCompleteContainer, {zIndex: 0}]} key={`ingredient${n}`}>
      //     {/* <TextInput style={styles.ingredientTextAdjustment} placeholder={`New ingredient name`}  autoCapitalize="none" onChange={(e) => this.addIngredientToList(`ingredient${n}`, e.nativeEvent.text, "", "Oz")} /> */}
      //       <Autocomplete
      //         // data={this.state.ingredientsList.filter(ing => ing.name.toLowerCase().startsWith(this.props.ingredients[`ingredient${n}`].name))}
      //         defaultValue={''}
      //         onChangeText={(e) =>  this.handleNewIngredientByName(`ingredient${n}`, e)}
      //         // renderItem={e => this.renderAutoIngredientsListItem(e, `ingredient${n}`)}
      //         // keyExtractor={(item) => item.id.toString()}
      //         autoCapitalize="none"
      //         placeholder={`New ingredient name`}
      //         // autoCorrect={false}
      //         // value={this.props.ingredients[`ingredient${n}`].name}
      //         hideResults={true}
      //         containerStyle={styles.autoCompleteOuterContainerStyle}
      //         inputContainerStyle={styles.autoCompleteInputContainerStyle}
      //         // listStyle={styles.autoCompleteList}
      //         style={styles.autoCompleteInput}
      //         // onFocus={() => this.isFocused(ingredient, true)}
      //         // onBlur={() => this.isFocused(ingredient, false)}
      //         // flatListProps={{nestedScrollEnabled: true}}
      //       />
      //   </View>
      //   <View style={styles.quantityAndUnitContainer}>
      //     <View style={styles.addIngredientQuantityInputBox} key={[`ingredient${n}`].quantity}>
      //       <TextInput style={styles.ingredientTextAdjustment} placeholder="Qty" keyboardType="phone-pad" onChange={(e) => this.addIngredientToList(`ingredient${n}`, "", e.nativeEvent.text, "Oz")} />
      //     </View>
      //       <View style={styles.addIngredientUnitInputBox} key={[`ingredient${n}`].unit}>
      //       <Picker style={styles.ingredientTextAdjustment}
      //                   mode="dropdown"
      //                   iosIcon={<Icon name="arrow-down" />}
      //                   onValueChange={(e) => this.addIngredientToList(`ingredient${n}`, "", "", e)}
      //                   >
      //                   {this.unitsPicker()}
      //       </Picker>
      //     </View>
      //   </View>
      // </View>
    )
  }

    handleNewIngredientByName = (ingredient, name) => {
      this.addIngredientToList(ingredient, name, "", "Oz")
      this.isFocused(ingredient, true)
    }

    addIngredientToList = (ingredientIndex, ingredientName, ingredientQuantity, ingredientUnit) => {
      this.props.addIngredientToRecipeDetails(ingredientIndex, ingredientName, ingredientQuantity, ingredientUnit)
    }

    handleTextInput = (text, parameter) => {
      this.props.saveRecipeDetails(parameter, text)
    }

    pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.3,
        base64: true
      })
      this.props.saveRecipeDetails("imageBase64", result.base64)
    }

    openCamera = async () => {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.3,
        base64: true
      })
      this.props.saveRecipeDetails("imageBase64", result.base64)
    }

    submitRecipe = async() => {
      const recipe = await postRecipe(this.props.loggedInChef.id, this.props.loggedInChef.auth_token, this.props.name, this.props.ingredients, this.props.instructions, this.props.time, this.props.difficulty, this.props.imageBase64)
      if (recipe) {
        this.props.clearNewRecipeDetails()
        this.props.navigation.navigate('MyRecipeBook')
      }
    }

    render() {
      // console.log(this.props)
      return (
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.mainPageContainer} imageStyle={styles.backgroundImageStyle}>
          <KeyboardAvoidingView  style={styles.mainPageContainer} behavior="padding">
            <ScrollView keyboardShouldPersistTaps='always'>
                  <View style={styles.formRow}>
                    <View style={styles.createRecipeInputBox} >
                      <TextInput style={styles.newRecipeTextCentering} value={this.props.name} placeholder="Recipe Name" onChange={(e) => this.handleTextInput(e.nativeEvent.text, "name")}/>
                    </View>
                  </View>
                    {[ ...this.renderIngredientsList(), this.renderNewIngredientItem()]}
                  <View style={styles.formRow}>
                    <View style={styles.createRecipeTextAreaBox}>
                      <TextInput style={styles.createRecipeTextAreaInput} value={this.props.instructions} placeholder="Instructions" multiline={true} numberOfLines={4} onChange={(e) => this.handleTextInput(e.nativeEvent.text, "instructions")}/>
                    </View>
                  </View>
                  <View style={styles.transparentFormRow}>
                    <View style={styles.timeAndDifficultyTitleItem}>
                      <Text style={styles.timeAndDifficultyTitle}>Time:</Text>
                    </View>
                    <View style={styles.timeAndDifficultyTitleItem}>
                      <Text style={styles.timeAndDifficultyTitle}>Difficulty:</Text>
                    </View>
                  </View>
                  <View style={styles.transparentFormRow}>
                    <View picker style={styles.timeAndDifficulty} >
                      <Picker style={styles.picker}
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      onValueChange={e => this.handleTextInput(e, "time")}
                      >
                      <Picker.Item style={styles.pickerText} key={this.props.time} label={this.props.time} value={this.props.time} />
                        {this.timesPicker()}
                      </Picker>
                    </View>
                    <View picker style={styles.timeAndDifficulty}>
                      <Picker style={styles.picker}
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      onValueChange={e => this.handleTextInput(e, "difficulty")}
                      >
                      <Picker.Item style={styles.pickerText} key={this.props.difficulty} label={this.props.difficulty} value={this.props.difficulty} />
                        {this.difficultiesPicker()}
                      </Picker>
                    </View>
                  </View>
                  <View style={styles.transparentFormRow}>
                    <TouchableOpacity style={styles.createRecipeFormButton} activeOpacity={0.7} title="Choose Photo" onPress={this.pickImage}>
                      <Icon style={styles.standardIcon} size={25} name='camera-burst' />
                      <Text style={styles.createRecipeFormButtonText}>Choose{"\n"}photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.createRecipeFormButton} activeOpacity={0.7} title="Take Photo" onPress={this.openCamera}>
                      <Icon style={styles.standardIcon} size={25} name='camera' />
                      <Text style={styles.createRecipeFormButtonText}>Take{"\n"}photo</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.transparentFormRow}>
                    <TouchableOpacity style={[styles.createRecipeFormButton,{marginBottom: 4}]} activeOpacity={0.7} onPress={e => this.submitRecipe(e)}>
                      <Icon style={styles.standardIcon} size={25} name='login' />
                      <Text style={styles.createRecipeFormButtonText}>Submit</Text>
                    </TouchableOpacity>
                  </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>

      )
    }

  }
)