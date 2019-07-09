import React from 'react';
import { Image, ScrollView, View, ImageBackground } from 'react-native';
import { connect } from 'react-redux'
import { databaseURL } from '../dataComponents/databaseURL'
import { styles } from './chefDetailsStyleSheet'
import { getChefDetails } from '../fetches/getChefDetails'
import AppHeader from '../../navigation/appHeader'
import ChefDetailsCard from './ChefDetailsCard'
import { MyRecipeBookTabsContainer } from './ChefDetailsNavigators'

const mapStateToProps = (state) => ({
  loggedInChef: state.loggedInChef,
  chef_details: state.chef_details,
})

const mapDispatchToProps = {
  storeChefDetails: (chef_details) => {
    return dispatch => {
      dispatch({ type: 'STORE_CHEF_DETAILS', chef_details: chef_details})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class ChefDetails extends React.Component {
    static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: <AppHeader text={"Chef Details"} />,
      };
    }

    componentDidMount = async() => {
      const chef_details = await getChefDetails(this.props.navigation.getParam('chefID'), this.props.loggedInChef.auth_token)
      if (chef_details) {
        // console.log(chef_details)
        this.props.storeChefDetails(chef_details)
      }
    }

    renderChefImage = () => {
      const chef = this.props.chef_details
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

    checkFollow = () => {
      fetch(`${databaseURL}/follows/check`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.props.loggedInChef.auth_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            follow: {
              follower_id: this.props.loggedInChef.id,
              followee_id: this.props.navigation.getParam('chefID'),
            }
          })
      })
      .then(res => res.json())
      .then(response => {
        // console.log(response)
        if (response == true){
          this.props.navigation.setParams({
            followable: false,
            followChef: this.followChef,
            unfollowChef: this.unfollowChef
          })
        } else {
          this.props.navigation.setParams({
            followable: true,
            followChef: this.followChef,
            unfollowChef: this.unfollowChef
          })
        }
        })
    }

    followChef = () => {
      fetch(`${databaseURL}/follows`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.props.loggedInChef.auth_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            follow: {
              follower_id: this.props.loggedInChef.id,
              followee_id: this.props.navigation.getParam('chefID'),
            }
          })
      })
      .then(res => res.json())
      .then(follow => {
        // console.log(follow)
        this.checkFollow()
      })
    }

    unfollowChef = () => {
      fetch(`${databaseURL}/follows`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.props.loggedInChef.auth_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            follow: {
              follower_id: this.props.loggedInChef.id,
              followee_id: this.props.navigation.getParam('chefID'),
            }
          })
      })
      .then(res => res.json())
      .then(unfollow => {
        // console.log(unfollow)
        this.checkFollow()
      })
    }

    parentNavigator = (route, params) => {
      route === "ChefDetails" ? this.props.navigation.push(route, {chefID: params.chefID}) : this.props.navigation.navigate(route, params)
    }

    render() {
      if(this.props.chef_details.chef !== undefined){
        // console.log(this.props.chef_details.chef.id)
        return (
          <View style={{flex:1}}>
            <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
              <ScrollView contentContainerStyle={{flexGrow:1}}>
                <ChefDetailsCard {...this.props.chef_details} imageURL={this.props.chef_details.chef.imageURL} reNavigate={this.reNavigate}/>
                <MyRecipeBookTabsContainer screenProps={{parentNavigator: this.parentNavigator, queryChefID: this.props.chef_details.chef.id}}/>
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

