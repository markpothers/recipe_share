import React, { Component } from 'react'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base'
import { databaseURL } from '../functionalComponents/databaseURL'


export default class RecipeCard extends Component {

    render() {
        // console.log(this.props.imageURL)
        return (
            <ListItem thumbnail>
                <Left>
                    <Thumbnail square style={{height: 150, width: 150}} source={this.props.imageURL} />
                </Left>
                <Body>
                    <Text>{this.props.id}: {this.props.name}</Text>
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