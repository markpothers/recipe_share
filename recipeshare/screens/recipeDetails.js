import React from 'react';
import { Container, Header, Text, Button } from 'native-base';
import {Image, ScrollView, StyleSheet, AsyncStorage, View, ImageBackground } from 'react-native';
import { connect } from 'react-redux'
import { databaseURL } from './functionalComponents/databaseURL'
import { styles } from './functionalComponents/RSStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const mapStateToProps = (state) => ({
  recipes_details: state.recipes_details,
  loggedInChef: state.loggedInChef
})

const mapDispatchToProps = {
    addRecipeLike: (like, listType) => {
      return dispatch => {
        dispatch({ type: 'ADD_RECIPE_LIKE', like: like, listType: listType})
    }
  },
    addRecipeMake: (make, listType) => {
      return dispatch => {
        dispatch({ type: 'ADD_RECIPE_MAKE', make: make, listType: listType})
    }
  },
  removeRecipeLikes: (remaining_likes, listType) => {
      return dispatch => {
        dispatch({ type: 'REMOVE_RECIPE_LIKES', recipe_likes: remaining_likes, listType: listType})
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
          opacity: 0.8
        },
        headerTintColor: '#fff59b',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: (
          <React.Fragment>
            {navigation.getParam('likeable') == false ? <Button rounded style={styles.newButton} onPress={navigation.getParam('unlikeRecipe')}><Icon name='heart' size={28} style={styles.newIcon}/></Button> : <Button rounded style={styles.newButton} onPress={navigation.getParam('likeRecipe')}><Icon name='heart-outline' size={28} style={styles.newIcon}/></Button> }
            {navigation.getParam('makeable') == false ? <Button rounded style={styles.newButton}><Icon name='food-off' size={28} style={styles.newIcon}/></Button> : <Button rounded style={styles.newButton} onPress={navigation.getParam('makeRecipe')}><Icon name='food' size={28} style={styles.newIcon}/></Button> }
            <Button rounded style={styles.newButton} onPress={navigation.getParam('deleteRecipe')}>
              <Icon name='delete-outline' size={28} style={styles.newIcon} />
            </Button>
          </React.Fragment>
        ),
      };
    }

    componentDidMount = () => {
      // this.props.navigation.setParams({
      //   likeRecipe: this.likeRecipe,
      //   makeRecipe: this.makeRecipe,
      //   unlikeRecipe: this.unlikeRecipe})
      this.checkLikeable()
      this.checkMakeable()
    }

    checkLikeable = () => {
      const likes = this.props.recipes_details[this.props.navigation.getParam('listChoice')].recipe_likes.filter(like => like.recipe_id == this.props.navigation.getParam('recipeID'))
      let myLike = null
      myLike = likes.find(like => like.chef_id == this.props.loggedInChef.id)
        if (myLike){
          this.props.navigation.setParams({
            likeable: false,
            likeRecipe: this.likeRecipe,
            makeRecipe: this.makeRecipe,
            unlikeRecipe: this.unlikeRecipe,
            deleteRecipe: this.deleteRecipe
          })
        } else {
          this.props.navigation.setParams({
            likeable: true,
            likeRecipe: this.likeRecipe,
            unlikeRecipe: this.unlikeRecipe,
            deleteRecipe: this.deleteRecipe
          })
        }
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
      // console.log(response)
      if (response == true){
        this.props.navigation.goBack()
      }
      // this.props.addRecipeLike(like, this.props.navigation.getParam('listChoice'))
      // this.checkLikeable()
    })
    }

    checkMakeable = () => {
      const makes = this.props.recipes_details[this.props.navigation.getParam('listChoice')].recipe_makes.filter(make => make.recipe_id == this.props.navigation.getParam('recipeID'))
      let mymake = null
      mymake = makes.find(make => make.chef_id == this.props.loggedInChef.id)
      // console.log(mymake)
        if (mymake){
          // console.log("mymake was true")
          this.props.navigation.setParams({
            makeable: false,
            makeRecipe: this.makeRecipe,
          })
        } else {
          // console.log("mymake was false")
          this.props.navigation.setParams({
            makeable: true,
            makeRecipe: this.makeRecipe,
          })
        }
    }

    renderRecipe = (listChoice, recipeID) => {
      const recipe = this.props.recipes_details[listChoice].recipes.find(recipe => recipe.id == recipeID)
      return <Text style={[styles.detailsHeaderTextBox]}>{recipe.name}</Text>
    }

    renderRecipeImages = (listChoice, recipeID) => {
      const recipe = this.props.recipes_details[listChoice].recipe_images.find(recipe => recipe.recipe_id == recipeID)
      if (recipe != undefined){
        return <Image style={[{width: '100%', height: 250}, styles.detailsImage]} source={{uri: `${databaseURL}${recipe.imageURL}`}}></Image>
      } else {
        return <Image style={[{width: '100%', height: 250}, styles.detailsImage]} source={require("./components/peas.jpg")}></Image>
      }
    }

    renderRecipeIngredients = (listChoice, recipeID) => {
      const ingredient_uses = this.props.recipes_details[listChoice].ingredient_uses.filter(ingredient_use => ingredient_use.recipe_id == recipeID)
      const list_values = ingredient_uses.map(ingredient_use => [ingredient_use.ingredient_id, ingredient_use.quantity, ingredient_use.unit])
      const ingredients = list_values.map(list_value => [...list_value, (this.props.recipes_details[listChoice].ingredients.find(ingredient => ingredient.id == list_value[0]).name)])
      return ingredients.map(ingredient => (
            <View style={styles.ingredientsTable} key={ingredient[0]}>
               <Text style={[styles.detailsContents, styles.ingredientName]}>{ingredient[3]}</Text>
               <Text style={[styles.detailsContents, styles.ingredientQuantity]}>{ingredient[1]}</Text>
               <Text style={[styles.detailsContents, styles.ingredientUnit]}>{ingredient[2]}</Text>
            </View>
            ))
    }

    renderRecipeInstructions = (listChoice, recipeID) => {
      const recipe = this.props.recipes_details[listChoice].recipes.find(recipe => recipe.id == recipeID)
      return <Text style={[styles.detailsContents]}>{recipe.instructions}</Text>
    }

    renderRecipeLikes = (listChoice, recipeID) => {
      const likes = this.props.recipes_details[listChoice].recipe_likes.filter(like => like.recipe_id == recipeID)
      return <Text style={[styles.detailsLikesAndMakesContents]}>Likes: {likes.length}</Text>
    }

    renderRecipeMakes = (listChoice, recipeID) => {
      const makes = this.props.recipes_details[listChoice].recipe_makes.filter(make => make.recipe_id == recipeID)
      return <Text style={[styles.detailsLikesAndMakesContents]}>Makes: {makes.length}</Text>
    }

    renderRecipeMakePics = (listChoice, recipeID) => {
      const make_pics = this.props.recipes_details[listChoice].make_pics.filter(make_pic => make_pic.recipe_id == recipeID)
      return make_pics.map(make_pic => {
        return (
          <React.Fragment key={make_pic.id}>
            <Image style={{width: 115, height: 115}} source={{uri: `${databaseURL}${make_pic.imageURL}`}}></Image>
          </React.Fragment>
        )
      })
    }

    renderRecipeComments = (listChoice, recipeID) => {
      const comments = this.props.recipes_details[listChoice].comments.filter(comment => comment.recipe_id == recipeID)
      return comments.map(comment => {
        return (
          <React.Fragment key={comment.id}>
            <Text style={[styles.detailsContents]}>Comment:</Text>
            <Text style={[styles.detailsContents]}>{comment.comment}</Text>
          </React.Fragment>
        )
      })
    }

    likeRecipe = () => {
            fetch(`${databaseURL}/recipe_likes`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${this.props.loggedInChef.auth_token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  recipe: {
                    recipe_id: this.props.navigation.getParam('recipeID'),
                    chef_id: this.props.loggedInChef.id,
                  }
                })
            })
            .then(res => res.json())
            .then(like => {
              // console.log(like)
              this.props.addRecipeLike(like, this.props.navigation.getParam('listChoice'))
              this.checkLikeable()
            })
    }

    unlikeRecipe = () => {
            fetch(`${databaseURL}/recipe_likes`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${this.props.loggedInChef.auth_token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  recipe: {
                    recipe_id: this.props.navigation.getParam('recipeID'),
                    chef_id: this.props.loggedInChef.id,
                  }
                })
            })
            .then(res => res.json())
            .then(unlikes => {
              const remaining_likes = this.props.recipes_details[this.props.navigation.getParam('listChoice')].recipe_likes.filter(like => like.id != unlikes[0])
              this.props.removeRecipeLikes(remaining_likes, this.props.navigation.getParam('listChoice'))
              this.checkLikeable()
            })
    }

    makeRecipe = () => {
            fetch(`${databaseURL}/recipe_makes`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${this.props.loggedInChef.auth_token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  recipe: {
                    recipe_id: this.props.navigation.getParam('recipeID'),
                    chef_id: this.props.loggedInChef.id,
                  }
                })
            })
            .then(res => res.json())
            .then(make => {
              // console.log(make)
                this.props.addRecipeMake(make, this.props.navigation.getParam('listChoice'))
                this.checkMakeable()
            })
    }

    render() {
      // console.log(this.props.navigation)
      const { navigation } = this.props;
      const listChoice = navigation.getParam('listChoice')
      const recipeID = navigation.getParam('recipeID')
      // console.log(listChoice)
      // console.log(recipeID)
      return (
        <View style={{flex:1}}>
          <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
            <View style={styles.detailsHeader}>
              {this.renderRecipe(listChoice, recipeID)}
            </View>
            <ScrollView contentContainerStyle={{flexGrow:1}}>
              <View style={styles.detailsLikesAndMakes}>
                <View style={styles.detailsLikes}>
                  {this.renderRecipeLikes(listChoice, recipeID)}
                </View>
                <View style={styles.detailsLikes}>
                  {this.renderRecipeMakes(listChoice, recipeID)}
                </View>
              </View>
              <View style={styles.detailsImageWrapper}>
                {this.renderRecipeImages(listChoice, recipeID)}
              </View>
              <View style={styles.detailsIngredients}>
                <Text style={styles.detailsSubHeadings}>Ingredients:</Text>
                {this.renderRecipeIngredients(listChoice, recipeID)}
              </View>
              {/* <View style={styles.detailsInstructions}>
              <Text style={styles.detailsSubHeadings}>Liked:</Text>
                {this.renderILikeThis(listChoice, recipeID)}
              </View> */}
              <View style={styles.detailsInstructions}>
              <Text style={styles.detailsSubHeadings}>Instructions:</Text>
                {this.renderRecipeInstructions(listChoice, recipeID)}
              </View>
              {/* <View style={styles.detailsMakePics}>
                {this.renderRecipeMakePics(listChoice, recipeID)}
              </View> */}
              {/* <View style={styles.detailsComments}>
              <Text style={styles.detailsSubHeadings}>Comments:</Text>
                {this.renderRecipeComments(listChoice, recipeID)}
              </View> */}
            </ScrollView>
          </ImageBackground>
        </View>
      );
    }
  }
)

