import React from 'react';
import { Container, Header, Text, Button } from 'native-base';
import {Image, ScrollView, StyleSheet, AsyncStorage } from 'react-native';
import { connect } from 'react-redux'
import { databaseURL } from './functionalComponents/databaseURL'
import { styles } from './functionalComponents/RSStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const mapStateToProps = (state) => ({
  recipes_details: state.recipes_details,
  loggedInChef: state.loggedInChef
})

const mapDispatchToProps = {
    addRecipeLike: (like, listType) => {
      return dispatch => {
        dispatch({ type: 'ADD_RECIPE_LIKE', like: like, listType: listType})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class RecipeDetails extends React.Component {
    static navigationOptions = {
      title: 'Recipe details',
    }

    componentDidMount = () => {
    }

    renderRecipe = (listChoice, recipeID) => {
      const recipe = this.props.recipes_details[listChoice].recipes.find(recipe => recipe.id == recipeID)
      return <Text>{recipe.name}</Text>
    }

    renderRecipeImages = (listChoice, recipeID) => {
      const recipe = this.props.recipes_details[listChoice].recipe_images.find(recipe => recipe.recipe_id == recipeID)
      if (recipe != undefined){
        return <Image style={{width: 250, height: 250}} source={{uri: `${databaseURL}${recipe.imageURL}`}}></Image>
      } else {
        return <Text>No image available</Text>
      }
    }

    renderRecipeIngredients = (listChoice, recipeID) => {
      const ingredient_uses = this.props.recipes_details[listChoice].ingredient_uses.filter(ingredient_use => ingredient_use.recipe_id == recipeID)
      const list_values = ingredient_uses.map(ingredient_use => [ingredient_use.ingredient_id, ingredient_use.quantity, ingredient_use.unit])
      const ingredients = list_values.map(list_value => [...list_value, (this.props.recipes_details[listChoice].ingredients.find(ingredient => ingredient.id == list_value[0]).name)])
      return ingredients.map(ingredient => <Text key={ingredient[0]}>{ingredient[1]} {ingredient[2]} {ingredient[3]}</Text> )
    }

    renderRecipeInstructions = (listChoice, recipeID) => {
      const recipe = this.props.recipes_details[listChoice].recipes.find(recipe => recipe.id == recipeID)
      return <Text>{recipe.instructions}</Text>
    }

    renderRecipeLikes = (listChoice, recipeID) => {
      const likes = this.props.recipes_details[listChoice].recipe_likes.filter(like => like.recipe_id == recipeID)
      return <Text>Likes: {likes.length}</Text>
    }

    renderRecipeMakes = (listChoice, recipeID) => {
      const makes = this.props.recipes_details[listChoice].recipe_makes.filter(make => make.recipe_id == recipeID)
      return <Text>makes: {makes.length}</Text>
    }

    renderRecipeMakePics = (listChoice, recipeID) => {
      const make_pics = this.props.recipes_details[listChoice].make_pics.filter(make_pic => make_pic.recipe_id == recipeID)
      return make_pics.map(make_pic => {
        return (
          <React.Fragment key={make_pic.id}>
            <Image style={{width: 250, height: 250}} source={{uri: `${databaseURL}${make_pic.imageURL}`}}></Image>
          </React.Fragment>
        )
      })
    }

    renderRecipeComments = (listChoice, recipeID) => {
      const comments = this.props.recipes_details[listChoice].comments.filter(comment => comment.recipe_id == recipeID)
      return comments.map(comment => {
        return (
          <React.Fragment key={comment.id}>
            <Text>Comment:</Text>
            <Text>{comment.comment}</Text>
          </React.Fragment>
        )
      })
    }

    likeRecipe = (listChoice, recipeID) => {
      AsyncStorage.getItem('chef', (err, res) => {
        const loggedInChef = JSON.parse(res)
            fetch(`${databaseURL}/recipe_likes`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${loggedInChef.auth_token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  recipe_like: {
                    recipe_id: recipeID,
                    chef_id: this.props.loggedInChef.id,
                  }
                })
            })
            .then(res => res.json())
            .then(like => {
              // console.log(like)
              this.props.addRecipeLike(like, listChoice)
            })
          })
    }

    render() {
      // console.log(this.props)
      const { navigation } = this.props;
      const listChoice = navigation.getParam('listChoice')
      const recipeID = navigation.getParam('recipeID')
      console.log(listChoice)
      console.log(recipeID)
      return (
        <Container>
          <Header>
            {this.renderRecipe(listChoice, recipeID)}
          </Header>
          <ScrollView>
            {this.renderRecipeImages(listChoice, recipeID)}
            {this.renderRecipeIngredients(listChoice, recipeID)}
            {this.renderRecipeInstructions(listChoice, recipeID)}
            {this.renderRecipeLikes(listChoice, recipeID)}
            {/* {this.renderRecipeMakes(listChoice, recipeID)} */}
            {this.renderRecipeMakePics(listChoice, recipeID)}
            {this.renderRecipeComments(listChoice, recipeID)}
          </ScrollView>
          <Button rounded danger style={styles.floatingButton} onPress={this.likeRecipe}>
              <Icon name='heart-outline' size={25} />
          </Button>
        </Container>
      );
    }
  }
)

