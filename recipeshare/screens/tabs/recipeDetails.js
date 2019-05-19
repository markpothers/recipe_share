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

const mapStateToProps = (state) => ({
  recipes_details: state.recipes_details,
})

const mapDispatchToProps = {
//   fetchAllRecipes: () => {
//       return dispatch => {
//           fetch('http://10.185.4.207:3000')
//           .then(res => res.json())
//           .then(recipes => {
//               dispatch({ type: 'STORE_ALL_RECIPES', recipes: recipes})
//           })
//       }
//   }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class RecipeDetails extends React.Component {

    componentDidMount = () => {
    }

    renderRecipe = () => {
      const recipe = this.props.recipes_details[this.props["listChoice"]].recipes.find(recipe => recipe.id == this.props["recipeID"])
      // console.log(recipe)
      return <Text>{recipe.name}</Text>
    }

    renderRecipeImages = () => {
      // console.log(this.props.recipes_details[this.props["listChoice"]].recipe_images)
      const recipe = this.props.recipes_details[this.props["listChoice"]].recipe_images.find(recipe => recipe.recipe_id == this.props["recipeID"])
      // console.log(recipe)
      if (recipe != undefined){
        return <Image style={{width: 300, height: 300}} source={{uri: `http://10.0.0.145:3000${recipe.imageURL}.jpg`}}></Image>
      } else {
        return <Text>No image available</Text>
      }
    }

    renderRecipeIngredients = () => {

    }

    renderRecipeInstructions = () => {
      const recipe = this.props.recipes_details[this.props["listChoice"]].recipes.find(recipe => recipe.id == this.props["recipeID"])
      return <Text>{recipe.instructions}</Text>
    }

    renderRecipeLikes = () => {
      const likes = this.props.recipes_details[this.props["listChoice"]].recipe_likes.filter(like => like.recipe_id == this.props["recipeID"])
      // console.log(likes)
      return <Text>Likes: {likes.length}</Text>
    }

    renderRecipeMakes = () => {
      const makes = this.props.recipes_details[this.props["listChoice"]].recipe_makes.filter(make => make.recipe_id == this.props["recipeID"])
      // console.log(makes)
      return <Text>makes: {makes.length}</Text>
    }

    renderRecipeMakePics = () => {
      // console.log(this.props.recipes_details[this.props["listChoice"]].make_pics)
      const make_pics = this.props.recipes_details[this.props["listChoice"]].make_pics.filter(make_pic => make_pic.recipe_id == this.props["recipeID"])
      // console.log(make_pics[0])
      return make_pics.map(make_pic => {
        return (
          <React.Fragment key={make_pic.id}>
            <Image style={{width: 300, height: 300}} source={{uri: `http://10.0.0.145:3000${make_pic.imageURL}.jpg`}}></Image>
          </React.Fragment>
        )
      })
    }

    renderRecipeComments = () => {
      // console.log(this.props.recipes_details[this.props["listChoice"]].comments)
      const comments = this.props.recipes_details[this.props["listChoice"]].comments.filter(comment => comment.recipe_id == this.props["recipeID"])
      // console.log(comments[0])
      return comments.map(comment => {
        return (
          <React.Fragment key={comment.id}>
            <Text>Comment:</Text>
            <Text>{comment.comment}</Text> 
          </React.Fragment>
        )
      })
    }


    render() {
      // console.log(this.props.recipes_details[this.props["listChoice"]].comments)
      console.log(this.props["recipeID"])
      return (
        <Container>
          <Header>
              <Text>Recipe Details</Text>
          </Header>
          <ScrollView>
            {this.renderRecipe()}
            {this.renderRecipeImages()}
            {this.renderRecipeIngredients()}
            {this.renderRecipeInstructions()}
            {this.renderRecipeLikes()}
            {this.renderRecipeMakes()}
            {this.renderRecipeMakePics()}
            {this.renderRecipeComments()}
          </ScrollView>
        </Container>
      );
    }
  }
)
