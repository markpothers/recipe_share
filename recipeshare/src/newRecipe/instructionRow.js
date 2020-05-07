import React from 'react'
import { PanResponder, Text, TextInput, TouchableOpacity, View, Keyboard, Platform } from 'react-native'
import { styles } from './newRecipeStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Autocomplete from 'react-native-autocomplete-input';
import { units } from '../dataComponents/units'
import DualOSPicker from '../functionalComponents/DualOSPicker'
import { centralStyles } from '../centralStyleSheet'
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';

export default class InstructionRow extends React.Component {

    componentDidMount =() =>{
        if (this.props.index == this.props.order.length-1){
            // console.log('row mounting')
        }
    }

    componentDidUpdate =() =>{
        if (this.props.index == this.props.order.length-1){
            // console.log('row updating')
        }
    }
    // componentDidMount = () => {
    //     this.panResponder = PanResponder.create({
    //         onStartShouldSetPanResponder: (evt, gestureState) => true,
    //         onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    //         onMoveShouldSetPanResponder: (evt, gestureState) => true,
    //         onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    //         onMoveShouldSetResponderCapture: (evt, gestureState) => true,
    //         onPanResponderGrant: ( event, gesture) => {
    //         console.log('pan responder granted')
    //         this.setState({opacity: 0.7})
    //         // this.scrollView.setNativeProps({ scrollEnabled: false })
    //         // this.props.toggleScrollViewEnabled(false)
    //         this.props.toggleRowActive()
    //         },
    //         onPanResponderMove: ( event, gesture) => {
    //         console.log('pan responder moving')
    //         },
    //         onPanResponderRelease: (event, gesture) => {
    //             // this.props.toggleScrollViewEnabled(false)
    //             this.setState({opacity: 1})
    //         console.log('pan responder released')
    //         }
    //     })
    // }


  render(){
    //   console.log(`render row ${this.props.index}`)
    // console.log(this.props.data)
    return (
        <View 
            style={[centralStyles.formInputContainer, {opacity: (this.props.active ? 0.7 : 1)}]}
            // {...(this.props.panResponder ? this.props.panResponder.panHandlers : null)}
        >
            <View 
                // onPress={this.props.toggleRowActive} 
                style={[styles.deleteInstructionContainer, {width: '15%'}]}
                // {...(this.panResponder ? this.panResponder.panHandlers : null)}
                // {...(this.props.panResponder ? this.props.panResponder.panHandlers : null)}
            >
                <Icon name='menu' size={24} style={styles.ingredientTrashCan}/>
            </View>
            <TextInput 
                style={styles.instructionInput}
                multiline={true}
                numberOfLines={1}
                value={this.props.data}
                placeholder={`New step`}
                onChangeText={(t) => this.props.handleInstructionChange(t, this.props.index)}
                onBlur={this.props.addNewInstruction}
                onEndEditing={this.props.addNewInstruction}
            />
            {/* <Text style={[centralStyles.formInput, {width: '75%'}]} value={this.props.data} placeholder={`Instructions step`} onChangeText={(t) => this.handleInstructionChange(t, index)}>{this.props.data}</Text> */}
            <TouchableOpacity style={[styles.deleteInstructionContainer, {width: '8%'}]} onPress={() => this.props.removeInstruction(this.props.index)}>
                <Icon name='trash-can-outline' size={24} style={styles.ingredientTrashCan}/>
            </TouchableOpacity>
        </View>
      )
  }
}