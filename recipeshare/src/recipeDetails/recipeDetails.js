import React from 'react';
import { Button } from 'native-base';
import { Image, ScrollView, View, ImageBackground, Text, FlatList } from 'react-native';
import { connect } from 'react-redux'
import { databaseURL } from '../dataComponents/databaseURL'
import { styles } from './recipeDetailsStyleSheet'
import { postRecipeLike } from '../fetches/postRecipeLike'
import { postReShare } from '../fetches/postReShare'
import { postRecipeMake } from '../fetches/postRecipeMake'
import { destroyRecipeLike } from '../fetches/destroyRecipeLike'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RecipeComment from './recipeComment'

const mapStateToProps = (state) => ({
  recipe_details: state.recipe_details,
  loggedInChef: state.loggedInChef
})

const mapDispatchToProps = {
  addRecipeLike: () => {
    return dispatch => {
      dispatch({ type: 'ADD_RECIPE_LIKE'})
    }
  },
  removeRecipeLike: () => {
    return dispatch => {
      dispatch({ type: 'REMOVE_RECIPE_LIKE'})
    }
  },
  addRecipeMake: () => {
    return dispatch => {
      dispatch({ type: 'ADD_RECIPE_MAKE'})
    }
  },
  addReShare: () => {
    return dispatch => {
      dispatch({ type: 'ADD_RECIPE_SHARE'})
    }
  },
  removeRecipeLikes: (remaining_likes, listType) => {
    return dispatch => {
      dispatch({ type: 'REMOVE_RECIPE_LIKES', recipe_likes: remaining_likes, listType: listType})
    }
  },
  storeRecipeDetails: (recipe_details) => {
  return dispatch => {
    dispatch({ type: 'STORE_RECIPE_DETAILS', recipe_details: recipe_details})
  }
}
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class RecipeDetails extends React.Component {
    static navigationOptions = ({ navigation }) => {
      return {
        title: 'Recipe details',
        headerStyle: {
          backgroundColor: '#104e01',
          // opacity: 0.8
        },
        headerTintColor: '#fff59b',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: (
          <React.Fragment>
            {navigation.getParam('likeable') == false ? <Button rounded style={styles.newButton} onPress={navigation.getParam('unlikeRecipe')}><Icon name='heart' size={28} style={styles.newIcon}/></Button> : <Button rounded style={styles.newButton} onPress={navigation.getParam('likeRecipe')}><Icon name='heart-outline' size={28} style={styles.newIcon}/></Button> }
            {navigation.getParam('makeable') == false ? <Button rounded style={styles.newButton}><Icon name='food-off' size={28} style={styles.newIcon}/></Button> : <Button rounded style={styles.newButton} onPress={navigation.getParam('makeRecipe')}><Icon name='food' size={28} style={styles.newIcon}/></Button> }
            {/* <Button rounded style={styles.newButton} onPress={navigation.getParam('editRecipe')}>
              <Icon2 name='edit' size={28} style={styles.newIcon} />
            </Button> */}
            <Button rounded style={styles.newButton} onPress={navigation.getParam('deleteRecipe')}>
              <Icon name='delete-outline' size={28} style={styles.newIcon} />
            </Button>
          </React.Fragment>
        ),
      };
    }

    componentDidMount = () => {
      this.fetchRecipeDetails()
    }

    fetchRecipeDetails = () => {
      // console.log(this.props.navigation.getParam('recipeID'))
      fetch(`${databaseURL}/recipes/${this.props.navigation.getParam('recipeID')}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.props.loggedInChef.auth_token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(recipe_details => {
        this.props.storeRecipeDetails(recipe_details)
          this.props.navigation.setParams({
            likeable: recipe_details.likeable,
            makeable: recipe_details.makeable,
            likeRecipe: this.likeRecipe,
            unlikeRecipe: this.unlikeRecipe,
            deleteRecipe: this.deleteRecipe,
            makeRecipe: this.makeRecipe,
            editRecipe: this.navigateToEditRecipe
          })
      })
    }

    navigateToEditRecipe = () => {
      // this.props.navigation.navigate('NewRecipe', {recipeID: this.props.navigation.getParam('recipeID')})
    }

    deleteRecipe = () => {
      fetch(`${databaseURL}/recipes/${this.props.navigation.getParam('recipeID')}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.props.loggedInChef.auth_token}`,
          'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(response => {
      if (response == true){
        this.props.navigation.goBack()
      }
    })
    }

    renderRecipeImages = () => {
      if (this.props.recipe_details.recipe_images.imageURL != ""){
      return <Image style={[{width: '100%', height: 250}, styles.detailsImage]} source={{uri: `${databaseURL}${this.props.recipe_details.recipe_images[0].imageURL}`}}></Image>
      }
    }

    renderRecipeIngredients = () => {
      const ingredient_uses = this.props.recipe_details.ingredient_uses
      const list_values = ingredient_uses.map(ingredient_use => [ingredient_use.ingredient_id, ingredient_use.quantity, ingredient_use.unit])
      const ingredients = list_values.map(list_value => [...list_value, (this.props.recipe_details.ingredients.find(ingredient => ingredient.id == list_value[0]).name)])
      return ingredients.map(ingredient => (
            <View style={styles.ingredientsTable} key={ingredient[0]}>
              <Text style={[styles.detailsContents, styles.ingredientName]}>{ingredient[3]}</Text>
              <Text style={[styles.detailsContents, styles.ingredientQuantity]}>{ingredient[1]}</Text>
              <Text style={[styles.detailsContents, styles.ingredientUnit]}>{ingredient[2]}</Text>
            </View>
      ))
    }

    renderRecipeMakePics = () => {
      return this.props.recipe_details.make_pics.map(make_pic => {
        return <Image key={make_pic.id} style={{width: 115, height: 115}} source={{uri: `${databaseURL}${make_pic.imageURL}`}}></Image>
      })
    }

    renderRecipeComments = () => {
      if (this.props.recipe_details.comments.length > 0){
        return (
          this.props.recipe_details.comments.map( comment => {
            return <RecipeComment key={comment.comment} {...comment} />
          })
          // <FlatList
          //   data={this.props.recipe_details.comments}
          //   renderItem={ (item) => <RecipeComment {...item.item} />}
          //   keyExtractor={ (item) => item.comment}
          //   scrollEnabled={false}
          //   />
        )
      } else {
        return <Text style={[styles.detailsContents]}>No comments yet.  Be the first!</Text>
      }
    }

    likeRecipe = async() => {
      const likePosted = await postRecipeLike(this.props.recipe_details.recipe.id, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
      if (likePosted) {
          this.props.addRecipeLike()
          this.props.navigation.setParams({
            likeable: false,
          })
      }
    }

    unlikeRecipe = async() => {
      const unlikePosted = await destroyRecipeLike(this.props.recipe_details.recipe.id, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
      if (unlikePosted) {
        this.props.removeRecipeLike()
        this.props.navigation.setParams({
          likeable: true,
        })
      }
    }

    makeRecipe = async() => {
      const makePosted = await postRecipeMake(this.props.recipe_details.recipe.id, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
      if (makePosted) {
        this.props.addRecipeMake()
        this.props.navigation.setParams({
          makeable: false,
        })
      }
    }

    reShareRecipe = async() => {
      const reSharePosted = await postReShare(this.props.recipe_details.recipe.id, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
      if (reSharePosted) {
          this.props.addReShare()
          this.props.navigation.setParams({
            reShareable: false,
          })
      }
    }

    render() {
      if (this.props.recipe_details != undefined){
        // console.log(this.props.recipe_details.comments)
        return (
          <View style={{flex:1}}>
            <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
              <View style={styles.detailsHeader}>
                <Text style={[styles.detailsHeaderTextBox]}>{this.props.recipe_details.recipe.name}</Text>
              </View>
              <ScrollView contentContainerStyle={{flexGrow:1}}>
                <View style={styles.detailsLikesAndMakes}>
                  <View style={styles.detailsLikes}>
                    <Text style={[styles.detailsLikesAndMakesContents]}>Likes: {this.props.recipe_details.recipe_likes}</Text>
                    <Text style={[styles.detailsLikesAndMakesContents]}>Makes: {this.props.recipe_details.recipe_makes}</Text>
                  </View>
                  <View style={styles.detailsLikes}>
                    <Text style={[styles.detailsLikesAndMakesContents]}>Time: {this.props.recipe_details.recipe.time}</Text>
                    <Text style={[styles.detailsLikesAndMakesContents]}>Difficulty: {this.props.recipe_details.recipe.difficulty}</Text>
                  </View>
                </View>
                <View style={styles.detailsImageWrapper}>
                  {this.renderRecipeImages()}
                </View>
                <View style={styles.detailsIngredients}>
                  <Text style={styles.detailsSubHeadings}>Ingredients:</Text>
                  {this.renderRecipeIngredients()}
                </View>
                <View style={styles.detailsInstructions}>
                <Text style={styles.detailsSubHeadings}>Instructions:</Text>
                  <Text style={[styles.detailsContents]}>{this.props.recipe_details.recipe.instructions}</Text>
                </View>
                <View style={styles.detailsMakePicsContainer}>
                  <Text style={styles.detailsSubHeadings}>Images from other users:</Text>
                  <ScrollView horizontal="true" style={styles.makepicScrollView}>
                    {this.renderRecipeMakePics()}
                  </ScrollView>
                </View>
                <View style={[styles.detailsComments, {height: (130 + this.props.recipe_details.comments.length*85)}]}>
                  <Text style={styles.detailsSubHeadings}>Comments:</Text>
                  {this.renderRecipeComments()}
                </View>
              </ScrollView>
            </ImageBackground>
          </View>
        );
      } else {
        return <Text>Recipe Details</Text>
      }
    }
  }
)

