import React from 'react'
import { FlatList } from 'react-native'
import ChefCard from './ChefCard'
import { databaseURL } from '../dataComponents/databaseURL'
import { connect } from 'react-redux'
import { getChefList } from '../fetches/getChefList'
import { NavigationEvents, withNavigation } from 'react-navigation'

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
    // console.log(chefs)
    return dispatch => {
      dispatch({ type: 'STORE_CHEF_LIST', chefType: listChoice, chefList: chefs})
      }
  },
  storeChefDetails: (listChoice, chef_details) => {
    // console.log(listChoice)
    return dispatch => {
      dispatch({ type: 'STORE_CHEFS_DETAILS', chefType: listChoice, chefsDetailsList: chef_details})
    }
  },
  appendToChefList: (listChoice, new_chefs) => {
    return dispatch => {
      dispatch({ type: 'APPEND_TO_CHEF_LISTS', chefType: listChoice, chefList: new_chefs})
      }
  },
  appendToChefDetails: (listChoice, new_chef_details) => {
    return dispatch => {
      dispatch({ type: 'APPEND_TO_CHEFS_DETAILS', chefType: listChoice, chefsDetailsList: new_chef_details})
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
      offset: 0
    }

    // handleRankChoiceButton = async() => {
    //   await this.props.changeRanking()
    //   await this.setState({limit: 1, offset: 0})
    //   this.fetchChefList()
    // }

    componentDidMount = () => {
      this.fetchChefList()
    }

    fetchChefList = async() => {
      const queryChefID = this.props.queryChefID ? this.props.queryChefID : this.props.loggedInChef.id
      let chefs = await getChefList(this.props["listChoice"], queryChefID, this.state.limit, this.state.offset, this.props.loggedInChef.auth_token)
      // console.log(chefs)
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
        return <ChefCard listChoice={this.props["listChoice"]} key={item.index.toString()} {...item.item} imageURL={imageURL} navigateToChefDetails={this.navigateToChefDetails}/>
    }

    // renderGlobalListButton = () => {
    //   if (this.props["listChoice"] == "global_ranks_chefs"){
    //     return (
    //       <Button rounded danger style={styles.rankButton} onPress={this.handleRankChoiceButton}>
    //           {this.props.global_ranking == 'liked' ? <Icon style={styles.rankIcon} size={25} name='thumb-up' /> : <Icon style={styles.rankIcon} size={25} name='thumb-up-outline' />}
    //           {this.props.global_ranking == 'liked' ? <Text style={styles.rankButtonText}>Most liked</Text> : <Text style={styles.rankButtonText}>Most made</Text>}
    //       </Button>
    //     )
    //   }
    // }

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
      this.props.navigation.navigate('ChefDetails', {chefID: chefID})
    }

    render() {
      // console.log(this.props[this.props["listChoice"]])
      return (
        <React.Fragment>
          <FlatList
            data={this.props[this.props["listChoice"]]}
            // extraData={this.props.chefs_details[this.props["listChoice"]]}
            renderItem={this.renderChefListItem}
            keyExtractor={(item) => item.id.toString()}
            onRefresh={this.refresh}
            refreshing={false}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.3}
          />
          {/* {this.renderGlobalListButton()} */}
        </React.Fragment>
      )
    }

  }
))