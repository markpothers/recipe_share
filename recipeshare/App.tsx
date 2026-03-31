import "react-native-gesture-handler"; // required by react-navigation

import * as SplashScreen from "expo-splash-screen";

import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { Platform, StyleSheet } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import AppNavigator from "./src/navigation/AppNavigator";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { store } from "./src/redux/store";

// import { Asset, Font, Icon } from 'expo';

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

	return (
		<SafeAreaProvider onLayout={onLayoutRootView}>
			<NavigationContainer
				theme={{
					...DefaultTheme,
					colors: { ...DefaultTheme.colors, background: "#104e01" },
				}}
			>
				<Provider store={store}>
					<SafeAreaView style={styles.container} edges={["top", "bottom"]}>
						<StatusBar
							backgroundColor="#000"
							style={Platform.OS === "ios" ? "auto" : "light"}
						/>
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
		backgroundColor: "#104e01",
		// borderWidth: 1,
		// borderColor: "red"
	},
});
