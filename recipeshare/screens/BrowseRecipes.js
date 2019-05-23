import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Tab, Tabs, ScrollableTab, Button } from 'native-base';
import RecipesList from './components/RecipesList';
import { connect } from 'react-redux'
import { styles } from './functionalComponents/RSStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NewRecipe from './tabs/newRecipe';

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
        title: 'Browse recipes',
        // headerStyle: {    //styles possibly needed if app-wide styling doesn't work
        //   backgroundColor: '#f4511e',
        // },
        // headerTintColor: '#fff',
        // headerTitleStyle: {
        //   fontWeight: 'bold',
        // },
        headerRight: (
          <Button rounded style={styles.standardButton} onPress={navigation.getParam('newRecipe')}>
            <Icon name='plus-circle-outline' size={25}/>
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

    // navigateToRecipeDetails


    render() {
      // console.log(this.props.navigation)
      return (
        <View style={styles.container}>
          {/* <NewRecipe/> */}

          <Container>
            <Tabs renderTabBar={()=> <ScrollableTab />}>
              <Tab heading="New Recipe">
              </Tab>
              <Tab heading="All Recipes">
                <RecipesList listChoice={"all"} navigation={this.props.navigation}/>
              </Tab>
              <Tab heading="Top Recipes">
                <RecipesList listChoice={"global_ranks"} navigation={this.props.navigation}/>
              </Tab>
              <Tab heading="Chef's Recipes">
                <RecipesList listChoice={"chef"} />
              </Tab>
            </Tabs>
          </Container>
        </View>
      );
    }

  }
)
