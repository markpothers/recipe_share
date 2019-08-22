import React from 'react'
import { ActionSheetIOS, Modal, Text, View, TouchableOpacity, Switch, Dimensions, Picker, Platform } from 'react-native'
import { styles } from './filterMenuStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux'
import { cuisines } from '../dataComponents/cuisines'
import { serves } from '../dataComponents/serves'
import { clearedFilters } from '../dataComponents/clearedFilters'
// import { countries } from '../dataComponents/countries'

export default class AppActionSheetIOS extends React.PureComponent{

    state = {
        clicked: 'United States'
    }

    showActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions({
            options: [...this.props.options, "cancel"],
            cancelButtonIndex: this.props.options.length,
            destructiveButtonIndex: this.props.defaultIndex,
        },
            (optionIndex) => {
            this.setState({ clicked: this.props.options[optionIndex] })
        })
    }

    render() {
        // console.log(Platform)
        return (
            <React.Fragment>
                <Text onPress={this.showActionSheet} style={this.props.style}>{this.state.clicked}</Text>
            </React.Fragment>
        )
    }
}