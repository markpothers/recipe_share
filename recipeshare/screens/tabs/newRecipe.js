import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { WebBrowser, ImagePicker } from 'expo'
import { MonoText } from '../../components/StyledText'
import { Container, Header, Content, Form, Item, Input, Label, Button, Icon, Picker } from 'native-base';
import { connect } from 'react-redux'
import { databaseURL } from '../functionalComponents/databaseURL'
import {Camera, Permissions, DangerZone } from 'expo'

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

  renderIngredientsList = () =>{
    // console.log(Object.keys(this.props.ingredients).sort())
     return Object.keys(this.props.ingredients).sort().map(ingredient => {
      //  console.log(this.props.ingredients[ingredient])
        return (
          <React.Fragment key={ingredient}>
            <Item rounded floatingLabel key={ingredient.name}>
              <Label>Ingredient {ingredient[ingredient.length-1]} Name </Label>
              <Input onChange={(e) => this.addIngredientToList(ingredient, e.nativeEvent.text, this.props.ingredients[ingredient].quantity, this.props.ingredients[ingredient].unit)} value={this.props.ingredients[ingredient].name} />
            </Item>
            <Item rounded floatingLabel key={ingredient.quantity}>
              <Label>Ingredient {ingredient[ingredient.length-1]} Quantity</Label>
              <Input onChange={(e) => this.addIngredientToList(ingredient, this.props.ingredients[ingredient].name, e.nativeEvent.text, this.props.ingredients[ingredient].unit)} value={this.props.ingredients[ingredient].quantity}/>
            </Item>
              <Item rounded floatingLabel key={ingredient.unit}>
              <Label>Ingredient {ingredient[ingredient.length-1]} Unit</Label>
            <Input onChange={(e) => this.addIngredientToList(ingredient, this.props.ingredients[ingredient].name, this.props.ingredients[ingredient].quantity, e.nativeEvent.text)} value={this.props.ingredients[ingredient].unit}/>
            </Item>
          </React.Fragment>
        )
      })

  }

  renderNewIngredientItem = () => {
    const n = Object.keys(this.props.ingredients).length+1
    // console.log(this.props.ingredients[`ingredient${n}`])
    return (
      <React.Fragment key={`ingredient${n}`}>
        <Item rounded floatingLabel key={[`ingredient${n}`].name}>
          <Label>Ingredient {n} Name </Label>
          <Input onChange={(e) => this.addIngredientToList(`ingredient${n}`, e.nativeEvent.text, "", "")} />
        </Item>
        <Item rounded floatingLabel key={[`ingredient${n}`].quantity}>
          <Label>Ingredient {n} Quantity</Label>
          <Input onChange={(e) => this.addIngredientToList(`ingredient${n}`, "", e.nativeEvent.text, "")} />
        </Item>
          <Item rounded floatingLabel key={[`ingredient${n}`].unit}>
          <Label>Ingredient {n} Unit</Label>
        <Input onChange={(e) => this.addIngredientToList(`ingredient${n}`, "", "", e.nativeEvent.text)} />
        </Item>
      </React.Fragment>
    )
  }




    addIngredientToList = (ingredientIndex, ingredientName = this.props.ingredients.ingredient1.name, ingredientQuantity = this.props.ingredients.ingredient1.quantity, ingredientUnit = this.props.ingredients.ingredient1.unit) => {
      this.props.addIngredientToRecipeDetails(ingredientIndex, ingredientName, ingredientQuantity, ingredientUnit)
    }

    handleTextInput = (e, parameter) => {
      this.props.saveRecipeDetails(parameter, e.nativeEvent.text)
    }

    pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.1,
        base64: true
      })
      // console.log(result)
      this.props.saveRecipeDetails("imageBase64", result.base64)
    }

    openCamera = async () => {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.1,
        base64: true
      })
      // console.log(result)
      this.props.saveRecipeDetails("imageBase64", result.base64)
    }

    submitRecipe = () => {
      console.log("sending new recipe details")
      fetch(`${databaseURL}/recipes`, {
        method: "POST",
        headers: {
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
      })
      .catch(error => {
        console.log(error)
      })
    }



    render() {
      // console.log(this.props.ingredients)
      return (
          <Container>
          <ScrollView>
            <Content>
              <Form>
              <Item rounded floatingLabel >
                  <Label>Recipe Name</Label>
                  <Input onChange={(e) => this.handleTextInput(e, "name")}/>
                </Item>
                  <Item rounded floatingLabel>
                  <Label>Instructions</Label>
                  <Input onChange={(e) => this.handleTextInput(e, "instructions")}/>
                </Item>
                  {[ ...this.renderIngredientsList(), this.renderNewIngredientItem()]}
                <Item rounded floatingLabel >
                  <Label>Difficulty</Label>
                  <Input onChange={(e) => this.handleTextInput(e, "difficulty")}/>
                </Item>
                <Item rounded floatingLabel last>
                  <Label>Time</Label>
                  <Input onChange={(e) => this.handleTextInput(e, "time")}/>
                </Item>
                <Button large rounded error title="Choose Photo" onPress={this.pickImage}>
                  <Icon name='camera' />
                  <Text>Choose Photo</Text>
                </Button>
                <Button large rounded error title="Take Photo" onPress={this.openCamera}>
                  <Icon name='camera' />
                  <Text>Take Photo</Text>
                </Button>
                <Button large rounded success style={styles.submitButton} onPress={e => this.submitRecipe(e)}>
                <Icon name='pizza' />
                <Text>Submit</Text>
                </Button>
              </Form>
            </Content>
            </ScrollView>

          </Container>
      )
    }

  }
)

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    contentContainer: {
      paddingTop: 30,
    },
    getStartedText: {
      fontSize: 17,
      color: 'rgba(96,100,109, 1)',
      lineHeight: 24,
      textAlign: 'center',
    }
  });