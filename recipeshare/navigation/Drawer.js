import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, Dimensions, AsyncStorage } from 'react-native'
import { DrawerItems, SafeAreaView } from 'react-navigation';
import { styles } from './drawerStyleSheet'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { databaseURL } from '../src/dataComponents/databaseURL'
import { responsiveHeight } from 'react-native-responsive-dimensions';

const mapStateToProps = (state) => ({
  loggedInChef: state.loggedInChef,
})

const mapDispatchToProps = {
}

export default (connect(mapStateToProps, mapDispatchToProps)(
  class Drawer extends React.PureComponent {

    logout = () => {
      AsyncStorage.removeItem('chef', () => {
        this.props.navigation.navigate('Login')
      })
    }

    render(){
        // console.log(this.props.loggedInChef)
      return (
      // <ScrollView>
        <SafeAreaView style={[styles.mainPageContainer, {height: responsiveHeight(100)}]} forceInset={{ top: 'always', horizontal: 'never' }}>
          <View style={styles.headerContainer}>
            <View style={styles.headerTopContainer}>
              <Image style={styles.logo} resizeMode="contain" source={require('../src/dataComponents/greenLogo.png')}/>
            </View>
          </View>
          <View style={styles.horizontalRule}></View>
          <View style={styles.routesContainer}>
            <TouchableOpacity style={styles.routeLink} onPress={e => this.props.navigation.navigate('BrowseRecipes')}>
              <Icon name='food' size={responsiveHeight(3.5)} style={styles.icon}/>
              <View style={styles.routeNameContainer}>
                <Text style={styles.routeName} maxFontSizeMultiplier={2}>All recipes {"&"} chefs</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.routeLink} onPress={e => this.props.navigation.navigate('MyRecipeBook')}>
              <Icon name='book-open-page-variant' size={responsiveHeight(3.5)} style={styles.icon}/>
              <View style={styles.routeNameContainer}>
                <Text style={styles.routeName} maxFontSizeMultiplier={2}>My recipe book</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.routeLink} onPress={e => this.props.navigation.navigate('Profile')}>
              <Icon name='account' size={responsiveHeight(3.5)} style={styles.icon}/>
              <View style={styles.routeNameContainer}>
                <Text style={styles.routeName} maxFontSizeMultiplier={2}>My profile</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.horizontalRule}></View>
          <View style={styles.bottomContainer}>
              <View style={styles.bottomLeftContainer}>
              <Text style={styles.userNameHeader} maxFontSizeMultiplier={1.5}>Logged in as:</Text>
              <TouchableOpacity onPress={e => this.props.navigation.navigate('Profile')}>
                <Text style={styles.userName} maxFontSizeMultiplier={1.5}>{this.props.loggedInChef.username}</Text>
              </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.bottomRightContainer} onPress={e => this.props.navigation.navigate('Profile')}>
                <AvatarImage image_url={this.props.loggedInChef.image_url}/>
              </TouchableOpacity>
            </View>
          <View style={styles.horizontalRule}></View>
          <View style={styles.logoutContainer}>
            <TouchableOpacity style={[styles.routeLink, {height: responsiveHeight(8)}]} onPress={this.logout}>
              <Icon name='logout' size={responsiveHeight(3.5)} style={styles.icon}/>
              <Text style={styles.routeName} maxFontSizeMultiplier={2}>Logout</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      // </ScrollView>
      )
    }
  }))

  function AvatarImage(props) {
    // console.log(props)
    const URL = props.image_url
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
