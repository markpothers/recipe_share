import React from 'react';
import { Container, Header, Tab, Tabs, ScrollableTab, Text, Button, Icon  } from 'native-base';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux'
import { databaseURL } from '../functionalComponents/databaseURL'


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

    componentDidMount = () => {
    }

    renderRecipe = () => {
      const recipe = this.props.recipes_details[this.props["listChoice"]].recipes.find(recipe => recipe.id == this.props["recipeID"])
      return <Text>{recipe.name}</Text>
    }

    renderRecipeImages = () => {
      const recipe = this.props.recipes_details[this.props["listChoice"]].recipe_images.find(recipe => recipe.recipe_id == this.props["recipeID"])
      if (recipe != undefined){
        return <Image style={{width: 250, height: 250}} source={{uri: `${databaseURL}${recipe.imageURL}`}}></Image>
      } else {
        return <Text>No image available</Text>
      }
    }

    renderRecipeIngredients = () => {
      const ingredient_uses = this.props.recipes_details[this.props["listChoice"]].ingredient_uses.filter(ingredient_use => ingredient_use.recipe_id == this.props["recipeID"])
      const list_values = ingredient_uses.map(ingredient_use => [ingredient_use.ingredient_id, ingredient_use.quantity, ingredient_use.unit])
      const ingredients = list_values.map(list_value => [...list_value, (this.props.recipes_details[this.props["listChoice"]].ingredients.find(ingredient => ingredient.id == list_value[0]).name)])
      return ingredients.map(ingredient => <Text key={ingredient[0]}>{ingredient[1]} {ingredient[2]} {ingredient[3]}</Text> )
    }

    renderRecipeInstructions = () => {
      const recipe = this.props.recipes_details[this.props["listChoice"]].recipes.find(recipe => recipe.id == this.props["recipeID"])
      return <Text>{recipe.instructions}</Text>
    }

    renderRecipeLikes = () => {
      const likes = this.props.recipes_details[this.props["listChoice"]].recipe_likes.filter(like => like.recipe_id == this.props["recipeID"])
      return <Text>Likes: {likes.length}</Text>
    }

    renderRecipeMakes = () => {
      const makes = this.props.recipes_details[this.props["listChoice"]].recipe_makes.filter(make => make.recipe_id == this.props["recipeID"])
      return <Text>makes: {makes.length}</Text>
    }

    renderRecipeMakePics = () => {
      const make_pics = this.props.recipes_details[this.props["listChoice"]].make_pics.filter(make_pic => make_pic.recipe_id == this.props["recipeID"])
      return make_pics.map(make_pic => {
        return (
          <React.Fragment key={make_pic.id}>
            <Image style={{width: 250, height: 250}} source={{uri: `${databaseURL}${make_pic.imageURL}`}}></Image>
          </React.Fragment>
        )
      })
    }

    renderRecipeComments = () => {
      const comments = this.props.recipes_details[this.props["listChoice"]].comments.filter(comment => comment.recipe_id == this.props["recipeID"])
      return comments.map(comment => {
        return (
          <React.Fragment key={comment.id}>
            <Text>Comment:</Text>
            <Text>{comment.comment}</Text>
          </React.Fragment>
        )
      })
    }

    likeRecipe = () => {
      // console.log("I like this recipe")
            fetch(`${databaseURL}/recipe_likes`, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  recipe_like: {
                    recipe_id: this.props["recipeID"],
                    chef_id: this.props.loggedInChef.id,
                  }
                })
            })
            .then(res => res.json())
            .then(like => {
              // console.log(like)
              this.props.addRecipeLike(like, this.props["listChoice"])
            })
    }


    render() {
      // console.log(this.props["listChoice"])
      // console.log(this.props["recipeID"])
      return (
        <Container>
          <Header>
          {this.renderRecipe()}
          </Header>
          <ScrollView>
            {this.renderRecipeImages()}
            {this.renderRecipeIngredients()}
            {this.renderRecipeInstructions()}
            {this.renderRecipeLikes()}
            {/* {this.renderRecipeMakes()} */}
            {this.renderRecipeMakePics()}
            {this.renderRecipeComments()}
          </ScrollView>
          <Button rounded danger style={styles.floatingButton} onPress={this.likeRecipe}>
              <Icon name='heart' />
          </Button>
        </Container>
      );
    }
  }
)

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    left: '81%',
    bottom: '3%',
    zIndex: 1
  }
});