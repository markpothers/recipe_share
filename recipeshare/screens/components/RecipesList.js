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
      recipes_details: state.recipes_details,
      loggedInChef: state.loggedInChef,
      global_ranking: state.global_ranking
})

const mapDispatchToProps = {
  changeRanking: () => {
    return dispatch => {
      dispatch({ type: 'CHANGE_GLOBAL_RANKING'})
    }
  },
  fetchRecipeLists: (listType, chef_id, global_ranking) => {
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
                  chef_id: chef_id,
                  limit: 100,
                  offset: 0,
                  ranking: global_ranking
                }
              })
          })
          .then(res => res.json())
          .then(recipes => {
            // console.log(recipes)
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

    handleNewRecipeButton = () => {
      console.log("button pressed")
    }

    handleRankChoiceButton = () => {
      this.props.changeRanking()
      this.props.fetchRecipeLists(this.props["listChoice"], this.props.loggedInChef.id, this.props.global_ranking)
    }

    componentDidMount = () => {
      this.props.fetchRecipeLists(this.props["listChoice"], this.props.loggedInChef.id, this.props.global_ranking)
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

    renderGlobalListButton = () => {
      if (this.props["listChoice"] == "global_ranks"){
        return (
          <Button rounded danger style={styles.floatingButton1} onPress={this.handleRankChoiceButton}>
              <Icon name='pizza' />
              {/* <Text>New Recipe</Text> */}
          </Button>
        )
      }
    }

    render() {
      // console.log(this.props.global_ranking)
      // console.log(Object.values(this.props[this.props["listChoice"] + `_Recipes`]))
      return (
        <Container>
          <Content>
            {/* <Text>Most {this.props.global_ranking} recipes </Text> */}
            <List>
              {this.renderRecipeListItems()}
            </List>
          </Content>
          <Button rounded success style={styles.floatingButton} onPress={this.handleNewRecipeButton}>
              <Icon name='pizza' />
              {/* <Text>New Recipe</Text> */}
          </Button>
              {this.renderGlobalListButton()}
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
    },
    floatingButton1: {
      position: 'absolute',
      left: '81%',
      bottom: '15%',
      zIndex: 1
    }
  });