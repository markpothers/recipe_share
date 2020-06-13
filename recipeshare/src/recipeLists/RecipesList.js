import React from 'react'
import { FlatList, ActivityIndicator, TouchableOpacity, View, Platform } from 'react-native'
import RecipeCard from './RecipeCard'
import { connect } from 'react-redux'
import { getRecipeList } from '../fetches/getRecipeList'
import { postRecipeLike } from '../fetches/postRecipeLike'
import { postReShare } from '../fetches/postReShare'
import { postRecipeMake } from '../fetches/postRecipeMake'
import { destroyRecipeLike } from '../fetches/destroyRecipeLike'
import { destroyReShare } from '../fetches/destroyReShare'
import { NavigationEvents, withNavigation } from 'react-navigation'
import { styles } from './recipeListStyleSheet'
import { centralStyles } from '../centralStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FilterMenu from '../functionalComponents/filterMenu'
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';

const mapStateToProps = (state) => ({
      all_Recipes: state.recipes.all,
      chef_Recipes: state.recipes.chef,
      chef_feed_Recipes: state.recipes.chef_feed,
      chef_liked_Recipes: state.recipes.chef_liked,
      chef_made_Recipes: state.recipes.chef_made,
      global_ranks_Recipes: state.recipes.global_ranks,
      most_liked_Recipes: state.recipes.most_liked,
      most_made_Recipes: state.recipes.most_made,
      recipes_details: state.recipes_details,
      loggedInChef: state.loggedInChef,
      global_ranking: state.global_ranking,
      filter_settings: state.filter_settings,
      cuisine: state.cuisine,
      serves: state.serves,
})

