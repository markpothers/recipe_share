import React from 'react';
import { Animated, Platform, Button, Text, Dimensions } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BrowseRecipesScreen from '../screens/BrowseRecipes';
import MyRecipeBookScreen from '../screens/MyRecipeBook';
import ProfileScreen from '../screens/ProfileScreen';
import RecipeDetailsScreen from '../screens/recipeDetails'
import ChefDetailsScreen from '../screens/chefDetails'
import NewRecipeScreen from '../screens/tabs/newRecipe'
import { ChefFeedScreen, NewestRecipesScreen, MostLikedRecipesScreen, MostMadeRecipesScreen, NewestChefsScreen, MostLikedChefsScreen, MostMadeChefsScreen} from './BrowseRecipesTabs'
import { styles } from '../screens/functionalComponents/RSStyleSheet'
import BrowseRecipesHeader from '../screens/functionalComponents/BrowseRecipesHeader'
import BrowseRecipesStack from './BrowseRecipesNavigator'

class BrowseRecipesCover extends React.Component {
  static router = BrowseRecipesStack.router
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <BrowseRecipesHeader/>,
      headerStyle: {
        backgroundColor: '#104e01',
        marginTop: 0, // -25 to hide entirely
        height: navigation.getParam('headerY'),
        overflow: 'hidden'
      },
      // headerTintColor: '#fff59b',  // move these settings to the BrowseRecipesHeader to give it the right colors
      // headerTitleStyle: {
      //   fontWeight: 'bold',
      // },
      // headerRight: (
      //   <React.Fragment>
      //     {/* {navigation.getParam('likeable') == false ? <Button rounded style={styles.newButton} onPress={navigation.getParam('unlikeRecipe')}><Icon name='heart' size={28} style={styles.newIcon}/></Button> : <Button rounded style={styles.newButton} onPress={navigation.getParam('likeRecipe')}><Icon name='heart-outline' size={28} style={styles.newIcon}/></Button> } */}
      //     {/* {navigation.getParam('makeable') == false ? <Button rounded style={styles.newButton}><Icon name='food-off' size={28} style={styles.newIcon}/></Button> : <Button rounded style={styles.newButton} onPress={navigation.getParam('makeRecipe')}><Icon name='food' size={28} style={styles.newIcon}/></Button> } */}
      //     {/* <Button rounded style={styles.newButton} onPress={navigation.getParam('editRecipe')}>
      //       <Icon2 name='edit' size={28} style={styles.newIcon} />
      //     </Button> */}
      //     {/* <Button rounded style={styles.newButton} onPress={navigation.getParam('deleteRecipe')}>
      //       <Icon name='delete-outline' size={28} style={styles.newIcon} />
      //     </Button> */}
      //   </React.Fragment>
      // ),
    }}

    state = {
      headerY: new Animated.Value(0)
    }

    componentWillMount = () => {
      // this.props.navigation.setParams({headerY: this.state.headerY})
      this.props.navigation.setParams({headerY: this.state.headerY.interpolate({
        inputRange: [0, 100],
        outputRange: [50, -50],
        extrapolate: 'clamp'
      })})
    }

    respondToListScroll = () => {
      console.log("I saw the scroll")
      Animated.event([{nativeEvent: {contentOffset: {y: this.state.headerY}}}]) 
    }

  render () {
    // console.log(this.props)
    return (
    <BrowseRecipesStack navigation={this.props.navigation} screenProps={this.respondToListScroll} />
    )
  }
}

export default BrowseRecipesCoverStack = createStackNavigator({
  BrowseRecipes: BrowseRecipesCover
})

