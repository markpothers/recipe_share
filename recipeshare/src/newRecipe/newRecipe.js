import React from 'react'
import { ScrollView, Text, ImageBackground, TextInput, KeyboardAvoidingView, TouchableOpacity, View, ActivityIndicator, Platform } from 'react-native'
import { connect } from 'react-redux'
import * as Permissions from 'expo-permissions'
import { styles } from './newRecipeStyleSheet'
import { centralStyles } from '../centralStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { times } from '../dataComponents/times'
import { difficulties } from '../dataComponents/difficulties'
import { postRecipe } from '../fetches/postRecipe'
import { patchRecipe } from '../fetches/patchRecipe'
import { fetchIngredients } from '../fetches/fetchIngredients'
import IngredientAutoComplete from './ingredientAutoComplete'
import AppHeader from '../../navigation/appHeader'
import PicSourceChooser from '../functionalComponents/picSourceChooser'
import FilterMenu from '../functionalComponents/filterMenu'
import DualOSPicker from '../functionalComponents/DualOSPicker'

const mapStateToProps = (state) => ({
  name: state.newRecipeDetails.name,
  instructions: state.newRecipeDetails.instructions,
  ingredients: state.newRecipeDetails.ingredients,
  difficulty: state.newRecipeDetails.difficulty,
  time: state.newRecipeDetails.time,
  imageBase64: state.newRecipeDetails.imageBase64,
  filter_settings: state.newRecipeDetails.filter_settings,
  cuisine: state.newRecipeDetails.cuisine,
  serves: state.newRecipeDetails.serves,
  acknowledgement: state.newRecipeDetails.acknowledgement,
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
  },
  storeAllIngredients: (ingredients) => {
    return dispatch => {
      dispatch({ type: 'STORE_ALL_INGREDIENTS', ingredients: ingredients})
    }
  },
  switchNewRecipeFilterValue: (category, value) => {
    return dispatch => {
      dispatch({ type: 'TOGGLE_NEW_RECIPE_FILTER_CATEGORY', category: category, value: value})
    }
  },
  setNewRecipeCuisine: (cuisine) => {
    return dispatch => {
        dispatch({ type: 'SET_NEW_RECIPE_CUISINE', cuisine: cuisine})
    }
  },
  setNewRecipeServes: (serves) => {
    return dispatch => {
        dispatch({ type: 'SET_NEW_RECIPE_SERVES', serves: serves})
    }
  },
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class NewRecipe extends React.Component {
    static navigationOptions = {
      headerTitle: <AppHeader text={"Create a New Recipe"}/>,
      // headerRight: null,
      headerLeft: null,
    }

    state = {
      hasPermission: false,
      ingredientsList: [],
      ingredient1: false,
      choosingPicture: false,
      filterDisplayed: false,
      awaitingServer: false,
    }

    componentDidMount = async() => {
      await this.setState({awaitingServer: true})
      this.props.clearNewRecipeDetails()
      if (this.props.navigation.getParam('recipe_details') !== undefined){
        this.setRecipeParamsForEditing()
      }
      Permissions.askAsync(Permissions.CAMERA_ROLL)
          .then(permission => {
              this.setState({hasPermission: permission.status == 'granted'})
          })
          Permissions.askAsync(Permissions.CAMERA)
          .then(permission => {
              this.setState({hasPermission: permission.status == 'granted'})
          })
      this.fetchIngredientsForAutoComplete()
      await this.setState({awaitingServer: false})
    }

  setRecipeParamsForEditing = () => {
    let recipe_details = this.props.navigation.getParam('recipe_details')
    this.props.saveRecipeDetails('name', recipe_details.recipe.name)
    this.props.saveRecipeDetails('instructions', recipe_details.recipe.instructions)
    this.props.saveRecipeDetails('time', recipe_details.recipe.time)
    this.props.saveRecipeDetails('acknowledgement', recipe_details.recipe.acknowledgement)
    this.props.saveRecipeDetails('difficulty', recipe_details.recipe.difficulty.toString())
    const list_values = recipe_details.ingredient_uses.map(ingredient_use => [ingredient_use.ingredient_id, ingredient_use.quantity, ingredient_use.unit])
    const ingredientsForEdit = list_values.map(list_value => [...list_value, (recipe_details.ingredients.find(ingredient => ingredient.id == list_value[0]).name)])
    ingredientsForEdit.forEach( (ing, index) => this.props.addIngredientToRecipeDetails(`ingredient${index+1}`, ing[3], ing[1], ing[2]))
    this.props.setNewRecipeCuisine(recipe_details.recipe.cuisine)
    this.props.setNewRecipeServes(recipe_details.recipe.serves)
    Object.keys(this.props.filter_settings).forEach( category => this.props.switchNewRecipeFilterValue(category, recipe_details.recipe[category.toLowerCase().split(" ").join("_")]))
  }

  choosePicture = () =>{
    this.setState({choosingPicture: true})
  }

  sourceChosen = () =>{
    this.setState({choosingPicture: false})
  }

  renderPictureChooser = () => {
    return <PicSourceChooser saveImage={this.saveImage} sourceChosen={this.sourceChosen} key={"pic-chooser"}/>
  }

  saveImage = async(image) => {
    await this.setState({awaitingServer: true})
    if (image.cancelled === false){
      this.props.saveRecipeDetails("imageBase64", image.base64)
      this.setState({choosingPicture: false})
    }
    await this.setState({awaitingServer: false})
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
     return Object.keys(this.props.ingredients).sort((a,b)=> parseInt(a.split("ingredient")[1])-parseInt(b.split("ingredient")[1])).map((ingredient, index) => {
      return (
          <IngredientAutoComplete
            removeIngredient={this.removeIngredient}
            key={ingredient}
            ingredientIndex={ingredient}
            ingredient={this.props.ingredients[ingredient]}
            ingredientsList={this.state.ingredientsList}
            focused={this.state[ingredient]}
            index={index}
            ingredientsLength={Object.keys(this.props.ingredients).length}
            isFocused={this.isFocused}
            addIngredientToRecipeDetails={this.props.addIngredientToRecipeDetails}
          />
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
      <IngredientAutoComplete
        removeIngredient={this.removeIngredient}
        key={`ingredient${n}`}
        ingredientIndex={`ingredient${n}`}
        ingredient={newIngredient[`ingredient${n}`]}
        ingredientsList={this.state.ingredientsList}
        focused={this.state[`ingredient${n}`]}
        index={0}
        ingredientsLength={0}
        isFocused={this.isFocused}
        addIngredientToRecipeDetails={this.props.addIngredientToRecipeDetails}
      />
    )
  }

    handleNewIngredientByName = (ingredient, name) => {
      this.addIngredientToList(ingredient, name, "", "Oz")
      this.isFocused(ingredient, true)
    }

    removeIngredient = (ingredientIndex) => {
      let newIngredients = {}
      let remainingIngredients = Object.keys(this.props.ingredients).filter(ing => ing !== ingredientIndex  && this.props.ingredients[ing].name !== "")
      remainingIngredients.sort((a,b)=> parseInt(a.split("ingredient")[1])-parseInt(b.split("ingredient")[1])).forEach( (ing, index) => {
        newIngredients[`ingredient${index+1}`] = {
          "name": this.props.ingredients[ing].name,
          "quantity": this.props.ingredients[ing].quantity,
          "unit": this.props.ingredients[ing].unit,
        }
      })
      this.props.storeAllIngredients(newIngredients)
    }

    handleTextInput = (text, parameter) => {
      this.props.saveRecipeDetails(parameter, text)
    }

    submitRecipe = async() => {
      await this.setState({awaitingServer: true})
      if (this.props.navigation.getParam('recipe_details') !== undefined){
        const recipe = await patchRecipe(this.props.loggedInChef.id, this.props.loggedInChef.auth_token, this.props.name, this.props.ingredients, this.props.instructions, this.props.time, this.props.difficulty, this.props.imageBase64, this.props.filter_settings, this.props.cuisine, this.props.serves, this.props.navigation.getParam('recipe_details').recipe.id, this.props.acknowledgement)
        if (recipe) {
          this.props.clearNewRecipeDetails()
          this.props.navigation.popToTop() //clears Recipe Details and newRecipe screens from the view stack so that switching back to BrowseRecipes will go to the List and not another screen
          this.props.navigation.navigate('MyRecipeBook')
        }
      }else{
        const recipe = await postRecipe(this.props.loggedInChef.id, this.props.loggedInChef.auth_token, this.props.name, this.props.ingredients, this.props.instructions, this.props.time, this.props.difficulty, this.props.imageBase64, this.props.filter_settings, this.props.cuisine, this.props.serves, this.props.acknowledgement)
        if (recipe) {
          this.props.clearNewRecipeDetails()
          this.props.navigation.popToTop() //clears Recipe Details and newRecipe screens from the view stack so that switching back to BrowseRecipes will go to the List and not another screen
          this.props.navigation.navigate('MyRecipeBook')
        }
      }
    }

    handleCategoriesButton = () =>{
      this.setState({filterDisplayed: !this.state.filterDisplayed})
    }

    onTimesChoiceChange = (choice) => {
      this.handleTextInput(choice, "time")
    }

    onDifficultiesChoiceChange = (choice) => {
      this.handleTextInput(choice, "difficulty")
    }

    render() {
      // console.log(this.state.awaitingServer)
      return (
        <ImageBackground source={require('../dataComponents/spinach.jpg')} style={styles.mainPageContainer} imageStyle={styles.backgroundImageStyle}>
          {this.state.choosingPicture ? this.renderPictureChooser() : null}
          {this.state.awaitingServer ? <View style={centralStyles.activityIndicatorContainer}><ActivityIndicator style={Platform.OS === 'ios' ? centralStyles.activityIndicator : null} size="large" color="#104e01" /></View> : null }
          <KeyboardAvoidingView  style={styles.mainPageContainer} keyboardVerticalOffset={72} behavior="padding">
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
                  <View style={styles.formRow}>
                    <View style={styles.createRecipeInputBox} >
                      <TextInput style={styles.newRecipeTextCentering} value={this.props.acknowledgement} placeholder="Acknowledge your recipe's source if it's not yourself" onChange={(e) => this.handleTextInput(e.nativeEvent.text, "acknowledgement")}/>
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
                      <DualOSPicker
                        onChoiceChange={this.onTimesChoiceChange}
                        options={times}
                        selectedChoice={this.props.time}/>
                    </View>
                    <View picker style={styles.timeAndDifficulty}>
                      <DualOSPicker
                        onChoiceChange={this.onDifficultiesChoiceChange}
                        options={difficulties}
                        selectedChoice={this.props.difficulty}/>
                    </View>
                  </View>
                  <View style={styles.transparentFormRow}>
                    <TouchableOpacity style={styles.createRecipeFormButton} activeOpacity={0.7} title="Take Photo" onPress={this.choosePicture}>
                      <Icon style={styles.standardIcon} size={25} name='camera' />
                      <Text style={styles.createRecipeFormButtonText}>Add{"\n"}picture</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.createRecipeFormButton} activeOpacity={0.7} onPress={this.handleCategoriesButton}>
                      <Icon style={styles.standardIcon} size={25} name='filter' />
                      <Text style={styles.createRecipeFormButtonText}>Select{"\n"}categories</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.transparentFormRow}>
                    <TouchableOpacity style={[styles.createRecipeFormButton,{marginBottom: 4}]} activeOpacity={0.7} onPress={e => this.submitRecipe(e)}>
                      <Icon style={styles.standardIcon} size={25} name='login' />
                      <Text style={styles.createRecipeFormButtonText}>Submit</Text>
                    </TouchableOpacity>
                  </View>
            </ScrollView>
            {this.state.filterDisplayed ? <FilterMenu handleCategoriesButton={this.handleCategoriesButton} newRecipe={true} confirmButtonText={"Save"} title={"Select categories for your recipe"}/> : null}
          </KeyboardAvoidingView>
        </ImageBackground>

      )
    }

  }
)