import React from 'react';
import { StyleSheet, View } from 'react-native';
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
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: (
          <Button rounded style={styles.standardButton} onPress={navigation.getParam('newRecipe')}>
            <Icon name='plus-circle-outline' size={25}/>
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


    render() {
      return (
        <View style={styles.container}>
          <Container>
            <Tabs renderTabBar={()=> <ScrollableTab />}>
              <Tab heading="My Recipes">
                <RecipesList listChoice={"chef"}  navigation={this.props.navigation}/>
              </Tab>
              <Tab heading="My Liked Recipes">
                <RecipesList listChoice={"chef_liked"}  navigation={this.props.navigation}/>
              </Tab>
              <Tab heading="My Made Recipes">
                <RecipesList listChoice={"chef_made"}  navigation={this.props.navigation}/>
              </Tab>
              {/* <Tab heading="New Recipe">
                <NewRecipe/>
              </Tab> */}
              {/* <Tab heading="Chef Details">
                <ChefDetails />
              </Tab> */}
            </Tabs>
          </Container>
            {/* <Button title="Go to Details" onPress={() => this.props.navigation.navigate('NewRecipe')}><Icon name='radio'/></Button> */}
        </View>
      );
    }

  }
)
