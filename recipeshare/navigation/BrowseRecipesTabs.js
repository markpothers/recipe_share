import React from 'react';
import { Platform, Text, View, ImageBackground, Button } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BrowseRecipesScreen from '../screens/BrowseRecipes';
import MyRecipeBookScreen from '../screens/MyRecipeBook';
import ProfileScreen from '../screens/ProfileScreen';
import RecipeDetailsScreen from '../screens/recipeDetails'
import ChefDetailsScreen from '../screens/chefDetails'
import NewRecipeScreen from '../screens/tabs/newRecipe'
import { styles } from '../screens/functionalComponents/RSStyleSheet'
import RecipesList from '../screens/components/RecipesList'
import ChefList from '../screens/components/ChefList'

export class ChefFeedScreen extends React.Component {
  render (){
    // console.log(this.props.screenProps())
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
          <RecipesList listChoice={"chef_feed"} />
        </ImageBackground>
      </View>
    )
  }
}

export class NewestRecipesScreen extends React.Component {
  render (){
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
          <RecipesList listChoice={"all"}/>
        </ImageBackground>
      </View>
    )
  }
}

export class MostLikedRecipesScreen extends React.Component {
  render (){
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
          <RecipesList listChoice={"most_liked"}/>
        </ImageBackground>
      </View>
    )
  }
}

export class MostMadeRecipesScreen extends React.Component {
  render (){
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
          <RecipesList listChoice={"most_made"}/>
        </ImageBackground>
      </View>
    )
  }
}

export class NewestChefsScreen extends React.Component {
  render (){
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
          <ChefList listChoice={"all_chefs"}/>
        </ImageBackground>
      </View>
    )
  }
}

export class MostLikedChefsScreen extends React.Component {
  render (){
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
          <ChefList listChoice={"most_liked_chefs"}/>
        </ImageBackground>
      </View>
    )
  }
}

export class MostMadeChefsScreen extends React.Component {
  render (){
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
          <ChefList listChoice={"most_made_chefs"}/>
        </ImageBackground>
      </View>
    )
  }
}