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
import { databaseURL } from '../functionalComponents/databaseURL'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
      all_Recipes: state.recipes.all,
      chef_Recipes: state.recipes.chef,
      chef_liked_Recipes: state.recipes.chef_liked,
      chef_made_Recipes: state.recipes.chef_made,
      global_ranks_Recipes: state.recipes.global_ranks,
      recipes_details: state.recipes_details
})

const mapDispatchToProps = {
  fetchRecipeLists: (listType) => {
      return dispatch => {
        console.log(databaseURL)
          fetch(`${databaseURL}/`, {
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
            console.log("sending recipes list to store")
              dispatch({ type: 'STORE_ALL_RECIPES', recipeType: listType, recipeList: recipes})
              recipe_ids = recipes.map(recipe =>{
                return recipe.id
              })
              fetch(`${databaseURL}/details`, {
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
                // console.log(recipe_details)
                console.log("sending recipe lists details to store")
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
        if (this.props.recipes_details[this.props["listChoice"]].recipe_images != undefined ){
          const recipe_image = this.props.recipes_details[this.props["listChoice"]].recipe_images.find(image => image.recipe_id == recipe.id)
          // console.log(`${databaseURL}${recipe_image.imageURL}`)
          if (recipe_image != undefined){
            return <RecipeCard key={recipe.id} {...recipe} imageURL={{ uri: `${databaseURL}${recipe_image.imageURL}` }}/>
          } else {
          return <RecipeCard key={recipe.id} {...recipe} imageURL={require("./peas.jpg")}/>
          }
        }else{
          return <RecipeCard key={recipe.id} {...recipe} imageURL={require("./peas.jpg")}/>
        }
      })
    }

    render() {
      // console.log(this.props)
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