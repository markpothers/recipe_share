import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { Container, Button, Tab, Tabs, ScrollableTab } from 'native-base';
import RecipesList from './components/RecipesList';
import { connect } from 'react-redux'
import { styles } from './functionalComponents/RSStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


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
  class MyRecipeBook extends React.Component {
    static navigationOptions = ({ navigation }) => {
      return {
        title: 'My recipe book',
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
      }
    };

    componentDidMount = () => {
      this.props.navigation.setParams({newRecipe: this.navigateToNewRecipe})
    }

    navigateToNewRecipe = () => {
      this.props.navigation.navigate('NewRecipe')
    }

    navigateToRecipeDetails = (listChoice, recipeID) =>{
      this.props.navigation.navigate('RecipeDetails', {listChoice: listChoice, recipeID: recipeID})
    }

    render() {
      return (
        // <View style={styles.container}>
        //   <Container>
        //     <Tabs renderTabBar={()=> <ScrollableTab />}>
        //       <Tab heading="My Recipes">
        //         <RecipesList listChoice={"chef"}  navigation={this.navigateToRecipeDetails}/>
        //       </Tab>
        //       <Tab heading="My Liked Recipes">
        //         <RecipesList listChoice={"chef_liked"}  navigation={this.navigateToRecipeDetails}/>
        //       </Tab>
        //       <Tab heading="My Made Recipes">
        //         <RecipesList listChoice={"chef_made"}  navigation={this.navigateToRecipeDetails}/>
        //       </Tab>
        //       <Tab heading="New Recipe">
        //         <NewRecipe/>
        //       </Tab>
        //       <Tab heading="Chef Details">
        //         <ChefDetails />
        //       </Tab>
        //     </Tabs>
        //   </Container>
        //     <Button title="Go to Details" onPress={() => this.props.navigation.navigate('NewRecipe')}><Icon name='radio'/></Button>
        // </View>

        <View >
        <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
          <Tabs style={styles.scrollTabHeader} tabBarUnderlineStyle={styles.scrollUnderline} renderTabBar={()=> <ScrollableTab style={styles.scrollTabHeader}/>}>
            <Tab textStyle={styles.inactiveTabHeadingText} activeTextStyle={styles.activeTabHeadingText} tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyle} heading="My Recipes">
              <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
                    <RecipesList listChoice={"chef"}  navigation={this.navigateToRecipeDetails}/>
              </ImageBackground>
            </Tab>
            <Tab textStyle={styles.inactiveTabHeadingText} activeTextStyle={styles.activeTabHeadingText} tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyle} heading="My Liked Recipes">
              <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
                <RecipesList listChoice={"chef_liked"}  navigation={this.navigateToRecipeDetails}/>
              </ImageBackground>
            </Tab>
            {/* <Tab textStyle={styles.inactiveTabHeadingText} activeTextStyle={styles.activeTabHeadingText} tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyle} heading="My Made Recipes">
              <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
                <RecipesList listChoice={"chef_made"}  navigation={this.navigateToRecipeDetails}/>
              </ImageBackground>
            </Tab> */}
          </Tabs>
        </ImageBackground>
        </View>
      );
    }

  }
)
