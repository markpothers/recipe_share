import React from 'react'
import { FlatList, ScrollView, Text, Image, TextInput, TouchableOpacity, View, Keyboard, Platform } from 'react-native'
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
import InstructionRow from './instructionRow'
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
import { DragSortableView, AutoDragSortableView } from 'react-native-drag-sort/lib'
import { clearedFilters } from '../dataComponents/clearedFilters'

const mapStateToProps = (state) => ({
  loggedInChef: state.loggedInChef
})

const mapDispatchToProps = {
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
      // headerRight: null,
      headerLeft: null,
    }

    state = {
      hasPermission: false,
      ingredientsList: [],
      autoCompleteFocused: null,
      choosingPrimaryPicture: false,
      choosingInstructionPicture: false,
      instructionImageIndex: 0,
      filterDisplayed: false,
      awaitingServer: false,
      instructionHeights: [responsiveHeight(7.2)
        , responsiveHeight(7.2),
        // responsiveHeight(7.2),responsiveHeight(7.2),
      ],
      averageInstructionHeight: responsiveHeight(7.2),
      scrollingEnabled: true,
      newRecipeDetails: {
        name: "This is my test recipe and it's really great",
        instructions: [
            'Pre heat oven to 450F...',
            'Chop everything up so that it is small enough to fit into a small place',
            // 'mix everything together with a liberal helping of mustard',
            // 'drink all the beer you can to help you get through this pigswill',
            // ''
          ],
        instructionImages: ['', '', '', ''],
        ingredients: [
          {
            name:"chi",
            quantity: "2",
            unit: "each"
          },
          // {
          //   name:"Flank steak",
          //   quantity: "500",
          //   unit: "g"
          // },
          // {
          //   name:"Filet of salmon",
          //   quantity: "17",
          //   unit: "fl oz"
          // },
          // {
          //   name:"peas",
          //   quantity: "501",
          //   unit: "each"
          // },
          // {
          //   name:"Boiled potatoes",
          //   quantity: "3",
          //   unit: "Oz"
          // },
        //   {
        //     name:"Chi",
        //     quantity: "2",
        //     unit: "each"
        //   },
          // {
          //   name: "",
          //   quantity: "",
          //   unit: "Oz",
          // }
        ],
        difficulty: "0",
        time: "00:15",
        primaryImageBase64: "",
        filter_settings: {
          "Breakfast": false,
          "Lunch": false,
          "Dinner": false,
          "Chicken": false,
          "Red meat": false,
          "Seafood": false,
          "Vegetarian": false,
          "Salad": false,
          "Vegan": false,
          "Soup": false,
          "Dessert": false,
          "Side": false,
          "Whole 30": false,
          "Paleo": false,
          "Freezer meal": false,
          "Keto": false,
          "Weeknight": false,
          "Weekend": false,
          "Gluten free": false,
          "Bread": false,
          "Dairy free": false,
          "White meat": false,
        },
        cuisine: "Cuban",
        serves: "6",
        acknowledgement: "This is my own recipe"
      }
    }

    componentDidMount = async() => {
      await this.setState({awaitingServer: true})
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

  componentDidUpdate = () => {
    this.addNewInstruction()
    this.addNewIngredient()
    // console.log(this.state.newRecipeDetails.primaryImageBase64)
  }

  activateScrollView = () => {
    this.setState({scrollingEnabled: true})
  }

  deactivateScrollView = () => {
    this.setState({scrollingEnabled: false})
  }

  setRecipeParamsForEditing = () => {
    let recipeDetails = this.props.navigation.getParam('recipe_details')
    // console.log(recipeDetails.ingredient_uses)
    let recipe = recipeDetails.recipe
    // console.log(recipe)
    let newIngredients = recipeDetails.ingredient_uses.map(ingredient_use => {
      return {
        ingredientId: ingredient_use.ingredient_id, 
        quantity: ingredient_use.quantity, 
        unit: ingredient_use.unit
      }
    })
    newIngredients.forEach(use => use.name = recipeDetails.ingredients.find(ingredient => ingredient.id == use.ingredientId).name)
    let newInstructionImages = recipeDetails.instructions.map( i => {
      let image = recipeDetails.instruction_images.find( j => j.instruction_id == i.id)
      if (image){
        return image
      } else {
        return ''
      }
    })
    this.setState({
      instructionHeights: recipeDetails.instructions.map( i => responsiveHeight(7.2)),
      newRecipeDetails: {
        name: recipe.name,
        instructions: recipeDetails.instructions.map( i => i.instruction),
        instructionImages: newInstructionImages,
        ingredients: newIngredients,
        difficulty: recipe.difficulty.toString(),
        time: recipe.time,
        primaryImageBase64: recipeDetails.recipe_images,
        filter_settings: {
          "Breakfast": recipe["breakfast"],
          "Lunch": recipe["lunch"],
          "Dinner": recipe["dinner"],
          "Chicken": recipe["chicken"],
          "Red meat": recipe["red_meat"],
          "Seafood": recipe["seafood"],
          "Vegetarian": recipe["vegetarian"],
          "Salad": recipe["salad"],
          "Vegan": recipe["vegan"],
          "Soup": recipe["soup"],
          "Dessert": recipe["dessert"],
          "Side": recipe["side"],
          "Whole 30": recipe["whole_30"],
          "Paleo": recipe["paleo"],
          "Freezer meal": recipe["freezer_meal"],
          "Keto": recipe["keto"],
          "Weeknight": recipe["weeknight"],
          "Weekend": recipe["weekend"],
          "Gluten free": recipe["gluten_free"],
          "Bread": recipe["bread"],
          "Dairy free": recipe["dairy_free"],
          "White meat": recipe["white_meat"],
        },
        cuisine: recipe.cuisine,
        serves: recipe.serves,
        acknowledgement: recipe.acknowledgement
      }
    })
  }

  choosePrimaryPicture = () =>{
    this.setState({choosingPrimaryPicture: true})
  }

  primarySourceChosen = () =>{
    this.setState({choosingPrimaryPicture: false})
  }

  renderPrimaryPictureChooser = () => {
    let imageSource = typeof this.state.newRecipeDetails.primaryImageBase64 == 'object' && this.state.newRecipeDetails.primaryImageBase64.length > 0 ? this.state.newRecipeDetails.primaryImageBase64[0].image_url : `data:image/jpeg;base64,${this.state.newRecipeDetails.primaryImageBase64}`
    return (
      <PicSourceChooser
      saveImage={this.savePrimaryImage}
      sourceChosen={this.primarySourceChosen}
      key={"primary-pic-chooser"}
      imageSource={imageSource}
    />
    )
  }

  savePrimaryImage = async(image) => {
    await this.setState({awaitingServer: true})
    if (image.cancelled === false){
      this.setState((state) => {
        return ({
          choosingPicture: false,
          newRecipeDetails: {...state.newRecipeDetails, primaryImageBase64: image.base64},
          awaitingServer: false,
          // choosingPrimaryPicture: false
        })
      })
    }
    else {
      await this.setState({
        awaitingServer: false,
        choosingPrimaryPicture: false
      })
    }
  }

  thisAutocompleteIsFocused = (index) => {
    this.setState({
     autoCompleteFocused: index,
      // scrollingEnabled: !state
    })
  }

  fetchIngredientsForAutoComplete = async() => {
    const ingredients = await fetchIngredients(this.props.loggedInChef.auth_token)
    if (ingredients) {
      this.setState({ingredientsList: ingredients})
    }
  }

  updateIngredientEntry = (index, name, quantity, unit) => {
    this.setState((state) => {
      let newIngredients = state.newRecipeDetails.ingredients
      newIngredients[index].name=name
      newIngredients[index].quantity=quantity
      newIngredients[index].unit=unit
      return ({
        newRecipeDetails: {
          ...state.newRecipeDetails,
          ingredients: newIngredients
        }
      })
    })
  }

  handleIngredientSort = (newIngredients) => {
    this.setState((state) => {
      return ({
        newRecipeDetails: {
          ...state.newRecipeDetails,
          ingredients: newIngredients,
        },
      })
    })
  }

  addNewIngredient = () => {
    let ingredients = this.state.newRecipeDetails.ingredients
    // console.log(ingredients[ingredients.length-1].unit != "Oz")
    if (ingredients[ingredients.length-1].name != "" || ingredients[ingredients.length-1].quantity != "" || ingredients[ingredients.length-1].unit != "Oz") {
      let newIngredients = [...ingredients, {name: "", quantity: "", unit: "Oz"}]
      this.setState((state) => {
        return ({
          newRecipeDetails: {...state.newRecipeDetails, ingredients: newIngredients}
        })
      })
    }
  }

    removeIngredient = (index) => {
      this.setState((state) => {
        let newIngredients = [...state.newRecipeDetails.ingredients]
        newIngredients.splice(index,1)
        return ({
          newRecipeDetails: {...state.newRecipeDetails, ingredients: newIngredients},
        })
      })
    }

    handleInput = (text, parameter) => {
      this.setState((state)=>{
        return({
          newRecipeDetails: {...state.newRecipeDetails, [parameter]: text},
        })
      })
    }

    submitRecipe = async() => {
      await this.setState({awaitingServer: true})
      let newRecipeDetails = this.state.newRecipeDetails
      if (this.props.navigation.getParam('recipe_details') !== undefined){
        const recipe = await patchRecipe(
          this.props.loggedInChef.id,
          this.props.loggedInChef.auth_token,
          newRecipeDetails.name,
          newRecipeDetails.ingredients,
          newRecipeDetails.instructions,
          newRecipeDetails.instructionImages,
          newRecipeDetails.time,
          newRecipeDetails.difficulty,
          newRecipeDetails.primaryImageBase64,
          newRecipeDetails.filter_settings,
          newRecipeDetails.cuisine,
          newRecipeDetails.serves,
          this.props.navigation.getParam('recipe_details').recipe.id,
          newRecipeDetails.acknowledgement
        )
        if (recipe) {
          this.props.clearNewRecipeDetails()
          this.props.navigation.popToTop() //clears Recipe Details and newRecipe screens from the view stack so that switching back to BrowseRecipes will go to the List and not another screen
          this.props.navigation.navigate('MyRecipeBook')
        }
      }else{
        const recipe = await postRecipe(
          this.props.loggedInChef.id,
          this.props.loggedInChef.auth_token,
          newRecipeDetails.name,
          newRecipeDetails.ingredients,
          newRecipeDetails.instructions,
          newRecipeDetails.instructionImages,
          newRecipeDetails.time,
          newRecipeDetails.difficulty,
          newRecipeDetails.primaryImageBase64,
          newRecipeDetails.filter_settings,
          newRecipeDetails.cuisine,
          newRecipeDetails.serves,
          newRecipeDetails.acknowledgement
        )
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

    handleInstructionChange = async(text, index) => {
      this.setState( (state) => {
        let newInstructions = [...state.newRecipeDetails.instructions]
        newInstructions[index] = text
        let newInstructionHeights = [...this.state.instructionHeights]
        return ({
          newRecipeDetails: {...state.newRecipeDetails, instructions: newInstructions},
          instructionHeights: newInstructionHeights
          })
      })
    }

    handleInstructionSizeChange = (index, size) => {
      this.setState( (state) => {
        let newInstructionHeights = [...state.instructionHeights]
        newInstructionHeights[index] = size + responsiveHeight(0.5)
        let newAverageInstructionHeight = parseFloat(newInstructionHeights.reduce( (acc, height) => acc + height, 0) / newInstructionHeights.length)
        return ({
            instructionHeights: newInstructionHeights,
            averageInstructionHeight: newAverageInstructionHeight,
          })
      })
    }

    handleInstructionsSort = (newInstructions) => {
      let newInstructionHeights = []
      let newInstructionImages = []
      newInstructions.forEach(instruction => {
        let index = this.state.newRecipeDetails.instructions.indexOf(instruction)
        newInstructionHeights.push(this.state.instructionHeights[index])
        newInstructionImages.push(this.state.newRecipeDetails.instructionImages[index])
      })
      this.setState((state) => {
        return ({
          newRecipeDetails: {
            ...state.newRecipeDetails,
            instructions: newInstructions,
            instructionImages: newInstructionImages
          },
          instructionHeights: newInstructionHeights,
        })
      })
    }

    addNewInstruction = () => {
      // console.log('here again')
      // console.log(this.state.newRecipeDetails.instructions[this.state.newRecipeDetails.instructions.length-2] !== '')
      if (this.state.newRecipeDetails.instructions[this.state.newRecipeDetails.instructions.length-1] !== ''
        || this.state.newRecipeDetails.instructions[this.state.newRecipeDetails.instructions.length-2] !== ''
      ){
        // console.log('but not here')
        this.setState((state) => {
          // console.log('adding new instruction')
          let newInstructions = [...state.newRecipeDetails.instructions]
          newInstructions.push('')
          let newInstructionImages = [...state.newRecipeDetails.instructionImages, '']
          let newInstructionHeights = [...state.instructionHeights, responsiveHeight(7.2)]
          let newAverageInstructionHeight = newInstructionHeights.reduce((acc, h) => acc + h, 0)/newInstructionHeights.length
          return ({
            newRecipeDetails: {
              ...state.newRecipeDetails,
              instructions: newInstructions,
              instructionImages: newInstructionImages
            },
            averageInstructionHeight: newAverageInstructionHeight,
            instructionHeights: newInstructionHeights
          })
        })
      }
    }

    removeInstruction = (index) => {
      let newInstructions = [...this.state.newRecipeDetails.instructions]
      newInstructions.splice(index, 1)
      let newInstructionHeights = [...this.state.instructionHeights]
      newInstructionHeights.splice(index,1)
      let newAverageInstructionHeight = newInstructionHeights.reduce((acc,h) => acc + h, 0)/newInstructionHeights.length
      this.setState((state) => {
        return ({
          newRecipeDetails: {...state.newRecipeDetails, instructions: newInstructions},
          instructionHeights: newInstructionHeights,
          averageInstructionHeight: newAverageInstructionHeight
        })
      })
    }

    chooseInstructionPicture = (index) =>{
      this.setState({
        choosingInstructionPicture: true,
        instructionImageIndex: index
      })
    }
  
    instructionSourceChosen = () =>{
      this.setState({choosingInstructionPicture: false})
    }

    renderInstructionPictureChooser = () => {
      let imageSource = typeof this.state.newRecipeDetails.instructionImages[this.state.instructionImageIndex] == 'object' ? this.state.newRecipeDetails.instructionImages[this.state.instructionImageIndex].image_url : `data:image/jpeg;base64,${this.state.newRecipeDetails.instructionImages[this.state.instructionImageIndex]}`
      return (
        <PicSourceChooser
          saveImage={this.saveInstructionImage}
          index={this.state.instructionImageIndex}
          sourceChosen={this.instructionSourceChosen}
          key={"instruction-pic-chooser"}
          imageSource={imageSource}
        />
      )
    }

    saveInstructionImage = async(image, index) => {
      // console.log(index)
      await this.setState({awaitingServer: true})
      if (image.cancelled === false){
        this.setState((state) => {
          let newInstructionImages = [...state.newRecipeDetails.instructionImages]
          newInstructionImages[index] = image.base64
          return ({
            choosingPicture: false,
            newRecipeDetails: {
              ...state.newRecipeDetails,
              instructionImages: newInstructionImages
            },
            awaitingServer: false,
            // choosingInstructionPicture: false
          })
        })
      }
      else {
        await this.setState({
          awaitingServer: false,
          choosingInstructionPicture: false
        })
      }
    }

    toggleFilterCategory = (category) => {
      this.setState((state) => {
        return ({
          newRecipeDetails: {
            ...state.newRecipeDetails,
            filter_settings: {
              ...state.newRecipeDetails.filter_settings,
              [category]: !state.newRecipeDetails.filter_settings[category]
            }
          }
        })
      })
    }

    clearFilerCategories = () => {
      this.setState((state) => {
        return ({
          newRecipeDetails: {
            ...state.newRecipeDetails,
            filter_settings: clearedFilters,
            cuisine: 'Any',
            serves: 'Any'
          }
        })
      })
    }

    render() {
      // console.log(this.state.newRecipeDetails.ingredients)
      return (
        <SpinachAppContainer awaitingServer={this.state.awaitingServer} scrollingEnabled={false}>
        {this.state.filterDisplayed && (
          <FilterMenu
          handleCategoriesButton={this.handleCategoriesButton}
          newRecipe={true}
          newRecipeFilterSettings={this.state.newRecipeDetails.filter_settings}
          switchNewRecipeFilterValue={this.toggleFilterCategory}
          newRecipeServes={this.state.newRecipeDetails.serves}
          setNewRecipeServes={this.handleInput}
          newRecipeCuisine={this.state.newRecipeDetails.cuisine}
          setNewRecipeCuisine={this.handleInput}
          clearNewRecipeFilters={this.clearFilerCategories}
          confirmButtonText={"Save"}
          title={"Select categories for your recipe"}
          />
        )}
        {this.state.choosingPrimaryPicture && this.renderPrimaryPictureChooser()}
        {this.state.choosingInstructionPicture && this.renderInstructionPictureChooser()}
          <ScrollView style={centralStyles.fullPageScrollView}
            nestedScrollEnabled={true}
            scrollEnabled={this.state.scrollingEnabled}
            keyboardShouldPersistTaps={'always'}
          >
            {/* form */}
            <View style={[centralStyles.formContainer, {width: responsiveWidth(100), marginLeft: 0, marginRight: 0}]}>
              {/* recipe name */}
              <View style={centralStyles.formSection}>
                <View style={centralStyles.formInputContainer}>
                  <TextInput
                    multiline={true}
                    maxFontSizeMultiplier={2.5}
                    style={centralStyles.formInput}
                    value={this.state.newRecipeDetails.name}
                    placeholder="Recipe name"
                    onChangeText={(t) => this.handleInput(t, "name")}/>
                </View>
              </View>
              {/* separator */}
              <View style={centralStyles.formSectionSeparatorContainer}>
                <View style={centralStyles.formSectionSeparator}>
                </View>
              </View>
              <View
                style={[
                  centralStyles.formSection,
                   this.state.autoCompleteFocused !== null && {zIndex: 1},
                  ]}
                >
                <DragSortableView
                  dataSource={this.state.newRecipeDetails.ingredients}
                  parentWidth={responsiveWidth(100)}
                  parentMarginBottom={125}
                  childrenWidth={responsiveWidth(100)}
                  childrenHeight={responsiveHeight(12.5)}
                  reverseChildZIndexing={true}
                  marginChildrenTop={responsiveHeight(0.5)}
                  onDataChange = {(newIngredients)=> this.handleIngredientSort(newIngredients)}
                  onClickItem={()=>{
                    if (this.state.autoCompleteFocused !== null) {
                      Keyboard.dismiss()
                      this.setState({autoCompleteFocused: null})
                    }
                  }}
                  onDragStart={this.deactivateScrollView}
                  onDragEnd={this.activateScrollView}
                  delayLongPress={200}
                  keyExtractor={(item,index)=> `${index}`}
                  renderItem={(item,index)=>{
                    return (
                      <IngredientAutoComplete
                        removeIngredient={this.removeIngredient}
                        // key={index}
                        ingredientIndex={index}
                        ingredient={item}
                        ingredientsList={this.state.ingredientsList}
                        focused={this.state.autoCompleteFocused}
                        index={index}
                        ingredientsLength={this.state.newRecipeDetails.ingredients.length}
                        thisAutocompleteIsFocused={this.thisAutocompleteIsFocused}
                        updateIngredientEntry={this.updateIngredientEntry}
                      />
                    )
                  }}
                />
              </View>
              {/* {[...this.renderIngredientsList(), this.renderNewIngredientItem()]} */}
              {/* separator */}
              <View style={[centralStyles.formSectionSeparatorContainer
                , {marginTop: -125+responsiveHeight(1)}
                ]}>
                <View style={centralStyles.formSectionSeparator}>
                </View>
              </View>
              <View style={[centralStyles.formSection]}>
                <AutoDragSortableView
                  dataSource={this.state.newRecipeDetails.instructions}
                  parentWidth={responsiveWidth(100)}
                  childrenWidth= {responsiveWidth(100)}
                  childrenHeight={this.state.averageInstructionHeight}
                  childrenHeights={this.state.instructionHeights}
                  marginChildrenTop={0}
                  onDataChange = {(newInstructions)=> this.handleInstructionsSort(newInstructions)}
                  onDragStart={this.deactivateScrollView}
                  onDragEnd={this.activateScrollView}
                  delayLongPress={100}
                  keyExtractor={(item,index)=> `${index}${item}`}
                  renderItem={(item,index)=>{
                    return (
                      <InstructionRow
                        refreshSortableList={this.state.refreshSortableList}
                        removeInstruction={this.removeInstruction}
                        handleInstructionChange={this.handleInstructionChange}
                        item={item}
                        index={index}
                        handleInstructionSizeChange={this.handleInstructionSizeChange}
                        addNewInstruction={this.addNewInstruction}
                        chooseInstructionPicture={this.chooseInstructionPicture}
                        instructionImagePresent={this.state.newRecipeDetails.instructionImages[index] != ''}
                      />
                    )
                  }}
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
                <TextInput maxFontSizeMultiplier={2} style={centralStyles.formInput} value={this.state.newRecipeDetails.acknowledgement} placeholder="Acknowledge your recipe's source if it's not yourself" onChangeText={(t) => this.handleInput(t, "acknowledgement")}/>
                </View>
              </View>
              {/* time and difficulty titles */}
              <View style={[centralStyles.formSection, {width: responsiveWidth(80)}]}>
                <View style={centralStyles.formInputContainer}>
                  <View style={styles.timeAndDifficultyTitleItem}>
                    <Text maxFontSizeMultiplier={1.7} style={styles.timeAndDifficultyTitle}>Time:</Text>
                  </View>
                  <View style={styles.timeAndDifficultyTitleItem}>
                    <Text maxFontSizeMultiplier={1.7} style={styles.timeAndDifficultyTitle}>Difficulty:</Text>
                  </View>
                </View>
              </View>
              {/* time and difficulty dropdowns */}
              <View style={[centralStyles.formSection, {width: responsiveWidth(80)}]}>
                <View style={centralStyles.formInputContainer}>
                  <View picker style={[styles.timeAndDifficulty, {paddingLeft: responsiveWidth(8)}]} >
                    <DualOSPicker
                      onChoiceChange={(choice) => this.handleInput(choice, "time")}
                      options={times}
                      selectedChoice={this.state.newRecipeDetails.time}/>
                  </View>
                  <View style={[styles.timeAndDifficulty, {paddingLeft: responsiveWidth(12)}]}>
                    <DualOSPicker
                      onChoiceChange={(choice) => this.handleInput(choice, "difficulty")}
                      options={difficulties}
                      selectedChoice={this.state.newRecipeDetails.difficulty}/>
                  </View>
                </View>
              </View>
              {/* add picture and select categories*/}
              <View style={[centralStyles.formSection, {width: responsiveWidth(80)}]}>
                <View style={centralStyles.formInputContainer}>
                  <TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={this.choosePrimaryPicture}>
                    <Icon style={centralStyles.greenButtonIcon} size={25} name='camera'></Icon>
                    <Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>Add{"\n"}picture</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={this.handleCategoriesButton}>
                    <Icon style={centralStyles.greenButtonIcon} size={25} name='filter'></Icon>
                      <Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>Select{"\n"}categories</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* submit */}
              <View style={[centralStyles.formSection, {width: responsiveWidth(80)}]}>
                <View style={[centralStyles.formInputContainer, {justifyContent: 'center'}]}>
                  <TouchableOpacity style={[centralStyles.yellowRectangleButton]} activeOpacity={0.7} onPress={e => this.submitRecipe(e)}>
                    <Icon style={centralStyles.greenButtonIcon} size={25} name='login'></Icon>
                    <Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </SpinachAppContainer>
      )
    }

  }
)