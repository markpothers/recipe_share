/**
 * @jest-environment jsdom
 */

// stock imports always required for enzyme testing
import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
// import { mount } from 'enzyme'
// import { act } from 'react-dom/test-utils';
// import { createSerializer } from 'enzyme-to-json';
// import serializer from 'enzyme-to-json/serializer';
// expect.addSnapshotSerializer(serializer)
// expect.addSnapshotSerializer(createSerializer({ mode: 'deep' }));
// import toJson from 'enzyme-to-json';
import { findByTestID } from "../auxTestFunctions/findByTestId"

// suite-specific imports
import { createStore } from "redux"
import { Provider } from "react-redux"
import { recipeList } from "../../__mocks__/data/recipeList"

import { initialState, middleware } from "../redux/store"
import reducer from "../redux/reducer"
import { TouchableOpacity } from "react-native"
// import { AlertPopUp } from '../alertPopUp/alertPopUp'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import OfflineMessage from "../offlineMessage/offlineMessage"
// import { apiCall } from '../auxFunctions/apiCall'
import RecipesList from "./RecipesList"
import RecipeCard from "./RecipeCard"
// import { mockRecipeList } from '../../__mocks__/mockRecipeList.js'
import SearchBar from "../searchBar/SearchBar"
import { getRecipeList } from "../fetches/getRecipeList"
import { postRecipeLike } from "../fetches/postRecipeLike"
import { postReShare } from "../fetches/postReShare"
import { postRecipeMake } from "../fetches/postRecipeMake"
import { destroyRecipeLike } from "../fetches/destroyRecipeLike"
import { destroyReShare } from "../fetches/destroyReShare"
import { cuisines } from "../dataComponents/cuisines"
import { serves } from "../dataComponents/serves"
import NetInfo from "@react-native-community/netinfo"


// manual mocks
jest.mock("../auxFunctions/apiCall")
jest.mock("../fetches/getRecipeList")
jest.mock("../fetches/postRecipeLike")
jest.mock("../fetches/postReShare")
jest.mock("../fetches/postRecipeMake")
jest.mock("../fetches/destroyRecipeLike")
jest.mock("../fetches/destroyReShare")

describe("Recipe List", () => {

	let component
	let navigation
	let route
	let instance
	let mockListener
	let mockListenerRemove
	let mockNavigate
	let store

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	})

	beforeEach(async () => {
		// console.log('runs before every test')
		store = createStore(reducer, initialState, middleware)
		mockListener = jest.fn()
		mockNavigate = jest.fn()
		mockListenerRemove = jest.fn()

		navigation = {
			addListener: mockListener,
			removeListener: mockListenerRemove,
			navigate: mockNavigate
		}

		route = {
			name: "All Recipes"
		}

		NetInfo.setReturnValue({ isConnected: true })

	})

	afterEach(async () => {
		// console.log('runs after each test')
		// AsyncStorage.setItem.mockClear() //forget calls to this method between tests
		// AsyncStorage.getItem.mockClear()
		// AsyncStorage.clear() //clear out the contents of AsyncStorage between tests
	})

	afterAll(() => {
		// console.log('runs after all tests have completed')
	})

	describe("rendering", () => {

		test("works with testing library", async () => {
			const { toJSON, getByTestId } = render(
				<Provider store={store}>
					<RecipesList
						navigation={navigation}
						route={route}
						listChoice={"all"}
					/>
				</Provider>)
			await waitFor(() => expect(toJSON()).toMatchSnapshot)

			const filterButton = getByTestId("filterButton")
			// expect(filterButton).toBeTruthy()

			console.log("mark")
			expect(mockListener).toHaveBeenCalledTimes(2)
			expect(mockListener).toHaveBeenNthCalledWith(1, "focus", expect.any(Function))
			expect(mockListener).toHaveBeenNthCalledWith(2, "blur", expect.any(Function))
		})

		// test('renders correctly when empty with an empty list and a filter button and adds appropriate listeners, then removes listeners when unmounted', async () => {
		// 	await act(async () => {
		// 		component = await mount(
		// 			<RecipesList
		// 				navigation={navigation}
		// 				route={route}
		// 				listChoice={"all"}
		// 			/>,
		// 			{
		// 				wrappingComponent: Provider,
		// 				wrappingComponentProps: {
		// 					store: store
		// 				}
		// 			}
		// 		)
		// 	})
		// 	component.setProps({})
		// 	let json = toJson(component)
		// 	expect(json).toMatchSnapshot()
		// 	let cards = component.find(RecipeCard)
		// 	expect(cards.length).toEqual(0)
		// 	let filterButton = findByTestID(component, TouchableOpacity, 'filterButton')
		// 	expect(filterButton).toBeTruthy()
		// 	expect(mockListener).toHaveBeenCalledTimes(2)
		// 	expect(mockListener).toHaveBeenNthCalledWith(1, 'focus', expect.any(Function))
		// 	expect(mockListener).toHaveBeenNthCalledWith(2, 'blur', expect.any(Function))
		// 	component.unmount()
		// 	expect(mockListenerRemove).toHaveBeenCalledTimes(2)
		// 	expect(mockListenerRemove).toHaveBeenNthCalledWith(1, 'focus', expect.any(Function))
		// 	expect(mockListenerRemove).toHaveBeenNthCalledWith(2, 'blur', expect.any(Function))
		// })
	})

})
