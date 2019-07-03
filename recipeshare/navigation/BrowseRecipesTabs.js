import React from 'react';
import { Platform, Text, View, ImageBackground, Button } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ChefDetailsScreen from '../src/chefDetails/chefDetails'
import NewRecipeScreen from '../src/newRecipe/newRecipe'
import { styles } from './navigationStyleSheet'
import RecipesList from '../src/recipeLists/RecipesList'
import ChefList from '../src/chefLists/ChefList'

export class ChefFeedScreen extends React.Component {
  render (){
    // console.log(this.props.screenProps)
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} >
          <RecipesList listChoice={"chef_feed"} respondToListScroll={this.props.screenProps}/>
        </ImageBackground>
      </View>
    )
  }
}

export class NewestRecipesScreen extends React.Component {
  render (){
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} >
          <RecipesList listChoice={"all"} respondToListScroll={this.props.screenProps}/>
        </ImageBackground>
      </View>
    )
  }
}

export class MostLikedRecipesScreen extends React.Component {
  render (){
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} >
          <RecipesList listChoice={"most_liked"} respondToListScroll={this.props.screenProps}/>
        </ImageBackground>
      </View>
    )
  }
}

export class MostMadeRecipesScreen extends React.Component {
  render (){
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} >
          <RecipesList listChoice={"most_made"} respondToListScroll={this.props.screenProps}/>
        </ImageBackground>
      </View>
    )
  }
}

export class NewestChefsScreen extends React.Component {
  render (){
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} >
          <ChefList listChoice={"all_chefs"} respondToListScroll={this.props.screenProps}/>
        </ImageBackground>
      </View>
    )
  }
}

export class MostLikedChefsScreen extends React.Component {
  render (){
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} >
          <ChefList listChoice={"most_liked_chefs"} respondToListScroll={this.props.screenProps}/>
        </ImageBackground>
      </View>
    )
  }
}

export class MostMadeChefsScreen extends React.Component {
  render (){
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} >
          <ChefList listChoice={"most_made_chefs"} respondToListScroll={this.props.screenProps}/>
        </ImageBackground>
      </View>
    )
  }
}