import React from 'react';
import { connect } from 'react-redux'
import { styles } from './profileStyleSheet'
import { View, ImageBackground, TouchableOpacity } from 'react-native'
import AppHeader from '../../navigation/appHeader'
import ChefDetailsCard from '../chefDetails/ChefDetailsCard'
import { getChefDetails } from '../fetches/getChefDetails'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ChefEditor from './chefEditor'
import { getDatabaseBackup } from '../fetches/getDatabaseBackup'
import { getDatabaseRestore } from '../fetches/getDatabaseRestore'


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
        headerLeft: null,
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

    manualBackupDatabase = async() => {
      const confirmation = await getDatabaseBackup(this.props.loggedInChef.auth_token, "manual")
      confirmation ? console.log("database manually backed up") : console.log("database backup failed or not permitted")
    }

    autoBackupDatabase = async() => {
      const confirmation = await getDatabaseBackup(this.props.loggedInChef.auth_token, "auto")
      confirmation ? console.log("database auto backup cycle started") : console.log("database auto backup cycle failed or not permitted")
    }

    // autoBackupDatabaseStop = async() => {
    //   const confirmation = await getDatabaseBackup(this.props.loggedInChef.auth_token, "stop")
    //   confirmation ? console.log("database auto backup cycle stopped") : console.log("database auto backup stop failed or not permitted")
    // }

    restorePrimaryDatabase = async() => {
      const confirmation = await getDatabaseRestore(this.props.loggedInChef.auth_token, "primary")
      confirmation ? console.log("database restored from primary backup") : console.log("primary backup restore failed or not permitted")
    }

    restoreSecondaryDatabase = async() => {
      const confirmation = await getDatabaseRestore(this.props.loggedInChef.auth_token, "secondary")
      confirmation ? console.log("database restored from secondary backup") : console.log("secondary backup restore failed or not permitted")
    }

    renderDatabaseButtons = () => {
      return (
        <React.Fragment>
            <TouchableOpacity style={styles.dbManualBackupButton} activeOpacity={0.7} onPress={this.manualBackupDatabase}>
                <Icon name='database-plus' size={24} style={styles.filterIcon}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dbAutoBackupButton} activeOpacity={0.7} onPress={this.autoBackupDatabase}>
                <Icon name='database-refresh' size={24} style={styles.filterIcon}/>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.dbAutoBackupStopButton} activeOpacity={0.7} onPress={this.autoBackupDatabaseStop}>
                <Icon name='database-remove' size={24} style={styles.filterIcon}/>
              </TouchableOpacity> */}
              <TouchableOpacity style={styles.dbPrimaryRestoreButton} activeOpacity={0.7} onPress={this.restorePrimaryDatabase}>
                <Icon name='database-export' size={24} style={styles.filterIcon}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dbSecondaryRestoreButton} activeOpacity={0.7} onPress={this.restoreSecondaryDatabase}>
                <Icon name='database-import' size={24} style={styles.filterIcon}/>
              </TouchableOpacity>
        </React.Fragment>

      )
    }

    render() {
      // console.log(this.props.loggedInChef)
      if(this.props.chefs_details[`chef${this.props.loggedInChef.id}`] !== undefined){
        const chef_details = this.props.chefs_details[`chef${this.props.loggedInChef.id}`]
        return (
          <React.Fragment>
            {this.state.editingChef ? <ChefEditor editingChef={this.editingChef} {...chef_details} chefUpdated={this.chefUpdated}/> : null}
            <ImageBackground source={require('../dataComponents/spinach.jpg')} style={styles.background} imageStyle={styles.backgroundImageStyle}>
              {this.props.loggedInChef.is_admin ? this.renderDatabaseButtons() : null}
              <ChefDetailsCard editChef={this.editingChef} myProfile={true} {...chef_details} imageURL={chef_details.chef.imageURL}/>
            </ImageBackground>
          </React.Fragment>
        )
      } else {
        return (
          <View style={{flex:1}}>
            <ImageBackground source={require('../dataComponents/spinach.jpg')} style={styles.background} imageStyle={styles.backgroundImageStyle}>
              {this.props.loggedInChef.is_admin ? this.renderDatabaseButtons() : null}
            </ImageBackground>
          </View>
        )
      }
    }
  }
)