import React from 'react'
import { StyleSheet, TouchableOpacity, View, AsyncStorage, ImageBackground, ScrollView, FlatList, Text } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Left, Body, Right, Button} from 'native-base'
import ChefCard from './ChefCard'
import { databaseURL } from '../dataComponents/databaseURL'
import { connect } from 'react-redux'
import { styles } from './chefListStyleSheet'
import { fetchChefList } from './chefListFetch'
// import { fetchChefDetails } from './chefListDetailsFetch'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const mapStateToProps = (state) => ({
      all_chefs: state.chefs.all_chefs,
      followed_chefs: state.chefs.followed,
      global_ranks_chefs: state.chefs.global_ranks_chefs,
      loggedInChef: state.loggedInChef,
      chefs_details: state.chefs_details,
      global_ranking: state.global_ranking,
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

export default connect(mapStateToProps, mapDispatchToProps)(
  class ChefList extends React.Component {

    state = {
      limit: 20,
      offset: 0
    }

    handleRankChoiceButton = async() => {
      await this.props.changeRanking()
      await this.setState({limit: 20, offset: 0})
      this.fetchChefListThenDetails()
    }

    componentDidMount = () => {
      this.fetchChefListThenDetails()
    }

    fetchChefListThenDetails = async() => {
      let chefs = await fetchChefList(this.props["listChoice"], this.props.loggedInChef.id, this.state.limit, this.state.offset, this.props.global_ranking, this.props.loggedInChef.auth_token)
      this.props.storeChefList(this.props["listChoice"], chefs)
      // console.log(this.props["listChoice"])
    }

    fetchAdditionalChefsThenDetailsForList = async() => {
      const new_chefs = await fetchChefList(this.props["listChoice"], this.props.loggedInChef.id, this.state.limit, this.state.offset, this.props.global_ranking, this.props.loggedInChef.auth_token)
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
      // console.log(item)
        return <ChefCard listChoice={this.props["listChoice"]} key={item.index.toString()} {...item} imageURL={imageURL} navigation={this.props.navigation}/>
    }

    renderGlobalListButton = () => {
      if (this.props["listChoice"] == "global_ranks_chefs"){
        return (
          <Button rounded danger style={styles.rankButton} onPress={this.handleRankChoiceButton}>
              {this.props.global_ranking == 'liked' ? <Icon style={styles.rankIcon} size={25} name='thumb-up' /> : <Icon style={styles.rankIcon} size={25} name='thumb-up-outline' />}
              {this.props.global_ranking == 'liked' ? <Text style={styles.rankButtonText}>Most liked</Text> : <Text style={styles.rankButtonText}>Most made</Text>}
          </Button>
        )
      }
    }

    refresh = async () => {
      await this.setState({limit: 50, offset: 0})
      this.props.clearListedChefs(this.props["listChoice"])
      this.fetchChefListThenDetails()
    }

    onEndReached = async () => {
      await this.setState({offset: this.state.offset + 20})
      this.fetchAdditionalChefsThenDetailsForList()
    }

    render() {
      // console.log(this.props["listChoice"])
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
          {this.renderGlobalListButton()}
        </React.Fragment>
      )
    }

  }
)