import 'react-native-gesture-handler';
import React from 'react';
import { Platform, StatusBar, StyleSheet, LogBox } from 'react-native';
import { Provider } from 'react-redux'
// import { Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import { store } from './src/redux/store'
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppLoading from 'expo-app-loading';
// This was requested by react Navigation although I can't see the difference in functionality
// import { enableScreens } from 'react-native-screens';
// enableScreens();

export default class App extends React.Component {
	state = {
		isLoadingComplete: false,
	};

	render() {
		// console.disableYellowBox = true;
		LogBox.ignoreAllLogs()
		if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
			return (
				<AppLoading
					startAsync={this._loadResourcesAsync}
					onError={this._handleLoadingError}
					onFinish={this._handleFinishLoading}
				/>
			);
		} else {
			return (
				<SafeAreaProvider>
					<NavigationContainer>
						<Provider store={store}>
							<SafeAreaView style={styles.container}>
								{Platform.OS === 'ios' && <StatusBar barStyle="default" />}
								<AppNavigator />
							</SafeAreaView>
						</Provider>
					</NavigationContainer>
				</SafeAreaProvider>
			);
		}
	}

	_loadResourcesAsync = async () => {
	};

	_handleLoadingError = error => {
		// In this case, you might want to report the error to your error
		// reporting service, for example Sentry
		console.warn(error);
	};

	_handleFinishLoading = () => {
		this.setState({ isLoadingComplete: true });
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
