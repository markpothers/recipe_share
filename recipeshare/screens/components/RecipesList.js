import React from 'react'
import { StyleSheet, TouchableOpacity, View, AsyncStorage, ImageBackground, ScrollView, FlatList, Text } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Left, Body, Right, Button, Icon } from 'native-base'
import RecipeCard from './RecipeCard'
import { databaseURL } from '../functionalComponents/databaseURL'
import { connect } from 'react-redux'
import { styles } from '../functionalComponents/RSStyleSheet'

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
        AsyncStorage.getItem('chef', (err, res) => {
            const loggedInChef = JSON.parse(res)
                        console.log(databaseURL)
                          fetch(`${databaseURL}/`, {
                              method: "POST",
                              headers: {
                                Authorization: `Bearer ${loggedInChef.auth_token}`,
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
                                  Authorization: `Bearer ${loggedInChef.auth_token}`,
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
      this.props.fetchRecipeLists(this.props["listChoice"], this.props.loggedInChef.id, this.props.global_ranking =='liked' ? 'made' : 'liked')
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
            return <RecipeCard listChoice={this.props["listChoice"]} key={recipe.id} {...recipe} imageURL={{ uri: `${databaseURL}${recipe_image.imageURL}` }} navigation={this.props.navigation}/>
          } else {
          return <RecipeCard listChoice={this.props["listChoice"]} key={recipe.id} {...recipe} imageURL={require("./peas.jpg")}/>
          }
        }else{
          return <RecipeCard listChoice={this.props["listChoice"]} key={recipe.id} {...recipe} imageURL={require("./peas.jpg")}/>
        }
      })
    }

    renderRecipeListItem = (item) => {
      // console.log(item.index)
      // return <RecipeCard {...item} />
      // return this.props[this.props["listChoice"] + `_Recipes`].map(recipe => {
        let imageURL = null
        if (this.props.recipes_details[this.props["listChoice"]].recipe_images != undefined ){
          // console.log("test")
          if (this.props.recipes_details[this.props["listChoice"]].recipe_images.find(image => image.recipe_id == item.item.id) != undefined){
            const recipe_image = this.props.recipes_details[this.props["listChoice"]].recipe_images.find(image => image.recipe_id == item.item.id)
            imageURL = { uri: `${databaseURL}${recipe_image.imageURL}` }
          }
        } else {
          imageURL = require("./peas.jpg")
        }
          // console.log(`${databaseURL}${recipe_image.imageURL}`)
        //   if (recipe_image != undefined){
        //     return <RecipeCard listChoice={this.props["listChoice"]} key={item.index.toString()} {...item} imageURL={{ uri: `${databaseURL}${recipe_image.imageURL}` }} navigation={this.props.navigation}/>
        //   } else {
        //   return <RecipeCard listChoice={this.props["listChoice"]} key={item.index.toString()} {...item} imageURL={require("./peas.jpg")}/>
        //   }
        // }else{
          // console.log(item.item.name)
          return <RecipeCard listChoice={this.props["listChoice"]} key={item.index.toString()} {...item} imageURL={imageURL} navigation={this.props.navigation}/>
        }
    //   })
    // }

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
      // console.log(this.props.navigation)
      // console.log(this.props[this.props["listChoice"] + `_Recipes`])
      return (

            <FlatList
              data={this.props[this.props["listChoice"] + `_Recipes`]}
              renderItem={this.renderRecipeListItem}
              keyExtractor={(item) => item.id.toString()}
            />

      )
    }

  }
)