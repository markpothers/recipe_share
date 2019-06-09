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
      headerTitle: "Cover Page", //<BrowseRecipesHeader/>,
      headerStyle: {
        backgroundColor: '#104e01',
        borderTop: 'solid',
        borderTopWidth: 24,
        borderColor: '#fff59b',
        // marginTop: 24, // -25 to hide entirely
        height: navigation.getParam('headerHeight'),
        overflow: 'hidden',
        
      },
    }}
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
    // }}

    state = {
      headerHeight: new Animated.Value(0)
    }

    componentWillMount = () => {
      const HEADER_MAX_HEIGHT = 60
      const HEADER_MIN_HEIGHT = 0
      const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

      this.props.navigation.setParams({headerHeight: this.state.headerHeight.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp'
      })
      });
    }

    componentWillMount = () => {
      // this.props.navigation.setParams({headerY: this.state.headerY})
      this.props.navigation.setParams({headerHeight: this.state.headerHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [80, 0],
        extrapolate: 'clamp'
      })})
    }

    componentDidMount = () => {
      Animated.event( this.props.navigation.setParams({headerHeight: this.state.headerHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [80, 0],
        extrapolate: 'clamp'
      })}))
    }

    respondToListScroll = (e) => {
      console.log(e)
      // Animated.event(this.props.navigation.setParams({headerHeight: e.nativeEvent.contentOffset.y}))
      // Animated.event([{nativeEvent: {contentOffset: {y: e.nativeEvent.contentOffset.y}}}])
    }

  render () {
    console.log(this.state.headerHeight)
    return (
    <BrowseRecipesStack navigation={this.props.navigation} screenProps={this.respondToListScroll} />
    )
  }
}

export default BrowseRecipesCoverStack = createStackNavigator({
  BrowseRecipes: BrowseRecipesCover
})

