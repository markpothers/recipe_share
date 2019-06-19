import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { Container, Tab, Tabs, ScrollableTab, Button } from 'native-base';
import RecipesList from '../src/recipeLists/RecipesList';
import ChefList from '../src/chefLists/ChefList';
import { connect } from 'react-redux'
import { styles } from '../src/generalStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NewRecipe from '../src/newRecipe/newRecipe';

const mapStateToProps = (state) => ({
      loggedInChef: state.loggedInChef
})

const mapDispatchToProps = {
  updateLoggedInChef: (id, username) => {
    return dispatch => {
      dispatch({ type: 'UPDATE_LOGGED_IN_CHEF', id: id, username: username})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class BrowseRecipes extends React.Component {
    static navigationOptions = ({ navigation }) => {
      return {
        title: 'Recipe-Share',
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
      };
    }

    componentDidMount = () => {
      this.props.navigation.setParams({newRecipe: this.navigateToNewRecipe})
    }

    navigateToNewRecipe = () => {
      this.props.navigation.navigate('NewRecipe')
    }

    navigateToRecipeDetails = (listChoice, recipeID) =>{
      // console.log("test")
      this.props.navigation.navigate('RecipeDetails', {listChoice: listChoice, recipeID: recipeID})
    }

    navigateToChefDetails = (listChoice, chefID) =>{
      this.props.navigation.navigate('ChefDetails', {listChoice: listChoice, chefID: chefID})
    }

    render() {
      // console.log(this.navigateToRecipeDetails)
      return (
        <Container style={styles.mainPageContainer}>
          <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
            <Tabs style={styles.scrollTabHeader} tabBarUnderlineStyle={styles.scrollUnderline} renderTabBar={()=> <ScrollableTab style={styles.scrollTabHeader}/>}>
              <Tab textStyle  ={styles.inactiveTabHeadingText} activeTextStyle={styles.activeTabHeadingText} tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyle} heading="Recipe Feed">
                <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
                  <RecipesList listChoice={"chef_feed"} navigation={this.navigateToRecipeDetails}/>
                </ImageBackground>
              </Tab>
              <Tab textStyle  ={styles.inactiveTabHeadingText} activeTextStyle={styles.activeTabHeadingText} tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyle} heading="Newest Recipes">
                <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
                  <RecipesList listChoice={"all"} navigation={this.navigateToRecipeDetails}/>
                </ImageBackground>
              </Tab>
              <Tab textStyle={styles.inactiveTabHeadingText} activeTextStyle={styles.activeTabHeadingText} tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyle} heading="Top Recipes">
                <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
                  <RecipesList listChoice={"global_ranks"} navigation={this.navigateToRecipeDetails}/>
                </ImageBackground>
              </Tab>
              <Tab textStyle={styles.inactiveTabHeadingText} activeTextStyle={styles.activeTabHeadingText} tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyle} heading="Newest Chefs">
                <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
                  <ChefList listChoice={"all_chefs"} navigation={this.navigateToChefDetails}/>
                </ImageBackground>
              </Tab>
              {/* <Tab textStyle={styles.inactiveTabHeadingText} activeTextStyle={styles.activeTabHeadingText} tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyle} heading="Top Chefs">
                <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
                  <ChefList listChoice={"global_ranks_chefs"} navigation={this.navigateToChefDetails}/>
                </ImageBackground>
              </Tab> */}
            </Tabs>
          </ImageBackground>
        </Container>
      );
    }

  }
)
