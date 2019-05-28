import React from 'react'
import { StyleSheet, TouchableOpacity, View, AsyncStorage, ImageBackground, ScrollView, FlatList, Text } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Left, Body, Right, Button} from 'native-base'
import RecipeCard from './RecipeCard'
import { databaseURL } from '../functionalComponents/databaseURL'
import { connect } from 'react-redux'
import { styles } from '../functionalComponents/RSStyleSheet'
import { fetchRecipeList } from '../functionalComponents/recipeListFetch'
import { fetchRecipeDetails } from '../functionalComponents/recipeListDetailsFetch'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
  storeRecipeList: (listChoice, recipes) => {
    return dispatch => {
      dispatch({ type: 'STORE_RECIPE_LISTS', recipeType: listChoice, recipeList: recipes})
      }
  },
  storeRecipeDetails: (listChoice, recipe_details) => {
    return dispatch => {
      dispatch({ type: 'STORE_RECIPES_DETAILS', recipeType: listChoice, recipesDetailsList: recipe_details})
    }
  },
  appendToRecipeList: (listChoice, new_recipes) => {
    return dispatch => {
      dispatch({ type: 'APPEND_TO_RECIPE_LISTS', recipeType: listChoice, recipeList: new_recipes})
      }
  },
  appendToRecipeDetails: (listChoice, new_recipe_details) => {
    return dispatch => {
      dispatch({ type: 'APPEND_TO_RECIPES_DETAILS', recipeType: listChoice, recipesDetailsList: new_recipe_details})
    }
  },
  clearListedRecipes: (listChoice) => {
    return dispatch => {
      dispatch({ type: 'CLEAR_LISTED_RECIPES', recipeType: listChoice})
    }
  },
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class RecipesList extends React.Component {

    state = {
      limit: 50,
      offset: 0
    }

    handleRankChoiceButton = async() => {
      await this.props.changeRanking()
      await this.setState({limit: 50, offset: 0})
      this.fetchRecipeListThenDetails()
    }

    componentDidMount = () => {
      this.fetchRecipeListThenDetails()
    }

    fetchRecipeListThenDetails = async() => {

      let recipes = await fetchRecipeList(this.props["listChoice"], this.props.chef_id, this.state.limit, this.state.offset, this.props.global_ranking, this.props.loggedInChef.auth_token)
      this.props.storeRecipeList(this.props["listChoice"], recipes)
      recipe_ids = recipes.map(recipe => {
        return recipe.id
      })
      // console.log(recipe_ids)
      const recipe_details = await fetchRecipeDetails(recipe_ids, this.props.loggedInChef.auth_token)
      this.props.storeRecipeDetails(this.props["listChoice"], recipe_details)
    }

    fetchAdditionalRecipesThenDetailsForList = async() => {
      const new_recipes = await fetchRecipeList(this.props["listChoice"], this.props.chef_id, this.state.limit, this.state.offset, this.props.global_ranking, this.props.loggedInChef.auth_token)
      this.props.appendToRecipeList(this.props["listChoice"], new_recipes)
      new_recipe_ids = new_recipes.map(recipe => {
        return recipe.id
      })
      const new_recipe_details = await fetchRecipeDetails(new_recipe_ids, this.props.loggedInChef.auth_token)
      this.props.appendToRecipeDetails(this.props["listChoice"], new_recipe_details)
    }

    renderRecipeListItem = (item) => {
      let imageURL = null
      if (this.props.recipes_details[this.props["listChoice"]].recipe_images != undefined ){
        if (this.props.recipes_details[this.props["listChoice"]].recipe_images.find(image => image.recipe_id == item.item.id) != undefined){
          const recipe_image = this.props.recipes_details[this.props["listChoice"]].recipe_images.find(image => image.recipe_id == item.item.id)
          imageURL = { uri: `${databaseURL}${recipe_image.imageURL}` }
        }
      } else {
        imageURL = require("./peas.jpg")
      }
        return <RecipeCard listChoice={this.props["listChoice"]} key={item.index.toString()} {...item} imageURL={imageURL} navigation={this.props.navigation}/>
    }

    renderGlobalListButton = () => {
      if (this.props["listChoice"] == "global_ranks"){
        return (
          <Button rounded danger style={styles.rankButton} onPress={this.handleRankChoiceButton}>
              {this.props.global_ranking == 'liked' ? <Icon style={styles.rankIcon} size={25} name='thumb-up' /> : <Icon style={styles.rankIcon} size={25} name='thumb-up-outline' />}
              {this.props.global_ranking == 'liked' ? <Text style={styles.rankButtonText}>Most likes</Text> : <Text style={styles.rankButtonText}>Most makes</Text>}
          </Button>
        )
      }
    }

    refresh = async () => {
      await this.setState({limit: 50, offset: 0})
      this.props.clearListedRecipes(this.props["listChoice"])
      this.fetchRecipeListThenDetails()
    }

    onEndReached = async () => {
      await this.setState({offset: this.state.offset + 50})
      this.fetchAdditionalRecipesThenDetailsForList()
    }

    render() {
      // console.log("rendering")
      return (
        <React.Fragment>
          <FlatList
            data={this.props[this.props["listChoice"] + `_Recipes`]}
            extraData={this.props.recipes_details[this.props["listChoice"]]}
            renderItem={this.renderRecipeListItem}
            keyExtractor={(item) => item.id.toString()}
            onRefresh={this.refresh}
            refreshing={false}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.3}
          />
          {this.renderGlobalListButton()}
        </React.Fragment>
      )
    }

  }
)