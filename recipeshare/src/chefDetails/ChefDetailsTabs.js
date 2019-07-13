import React from 'react';
import { View, ImageBackground } from 'react-native';
import RecipesList from '../recipeLists/RecipesList'
import ChefList from '../chefLists/ChefList'
import { styles } from '../../navigation/navigationStyleSheet'

export class ChefFeedScreen extends React.Component {
  render (){
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} >
          <RecipesList listChoice={"chef_feed"}
            parentNavigator={this.props.screenProps.parentNavigator}
            queryChefID={this.props.screenProps.queryChefID}/>
        </ImageBackground>
      </View>
    )
  }
}

export class MyRecipesScreen extends React.Component {
  render (){
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} >
          <RecipesList
            listChoice={"chef"}
            parentNavigator={this.props.screenProps.parentNavigator}
            queryChefID={this.props.screenProps.queryChefID}/>
        </ImageBackground>
      </View>
    )
  }
}

export class MyLikedRecipesScreen extends React.Component {
  render (){
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} >
          <RecipesList listChoice={"chef_liked"}
            parentNavigator={this.props.screenProps.parentNavigator}
            queryChefID={this.props.screenProps.queryChefID}/>
        </ImageBackground>
      </View>
    )
  }
}

export class MyMadeRecipesScreen extends React.Component {
  render (){
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} >
          <RecipesList listChoice={"chef_made"}
            parentNavigator={this.props.screenProps.parentNavigator}
            queryChefID={this.props.screenProps.queryChefID}/>
        </ImageBackground>
      </View>
    )
  }
}

export class ChefsFollowedScreen extends React.Component {
  render (){
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} >
          <ChefList listChoice={"chef_followees"}
            parentNavigator={this.props.screenProps.parentNavigator}
            queryChefID={this.props.screenProps.queryChefID}/>
        </ImageBackground>
      </View>
    )
  }
}

export class ChefsFollowingScreen extends React.Component {
  render (){
    // console.log(this.props.screenProps)
    return (
      <View style={styles.mainPageContainer}>
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} >
          <ChefList listChoice={"chef_followers"}
            parentNavigator={this.props.screenProps.parentNavigator}
            queryChefID={this.props.screenProps.queryChefID}/>
        </ImageBackground>
      </View>
    )
  }
}