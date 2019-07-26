import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, Dimensions, AsyncStorage } from 'react-native'
import { DrawerItems, SafeAreaView } from 'react-navigation';
import { styles } from './drawerStyleSheet'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { databaseURL } from '../src/dataComponents/databaseURL'

const mapStateToProps = (state) => ({
  loggedInChef: state.loggedInChef,
})

const mapDispatchToProps = {
}

export default (connect(mapStateToProps, mapDispatchToProps)(
  class Drawer extends React.PureComponent {

    logout = () => {
      AsyncStorage.removeItem('chef', () => {})
      this.props.navigation.navigate('Login')
    }

    render(){
        // console.log(this.props.loggedInChef.imageURL)
      return (
      <ScrollView>
        <SafeAreaView style={[styles.mainPageContainer, {height: Dimensions.get('window').height*0.96}]} forceInset={{ top: 'always', horizontal: 'never' }}>
          <View style={styles.headerContainer}>
            <View style={styles.headerTopContainer}>
              <Image style={styles.logo} resizeMode="contain" source={require('../src/dataComponents/greenLogo.png')}/>
            </View>
          </View>
          <View style={styles.horizontalRule}></View>
          <View style={styles.routesContainer}>
            <TouchableOpacity style={styles.routeLink} onPress={e => this.props.navigation.navigate('BrowseRecipes')}>
              <Icon name='food' size={24} style={styles.icon}/>
              <Text style={styles.routeName}>All recipes & chefs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.routeLink} onPress={e => this.props.navigation.navigate('MyRecipeBook')}>
              <Icon name='book-open-page-variant' size={24} style={styles.icon}/>
              <Text style={styles.routeName}>My recipe book</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.routeLink} onPress={e => this.props.navigation.navigate('Profile')}>
              <Icon name='account' size={24} style={styles.icon}/>
              <Text style={styles.routeName}>My profile</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.horizontalRule}></View>
          <View style={styles.bottomContainer}>
              <View style={styles.bottomRightContainer}>
              <Text style={styles.userNameheader}>Logged in as:</Text>
              <Text style={styles.userName}>{this.props.loggedInChef.username}</Text>
              </View>
              <View style={styles.bottomLeftContainer}>
                <AvatarImage imageURL={this.props.loggedInChef.imageURL}/>
              </View>
            </View>
          <View style={styles.horizontalRule}></View>
          <View style={styles.logoutContainer}>
            <TouchableOpacity style={styles.routeLink} onPress={this.logout}>
              <Icon name='logout' size={24} style={styles.icon}/>
              <Text style={styles.routeName}>Logout</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
      )
    }
  }))

  function AvatarImage(props) {
    const URL = props.imageURL
    if (URL == null) {
        return (
            <Image style={styles.avatarThumbnail} source={require("../src/dataComponents/peas.jpg")} />
        )
    } else {
    return (
        <Image style={styles.avatarThumbnail} source={URL.startsWith("http") ? {uri: URL} : {uri: `${databaseURL}${URL}`}} />
        )
    }
}
