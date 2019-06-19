import React from 'react';
import { Platform, Button, Text, Dimensions } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator } from 'react-navigation';
import BrowseRecipesStack from './BrowseRecipesNavigator'
import { styles } from './navigationStyleSheet'

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
        // overflow: 'hidden',
        borderStyle: 'solid',
        borderWidth: 2,
      },
      headerTintColor: '#fff59b',  // move these settings to the BrowseRecipesHeader to give it the right colors
      headerTitleStyle: {
        fontSize: 24,
        fontWeight: 'normal',
        color: '#fff59b'
      },
      //headerRight: (
        // <React.Fragment>
          // {/* {navigation.getParam('likeable') == false ? <Button rounded style={styles.newButton} onPress={navigation.getParam('unlikeRecipe')}><Icon name='heart' size={28} style={styles.newIcon}/></Button> : <Button rounded style={styles.newButton} onPress={navigation.getParam('likeRecipe')}><Icon name='heart-outline' size={28} style={styles.newIcon}/></Button> } */}
          // {/* {navigation.getParam('makeable') == false ? <Button rounded style={styles.newButton}><Icon name='food-off' size={28} style={styles.newIcon}/></Button> : <Button rounded style={styles.newButton} onPress={navigation.getParam('makeRecipe')}><Icon name='food' size={28} style={styles.newIcon}/></Button> } */}
          // {/* <Button rounded style={styles.newButton} onPress={navigation.getParam('editRecipe')}>
          //   <Icon2 name='edit' size={28} style={styles.newIcon} />
          // </Button> */}
          // {/* <Button rounded style={styles.newButton} onPress={navigation.getParam('deleteRecipe')}>
          //   <Icon name='delete-outline' size={28} style={styles.newIcon} />
          // </Button> */}
        // </React.Fragment>
      // ),
    }}

    state = {
      headerHeight: 60
    }

    componentWillMount = () => {
      this.props.navigation.setParams({headerHeight: this.state.headerHeight});
      // this.props.navigation.setParams({headerY: this.state.headerY})
      // this.props.navigation.setParams({headerHeight: this.state.headerHeight.interpolate({
      //   inputRange: [0, 1],
      //   outputRange: [80, 0],
      //   extrapolate: 'clamp'
      // })})
    }

    componentDidMount = () => {
      // Animated.event( this.props.navigation.setParams({headerHeight: this.state.headerHeight.interpolate({
      //   inputRange: [0, 1],
      //   outputRange: [80, 0],
      //   extrapolate: 'clamp'
      // })}))
    }

    respondToListScroll = (e) => {
      console.log("cover saw the scroll")
      // Animated.event(this.props.navigation.setParams({headerHeight: e.nativeEvent.contentOffset.y}))
      // Animated.event([{nativeEvent: {contentOffset: {y: e.nativeEvent.contentOffset.y}}}])
    }

  render () {
    // console.log(BrowseRecipesCover.router)
    return (
    <BrowseRecipesStack navigation={this.props.navigation} screenProps={this.respondToListScroll} />
    )
  }
}

export default BrowseRecipesCoverStack = createStackNavigator({
  BrowseRecipes: BrowseRecipesCover
})

