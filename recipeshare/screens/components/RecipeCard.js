import React, { Component } from 'react'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base'

export default class RecipeCard extends Component {

    render() {
        // console.log(this.props.navigation)
        return (
            <ListItem thumbnail>
                <Left>
                    <Thumbnail square  source={this.props.imageURL} />
                </Left>
                <Body>
                    <Text>{this.props.id}: {this.props.name}</Text>
                    <Text note numberOfLines={1}>Difficulty: {this.props.difficulty}/10</Text>
                </Body>
                <Right>
                    <Button transparent onPress={() => this.props.navigation.navigate('RecipeDetails', {listChoice: this.props["listChoice"], recipeID: this.props.id})}>
                        <Text>View details</Text>
                    </Button>
                </Right>
            </ListItem>
        );
  }
}