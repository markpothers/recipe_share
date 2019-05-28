import React from 'react';
import { Container, Header, Text, Button, Tab, Tabs, ScrollableTab } from 'native-base';
import {Image, ScrollView, StyleSheet, AsyncStorage, View, ImageBackground } from 'react-native';
import { connect } from 'react-redux'
import { databaseURL } from './functionalComponents/databaseURL'
import { styles } from './functionalComponents/RSStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RecipesList from './components/RecipesList';


const mapStateToProps = (state) => ({
  all_chefs: state.chefs.all_chefs,
  followed_chefs: state.chefs.followed,
  global_ranks_chefs: state.chefs.global_ranks_chefs,
  loggedInChef: state.loggedInChef,
  chefs_details: state.chefs_details,
  global_ranking: state.global_ranking,
  chef_followees: state.chefs.chef_followees,
  chef_followers: state.chefs.chef_followers
})

const mapDispatchToProps = {
  //   addRecipeLike: (like, listType) => {
  //     return dispatch => {
  //       dispatch({ type: 'ADD_RECIPE_LIKE', like: like, listType: listType})
  //   }
  // },
  //   addRecipeMake: (make, listType) => {
  //     return dispatch => {
  //       dispatch({ type: 'ADD_RECIPE_MAKE', make: make, listType: listType})
  //   }
  // }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class ChefDetails extends React.Component {
    static navigationOptions = ({ navigation }) => {
      return {
        title: 'Chef details',
        headerStyle: {    //styles possibly needed if app-wide styling doesn't work
          backgroundColor: '#104e01',
          opacity: 0.8
        },
        headerTintColor: '#fff59b',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: (
            <Button rounded style={styles.newButton} onPress={navigation.getParam('followChef')}>
              <Icon name='account-plus' size={28} style={styles.newIcon} />
            </Button>
        ),
      };
      
    }

    componentDidMount = () => {
      this.props.navigation.setParams({followChef: this.followChef})
    }

    renderChefName = (listChoice, chefID) => {
      const chef = this.props[listChoice].find(chef => chef.id == chefID)
      return <Text style={[styles.detailsHeaderTextBox]}>{chef.username}</Text>
    }

    renderChefImage = (listChoice, chefID) => {
      const chef = this.props[listChoice].find(chef => chef.id == chefID)
      if (chef != undefined){
        if (chef.imageURL != null) {
          if (chef.imageURL.startsWith("http")) {
            return <Image style={[{width: '50%', height: 100}, styles.detailsImage]} source={{uri: chef.imageURL}}></Image>
          } else {
            return <Image style={[{width: '50%', height: 100}, styles.detailsImage]} source={{uri: `${databaseURL}${chef.imageURL}`}}></Image>
          }
        } else {
          return <Image style={[{width: '50%', height: 100}, styles.detailsImage]} source={require("./components/peas.jpg")}></Image>
        }
      }
    }

    renderChefListItem = (item) => {
      let imageURL = null
      if (chef.imageURL != null) {
        if (item.item.imageURL.startsWith("http")) {
          imageURL = { uri: item.item.imageURL }
        } else {
          imageURL = { uri: `${databaseURL}${item.item.imageURL}` }
        }
      }
      // console.log(item)
        return <ChefCard listChoice={this.props["listChoice"]} key={item.index.toString()} {...item} imageURL={imageURL} navigation={this.props.navigation}/>
    }






    renderChefIngredients = (listChoice, recipeID) => {
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

    navigateToRecipeDetails = (listChoice, recipeID) =>{
      this.props.navigation.navigate('RecipeDetails', {listChoice: listChoice, recipeID: recipeID})
    }

    followChef = () => {
      AsyncStorage.getItem('chef', (err, res) => {
        const loggedInChef = JSON.parse(res)
            fetch(`${databaseURL}/follows`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${loggedInChef.auth_token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  follow: {
                    follower_id: loggedInChef.id,
                    followee_id: this.props.navigation.getParam('chefID'),
                  }
                })
            })
            .then(res => res.json())
            .then(follow => {
              console.log(follow)
                // this.props.addRecipeLike(follow, this.props.navigation.getParam('listChoice'))
            })
          })
    }

    // makeRecipe = () => {
    //   AsyncStorage.getItem('chef', (err, res) => {
    //     const loggedInChef = JSON.parse(res)
    //         fetch(`${databaseURL}/recipe_makes`, {
    //             method: "POST",
    //             headers: {
    //               Authorization: `Bearer ${loggedInChef.auth_token}`,
    //               'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //               recipe: {
    //                 recipe_id: this.props.navigation.getParam('recipeID'),
    //                 chef_id: loggedInChef.id,
    //               }
    //             })
    //         })
    //         .then(res => res.json())
    //         .then(make => {
    //           // console.log(make)
    //             this.props.addRecipeMake(make, this.props.navigation.getParam('listChoice'))
    //         })
    //       })
    // }

    render() {
      // console.log(this.props)
      const { navigation } = this.props;
      const listChoice = navigation.getParam('listChoice')
      const chefID = navigation.getParam('chefID')
      console.log(listChoice)
      console.log(chefID)
      return (
        <View style={{flex:1}}>
          <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
            <View style={styles.detailsHeader}>
              {this.renderChefName(listChoice, chefID)}
            </View>
            <ScrollView contentContainerStyle={{flexGrow:1}}>
              <View style={styles.detailsLikesAndMakes}>
                {/* <View style={styles.detailsLikes}>
                  {this.renderRecipeLikes(listChoice, recipeID)}
                </View> */}
                {/* <View style={styles.detailsLikes}>
                  {this.renderRecipeMakes(listChoice, recipeID)}
                </View> */}
              </View>
              <View style={styles.detailsImageWrapper}>
                {this.renderChefImage(listChoice, chefID)}
              </View>
              <Tabs style={styles.scrollTabHeader} tabBarUnderlineStyle={styles.scrollUnderline}>
                <Tab textStyle={styles.inactiveTabHeadingText} activeTextStyle={styles.inactiveTabHeadingText} tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyle} heading="My Recipes">
                  <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
                    <RecipesList listChoice={"chef"} chef_id={chefID} navigation={this.navigateToRecipeDetails}/>
                  </ImageBackground>
                </Tab>
              </Tabs>
              {/* <View style={styles.detailsIngredients}>
                <Text style={styles.detailsSubHeadings}>Ingredients:</Text>
                {this.renderRecipeIngredients(listChoice, recipeID)}
              </View> */}
              {/* <View style={styles.detailsInstructions}>
              <Text style={styles.detailsSubHeadings}>Instructions:</Text>
                {this.renderRecipeInstructions(listChoice, recipeID)}
              </View> */}
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

