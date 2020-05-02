import React from 'react'
import { FlatList, ScrollView, SafeAreaView, Image, KeyboardAvoidingView, View, ActivityIndicator } from 'react-native'
// import { styles } from './newRecipeStyleSheet'
import { centralStyles } from '../centralStyleSheet'
import FilterMenu from '../functionalComponents/filterMenu'


export default class SpinachAppContainer extends React.Component {
    static navigationOptions = {

    }

    state = {
        scrollingEnabled: true
    }

    render() {
      // console.log('instructions')
      // console.log(this.state.instructions)
      // console.log('order')
      // console.log(this.state.instructionsOrder)
    //   const instructionsHeight = (this.state.instructionsOrder.length+1)*9.5
      // console.log(instructionsHeight)
        if (this.props.scrollingEnabled)
        {
            return (
                <SafeAreaView style={centralStyles.fullPageSafeAreaView}>
                <Image
                source={require('../dataComponents/spinach.jpg')}
                style={centralStyles.spinachFullBackground}
                // resizeMode={"cover"}
                />
                {/* <KeyboardAvoidingView style={centralStyles.fullPageKeyboardAvoidingView}> */}
                {this.props.awaitingServer && <View style={centralStyles.activityIndicatorContainer}><ActivityIndicator style={centralStyles.activityIndicator } size="large" color="#104e01" /></View>}
                {/* {this.state.filterDisplayed ? <FilterMenu handleCategoriesButton={this.handleCategoriesButton} newRecipe={true} confirmButtonText={"Save"} title={"Select categories for your recipe"}/> : null} */}
                {/* {this.state.choosingPicture ? this.renderPictureChooser() : null} */}
                <ScrollView style={centralStyles.fullPageScrollView}
                nestedScrollEnabled={true}
                scrollEnabled={this.state.scrollingEnabled}
                keyboardShouldPersistTaps={'always'}
                // onPanResponderGrant={() => console.log('granted')}
                // onPanResponderRelease={() => console.log('released')}
                // disableScrollViewPanResponder={true}
                ref={(c) => { this.scrollView = c; }}
                >
                    {this.props.children}


                </ScrollView>
                {/* </KeyboardAvoidingView> */}
                </SafeAreaView>
            )
        }
        else {
            return (
                <SafeAreaView style={centralStyles.fullPageSafeAreaView}>
                <Image
                source={require('../dataComponents/spinach.jpg')}
                style={centralStyles.spinachFullBackground}
                // resizeMode={"cover"}
                />
                {/* <KeyboardAvoidingView style={centralStyles.fullPageKeyboardAvoidingView}> */}
                {this.props.awaitingServer && <View style={centralStyles.activityIndicatorContainer}><ActivityIndicator style={centralStyles.activityIndicator } size="large" color="#104e01" /></View>}
                {/* {this.state.filterDisplayed ? <FilterMenu handleCategoriesButton={this.handleCategoriesButton} newRecipe={true} confirmButtonText={"Save"} title={"Select categories for your recipe"}/> : null} */}
                {/* {this.state.choosingPicture ? this.renderPictureChooser() : null} */}

                    {this.props.children}


                {/* </KeyboardAvoidingView> */}
                </SafeAreaView>
            )
        }
    }
}