import React, { Component } from 'react'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base'


export default class RecipeCard1 extends Component {

    render() {
        return (
            <ListItem thumbnail>
                <Left>
                    <Thumbnail square source={{ uri: 'Image URL' }} />
                </Left>
                <Body>
                    <Text>{this.props.name}</Text>
                    <Text note numberOfLines={1}>Difficulty: {this.props.difficulty}/10</Text>
                </Body>
                <Right>
                    <Button transparent>
                    <Text>View</Text>
                </Button>
                </Right>
            </ListItem>
        );
  }
}