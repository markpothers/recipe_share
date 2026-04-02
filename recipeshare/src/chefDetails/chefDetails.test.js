import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import React from "react";
import { rootReducer, storeChefDetails, updateLoggedInChef } from "../redux";

import ChefDetails from "./chefDetails";
import NetInfo from "@react-native-community/netinfo";
import { destroyFollow, postFollow } from "../fetches";

jest.mock("../fetches", () => ({
	...jest.requireActual("../fetches"),
	postFollow: jest.fn(),
	destroyFollow: jest.fn(),
	getChefDetails: jest.fn(),
}));

jest.mock("../components", () => {
	const RN = jest.requireActual("react-native");
	return {
		OfflineMessage: ({ message }) => <RN.Text>{message}</RN.Text>,
		SpinachAppContainer: ({ children }) => <RN.View>{children}</RN.View>,
	};
});

jest.mock("./ChefDetailsCard", () => {
	const RN = jest.requireActual("react-native");
	return function MockChefDetailsCard() {
		return <RN.Text>Chef details card</RN.Text>;
	};
});

jest.mock("./ChefDetailsNavigators", () => {
	const RN = jest.requireActual("react-native");
	return {
		ChefRecipeBookTabs: () => <RN.Text>Chef tabs</RN.Text>,
	};
});

jest.mock("../dynamicMenu/DynamicMenu", () => {
	const RN = jest.requireActual("react-native");
	return function MockDynamicMenu({ buttons, closeDynamicMenu }) {
		return (
			<RN.View>
				{buttons.map((button) => (
					<RN.TouchableOpacity key={button.text} onPress={button.action}>
						<RN.Text>{button.text}</RN.Text>
					</RN.TouchableOpacity>
				))}
				<RN.TouchableOpacity onPress={closeDynamicMenu}>
					<RN.Text>Close Menu</RN.Text>
				</RN.TouchableOpacity>
			</RN.View>
		);
	};
});

describe("ChefDetails", () => {
	let store;
	let navigation;
	let route;

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

		store.dispatch(
			storeChefDetails({
				chefID: "chef1",
				chef_details: {
					chef: {
						id: 1,
						username: "chef one",
						country: "USA",
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
			})
		);

		navigation = {
			setOptions: jest.fn(),
			navigate: jest.fn(),
		};

		route = {
			params: {
				chefID: 1,
			},
		};

		NetInfo.setReturnValue(true);
		postFollow.mockResolvedValue(true);
		destroyFollow.mockResolvedValue(true);
	});

	test("renders with chef details and sets header options", async () => {
		const { getByText } = render(
			<Provider store={store}>
				<ChefDetails navigation={navigation} route={route} />
			</Provider>
		);

		await waitFor(() => expect(getByText("Chef details card")).toBeTruthy());
		expect(getByText("Chef tabs")).toBeTruthy();
		expect(navigation.setOptions).toHaveBeenCalled();
	});

	test("follows chef from dynamic menu", async () => {
		const { getByText } = render(
			<Provider store={store}>
				<ChefDetails navigation={navigation} route={route} />
			</Provider>
		);

		await waitFor(() => expect(navigation.setOptions).toHaveBeenCalled());
		const headerConfig = navigation.setOptions.mock.calls[0][0];

		act(() => {
			const headerRight = headerConfig.headerRight();
			headerRight.props.buttonAction();
		});

		await waitFor(() => expect(getByText("Follow chef")).toBeTruthy());
		fireEvent.press(getByText("Follow chef"));

		await waitFor(() => expect(postFollow).toHaveBeenCalledWith(22, 1, "mockAuthToken"));
	});

	test("navigates to NewRecipe from dynamic menu", async () => {
		const { getByText } = render(
			<Provider store={store}>
				<ChefDetails navigation={navigation} route={route} />
			</Provider>
		);

		await waitFor(() => expect(navigation.setOptions).toHaveBeenCalled());
		const headerConfig = navigation.setOptions.mock.calls[0][0];

		act(() => {
			const headerRight = headerConfig.headerRight();
			headerRight.props.buttonAction();
		});

		await waitFor(() => expect(getByText("Create new recipe")).toBeTruthy());
		fireEvent.press(getByText("Create new recipe"));
		expect(navigation.navigate).toHaveBeenCalledWith("NewRecipe");
	});

	test("uses unfollow action when chef is already followed", async () => {
		store.dispatch(
			storeChefDetails({
				chefID: "chef1",
				chef_details: {
					...store.getState().root.chef_details.chef1,
					chef_followed: true,
					followers: 5,
				},
			})
		);

		const { getByText } = render(
			<Provider store={store}>
				<ChefDetails navigation={navigation} route={route} />
			</Provider>
		);

		await waitFor(() => expect(navigation.setOptions).toHaveBeenCalled());
		const headerConfig = navigation.setOptions.mock.calls[0][0];

		act(() => {
			const headerRight = headerConfig.headerRight();
			headerRight.props.buttonAction();
		});

		await waitFor(() => expect(getByText("Stop following chef")).toBeTruthy());
		fireEvent.press(getByText("Stop following chef"));
		await waitFor(() => expect(destroyFollow).toHaveBeenCalledWith(22, 1, "mockAuthToken"));
	});

	test("shows offline message when follow is attempted offline", async () => {
		NetInfo.setReturnValue(false);

		const { getByText } = render(
			<Provider store={store}>
				<ChefDetails navigation={navigation} route={route} />
			</Provider>
		);

		await waitFor(() => expect(navigation.setOptions).toHaveBeenCalled());
		const headerConfig = navigation.setOptions.mock.calls[0][0];

		act(() => {
			const headerRight = headerConfig.headerRight();
			headerRight.props.buttonAction();
		});

		fireEvent.press(getByText("Follow chef"));

		await waitFor(() =>
			expect(getByText("Sorry, can't do that right now.\nYou appear to be offline.")).toBeTruthy()
		);
	});

	test("navigates to logout flow when follow request throws Logout", async () => {
		postFollow.mockRejectedValue({ name: "Logout" });

		const { getByText } = render(
			<Provider store={store}>
				<ChefDetails navigation={navigation} route={route} />
			</Provider>
		);

		await waitFor(() => expect(navigation.setOptions).toHaveBeenCalled());
		const headerConfig = navigation.setOptions.mock.calls[0][0];

		act(() => {
			const headerRight = headerConfig.headerRight();
			headerRight.props.buttonAction();
		});

		fireEvent.press(getByText("Follow chef"));

		await waitFor(() =>
			expect(navigation.navigate).toHaveBeenCalledWith("ProfileCover", {
				screen: "Profile",
				params: { logout: true },
			})
		);
	});

	test("renders fallback container when chef details are missing", async () => {
		const { queryByText } = render(
			<Provider store={store}>
				<ChefDetails navigation={navigation} route={{ params: { chefID: 999 } }} />
			</Provider>
		);

		await waitFor(() => expect(queryByText("Chef details card")).toBeNull());
	});
});
