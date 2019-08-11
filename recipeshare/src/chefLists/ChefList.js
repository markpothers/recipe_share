import React from 'react'
import { FlatList, ActivityIndicator } from 'react-native'
import ChefCard from './ChefCard'
import { databaseURL } from '../dataComponents/databaseURL'
import { connect } from 'react-redux'
import { getChefList } from '../fetches/getChefList'
import { NavigationEvents, withNavigation } from 'react-navigation'
import { postFollow } from '../fetches/postFollow'
import { destroyFollow } from '../fetches/destroyFollow'

const mapStateToProps = (state) => ({
      all_chefs: state.chefs.all_chefs,
      followed_chefs: state.chefs.followed,
      loggedInChef: state.loggedInChef,
      chefs_details: state.chefs_details,
      most_liked_chefs: state.chefs.most_liked_chefs,
      most_made_chefs: state.chefs.most_made_chefs,
      chef_followees: state.chefs.chef_followees,
      chef_followers: state.chefs.chef_followers
})

const mapDispatchToProps = {
  changeRanking: () => {
    return dispatch => {
      dispatch({ type: 'CHANGE_GLOBAL_RANKING'})
    }
  },
  storeChefList: (listChoice, chefs) => {
    return dispatch => {
      dispatch({ type: 'STORE_CHEF_LIST', chefType: listChoice, chefList: chefs})
      }
  },
  appendToChefList: (listChoice, new_chefs) => {
    return dispatch => {
      dispatch({ type: 'APPEND_TO_CHEF_LISTS', chefType: listChoice, chefList: new_chefs})
      }
  },
  clearListedChefs: (listChoice) => {
    return dispatch => {
      dispatch({ type: 'CLEAR_LISTED_CHEFS', chefType: listChoice})
    }
  },
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(
  class ChefList extends React.Component {

    state = {
      limit: 20,
      offset: 0,
      awaitingServer: false
    }

    componentDidMount = () => {
      this.fetchChefList()
    }

    respondToFocus = async() =>{
      await this.setState({offset: 0})
      this.fetchChefList()
    }

    fetchChefList = async() => {
      const queryChefID = this.props.queryChefID ? this.props.queryChefID : this.props.loggedInChef.id
      let chefs = await getChefList(this.props["listChoice"], queryChefID, this.state.limit, this.state.offset, this.props.loggedInChef.auth_token)
      this.props.storeChefList(this.props["listChoice"], chefs)
    }

    fetchAdditionalChefs = async() => {
      const queryChefID = this.props.queryChefID ? this.props.queryChefID : this.props.loggedInChef.id
      const new_chefs = await getChefList(this.props["listChoice"], queryChefID, this.state.limit, this.state.offset, this.props.loggedInChef.auth_token)
      this.props.appendToChefList(this.props["listChoice"], new_chefs)
    }

    renderChefListItem = (item) => {
      let imageURL = null
      if (item.item.imageURL != null) {
        if (item.item.imageURL.startsWith("http")) {
          imageURL = { uri: item.item.imageURL }
        } else {
          imageURL = { uri: `${databaseURL}${item.item.imageURL}` }
        }
      }
        return <ChefCard
                listChoice={this.props["listChoice"]}
                key={item.index.toString()}
                {...item.item}
                imageURL={imageURL}
                navigateToChefDetails={this.navigateToChefDetails}
                followChef={this.followChef}
                unFollowChef={this.unFollowChef}/>
    }

    followChef = async(followee_id) => {
      await this.setState({awaitingServer: true})
      const followPosted = await postFollow(this.props.loggedInChef.id, followee_id, this.props.loggedInChef.auth_token)
      if (followPosted) {
        let updatedChefs = this.props[this.props["listChoice"]].map( chef => {
          if (chef['id'] === followee_id){
            chef['followers'] +=1
            chef['user_chef_following'] += 1
           return chef
        } else {
          return chef
        }
        })
        this.props.storeChefList(this.props["listChoice"], updatedChefs)
      }
      await this.setState({awaitingServer: false})
    }

    unFollowChef = async(followee_id) => {
      await this.setState({awaitingServer: true})
      const followPosted = await destroyFollow(this.props.loggedInChef.id, followee_id, this.props.loggedInChef.auth_token)
      if (followPosted) {
        let updatedChefs = this.props[this.props["listChoice"]].map( chef => {
          if (chef['id'] === followee_id){
            chef['followers'] -=1
            chef['user_chef_following'] = 0
           return chef
        } else {
          return chef
        }
        })
        this.props.storeChefList(this.props["listChoice"], updatedChefs)
      }
      await this.setState({awaitingServer: false})
    }

    refresh = async () => {
      await this.setState({limit: 20, offset: 0})
      this.props.clearListedChefs(this.props["listChoice"])
      this.fetchChefList()
    }

    onEndReached = async () => {
      await this.setState({offset: this.state.offset + 20})
      this.fetchAdditionalChefs()
    }

    navigateToChefDetails = (chefID) => {
      this.props.parentNavigator ? this.props.parentNavigator('ChefDetails', {chefID: chefID}) : this.props.navigation.navigate('ChefDetails', {chefID: chefID})
    }

    render() {
      // console.log(this.props[this.props["listChoice"]])
      return (
        <React.Fragment>
          <NavigationEvents onWillFocus={this.respondToFocus}/>
          {this.state.awaitingServer ? <ActivityIndicator style={styles.activityIndicator} size="large" color="#104e01" /> : null }
          <FlatList
            data={this.props[this.props["listChoice"]]}
            renderItem={this.renderChefListItem}
            keyExtractor={(item) => item.id.toString()}
            onRefresh={this.refresh}
            refreshing={false}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.3}
          />
        </React.Fragment>
      )
    }

  }
))