const mapDispatchToProps = {
  // changeRanking: () => {
  //   return dispatch => {
  //     dispatch({ type: 'CHANGE_GLOBAL_RANKING'})
  //   }
  // },
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
  // clearListedRecipes: (listChoice) => {
  //   return dispatch => {
  //     dispatch({ type: 'CLEAR_LISTED_RECIPES', recipeType: listChoice})
  //   }
  // },
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(
  class RecipesList extends React.Component {

    state = {
      limit: 20,
      offset: 0,
      isDisplayed: true,
      filterDisplayed: false,
      awaitingServer: false
    }

    componentDidMount = async() => {
      await this.setState({awaitingServer: true})
      await this.fetchRecipeListThenDetails()
      await this.setState({awaitingServer: false})
    }

    // componentWillUnmount = () => {
    // }

    shouldComponentUpdate = (nextProps, nextState) => {
      return (
        this.state.isDisplayed
      )
    }

    respondToFocus = async() =>{
      await this.setState({awaitingServer: true})
      await this.setState({offset: 0})
      await this.fetchRecipeListThenDetails()
      await this.setState({awaitingServer: false})
    }

    fetchRecipeListThenDetails = async() => {
      try {
        const queryChefID = this.props.queryChefID ? this.props.queryChefID : this.props.loggedInChef.id
        let recipes = await getRecipeList(this.props["listChoice"], queryChefID, this.state.limit, this.state.offset, this.props.global_ranking, this.props.loggedInChef.auth_token, this.props.filter_settings, this.props.cuisine, this.props.serves)
        this.props.storeRecipeList(this.props["listChoice"], recipes)
      }
      catch (e){}

    }

    fetchAdditionalRecipesThenDetailsForList = async() => {
      await this.setState({awaitingServer: true})
      try{
        const queryChefID = this.props.queryChefID ? this.props.queryChefID : this.props.loggedInChef.id
        const new_recipes = await getRecipeList(this.props["listChoice"], queryChefID, this.state.limit, this.state.offset, this.props.global_ranking, this.props.loggedInChef.auth_token, this.props.filter_settings, this.props.cuisine, this.props.serves)
        this.props.appendToRecipeList(this.props["listChoice"], new_recipes)
      }
      catch (e){}
      await this.setState({awaitingServer: false})
    }

    navigateToRecipeDetails = (recipeID) =>{
      this.props.parentNavigator ? this.props.parentNavigator('RecipeDetails', {recipeID: recipeID}) : this.props.navigation.navigate('RecipeDetails', {recipeID: recipeID})
    }

    navigateToRecipeDetailsAndComment = (recipeID) =>{
      this.props.parentNavigator ? this.props.parentNavigator('RecipeDetails', {recipeID: recipeID, commenting: true}) : this.props.navigation.navigate('RecipeDetails', {recipeID: recipeID, commenting: true})
    }

    navigateToChefDetails = (chefID) => {
      this.props.parentNavigator ? this.props.parentNavigator('ChefDetails', {chefID: chefID}) : this.props.navigation.navigate('ChefDetails', {chefID: chefID})
    }

    renderRecipeListItem = (item) => {
        return (
            <RecipeCard listChoice={this.props["listChoice"]}
              key={item.index.toString()} 
              {...item.item} 
              navigateToRecipeDetails={this.navigateToRecipeDetails} 
              navigateToRecipeDetailsAndComment={this.navigateToRecipeDetailsAndComment} 
              navigateToChefDetails={this.navigateToChefDetails} 
              likeRecipe={this.likeRecipe} 
              unlikeRecipe={this.unlikeRecipe} 
              makeRecipe={this.makeRecipe} 
              reShareRecipe={this.reShareRecipe}
              unReShareRecipe={this.unReShareRecipe} 
              />
          )
    }

    refresh = async () => {
      await this.setState({limit: 20, offset: 0})
      this.fetchRecipeListThenDetails()
    }

    onEndReached = async () => {
      await this.setState({offset: this.state.offset + 20})
      this.fetchAdditionalRecipesThenDetailsForList()
    }

    onScroll = (e) => {
      e.persist()
      this.props.respondToListScroll(e)
    }

    likeRecipe = async(recipeID) => {
      await this.setState({awaitingServer: true})
      const likePosted = await postRecipeLike(recipeID, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
      if (likePosted) {
        const recipes = this.props[this.props["listChoice"] + `_Recipes`].map( (recipe) => {
          if (recipe['id'] === recipeID){
            recipe['likes_count'] = parseInt(recipe['likes_count']) + 1
            recipe['chef_liked'] = 1
            return recipe
          } else {
            return recipe
          }
        })
        this.props.storeRecipeList(this.props["listChoice"], recipes)
        this.props.fetchChefDetails && this.props.fetchChefDetails()
      }
      await this.setState({awaitingServer: false})
    }

    unlikeRecipe = async(recipeID) => {
      await this.setState({awaitingServer: true})
      const unlikePosted = await destroyRecipeLike(recipeID, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
      if (unlikePosted) {
        const recipes = this.props[this.props["listChoice"] + `_Recipes`].map( (recipe) => {
          if (recipe['id'] === recipeID){
            recipe['likes_count'] = parseInt(recipe['likes_count']) - 1
            recipe['chef_liked'] = 0
            return recipe
          } else {
            return recipe
          }
        })
        this.props.storeRecipeList(this.props["listChoice"], recipes)
        this.props.fetchChefDetails && this.props.fetchChefDetails()
      }
      await this.setState({awaitingServer: false})
    }

    makeRecipe = async(recipeID) => {
      await this.setState({awaitingServer: true})
      const makePosted = await postRecipeMake(recipeID, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
      if (makePosted) {
        const recipes = this.props[this.props["listChoice"] + `_Recipes`].map( (recipe) => {
          if (recipe['id'] === recipeID){
            recipe['makes_count'] = parseInt(recipe['makes_count']) + 1
            recipe['chef_made'] = 1
            return recipe
          } else {
            return recipe
          }
        })
        this.props.storeRecipeList(this.props["listChoice"], recipes)
      }
      await this.setState({awaitingServer: false})
    }

    reShareRecipe = async(recipeID) => {
      await this.setState({awaitingServer: true})
      const reSharePosted = await postReShare(recipeID, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
      if (reSharePosted) {
        const recipes = this.props[this.props["listChoice"] + `_Recipes`].map( (recipe) => {
          if (recipe['id'] === recipeID){
            recipe['shares_count'] = parseInt(recipe['shares_count']) + 1
            recipe['chef_shared'] = 1
            return recipe
          } else {
            return recipe
          }
        })
        this.props.storeRecipeList(this.props["listChoice"], recipes)
        this.props.fetchChefDetails && this.props.fetchChefDetails()
      }
      await this.setState({awaitingServer: false})
    }

    unReShareRecipe = async(recipeID) => {
      await this.setState({awaitingServer: true})
      const unReShared = await destroyReShare(recipeID, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
      if (unReShared) {
        const recipes = this.props[this.props["listChoice"] + `_Recipes`].map( (recipe) => {
          if (recipe['id'] === recipeID){
            recipe['shares_count'] = parseInt(recipe['shares_count']) - 1
            recipe['chef_shared'] = 0
            return recipe
          } else {
            return recipe
          }
        })
        this.props.storeRecipeList(this.props["listChoice"], recipes)
        this.props.fetchChefDetails && this.props.fetchChefDetails()
      }
      await this.setState({awaitingServer: false})
    }

    respondToBlur = () =>{
      this.setState({isDisplayed: false})
    }

    respondToFocus = async() =>{
      await this.setState({
        offset: 0,
        isDisplayed: true
      })
      this.fetchRecipeListThenDetails()
    }

    handleFilterButton = () =>{
      this.setState({filterDisplayed: true})
    }

    closeFilterAndRefresh = () => {
      this.setState({filterDisplayed: false})
      this.refresh()
    }

    render() {

      // console.log(this.props.addLikeCount)
      return (
        <SpinachAppContainer awaitingServer={this.state.awaitingServer}>
          <NavigationEvents onWillFocus={this.respondToFocus} onWillBlur={this.respondToBlur}/>
            <TouchableOpacity style={styles.filterButton} activeOpacity={0.7} onPress={this.handleFilterButton}>
              <Icon name='filter' size={responsiveHeight(3.5)} style={styles.filterIcon}/>
            </TouchableOpacity>
          <FlatList
            data={this.props[this.props["listChoice"] + `_Recipes`]}
            extraData={this.props.recipes_details}
            renderItem={this.renderRecipeListItem}
            keyExtractor={(item) => item.id.toString()}
            onRefresh={this.refresh}
            refreshing={false}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={1}
            // initialNumToRender={200}
            // onScroll={e => this.onScroll(e)}
            // scrollEventThrottle={16}
            nestedScrollEnabled={true}
          />
          {this.state.filterDisplayed ? <FilterMenu handleFilterButton={this.handleFilterButton} refresh={this.refresh} closeFilterAndRefresh={this.closeFilterAndRefresh} confirmButtonText={"Apply"} title={"Apply filters to recipes list"}/> : null}
        </SpinachAppContainer>
      )
    }
  }
))
