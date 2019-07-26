import React from 'react';
import { connect } from 'react-redux'
import { styles } from './profileStyleSheet'
import { View, ImageBackground } from 'react-native'
import AppHeader from '../../navigation/appHeader'
import ChefDetailsCard from '../chefDetails/ChefDetailsCard'
import { getChefDetails } from '../fetches/getChefDetails'
import ChefEditor from './chefEditor'

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

    state = {
      editingChef: false
    }

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

    editingChef = () => {
      this.setState({editingChef: !this.state.editingChef})
    }

    chefUpdated = () => {
      this.setState({editingChef: !this.state.editingChef})
      this.fetchChefDetails()
    }

    render() {
      // console.log(this.props.chefs_details[`chef${this.props.navigation.getParam('chefID')}`])
      if(this.props.chefs_details[`chef${this.props.loggedInChef.id}`] !== undefined){
        const chef_details = this.props.chefs_details[`chef${this.props.loggedInChef.id}`]
        return (
          <React.Fragment>
            {this.state.editingChef ? <ChefEditor editingChef={this.editingChef} {...chef_details} chefUpdated={this.chefUpdated}/> : null}
            <ImageBackground source={require('../dataComponents/spinach.jpg')} style={styles.background} imageStyle={styles.backgroundImageStyle}>
              <ChefDetailsCard editChef={this.editingChef} myProfile={true} {...chef_details} imageURL={chef_details.chef.imageURL}/>
            </ImageBackground>
          </React.Fragment>
        )
      } else {
        return (
          <View style={{flex:1}}>
            <ImageBackground source={require('../dataComponents/spinach.jpg')} style={styles.background} imageStyle={styles.backgroundImageStyle}>
            </ImageBackground>
          </View>
        )
      }
    }
  }
)