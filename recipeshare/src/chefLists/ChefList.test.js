import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import React from "react";
import { rootReducer, updateLoggedInChef } from "../redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ChefList from "./ChefList";
import NetInfo from "@react-native-community/netinfo";
import { getChefDetails, getChefList } from "../fetches";

jest.mock("../fetches", () => ({
	...jest.requireActual("../fetches"),
	getChefList: jest.fn(),
	getChefDetails: jest.fn(),
	postFollow: jest.fn(),
	destroyFollow: jest.fn(),
}));

jest.mock("../components", () => {
	const RN = jest.requireActual("react-native");
	return {
		SpinachAppContainer: ({ children }) => <RN.View>{children}</RN.View>,
		OfflineMessage: ({ message }) => <RN.Text>{message}</RN.Text>,
		SearchBar: ({ searchTerm, setSearchTerm }) => (
			<RN.TextInput value={searchTerm} placeholder="Search for Chefs" onChangeText={setSearchTerm} />
		),
		SearchBarClearButton: ({ setSearchTerm }) => (
			<RN.TouchableOpacity onPress={() => setSearchTerm("")}>
				<RN.Text>Clear Search</RN.Text>
			</RN.TouchableOpacity>
		),
	};
});

jest.mock("./ChefCard", () => {
	const RN = jest.requireActual("react-native");
	return function MockChefCard(props) {
		return (
			<RN.View>
				<RN.TouchableOpacity onPress={() => props.navigateToChefDetails(props.id)}>
					<RN.Text>{props.username}</RN.Text>
				</RN.TouchableOpacity>
			</RN.View>
		);
	};
});

jest.mock("../navigation/appHeader", () => {
	const RN = jest.requireActual("react-native");
	return function MockAppHeader() {
		return <RN.Text>Header</RN.Text>;
	};
});

jest.mock("../auxFunctions/saveChefListsLocally", () => ({
	saveChefListsLocally: jest.fn().mockResolvedValue(true),
	loadLocalChefLists: jest.fn().mockResolvedValue([]),
}));

jest.mock("../auxFunctions/saveChefDetailsLocally", () => jest.fn());

