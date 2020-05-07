import React from 'react'
import { ScrollView, SafeAreaView, Image, KeyboardAvoidingView, View, ActivityIndicator } from 'react-native'
import { centralStyles } from '../centralStyleSheet'


export default class SpinachAppContainer extends React.Component {
    static navigationOptions = {

    }

    state = {
        scrollingEnabled: true
    }

    render() {
        if (this.props.scrollingEnabled){
            return (
                <SafeAreaView style={centralStyles.fullPageSafeAreaView}>
                    <Image
                        source={require('../dataComponents/spinach.jpg')}
                        style={centralStyles.spinachFullBackground}
                    />
                    {this.props.awaitingServer && <View style={centralStyles.activityIndicatorContainer}><ActivityIndicator style={centralStyles.activityIndicator } size="large" color="#104e01" /></View>}
                    <ScrollView style={centralStyles.fullPageScrollView}
                        nestedScrollEnabled={true}
                        scrollEnabled={this.state.scrollingEnabled}
                        keyboardShouldPersistTaps={'always'}
                        ref={(c) => { this.scrollView = c; }}
                    >
                        {this.props.children}
                    </ScrollView>
                </SafeAreaView>
            )
        }
        else {
            return (
                <SafeAreaView style={centralStyles.fullPageSafeAreaView}>
                    <Image
                        source={require('../dataComponents/spinach.jpg')}
                        style={centralStyles.spinachFullBackground}
                    />
                    {this.props.awaitingServer && <View style={centralStyles.activityIndicatorContainer}><ActivityIndicator style={centralStyles.activityIndicator } size="large" color="#104e01" /></View>}
                    {this.props.children}
                </SafeAreaView>
            )
        }
    }
}