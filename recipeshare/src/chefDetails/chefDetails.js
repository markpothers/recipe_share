import React from 'react';
import { Image, ScrollView, View, ImageBackground, ActivityIndicator, Platform } from 'react-native';
import { connect } from 'react-redux'
import { databaseURL } from '../dataComponents/databaseURL'
import { styles } from './chefDetailsStyleSheet'
import { centralStyles } from '../centralStyleSheet'
import { getChefDetails } from '../fetches/getChefDetails'
import AppHeader from '../../navigation/appHeader'
import ChefDetailsCard from './ChefDetailsCard'
import { MyRecipeBookTabsContainer, MyRecipeBookTabs } from './ChefDetailsNavigators'
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
        headerLeft: null,
      }
    }

    state = {
      awaitingServer: false
    }

    componentDidMount = async() => {
      await this.setState({awaitingServer: true})
      await this.fetchChefDetails()
      await this.setState({awaitingServer: false})
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
      await this.setState({awaitingServer: true})
      const followPosted = await postFollow(this.props.loggedInChef.id, followee_id, this.props.loggedInChef.auth_token)
      if (followPosted) {
        let newFollowers = [...this.props.chefs_details[`chef${this.props.navigation.getParam('chefID')}`].followers, followPosted]
        this.props.storeNewFollowers(followee_id, newFollowers)
      }
      await this.setState({awaitingServer: false})
    }

    unFollowChef = async(followee_id) => {
      await this.setState({awaitingServer: true})
      const followPosted = await destroyFollow(this.props.loggedInChef.id, followee_id, this.props.loggedInChef.auth_token)
      if (followPosted) {
        let newFollowers = this.props.chefs_details[`chef${this.props.navigation.getParam('chefID')}`].followers.filter( follower => follower.follower_id !== this.props.loggedInChef.id)
        this.props.storeNewFollowers(followee_id, newFollowers)
      }
      await this.setState({awaitingServer: false})
    }

    parentNavigator = (route, params) => {
      route === "ChefDetails" ? this.props.navigation.push(route, {chefID: params.chefID}) : this.props.navigation.navigate(route, params)
    }

    render() {
      // console.log(this.props.chefs_details[`chef${this.props.navigation.getParam('chefID')}`])
      if(this.props.chefs_details[`chef${this.props.navigation.getParam('chefID')}`] !== undefined){
        const chef_details = this.props.chefs_details[`chef${this.props.navigation.getParam('chefID')}`]
        return (
          <View style={{flex:1}}>
            <ImageBackground source={require('../dataComponents/spinach.jpg')} style={styles.background} imageStyle={styles.backgroundImageStyle}>
              {this.state.awaitingServer ? <View style={centralStyles.activityIndicatorContainer}><ActivityIndicator style={Platform.OS === 'ios' ? centralStyles.activityIndicator : null} size="large" color="#104e01" /></View> : null }
              <ScrollView contentContainerStyle={{flexGrow:1}}>
                <ChefDetailsCard 
                  {...chef_details} 
                  imageURL={chef_details.chef.imageURL} 
                  followChef={this.followChef}
                  unFollowChef={this.unFollowChef}
                  notProfile={true}/>
                <View style={styles.recipeBookContainer}>
                  <MyRecipeBookTabsContainer screenProps={{parentNavigator: this.parentNavigator, queryChefID: chef_details.chef.id}}/>
                  {/* <MyRecipeBook/> */}
                </View>
              </ScrollView>
            </ImageBackground>
          </View>
        )
      } else {
        // console.log(this.props)
        return (
          <View style={{flex:1}}>
            <ImageBackground source={require('../dataComponents/spinach.jpg')} style={styles.background} imageStyle={styles.backgroundImageStyle}>
              {this.state.awaitingServer ? <View style={centralStyles.activityIndicatorContainer}><ActivityIndicator style={Platform.OS === 'ios' ? centralStyles.activityIndicator : null} size="large" color="#104e01" /></View> : null }
            </ImageBackground>
          </View>
        )
      }
    }
  }
)

