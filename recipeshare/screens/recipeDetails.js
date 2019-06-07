import React from 'react';
import { Text, Button } from 'native-base';
import {Image, ScrollView, View, ImageBackground } from 'react-native';
import { connect } from 'react-redux'
import { databaseURL } from './functionalComponents/databaseURL'
import { styles } from './functionalComponents/RSStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';


const mapStateToProps = (state) => ({
  recipe_details: state.recipe_details,
  loggedInChef: state.loggedInChef
})

const mapDispatchToProps = {
    addRecipeLike: () => {
      return dispatch => {
        dispatch({ type: 'ADD_RECIPE_LIKE'})
    }
  },
  removeRecipeLike: () => {
    return dispatch => {
      dispatch({ type: 'REMOVE_RECIPE_LIKE'})
  }
},
    addRecipeMake: () => {
      return dispatch => {
        dispatch({ type: 'ADD_RECIPE_MAKE'})
    }
  },
  removeRecipeLikes: (remaining_likes, listType) => {
      return dispatch => {
        dispatch({ type: 'REMOVE_RECIPE_LIKES', recipe_likes: remaining_likes, listType: listType})
      }
  },
  storeRecipeDetails: (recipe_details) => {
    return dispatch => {
      dispatch({ type: 'STORE_RECIPE_DETAILS', recipe_details: recipe_details})
    }
}
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class RecipeDetails extends React.Component {
    static navigationOptions = ({ navigation }) => {
      return {
        title: 'Recipe details',
        headerStyle: {
          backgroundColor: '#104e01',
          opacity: 0.8
        },
        headerTintColor: '#fff59b',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: (
          <React.Fragment>
            {navigation.getParam('likeable') == false ? <Button rounded style={styles.newButton} onPress={navigation.getParam('unlikeRecipe')}><Icon name='heart' size={28} style={styles.newIcon}/></Button> : <Button rounded style={styles.newButton} onPress={navigation.getParam('likeRecipe')}><Icon name='heart-outline' size={28} style={styles.newIcon}/></Button> }
            {navigation.getParam('makeable') == false ? <Button rounded style={styles.newButton}><Icon name='food-off' size={28} style={styles.newIcon}/></Button> : <Button rounded style={styles.newButton} onPress={navigation.getParam('makeRecipe')}><Icon name='food' size={28} style={styles.newIcon}/></Button> }
            {/* <Button rounded style={styles.newButton} onPress={navigation.getParam('editRecipe')}>
              <Icon2 name='edit' size={28} style={styles.newIcon} />
            </Button> */}
            <Button rounded style={styles.newButton} onPress={navigation.getParam('deleteRecipe')}>
              <Icon name='delete-outline' size={28} style={styles.newIcon} />
            </Button>
          </React.Fragment>
        ),
      };
    }

    componentDidMount = () => {
      this.fetchRecipeDetails()
    }

    fetchRecipeDetails = () => {
      // console.log(this.props.navigation.getParam('recipeID'))
      fetch(`${databaseURL}/recipes/${this.props.navigation.getParam('recipeID')}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.props.loggedInChef.auth_token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(recipe_details => {
        this.props.storeRecipeDetails(recipe_details)
          this.props.navigation.setParams({
            likeable: recipe_details.likeable,
            makeable: recipe_details.makeable,
            likeRecipe: this.likeRecipe,
            unlikeRecipe: this.unlikeRecipe,
            deleteRecipe: this.deleteRecipe,
            makeRecipe: this.makeRecipe,
            editRecipe: this.navigateToEditRecipe
          })
      })
    }

    navigateToEditRecipe = () => {
      // this.props.navigation.navigate('NewRecipe', {recipeID: this.props.navigation.getParam('recipeID')})
    }

    deleteRecipe = () => {
      fetch(`${databaseURL}/recipes/${this.props.navigation.getParam('recipeID')}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.props.loggedInChef.auth_token}`,
          'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(response => {
      if (response == true){
        this.props.navigation.goBack()
      }
    })
    }

    renderRecipeName = () => {
      if (this.props.recipe_details != undefined){
      return <Text style={[styles.detailsHeaderTextBox]}>{this.props.recipe_details.recipe.name}</Text>
      } else {
        return <Text style={[styles.detailsHeaderTextBox]}>Recipe Name</Text>
      }
    }

    renderRecipeImages = () => {
      if (this.props.recipe_details != undefined){
        if (this.props.recipe_details.recipe_images.imageURL != ""){
        return <Image style={[{width: '100%', height: 250}, styles.detailsImage]} source={{uri: `${databaseURL}${this.props.recipe_details.recipe_images[0].imageURL}`}}></Image>
        }
      } else {
          return <Image style={[{width: '100%', height: 250}, styles.detailsImage]} source={require("./components/peas.jpg")}></Image>
      }
    }

    renderRecipeIngredients = () => {
      if (this.props.recipe_details != undefined){
        const ingredient_uses = this.props.recipe_details.ingredient_uses
        const list_values = ingredient_uses.map(ingredient_use => [ingredient_use.ingredient_id, ingredient_use.quantity, ingredient_use.unit])
        const ingredients = list_values.map(list_value => [...list_value, (this.props.recipe_details.ingredients.find(ingredient => ingredient.id == list_value[0]).name)])
        return ingredients.map(ingredient => (
              <View style={styles.ingredientsTable} key={ingredient[0]}>
                <Text style={[styles.detailsContents, styles.ingredientName]}>{ingredient[3]}</Text>
                <Text style={[styles.detailsContents, styles.ingredientQuantity]}>{ingredient[1]}</Text>
                <Text style={[styles.detailsContents, styles.ingredientUnit]}>{ingredient[2]}</Text>
              </View>
              ))
      } else {
        return <Text style={[styles.detailsContents]}>Ingredients</Text>
      }
    }

    renderRecipeInstructions = () => {
      if (this.props.recipe_details != undefined){
        return <Text style={[styles.detailsContents]}>{this.props.recipe_details.recipe.instructions}</Text>
        } else {
          return <Text style={[styles.detailsContents]}>Recipe Instructions</Text>
        }
    }

    renderRecipeLikes = () => {
      if (this.props.recipe_details != undefined){
        return <Text style={[styles.detailsLikesAndMakesContents]}>Likes: {this.props.recipe_details.recipe_likes}</Text>
        } else {
          return <Text style={[styles.detailsLikesAndMakesContents]}>likes</Text>
      }
    }

    renderRecipeMakes = () => {
      if (this.props.recipe_details != undefined){
        return <Text style={[styles.detailsLikesAndMakesContents]}>Makes: {this.props.recipe_details.recipe_makes}</Text>
        } else {
          return <Text style={[styles.detailsLikesAndMakesContents]}>makes</Text>
      }
    }

    renderRecipeTime = () => {
      if (this.props.recipe_details != undefined){
        return <Text style={[styles.detailsLikesAndMakesContents]}>Time: {this.props.recipe_details.recipe.time}</Text>
        } else {
          return <Text style={[styles.detailsLikesAndMakesContents]}>time</Text>
      }
    }

    renderRecipeDifficulty = () => {
      if (this.props.recipe_details != undefined){
        return <Text style={[styles.detailsLikesAndMakesContents]}>Difficulty: {this.props.recipe_details.recipe.difficulty}</Text>
        } else {
          return <Text style={[styles.detailsLikesAndMakesContents]}>difficulty</Text>
      }
    }

    renderRecipeMakePics = () => {
      if (this.props.recipe_details != undefined){
        return this.props.recipe_details.make_pics.map(make_pic => {
          return (
            <React.Fragment key={make_pic.id}>
              <Image style={{width: 115, height: 115}} source={{uri: `${databaseURL}${make_pic.imageURL}`}}></Image>
            </React.Fragment>
          )
        })
      }
    }

    renderRecipeComments = () => {
      if (this.props.recipe_details != undefined){
        return this.props.recipe_details.comments.map(comment => {
          return (
            <React.Fragment key={comment.id}>
              <Text style={[styles.detailsContents]}>Comment:</Text>
              <Text style={[styles.detailsContents]}>{comment.comment}</Text>
            </React.Fragment>
          )
        })
      } else {
        return <Text style={[styles.detailsLikesAndMakesContents]}>No comments</Text>
      }
    }

    likeRecipe = () => {
      fetch(`${databaseURL}/recipe_likes`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.props.loggedInChef.auth_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            recipe: {
              recipe_id: this.props.navigation.getParam('recipeID'),
              chef_id: this.props.loggedInChef.id,
            }
          })
      })
      .then(res => res.json())
      .then(like => {
        if (like == true) {
          this.props.addRecipeLike()
          this.props.navigation.setParams({
            likeable: false,
          })
        }
      })
    }

    unlikeRecipe = () => {
      fetch(`${databaseURL}/recipe_likes`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.props.loggedInChef.auth_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            recipe: {
              recipe_id: this.props.navigation.getParam('recipeID'),
              chef_id: this.props.loggedInChef.id,
            }
          })
      })
      .then(res => res.json())
      .then(unlike => {
        if (unlike == true) {
          this.props.removeRecipeLike()
          this.props.navigation.setParams({
            likeable: true,
          })
        }
      })
    }

    makeRecipe = () => {
      fetch(`${databaseURL}/recipe_makes`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.props.loggedInChef.auth_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            recipe: {
              recipe_id: this.props.navigation.getParam('recipeID'),
              chef_id: this.props.loggedInChef.id,
            }
          })
      })
      .then(res => res.json())
      .then(make => {
        if (make == true) {
          this.props.addRecipeMake()
          this.props.navigation.setParams({
            makeable: false,
          })
        }
      })
    }

    render() {
      console.log(this.props.screenProps())
      return (
        <View style={{flex:1}}>
          <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
            <View style={styles.detailsHeader}>
              {this.renderRecipeName()}
            </View>
            <ScrollView contentContainerStyle={{flexGrow:1}}>
              <View style={styles.detailsLikesAndMakes}>
                <View style={styles.detailsLikes}>
                  {this.renderRecipeLikes()}
                </View>
                <View style={styles.detailsLikes}>
                  {this.renderRecipeMakes()}
                </View>
              </View>
              <View style={styles.detailsLikesAndMakes}>
                <View style={styles.detailsLikes}>
                  {this.renderRecipeTime()}
                </View>
                <View style={styles.detailsLikes}>
                  {this.renderRecipeDifficulty()}
                </View>
              </View>
              <View style={styles.detailsImageWrapper}>
                {this.renderRecipeImages()}
              </View>
              <View style={styles.detailsIngredients}>
                <Text style={styles.detailsSubHeadings}>Ingredients:</Text>
                {this.renderRecipeIngredients()}
              </View>
              <View style={styles.detailsInstructions}>
              <Text style={styles.detailsSubHeadings}>Instructions:</Text>
                {this.renderRecipeInstructions()}
              </View>
              <ScrollView horizontal="true">
                {this.renderRecipeMakePics()}
              </ScrollView>
              <View style={styles.detailsComments}>
              <Text style={styles.detailsSubHeadings}>Comments:</Text>
                {this.renderRecipeComments()}
              </View>
            </ScrollView>
          </ImageBackground>
        </View>
      );
    }
  }
)

