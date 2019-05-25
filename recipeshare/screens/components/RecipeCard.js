import React, { Component } from 'react'
import { Image, View, TouchableOpacity } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base'
import { styles } from '../functionalComponents/RSStyleSheet'


export default class RecipeCard extends Component {
    
    render() {
        // console.log(this.props.listChoice)
        // if (this.props.index % 2 == 0) {
            return (
                // <ListItem style={styles.recipeCard} onPress={() => this.props.navigation(this.props["listChoice"], this.props.id)}>
                //     <Left>
                //     </Left>
                //     <Body>
                        <TouchableOpacity activeOpacity={0.8} style={styles.recipeCard} onPress={() => this.props.navigation(this.props.listChoice, this.props.item.id)}>
                            <View style={styles.recipeCardRightContent} >
                                <Image style={styles.thumbnail} source={this.props.imageURL} />
                            </View>
                            <View style={styles.recipeCardRightContent} >
                                <Text style={styles.recipeCardName}>{this.props.item.id}: {this.props.item.name}</Text>
                                {/* <Text style={styles.recipeCardChefName}>Chef Name</Text> */}
                                <Text style={styles.recipeCardOther} numberOfLines={1}>Difficulty: {this.props.item.difficulty}/10</Text>
                            </View>
                        </TouchableOpacity>
                //     </Body>

                // </ListItem>
            );
        // } else {
        //     return (
        //         // <ListItem style={styles.recipeCard} onPress={() => this.props.navigation(this.props["listChoice"], this.props.id)}>
        //         //     <Left>
        //         //     </Left>
        //         //     <Body>
        //                 <View style={styles.recipeCard} onPress={() => this.props.navigation(this.props["listChoice"], this.props.item.id)}>
        //                     <View style={styles.recipeCardRightContent}>
        //                         <Text style={styles.recipeCardName}>{this.props.item.id}: {this.props.item.name}</Text>
        //                         <Text style={styles.recipeCardChefName}>Chef Name</Text>
        //                         <Text style={styles.recipeCardOther} numberOfLines={1}>Difficulty: {this.props.item.difficulty}/10</Text>
        //                     </View>
        //                     <View style={styles.recipeCardRightContent}>
        //                         <Image style={styles.thumbnail} source={this.props.imageURL} />
        //                     </View>

        //                 </View>
        //         //     </Body>

        //         // </ListItem>
        //     );
        // }
  }
}