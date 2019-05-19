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
import { Container, Header, Content, List, ListItem, Thumbnail, Left, Body, Right, Button, Icon } from 'native-base'
import { WebBrowser } from 'expo'
import { MonoText } from '../../components/StyledText'
import RecipeCard from './RecipeCard'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
      all_Recipes: state.recipes.all,
      chef_Recipes: state.recipes.chef,
      chef_liked_Recipes: state.recipes.chef_liked,
      chef_made_Recipes: state.recipes.chef_made,
      global_ranks_Recipes: state.recipes.global_ranks
})

const mapDispatchToProps = {
  fetchRecipeLists: (listType) => {
      return dispatch => {
          fetch('http://10.0.0.145:3000/', {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                recipe: {
                  listType: listType,
                  chef_id: 1,
                  limit: 100,
                  offset: 0,
                  ranking: "made"
                }
              })
          })
          .then(res => res.json())
          .then(recipes => {
              dispatch({ type: 'STORE_ALL_RECIPES', recipeType: listType, recipeList: recipes})
              recipe_ids = recipes.map(recipe =>{
                return recipe.id
              })
              fetch('http://10.0.0.145:3000/details', {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  details: {listed_recipes: recipe_ids}
                })
              })
              .then(res => res.json())
              .then(recipe_details => {
                dispatch({ type: 'STORE_RECIPES_DETAILS', recipeType: listType, recipesDetailsList: recipe_details})
                // console.log(listType)
                // console.log(recipe_details.recipes)
                // console.log(recipe_details.comments[0])
                // console.log(recipe_details.ingredient_uses[0])
                // console.log(recipe_details.ingredients[0])
                // console.log(recipe_details.recipe_images[0])
                // console.log(recipe_details.recipe_likes[0])
                // console.log(recipe_details.recipe_makes[0])
                // console.log(recipe_details.make_pics[0])
              })
          })
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class RecipesList extends React.Component {

    handleButton = () => {
      console.log("button pressed")
    }

    componentDidMount = () => {
      this.props.fetchRecipeLists(this.props["listChoice"])
    }

    renderRecipeListItems = () => {
      return this.props[this.props["listChoice"] + `_Recipes`].map(recipe => {
        return <RecipeCard key={recipe.id} {...recipe} listChoice={this.props["listChoice"]}/>
      })
    }

    render() {
      return (
        <Container>
          <Content>
            <List>
              {this.renderRecipeListItems()}
            </List>
          </Content>
          <Button rounded success style={styles.floatingButton} onPress={this.handleButton}>
              <Icon name='pizza' />
              {/* <Text>New Recipe</Text> */}
          </Button>
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
    },
    floatingButton: {
      position: 'absolute',
      left: '81%',
      bottom: '3%',
      zIndex: 1
    }
  });