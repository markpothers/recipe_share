import React from 'react';
import { Container, Header, Tab, Tabs, ScrollableTab, Text, Button, Icon  } from 'native-base';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import RecipesList from './components/RecipesList';
// import MyRecipes from './tabs/myRecipes';
// import MyLikedRecipes from './tabs/myLikedRecipes';
// import MyMadeRecipes from './tabs/myMadeRecipes';
// import TopRecipes from './tabs/topRecipes';
import NewRecipe from './tabs/newRecipe'
import CreateChef from './tabs/createChef'
import Login from './tabs/login'
import RecipeDetails from './tabs/recipeDetails'
import ChefDetails from './tabs/chefDetails'

// import { connect } from 'react-redux'

// const mapStateToProps = (state) => ({
//       recipes: state.recipes
// })

// const mapDispatchToProps = {
//   fetchAllRecipes: () => {
//       return dispatch => {
//           fetch('http://10.185.4.207:3000')
//           .then(res => res.json())
//           .then(recipes => {
//               dispatch({ type: 'STORE_ALL_RECIPES', recipes: recipes})
//           })
//       }
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(
  export default class RecipeShareTabs extends React.Component {

    componentDidMount = () => {
      // this.props.fetchAllRecipes()
    }

    render() {
      return (
        <Container>
          <Header>
              <Text>Recipe Share</Text>
          </Header>
          <Tabs renderTabBar={()=> <ScrollableTab />}>
          <Tab heading="All Recipes">
              <RecipesList listChoice={"all"}/>
            </Tab>

          <Tab heading="Recipe Details">
                <RecipeDetails listChoice={"all"} recipeID={483}/>
              </Tab>
              <Tab heading="Chef Details">
                <ChefDetails />
              </Tab>
             <Tab heading="Login">
                <Login />
              </Tab>
              
                          <Tab heading="Create Chef">
                <CreateChef />
              </Tab>

          


            <Tab heading="My Recipes">
              <RecipesList listChoice={"chef"} />
            </Tab>
            <Tab heading="My Liked Recipes">
              <RecipesList listChoice={"chef_liked"} />
            </Tab>
            <Tab heading="My Made Recipes">
              <RecipesList listChoice={"chef_made"} />
            </Tab>
            <Tab heading="Chef's Recipes">
              <RecipesList listChoice={"chef"} />
            </Tab>
            <Tab heading="Top Recipes">
              <RecipesList listChoice={"global_ranks"} />
            </Tab>

            <Tab heading="New Recipes">
              <NewRecipe />
            </Tab>


          </Tabs>
        </Container>
      );
    }
  }
// )
