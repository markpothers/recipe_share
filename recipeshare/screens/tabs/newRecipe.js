import React from 'react'
import { ScrollView, StyleSheet, Text, AsyncStorage, ImageBackground, TextInput, KeyboardAvoidingView} from 'react-native'
import { ImagePicker } from 'expo'
import { Container, Header, Content, Form, Item, Input, Label, Button, Picker, View } from 'native-base';
import { connect } from 'react-redux'
import { databaseURL } from '../functionalComponents/databaseURL'
import {Camera, Permissions, DangerZone } from 'expo'
import { styles } from '../functionalComponents/RSStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { times } from '../dataComponents/times'
import { difficulties } from '../dataComponents/difficulties'
import { units } from '../dataComponents/units'



const mapStateToProps = (state) => ({
  name: state.newRecipeDetails.name,
  instructions: state.newRecipeDetails.instructions,
  ingredients: state.newRecipeDetails.ingredients,
  difficulty: state.newRecipeDetails.difficulty,
  time: state.newRecipeDetails.time,
  imageBase64: state.newRecipeDetails.imageBase64,
  chef_id: state.loggedInChef.id
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
      title: 'Create a new recipe!',
      headerStyle: {
      backgroundColor: '#104e01',
      opacity: 0.8
    },
    headerTintColor: '#fff59b',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    }
    
    state = {
      hasPermission: false,
    }

  componentDidMount(){
    Permissions.askAsync(Permissions.CAMERA_ROLL)
        .then(permission => {
            this.setState({hasPermission: permission.status == 'granted'})
        })
        Permissions.askAsync(Permissions.CAMERA)
        .then(permission => {
            this.setState({hasPermission: permission.status == 'granted'})
        })
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

  renderIngredientsList = () =>{
     return Object.keys(this.props.ingredients).sort().map(ingredient => {
        return (
          <View style={styles.formRow} key={ingredient}>
            <Item rounded style={styles.addIngredientNameInputBox} key={ingredient.name}>
              <Input style={styles.newRecipeTextCentering} placeholder={`Ingredient name`}  autoCapitalize="none" onChange={(e) => this.addIngredientToList(ingredient, e.nativeEvent.text, this.props.ingredients[ingredient].quantity, this.props.ingredients[ingredient].unit)} value={this.props.ingredients[ingredient].name} />
            </Item>
            <Item rounded style={styles.addIngredientQuantityInputBox} key={ingredient.quantity}>
              <Input style={styles.QtyTextCentering} placeholder="Qty" keyboardType="phone-pad" onChange={(e) => this.addIngredientToList(ingredient, this.props.ingredients[ingredient].name, e.nativeEvent.text, this.props.ingredients[ingredient].unit)} value={this.props.ingredients[ingredient].quantity}/>
            </Item>
              <Item rounded style={styles.addIngredientUnitInputBox} key={ingredient.unit}>
              <Picker style={styles.unitPicker}
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      onValueChange={(e) => this.addIngredientToList(ingredient, this.props.ingredients[ingredient].name, this.props.ingredients[ingredient].quantity, e)} value={this.props.ingredients[ingredient].unit}
                      >
                      <Picker.Item style={styles.pickerText} key={this.props.ingredients[ingredient].unit} label={this.props.ingredients[ingredient].unit} value={this.props.ingredients[ingredient].unit} />
                      {this.unitsPicker()}
              </Picker>
            </Item>
          </View>
        )
      })
  }

  renderNewIngredientItem = () => {
    const n = Object.keys(this.props.ingredients).length+1
    // console.log(this.props.ingredients[`ingredient${n}`])
    return (
      <View style={styles.formRow} key={`ingredient${n}`}>

      {/* <View style={styles.ingredientContainer} key={`ingredient${n}`}> */}
        <Item rounded style={styles.addIngredientNameInputBox} key={[`ingredient${n}`].name}>
          {/* <Label>Ingredient {n} Name </Label> */}
          <Input style={styles.newRecipeTextCentering} placeholder={`New ingredient name`}  autoCapitalize="none" onChange={(e) => this.addIngredientToList(`ingredient${n}`, e.nativeEvent.text, "", "Oz")} />
        </Item>
        <Item rounded style={styles.addIngredientQuantityInputBox} key={[`ingredient${n}`].quantity}>
          {/* <Label>Qty</Label> */}
          <Input style={styles.QtyTextCentering} placeholder="Qty" keyboardType="phone-pad" onChange={(e) => this.addIngredientToList(`ingredient${n}`, "", e.nativeEvent.text, "Oz")} />
        </Item>
          <Item rounded style={styles.addIngredientUnitInputBox} key={[`ingredient${n}`].unit}>
          {/* <Label>Unit</Label> */}
          <Picker style={styles.unitPicker}
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      onValueChange={(e) => this.addIngredientToList(`ingredient${n}`, "", "", e)}
                      >
                      {this.unitsPicker()}
          </Picker>
        {/* <Input style={styles.QtyTextCentering} placeholder="Unit" onChange={(e) => this.addIngredientToList(`ingredient${n}`, "", "", e.nativeEvent.text)} /> */}
        </Item>
      {/* </View> */}
      </View>
    )
  }

    addIngredientToList = (ingredientIndex, ingredientName = this.props.ingredients.ingredient1.name, ingredientQuantity = this.props.ingredients.ingredient1.quantity, ingredientUnit = this.props.ingredients.ingredient1.unit) => {
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
      // console.log(result)
      this.props.saveRecipeDetails("imageBase64", result.base64)
    }

    openCamera = async () => {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.3,
        base64: true
      })
      // console.log(result)
      this.props.saveRecipeDetails("imageBase64", result.base64)
    }

    submitRecipe = () => {
      AsyncStorage.getItem('chef', (err, res) => {
        const loggedInChef = JSON.parse(res)
            console.log("sending new recipe details")
            fetch(`${databaseURL}/recipes`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${loggedInChef.auth_token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                recipe: this.props
              })
            })
            .then(res => res.json())
            .then(recipe => {
              console.log(recipe)
              this.props.clearNewRecipeDetails()
              this.props.navigation.navigate('MyRecipeBook')
            })
            .catch(error => {
              console.log(error)
            })
    })
  }

    render() {
      // console.log(this.props.chef_id)
      return (
        <KeyboardAvoidingView  style={styles.mainPageContainer} behavior="padding">
          <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
            <ScrollView>
              <KeyboardAvoidingView style={styles.createRecipeForm} behavior="padding">
                <Form>
                  <View style={styles.formRow}>
                    <Item rounded style={styles.createRecipeInputBox} >
                      {/* <Label>Recipe Name</Label> */}
                      <Input style={styles.newRecipeTextCentering} value={this.props.name} placeholder="Recipe Name" onChange={(e) => this.handleTextInput(e.nativeEvent.text, "name")}/>
                    </Item>
                  </View>
                    {[ ...this.renderIngredientsList(), this.renderNewIngredientItem()]}
                    <View style={styles.formRow}>
                    <Item rounded style={styles.createRecipeTextAreaBox}>
                      {/* <Label>Instructions</Label> */}
                      <Input style={styles.createRecipeTextAreaInput} value={this.props.instructions} placeholder="Instructions" multiline={true} numberOfLines={4} onChange={(e) => this.handleTextInput(e.nativeEvent.text, "instructions")}/>
                    </Item>
                  </View>
                  <View style={styles.timeAndDifficultyWrapper}>
                    <Item rounded style={styles.timeAndDifficultyTitleItem}>
                      <Text style={styles.timeAndDifficultyTitle}>Time:</Text>
                    </Item>
                    <Item rounded style={styles.timeAndDifficultyTitleItem}>
                      <Text style={styles.timeAndDifficultyTitle}>Difficulty:</Text>
                    </Item>
                  </View>
                  <View style={styles.timeAndDifficultyWrapper}>
                    <Item rounded picker style={styles.timeAndDifficulty} >
                      <Picker style={styles.picker}
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      onValueChange={e => this.handleTextInput(e, "time")}
                      >
                      <Picker.Item style={styles.pickerText} key={this.props.time} label={this.props.time} value={this.props.time} />
                      {this.timesPicker()}
                      </Picker>
                    </Item>
                    <Item rounded picker style={styles.timeAndDifficulty}>
                      <Picker style={styles.picker}
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      onValueChange={e => this.handleTextInput(e, "difficulty")}
                      >
                      <Picker.Item style={styles.pickerText} key={this.props.difficulty} label={this.props.difficulty} value={this.props.difficulty} />
                      {this.difficultiesPicker()}
                      </Picker>
                    </Item>
                  </View>
                  <View style={styles.formRow}>
                    <Button rounded info style={styles.createRecipeFormButton} title="Choose Photo" onPress={this.pickImage}>
                      <Icon style={styles.standardIcon} size={25} name='camera-burst' />
                      <Text style={styles.createChefFormButtonText}>Choose{"\n"}photo</Text>
                    </Button>
                    <Button rounded warning style={styles.createRecipeFormButton} title="Take Photo" onPress={this.openCamera}>
                      <Icon style={styles.standardIcon} size={25} name='camera' />
                      <Text style={styles.createChefFormButtonText}>Take{"\n"}photo</Text>
                    </Button>
                  </View>
                  <View style={styles.formRow}>
                    <Button rounded success style={styles.createRecipeFormSubmitButton} onPress={e => this.submitRecipe(e)}>
                      <Icon style={styles.standardIcon} size={25} name='login' />
                      <Text style={styles.createChefFormButtonText}>Submit</Text>
                    </Button>
                  </View>
                </Form>
              </KeyboardAvoidingView>
            </ScrollView>
          </ImageBackground>
        </KeyboardAvoidingView>
      )
    }

  }
)