import "react-native-gesture-handler"; // required by react-navigation
import React, { useState, useEffect, useCallback } from "react";
import { Platform, StatusBar, StyleSheet, LogBox } from "react-native";
import { Provider } from "react-redux";
// import { Asset, Font, Icon } from 'expo';
import AppNavigator from "./navigation/AppNavigator";
import { store } from "./src/redux/store";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";

export default function App() {
	const [appIsReady, setAppIsReady] = useState(false);

	useEffect(() => {
		async function prepare() {
			try {
				// Keep the splash screen visible while we fetch resources
				await SplashScreen.preventAutoHideAsync();
				// Pre-load fonts, make any API calls you need to do here
				// await Font.loadAsync(Entypo.font);
			} catch (e) {
				console.warn(e);
			} finally {
				// Tell the application to render
				setAppIsReady(true);
			}
		}

		prepare();
	}, []);

	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			// This tells the splash screen to hide immediately! If we call this after
			// `setAppIsReady`, then we may see a blank screen while the app is
			// loading its initial state and rendering its first pixels. So instead,
			// we hide the splash screen once we know the root view has already
			// performed layout.
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	if (!appIsReady) {
		return null;
	}

	LogBox.ignoreAllLogs();
	return (
		<SafeAreaProvider onLayout={onLayoutRootView}>
			<NavigationContainer>
				<Provider store={store}>
					<SafeAreaView style={styles.container}>
						{Platform.OS === "ios" && <StatusBar barStyle="default" />}
						<AppNavigator />
					</SafeAreaView>
				</Provider>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
});
