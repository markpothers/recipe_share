import React from 'react'
import { FlatList } from 'react-native'
import { Button} from 'native-base'
import RecipeCard from './RecipeCard'
import { connect } from 'react-redux'
import { styles } from './recipeListStyleSheet'
import { fetchRecipeList } from '../fetches/recipeListFetch'
import { postRecipeLike } from '../fetches/postRecipeLike'
import { postReShare } from '../fetches/postReShare'
import { postRecipeMake } from '../fetches/postRecipeMake'
import { destroyRecipeLike } from '../fetches/destroyRecipeLike'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { NavigationEvents, withNavigation } from 'react-navigation'

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
  // clearListedRecipes: (listChoice) => {
  //   return dispatch => {
  //     dispatch({ type: 'CLEAR_LISTED_RECIPES', recipeType: listChoice})
  //   }
  // },
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(
  class RecipesList extends React.PureComponent {
    static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: 'My recipe book',
        headerStyle: {    //styles possibly needed if app-wide styling doesn't work
          backgroundColor: '#104e01',
          opacity: 0.8
        },
        headerTintColor: '#fff59b',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: (
          <Button rounded style={styles.newButton} onPress={navigation.getParam('newRecipe')}>
            <Icon name='plus' size={40} style={styles.newIcon}/>
          </Button>
        ),
      }
    };

    state = {
      limit: 20,
      offset: 0
    }

    handleRankChoiceButton = async() => {
      await this.props.changeRanking()
      await this.setState({limit: 20, offset: 0})
      this.fetchRecipeListThenDetails()
    }

    componentDidMount = () => {
      this.fetchRecipeListThenDetails()
      // this.navigateToRecipeDetails(454)
    }

    respondToFocus = async() =>{
      await this.setState({offset: 0})
      this.fetchRecipeListThenDetails()
    }

    fetchRecipeListThenDetails = async() => {
      let recipes = await fetchRecipeList(this.props["listChoice"], this.props.chef_id, this.state.limit, this.state.offset, this.props.global_ranking, this.props.loggedInChef.auth_token)
      this.props.storeRecipeList(this.props["listChoice"], recipes)
    }

    fetchAdditionalRecipesThenDetailsForList = async() => {
      const new_recipes = await fetchRecipeList(this.props["listChoice"], this.props.chef_id, this.state.limit, this.state.offset, this.props.global_ranking, this.props.loggedInChef.auth_token)
      this.props.appendToRecipeList(this.props["listChoice"], new_recipes)
    }

    navigateToRecipeDetails = (recipeID) =>{
      this.props.navigation.navigate('RecipeDetails', {recipeID: recipeID})
    }

    navigateToChefDetails = (chefID) => {
      this.props.navigation.navigate('ChefDetails', {listChoice: this.props["listChoice"], chefID: chefID})
    }

    renderRecipeListItem = (item) => {
        let imageURL = require("../dataComponents/peas.jpg")
        return (
          // <View style={styles.recipeCard} key={item.index.toString()}>
            <RecipeCard listChoice={this.props["listChoice"]} key={item.index.toString()} {...item.item} navigateToRecipeDetails={this.navigateToRecipeDetails} navigateToChefDetails={this.navigateToChefDetails} likeRecipe={this.likeRecipe} unlikeRecipe={this.unlikeRecipe} makeRecipe={this.makeRecipe} reShareRecipe={this.reShareRecipe}/>
            // <RecipeCardTouchables {...item.item} likeRecipe={this.likeRecipe} unlikeRecipe={this.unlikeRecipe} makeRecipe={this.makeRecipe} reShareRecipe={this.reShareRecipe}/>
          // </View>
          )
    }

    // renderGlobalListButton = () => {
    //   if (this.props["listChoice"] == "global_ranks"){
    //     return (
    //       <Button rounded danger style={styles.rankButton} onPress={this.handleRankChoiceButton}>
    //           {this.props.global_ranking == 'liked' ? <Icon style={styles.rankIcon} size={25} name='thumb-up' /> : <Icon style={styles.rankIcon} size={25} name='thumb-up-outline' />}
    //           {this.props.global_ranking == 'liked' ? <Text style={styles.rankButtonText}>Most likes</Text> : <Text style={styles.rankButtonText}>Most makes</Text>}
    //       </Button>
    //     )
    //   }
    // }

    refresh = async () => {
      await this.setState({limit: 20, offset: 0})
      // this.props.clearListedRecipes(this.props["listChoice"])
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
      const likePosted = await postRecipeLike(recipeID, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
      if (likePosted) {
        const recipes = this.props[this.props["listChoice"] + `_Recipes`].map( (recipe) => {
          if (recipe['id'] === recipeID){
            recipe['likesCount'] += 1
            recipe['chef_liked'] += 1
            return recipe
          } else {
            return recipe
          }
        })
        this.props.storeRecipeList(this.props["listChoice"], recipes)
      }
    }

    unlikeRecipe = async(recipeID) => {
      const unlikePosted = await destroyRecipeLike(recipeID, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
      if (unlikePosted) {
        const recipes = this.props[this.props["listChoice"] + `_Recipes`].map( (recipe) => {
          if (recipe['id'] === recipeID){
            recipe['likesCount'] -= 1
            recipe['chef_liked'] = 0
            return recipe
          } else {
            return recipe
          }
        })
        this.props.storeRecipeList(this.props["listChoice"], recipes)
      }
    }

    makeRecipe = async(recipeID) => {
      const makePosted = await postRecipeMake(recipeID, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
      if (makePosted) {
        const recipes = this.props[this.props["listChoice"] + `_Recipes`].map( (recipe) => {
          if (recipe['id'] === recipeID){
            recipe['makesCount'] += 1
            recipe['chef_made'] += 1
            return recipe
          } else {
            return recipe
          }
        })
        this.props.storeRecipeList(this.props["listChoice"], recipes)
      }
    }

    reShareRecipe = async(recipeID) => {
      const likePosted = await postReShare(recipeID, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
      if (likePosted) {
        const recipes = this.props[this.props["listChoice"] + `_Recipes`].map( (recipe) => {
          if (recipe['id'] === recipeID){
            recipe['sharesCount'] += 1
            recipe['chef_shared'] += 1
            return recipe
          } else {
            return recipe
          }
        })
        this.props.storeRecipeList(this.props["listChoice"], recipes)
      }
    }

    render() {
      // console.log(this.props.chef_feed_Recipes.length)
      return (
        <React.Fragment>
          <NavigationEvents onWillFocus={this.respondToFocus}/>
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
          />
          {/* {this.renderGlobalListButton()} */}
        </React.Fragment>
      )
    }
  }
))