describe("ChefList", () => {
	let store;
	let navigation;
	let route;
	let parentNavigator;

	beforeEach(() => {
		store = configureStore({
			reducer: {
				root: rootReducer,
			},
		});

		store.dispatch(
			updateLoggedInChef({
				id: 22,
				e_mail: "test@email.com",
				username: "mockChef",
				auth_token: "mockAuthToken",
				image_url: "",
				is_admin: false,
				is_member: false,
			})
		);

		parentNavigator = {
			getState: jest.fn(() => ({
				routes: [{ params: { title: "Top Chefs" } }],
			})),
			setOptions: jest.fn(),
		};

		navigation = {
			addListener: jest.fn((_, cb) => cb),
			removeListener: jest.fn(),
			navigate: jest.fn(),
			push: jest.fn(),
			isFocused: jest.fn(() => true),
			getParent: jest.fn(() => parentNavigator),
		};

		route = {
			key: "testChefListRoute",
			name: "Chefs",
		};

		getChefList.mockResolvedValue([
			{
				id: 1,
				username: "Chef One",
				country: "US",
				profile_text: "bio",
				image_url: null,
				user_chef_following: 0,
				followers: 3,
				recipe_count: 2,
				recipe_likes_received: 1,
			},
		]);

		getChefDetails.mockResolvedValue({
			chef: {
				id: 1,
				username: "Chef One",
				country: "US",
				profile_text: "bio",
				image_url: null,
				created_at: "",
			},
			chef_commented: false,
			chef_followed: false,
			chef_liked: false,
			chef_made: false,
			chef_make_piced: false,
			chef_shared: false,
			comments: 0,
			comments_received: 0,
			followers: 0,
			following: 0,
			make_pics: 0,
			make_pics_received: 0,
			re_shares: 0,
			re_shares_received: 0,
			recipe_likes: 0,
			recipe_likes_received: 0,
			recipes: 0,
		});

		NetInfo.setReturnValue(true);
	});

	test("fetches and renders chefs on mount", async () => {
		const { getByText } = render(
			<Provider store={store}>
				<ChefList navigation={navigation} route={route} listChoice="Top Chefs" />
			</Provider>
		);

		await waitFor(() => expect(getChefList).toHaveBeenCalled());
		await waitFor(() => expect(getByText("Chef One")).toBeTruthy());
		expect(parentNavigator.setOptions).toHaveBeenCalled();
		expect(getChefList).toHaveBeenCalledWith("Top Chefs", 22, 10, 0, "mockAuthToken", "");
	});

	test("updates list when searching for chefs", async () => {
		const { getByPlaceholderText } = render(
			<Provider store={store}>
				<ChefList navigation={navigation} route={route} listChoice="Top Chefs" />
			</Provider>
		);

		await waitFor(() => expect(getChefList).toHaveBeenCalledTimes(1));
		fireEvent.changeText(getByPlaceholderText("Search for Chefs"), "alice");

		await waitFor(() => expect(getChefList).toHaveBeenCalledTimes(2));
		expect(getChefList).toHaveBeenLastCalledWith("Top Chefs", 22, 10, 0, "mockAuthToken", "alice");
	});

	test("shows offline message when offline", async () => {
		NetInfo.setReturnValue(false);

		const { getByText } = render(
			<Provider store={store}>
				<ChefList navigation={navigation} route={route} listChoice="Top Chefs" />
			</Provider>
		);

		await waitFor(() =>
			expect(getByText("Sorry, can't get recipes chefs now.\nYou appear to be offline.")).toBeTruthy()
		);
	});

	test("navigates to logout flow when chef list fetch throws Logout", async () => {
		getChefList.mockRejectedValue({ name: "Logout" });

		render(
			<Provider store={store}>
				<ChefList navigation={navigation} route={route} listChoice="Top Chefs" />
			</Provider>
		);

		await waitFor(() =>
			expect(navigation.navigate).toHaveBeenCalledWith("ProfileCover", {
				screen: "Profile",
				params: { logout: true },
			})
		);
	});

	test("navigates to chef details when chef card is pressed", async () => {
		const { getByText } = render(
			<Provider store={store}>
				<ChefList navigation={navigation} route={route} listChoice="Top Chefs" />
			</Provider>
		);

		await waitFor(() => expect(getByText("Chef One")).toBeTruthy());
		fireEvent.press(getByText("Chef One"));

		await waitFor(() => expect(getChefDetails).toHaveBeenCalledWith(1, "mockAuthToken"));
		await waitFor(() => expect(navigation.push).toHaveBeenCalledWith("ChefDetails", { chefID: 1 }));
	});

	test("uses local chef details fallback when API fails", async () => {
		getChefDetails.mockRejectedValue(new Error("network"));
		jest.spyOn(AsyncStorage, "getItem").mockImplementation((_, callback) => {
			callback(
				null,
				JSON.stringify([
					{
						chef: {
							id: 1,
							username: "Chef One",
							country: "US",
							profile_text: "bio",
							image_url: null,
							created_at: "",
						},
						chef_commented: false,
						chef_followed: false,
						chef_liked: false,
						chef_made: false,
						chef_make_piced: false,
						chef_shared: false,
						comments: 0,
						comments_received: 0,
						followers: 0,
						following: 0,
						make_pics: 0,
						make_pics_received: 0,
						re_shares: 0,
						re_shares_received: 0,
						recipe_likes: 0,
						recipe_likes_received: 0,
						recipes: 0,
					},
				])
			);
		});

		const { getByText } = render(
			<Provider store={store}>
				<ChefList navigation={navigation} route={route} listChoice="Top Chefs" />
			</Provider>
		);

		await waitFor(() => expect(getByText("Chef One")).toBeTruthy());
		fireEvent.press(getByText("Chef One"));

		await waitFor(() => expect(navigation.push).toHaveBeenCalledWith("ChefDetails", { chefID: 1 }));
	});
});
