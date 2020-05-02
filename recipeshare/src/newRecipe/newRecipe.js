import React from 'react'
import { FlatList, PanResponder, ScrollView, SafeAreaView, Text, Image, TextInput, KeyboardAvoidingView, TouchableOpacity, View, ActivityIndicator, Platform } from 'react-native'
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
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions'
import SortableList from 'react-native-sortable-list';
import InstructionRow from './instructionRow'
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'

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
      instructions: {
        step_0: 'Pre heat oven to 450F, and start to chop all the vegetables.  Add 2 tbsp of pure olive oil to the pan and wait until it is just starting to smoke.',
        step_1: 'Dice the chicken',
        step_2: 'Add the onion to the pan and fry for 2-4 minutes until it is browning',
        step_3: ''
      },
      instructionsOrder: ['step_0', 'step_1', 'step_2', 'step_3'],
      // numberOfInstructionsSteps: 3,
      scrollingEnabled: true
    }

    componentDidMount = async() => {
      await this.setState({awaitingServer: true})
      // this.panResponder = this.createPanResponder()
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
      // this.panResponder = PanResponder.create({
      //   onStartShouldSetPanResponder: (evt, gestureState) => true,
      //   onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      //   onMoveShouldSetPanResponder: (evt, gestureState) => true,
      //   onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      //   onPanResponderGrant: ( event, gesture) => {
      //     console.log('pan responder granted')
      //   },
      //   onPanResponderMove: ( event, gesture) => {
      //     console.log('pan responder moving')
      //   },
      //   onPanResponderMove: ( event, gesture) => {
      //     console.log('pan responder moving')
      //   },
      //   onPanResponderRelease: (event, gesture) => {
      //     console.log('pan responder released')
      //   }
      // })
    }

    // createPanResponder = () => {
    //   return PanResponder.create({
    //     onStartShouldSetPanResponder: (evt, gestureState) => true,
    //     onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    //     onMoveShouldSetPanResponder: (evt, gestureState) => true,
    //     onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    //     onPanResponderGrant: ( event, gesture) => {
    //       console.log('pan responder granted')
    //       this.scrollView.setNativeProps({ scrollEnabled: false })

    //     },
    //     onPanResponderMove: ( event, gesture) => {
    //       console.log('pan responder moving')
    //     },
    //     onPanResponderMove: ( event, gesture) => {
    //       console.log('pan responder moving')
    //     },
    //     onPanResponderRelease: (event, gesture) => {
    //       console.log('pan responder released')
    //       this.scrollView.setNativeProps({ scrollEnabled: true })

    //     }
    //   })
    // }

  // componentDidUpdate = () => {

  // }

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
    let newInstructions = {}
    let newOrder = []
    recipe_details.instructions.forEach(instruction => {
      newInstructions[`step_${instruction.step}`] = instruction.instruction
      newOrder.push(`step_${instruction.step}`)
    })
    this.setState({
      instructions: newInstructions,
      order: newOrder
    })
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
        index={n-1}
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
        const recipe = await patchRecipe(this.props.loggedInChef.id, this.props.loggedInChef.auth_token, this.props.name, this.props.ingredients, this.state.instructions, this.state.instructionsOrder, this.props.time, this.props.difficulty, this.props.imageBase64, this.props.filter_settings, this.props.cuisine, this.props.serves, this.props.navigation.getParam('recipe_details').recipe.id, this.props.acknowledgement)
        if (recipe) {
          this.props.clearNewRecipeDetails()
          this.props.navigation.popToTop() //clears Recipe Details and newRecipe screens from the view stack so that switching back to BrowseRecipes will go to the List and not another screen
          this.props.navigation.navigate('MyRecipeBook')
        }
      }else{
                                                        // chef_id,                         auth_token,            name,           ingredients,             instructions,            instructionsOrder,            time,            difficulty,             imageBase64,           filter_settings,          cuisine,               serves,           acknowledgement
        const recipe = await postRecipe(this.props.loggedInChef.id, this.props.loggedInChef.auth_token, this.props.name, this.props.ingredients, this.state.instructions, this.state.instructionsOrder, this.props.time, this.props.difficulty, this.props.imageBase64, this.props.filter_settings, this.props.cuisine, this.props.serves, this.props.acknowledgement)
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

    handleInstructionChange = async(text, index) => {
      // if (index == this.state.instructionsOrder.length-1){
      //   await this.setState( (state) => {
      //     console.log('last one')
      //     // let newInstructions = Object.assign({}, state.instructions)
      //     // let newOrder = [...state.instructionsOrder]
      //     // newInstructions[newOrder[index]] = text
      //     let newInstructions = state.instructions
      //     let newOrder = state.instructionsOrder
      //     newInstructions[newOrder[index]] = text
      //     return ({
      //         instructions: newInstructions,
      //         instructionsOrder: newOrder
      //       })
      //   })
      // } else {
        await this.setState( (state) => {
          // console.log(' not last one')
          // let newInstructions = Object.assign({}, state.instructions)
          // let newOrder = [...state.instructionsOrder]
          // newInstructions[newOrder[index]] = text
          let newInstructions = state.instructions
          let newOrder = state.instructionsOrder
          newInstructions[newOrder[index]] = text
          // console.log('test value')
          // console.log(this.state.instructions[this.state.instructionsOrder[this.state.instructionsOrder.length-1]])
          return ({
              instructions: newInstructions,
              instructionsOrder: newOrder
            })
        })
      // }
    }

    addNewInstruction = (text, index) => {
      if (this.state.instructions[this.state.instructionsOrder[this.state.instructionsOrder.length-1]] !== ''){
        console.log('condition met')
        newOrder = [...this.state.instructionsOrder]
        newOrder.push(`step_${this.state.instructionsOrder.length}`)
        let newInstructions = Object.assign({}, this.state.instructions)
        newInstructions[`step_${this.state.instructionsOrder.length}`] = ''
        this.setState({
          instructions: newInstructions,
          instructionsOrder: newOrder
        })
      }
    }

  //  handleNewInstruction = (text) => {
  //     let newInstructions = this.state.instructions
  //     newInstructions.push(text)
  //     this.setState({instructions: newInstructions})
  //  }
  
    removeInstruction = (index) => {
      // const instructionToDelete = Object.keys(this.state.instructions).filter( step => this.state.instructions[step] === text)
      let newInstructions = this.state.instructions
      delete newInstructions[`step_${index+1}`]
      const newOrder = this.state.instructionsOrder.filter(step => step !== `step_${index+1}`)
      this.setState({
        instructions: newInstructions,
        instructionsOrder: newOrder
      })
    }

    updateInstructionsOrder = (newOrder) => {
      this.setState({instructionsOrder: newOrder})
    }

    handleInstructionRowRelease = () => {
      // console.log('released')
      // setTimeout((()=>this.setState({scrollingEnabled: true})), 2000)
      // this.setState({scrollingEnabled: true})
      this.scrollView.setNativeProps({ scrollEnabled: true })

    }

    handleActivateRow = () => {
      // console.log('activated')
      // clearTimeout(sorterTimer)
      // this.setState({scrollingEnabled: false})
      this.scrollView.setNativeProps({ scrollEnabled: false })
      // sorterTimer = setTimeout((()=>this.setState({scrollingEnabled: true})), 5000)
    }

    handleRowPress = () => {
      // console.log('pressed')
    }

    toggleScrollViewEnabled = (enabled) => {
      this.setState({scrollingEnabled: enabled})
    }

    render() {
      // console.log('instructions')
      // console.log(this.state.instructions)
      // console.log('order')
      // console.log(this.state.instructionsOrder)
      const instructionsHeight = (this.state.instructionsOrder.length+1)*9.5
      // console.log(instructionsHeight)
      return (
        <SpinachAppContainer scrollingEnabled={true}>
        {this.state.awaitingServer && <View style={centralStyles.activityIndicatorContainer}><ActivityIndicator style={centralStyles.activityIndicator } size="large" color="#104e01" /></View>}
        {this.state.filterDisplayed ? <FilterMenu handleCategoriesButton={this.handleCategoriesButton} newRecipe={true} confirmButtonText={"Save"} title={"Select categories for your recipe"}/> : null}
        {this.state.choosingPicture ? this.renderPictureChooser() : null}
          {/* form */}
          <View style={[centralStyles.formContainer, {width: responsiveWidth(100), marginLeft: 0, marginRight: 0}]}>
            {/* recipe name */}
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
              <TextInput style={centralStyles.formInput} value={this.props.name} placeholder="Recipe name" onChangeText={(t) => this.handleTextInput(t, "name")}/>
              </View>
            </View>
            {/* separator */}
            <View style={centralStyles.formSectionSeparatorContainer}>
              <View style={centralStyles.formSectionSeparator}>
              </View>
            </View>
            {[...this.renderIngredientsList(), this.renderNewIngredientItem()]}
            {/* separator */}
            <View style={centralStyles.formSectionSeparatorContainer}>
              <View style={centralStyles.formSectionSeparator}>
              </View>
            </View>
            <View style={[centralStyles.formSection]}>
              <SortableList
                            // {...(this.panResponder ? this.panResponder.panHandlers : null)}
                style={{ flex: 1, borderColor: 'blue', borderWidth: 0 }}
                contentContainerStyle={{borderWidth: 0, borderColor: 'yellow', flex: 1}}
                innerContainerStyle={{borderWidth: 0, borderColor: 'red'}}
                // sortRowStyle={{marginTop:0}}
                data={this.state.instructions}
                order={this.state.instructionsOrder}
                onChangeOrder={newOrder => this.updateInstructionsOrder(newOrder)}
                // scrollEnabled={true}
                rowActivationTime={0}
                onPressRow={this.handleRowPress}
                numberOfInstructionsSteps={this.state.numberOfInstructionsSteps}
                // onPressRow={this.handleActivateRow}
                // onPanResponderGrant={() => this.setState({scrollingEnabled: false})}
                // onPanResponderGrant={() => console.log('granted')}
                // onPanResponderRelease={() => this.setState({scrollingEnabled: true})}
                // onPanResponderRelease={() => console.log('released')}
                onActivateRow={this.handleActivateRow}
                //onReleaseRow={() => this.setState({scrollingEnabled: true})}
                onReleaseRow={this.handleInstructionRowRelease}
                // manuallyActivateRows={true}
                // onReleaseRow={null}
                // renderHeader={() => this.renderNewIngredientItem()}
                // onRowMoved={e => {
                //   order.splice(e.to, 0, order.splice(e.from, 1)[0])
                //   this.forceUpdate()
                // }}
                // onMoveStart={console.log('move started')}
                // onMoveEnd={console.log('move finished')}
                // onMoveActive={console.log('move active')}
                // limitScrolling={true}
                // moveOnPressIn={true}
                // disableAnimatedScrolling={true}
                renderRow={({key, index, data, disabled, active}) => {
                  // console.log(`key: ${key}`)
                  // console.log(`index: ${index}`)
                  // console.log(`data: ${data}`)
                  // console.log(`disabled: ${disabled}`)
                  // console.log(`active: ${active}`)
                  return (
                  <InstructionRow
                    data={data}
                    removeInstruction={this.removeInstruction}
                    handleInstructionChange={this.handleInstructionChange}
                    key={key}
                    index={index}
                    disabled={disabled}
                    active={active}
                    toggleScrollViewEnabled={this.toggleScrollViewEnabled}
                    order={this.state.instructionsOrder}
                    // panResponder={this.panResponder}
                    // scrollView={this.scrollView}
                    addNewInstruction={this.addNewInstruction}
                  />)}
                }
                // renderFooter={() => {
                //   // console.log(index)
                //   return (
                //   <InstructionRow
                //     data={""}
                //     removeInstruction={this.removeInstruction}
                //     handleInstructionChange={this.handleNewInstructionChange}
                //     key={"newRow"}
                //     index={Object.keys(this.state.instructions).length}
                //     // disabled={disabled}
                //     // active={active}
                //     toggleScrollViewEnabled={this.toggleScrollViewEnabled}
                //     // panResponder={this.panResponder}
                //     // scrollView={this.scrollView}
                //   />)}
                // }
                // renderItem={({item}) => {
                //   // console.log(index)
                //   return (
                //   <InstructionRow
                //     data={item}
                //     removeInstruction={this.removeInstruction}
                //     handleInstructionChange={this.handleInstructionChange}
                //     key={item}
                //     // index={index}
                //     // disabled={disabled}
                //     // active={active}
                //     panResponder={this.panResponder}
                //   />)}
                // }
              />
            </View>
             {/* separator */}
             <View style={centralStyles.formSectionSeparatorContainer}>
              <View style={centralStyles.formSectionSeparator}>
              </View>
            </View>
            {/* acknowledgement */}
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
              <TextInput style={centralStyles.formInput} value={this.props.acknowledgement} placeholder="Acknowledge your recipe's source if it's not yourself" onChangeText={(t) => this.handleTextInput(t, "acknowledgement")}/>
              </View>
            </View>
            {/* time and difficulty titles */}
            <View style={[centralStyles.formSection, {width: responsiveWidth(80)}]}>
              <View style={centralStyles.formInputContainer}>
                <View style={styles.timeAndDifficultyTitleItem}>
                  <Text style={styles.timeAndDifficultyTitle}>Time:</Text>
                </View>
                <View style={styles.timeAndDifficultyTitleItem}>
                  <Text style={styles.timeAndDifficultyTitle}>Difficulty:</Text>
                </View>
              </View>
            </View>
            {/* time and difficulty dropdowns */}
            <View style={[centralStyles.formSection, {width: responsiveWidth(80)}]}>
              <View style={centralStyles.formInputContainer}>
                <View picker style={[styles.timeAndDifficulty, {paddingLeft: responsiveWidth(8)}]} >
                  <DualOSPicker
                    onChoiceChange={this.onTimesChoiceChange}
                    options={times}
                    selectedChoice={this.props.time}/>
                </View>
                <View picker style={[styles.timeAndDifficulty, {paddingLeft: responsiveWidth(12)}]}>
                  <DualOSPicker
                    onChoiceChange={this.onDifficultiesChoiceChange}
                    options={difficulties}
                    selectedChoice={this.props.difficulty}/>
                </View>
              </View>
            </View>
            {/* add picture and select categories*/}
            <View style={[centralStyles.formSection, {width: responsiveWidth(80)}]}>
              <View style={centralStyles.formInputContainer}>
                <TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={this.choosePicture}>
                  <Icon style={centralStyles.greenButtonIcon} size={25} name='camera'></Icon>
                  <Text style={centralStyles.greenButtonText}>Add{"\n"}picture</Text>
                </TouchableOpacity>
                <TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={this.handleCategoriesButton}>
                  <Icon style={centralStyles.greenButtonIcon} size={25} name='filter'></Icon>
                    <Text style={centralStyles.greenButtonText}>Select{"\n"}categories</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* submit */}
            <View style={[centralStyles.formSection, {width: responsiveWidth(80)}]}>
              <View style={[centralStyles.formInputContainer, {justifyContent: 'center'}]}>
                <TouchableOpacity style={[centralStyles.yellowRectangleButton]} activeOpacity={0.7} onPress={e => this.submitRecipe(e)}>
                  <Icon style={centralStyles.greenButtonIcon} size={25} name='login'></Icon>
                    <Text style={centralStyles.greenButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>




{/* 
                  <View style={[styles.formRow, {marginTop: 100}]}>
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
                  </View> */}

        </SpinachAppContainer>


      )
    }

  }
)