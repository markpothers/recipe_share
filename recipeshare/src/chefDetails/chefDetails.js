import React from 'react';
import { Image, ScrollView, View, ImageBackground } from 'react-native';
import { connect } from 'react-redux'
import { databaseURL } from '../dataComponents/databaseURL'
import { styles } from './chefDetailsStyleSheet'
import { getChefDetails } from '../fetches/getChefDetails'
import AppHeader from '../../navigation/appHeader'
import ChefDetailsCard from './ChefDetailsCard'
import { MyRecipeBookTabsContainer } from './ChefDetailsNavigators'
import { postFollow } from '../fetches/postFollow'
import { destroyFollow } from '../fetches/destroyFollow'

const mapStateToProps = (state) => ({
  loggedInChef: state.loggedInChef,
  chefs_details: state.chefs_details,
})

const mapDispatchToProps = {
  storeChefDetails: (chef_details) => {
    return dispatch => {
      dispatch({ type: 'STORE_CHEF_DETAILS', chefID: `chef${chef_details.chef.id}`, chef_details: chef_details})
    }
  },
  storeNewFollowers: (followee_id, followers) => {
    return dispatch => {
      dispatch({ type: 'STORE_NEW_FOLLOWERS', chefID: `chef${followee_id}`, followers: followers})
    }
  },
  // clearChefDetails: () => {
  //   return dispatch => {
  //     dispatch({type: 'CLEAR_CHEF_DETAILS'})
  //   }
  // }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class ChefDetails extends React.Component {
    static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: <AppHeader text={"Chef Details"} />,
      }
    }

    componentDidMount = () => {
      this.fetchChefDetails()
    }

    componentWillUnmount = () => {
      // console.log("unmounting")
      // this.props.clearChefDetails()
    }

    fetchChefDetails = async() => {
      const chef_details = await getChefDetails(this.props.navigation.getParam('chefID'), this.props.loggedInChef.auth_token)
      if (chef_details) {
        this.props.storeChefDetails(chef_details)
      }
    }

    renderChefImage = () => {
      const chef = this.props.chefs_details[`chef${this.props.navigation.getParam('chefID')}`]
      if (chef != undefined){
        if (chef.imageURL != null) {
          if (chef.imageURL.startsWith("http")) {
            return <Image style={{width: '100%', height: '100%'}} source={{uri: chef.imageURL}}></Image>
          } else {
            return <Image style={{width: '100%', height: '100%'}} source={{uri: `${databaseURL}${chef.imageURL}`}}></Image>
          }
        } else {
          return <Image style={{width: '100%', height: '100%'}} source={require("../dataComponents/peas.jpg")}></Image>
        }
      }
    }

    navigateToRecipeDetails = (recipeID) =>{
      this.props.navigation.navigate('RecipeDetails', {recipeID: recipeID})
    }

    followChef = async(followee_id) => {
      const followPosted = await postFollow(this.props.loggedInChef.id, followee_id, this.props.loggedInChef.auth_token)
      if (followPosted) {
        let newFollowers = [...this.props.chefs_details[`chef${this.props.navigation.getParam('chefID')}`].followers, followPosted]
        this.props.storeNewFollowers(followee_id, newFollowers)
      }
    }

    unFollowChef = async(followee_id) => {
      const followPosted = await destroyFollow(this.props.loggedInChef.id, followee_id, this.props.loggedInChef.auth_token)
      if (followPosted) {
        let newFollowers = this.props.chefs_details[`chef${this.props.navigation.getParam('chefID')}`].followers.filter( follower => follower.follower_id !== this.props.loggedInChef.id)
        this.props.storeNewFollowers(followee_id, newFollowers)
      }
    }

    parentNavigator = (route, params) => {
      route === "ChefDetails" ? this.props.navigation.push(route, {chefID: params.chefID}) : this.props.navigation.navigate(route, params)
    }

    render() {
      // console.log(this.props.chefs_details[`chef${this.props.navigation.getParam('chefID')}`])
      if(this.props.chefs_details[`chef${this.props.navigation.getParam('chefID')}`] !== undefined){
        const chef_details = this.props.chefs_details[`chef${this.props.navigation.getParam('chefID')}`]
        // console.log(this.props.chefs_details)
        return (
          <View style={{flex:1}}>
            <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
              <ScrollView contentContainerStyle={{flexGrow:1}}>
                <ChefDetailsCard 
                  {...chef_details} 
                  imageURL={chef_details.chef.imageURL} 
                  reNavigate={this.reNavigate}
                  followChef={this.followChef}
                  unFollowChef={this.unFollowChef}/>
                <MyRecipeBookTabsContainer screenProps={{parentNavigator: this.parentNavigator, queryChefID: chef_details.chef.id}}/>
              </ScrollView>
            </ImageBackground>
          </View>
        )
      } else {
        return (
          <View style={{flex:1}}>
            <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
            </ImageBackground>
          </View>
        )
      }
    }
  }
)

