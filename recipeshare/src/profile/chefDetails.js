import React from 'react';
import { Container, Header, Text, Button, Icon  } from 'native-base';
import {Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View, ImageBackground } from 'react-native';
import { connect } from 'react-redux'
import { styles } from './profileStyleSheet'
import { databaseURL } from '../dataComponents/databaseURL'

const mapStateToProps = (state) => ({
    loggedInChef: state.loggedInChef
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(
  class ChefDetails extends React.Component {

    state = {
      chef_details: {}
    }

    componentDidMount = () => {
      this.fetchChefDetails()
    }

    fetchChefDetails = () => {
      // console.log(databaseURL)
      fetch(`${databaseURL}/chefs/${this.props.loggedInChef.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.props.loggedInChef.auth_token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(chef => {
        // console.log(chef)
        this.setState({chef_details: chef})
      })
    }

    renderChefImage = () => {
      if (this.state.chef_details.imageURL != null){
        return <Image style={[{width: '100%', height: 250}, styles.detailsImage]} source={{uri: `${databaseURL}${this.state.chef_details.imageURL}`}}></Image>
      } else {
        return <Image style={[{width: '100%', height: 250}, styles.detailsImage]} source={require("../dataComponents/peas.jpg")}></Image>
      }
    }

    render() {
      // console.log(this.state.chef_details)
        return (
          <View style={styles.mainPageContainer}>
            <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
              <View style={styles.detailsHeader}>
                {/* <Text style={[styles.detailsHeaderTextBox, {textAlign: 'left'}]}>User: {this.state.chef_details.id}</Text> */}
                <Text style={[styles.detailsHeaderTextBox]}>{this.state.chef_details.username}</Text>
              </View>
              <View style={styles.detailsImageWrapper}>
                {this.renderChefImage()}
              </View>
              <View style={styles.detailsHeader}>
                <Text style={[styles.detailsContent, {marginLeft: '3%'}]}>From: {this.state.chef_details.country}</Text>
                <Text style={[styles.detailsContent, {marginLeft: '3%'}]}>User since: {this.state.chef_details.created_at != undefined ? this.state.chef_details.created_at.substring(0, 4) : ""}</Text>
              </View>
            </ImageBackground>
          </View>
      );
    }
  }
)
