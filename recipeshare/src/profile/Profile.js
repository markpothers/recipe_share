import React from 'react';
import { connect } from 'react-redux'
import { styles } from './profileStyleSheet'
import { Container, Header, Text, Button,  } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AsyncStorage, View, ImageBackground, TouchableOpacity } from 'react-native'
import AppHeader from '../../navigation/appHeader'
import ChefDetailsCard from '../chefDetails/ChefDetailsCard'
import { getChefDetails } from '../fetches/getChefDetails'

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
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class Profile extends React.Component {
    static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: <AppHeader text={"Profile"}/>,
      }
    };

    componentDidMount = () => {
      this.fetchChefDetails()
    }

    componentWillUnmount = () => {
      // console.log("unmounting")
      // this.props.clearChefDetails()
    }

    fetchChefDetails = async() => {
      const chef_details = await getChefDetails(this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
      if (chef_details) {
        this.props.storeChefDetails(chef_details)
      }
    }

    logout = () => {
      AsyncStorage.removeItem('chef', () => {})
      this.props.navigation.navigate('Login')
    }

    render() {
      // console.log(this.props.chefs_details[`chef${this.props.navigation.getParam('chefID')}`])
      if(this.props.chefs_details[`chef${this.props.loggedInChef.id}`] !== undefined){
        const chef_details = this.props.chefs_details[`chef${this.props.loggedInChef.id}`]
        return (
          <React.Fragment>
            <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
              <ChefDetailsCard {...chef_details} imageURL={chef_details.chef.imageURL}/>
                <TouchableOpacity activeOpacity={0.7} style={styles.logoutButton} onPress={this.logout}>
                  <Icon name='logout' size={25} style={styles.icon} />
                </TouchableOpacity>
            </ImageBackground>
          </React.Fragment>
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
