/**
 * @jest-environment jsdom
 */

// stock imports always required for enzyme testing
import React from 'react';
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils';
// import { createSerializer } from 'enzyme-to-json';
// import serializer from 'enzyme-to-json/serializer';
// expect.addSnapshotSerializer(serializer)
// expect.addSnapshotSerializer(createSerializer({ mode: 'deep' }));
import toJson from 'enzyme-to-json';
import { findByTestID } from '../auxTestFunctions/findByTestId'

// suite-specific imports
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import { initialState, middleware } from '../redux/store'
import reducer from '../redux/reducer.js'
import { TouchableOpacity } from 'react-native'
// import { AlertPopUp } from '../alertPopUp/alertPopUp'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import OfflineMessage from '../offlineMessage/offlineMessage';
// import { apiCall } from '../auxFunctions/apiCall'
import RecipesList from './RecipesList.js'
import RecipeCard from './RecipeCard'
import { mockRecipeList } from '../../__mocks__/mockRecipeList.js'
import SearchBar from '../searchBar/SearchBar.js'
import { getRecipeList } from '../fetches/getRecipeList.js'
import { postRecipeLike } from '../fetches/postRecipeLike'
import { postReShare } from '../fetches/postReShare'
import { postRecipeMake } from '../fetches/postRecipeMake'
import { destroyRecipeLike } from '../fetches/destroyRecipeLike'
import { destroyReShare } from '../fetches/destroyReShare'
import { cuisines } from '../dataComponents/cuisines'
import { serves } from '../dataComponents/serves'
import NetInfo from '@react-native-community/netinfo'


// manual mocks
jest.mock('../auxFunctions/apiCall.js')
jest.mock('../fetches/getRecipeList.js')
jest.mock('../fetches/postRecipeLike')
jest.mock('../fetches/postReShare')
jest.mock('../fetches/postRecipeMake')
jest.mock('../fetches/destroyRecipeLike')
jest.mock('../fetches/destroyReShare')

describe('Recipe List', () => {

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
			name: 'All Recipes'
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

	describe('rendering', () => {

		test('renders correctly when empty with an empty list and a filter button and adds appropriate listeners, then removes listeners when unmounted', async () => {
			await act(async () => {
				component = await mount(
					<RecipesList
						navigation={navigation}
						route={route}
						listChoice={"all"}
					/>,
					{
						wrappingComponent: Provider,
						wrappingComponentProps: {
							store: store
						}
					}
				)
			})
			component.setProps({})
			let json = toJson(component)
			expect(json).toMatchSnapshot()
			let cards = component.find(RecipeCard)
			expect(cards.length).toEqual(0)
			let filterButton = findByTestID(component, TouchableOpacity, 'filterButton')
			expect(filterButton).toBeTruthy()
			expect(mockListener).toHaveBeenCalledTimes(2)
			expect(mockListener).toHaveBeenNthCalledWith(1, 'focus', expect.any(Function))
			expect(mockListener).toHaveBeenNthCalledWith(2, 'blur', expect.any(Function))
			component.unmount()
			expect(mockListenerRemove).toHaveBeenCalledTimes(2)
			expect(mockListenerRemove).toHaveBeenNthCalledWith(1, 'focus', expect.any(Function))
			expect(mockListenerRemove).toHaveBeenNthCalledWith(2, 'blur', expect.any(Function))
		})

		test("renders correctly with the My Feed Message when it's my feed and empty", async () => {
			getRecipeList.mockImplementation(() => new Promise.resolve({
				cuisines: cuisines,
				serves: serves,
				recipes: []
			}))
			await act(async () => {
				component = await mount(
					<RecipesList
						navigation={navigation}
						route={{ name: 'My Feed' }}
						listChoice={"chef_feed"}
					/>,
					{
						wrappingComponent: Provider,
						wrappingComponentProps: {
							store: store
						}
					}
				)
			})
			component.setProps({})
			let cards = component.find(RecipeCard)
			expect(cards.length).toEqual(0)
			let myFeedMessage = component.find(OfflineMessage)
			expect(myFeedMessage.first().props().testID).toEqual('myFeedMessage')
		})

		test('renders correctly with a bunch of recipe cards when data present', async () => {
			getRecipeList.mockImplementation(() => new Promise.resolve(mockRecipeList))
			await act(async () => {
				component = await mount(
					<RecipesList
						navigation={navigation}
						route={{ name: 'My Feed' }}
						listChoice={"chef_feed"}
					/>,
					{
						wrappingComponent: Provider,
						wrappingComponentProps: {
							store: store
						}
					}
				)
			})
			component.setProps({})
			let cards = component.find(RecipeCard)
			expect(cards.length).toEqual(17) //matches the initial num to render of the flatlist
			let searchBar = component.find(SearchBar)
			expect(searchBar.length).toEqual(1)
			// let json = toJson(component) // snapshot testing doesn't work with a list and cards because it results in too long a string
			// expect(component).toMatchSnapshot()
		})

		test('renders with offline message', async () => {
			getRecipeList.mockImplementation(() => new Promise.resolve({
				cuisines: cuisines,
				serves: serves,
				recipes: []
			}))
			await act(async () => {
				component = await mount(
					<RecipesList
						navigation={navigation}
						route={{ name: 'My Feed' }}
						listChoice={"chef_feed"}
					/>,
					{
						wrappingComponent: Provider,
						wrappingComponentProps: {
							store: store
						}
					}
				)
			})
			component.setProps({})
			let cards = component.find(RecipeCard)
			expect(cards.length).toEqual(0)
			instance = component.children().instance()
			instance.setState({ renderOfflineMessage: true })
			let offlineMessage = component.find(OfflineMessage)
			expect(offlineMessage.length).toEqual(1)
		})

	})

	describe('liking and commenting etc.', () => {

		let card
		let recipe

		beforeEach(async () => {
			// console.log('runs before every test')
			getRecipeList.mockImplementation(() => new Promise.resolve(mockRecipeList))
			await act(async () => {
				component = await mount(
					<RecipesList
						navigation={navigation}
						route={{
							name: 'My Feed',
							key: 'my_feed_1234'
						}}
						listChoice={"chef_feed"}
					/>,
					{
						wrappingComponent: Provider,
						wrappingComponentProps: {
							store: store
						}
					}
				)
			})
			component.setProps({})
			instance = component.children().instance()
			card = component.find(RecipeCard).first().props()
			recipe = instance.props.allRecipeLists[instance.props.route.key][0]
		})

		test('a RecipeCards likeRecipe is this.likeRecipe', async () => {
			expect(card.likeRecipe).toBe(instance.likeRecipe)
		})

		test('a RecipeCards unlikeRecipe is this.unlikeRecipe', async () => {
			expect(card.unlikeRecipe).toBe(instance.unlikeRecipe)
		})

		test('a RecipeCards makeRecipe is this.makeRecipe', async () => {
			expect(card.makeRecipe).toBe(instance.makeRecipe)
		})

		test('a RecipeCards reShareRecipe is this.reShareRecipe', async () => {
			expect(card.reShareRecipe).toBe(instance.reShareRecipe)
		})

		test('a RecipeCards unReShareRecipe is this.unReShareRecipe', async () => {
			expect(card.unReShareRecipe).toBe(instance.unReShareRecipe)
		})

		test('liking a recipe calls to server and if successful adds a like count', async () => {
			postRecipeLike.mockImplementation(() => new Promise.resolve(true))
			//console.log(instance.props.allRecipeLists[instance.props.route.key])
			let otherLikes = instance.props.allRecipeLists[instance.props.route.key].slice(1).map(r => r.likes_count)
			let otherChefLikes = instance.props.allRecipeLists[instance.props.route.key].slice(1).map(r => r.chef_liked)
			expect(recipe.likes_count).toEqual(3) //starting number for this recipe
			expect(recipe.chef_liked).toEqual(0) //starting number for this recipe
			await act(async () => { await card.likeRecipe(recipe.id) })
			expect(recipe.likes_count).toEqual(4) // add one to the recipe
			expect(recipe.chef_liked).toEqual(1) //change to recipe
			expect(instance.props.allRecipeLists[instance.props.route.key].slice(1).map(r => r.likes_count)).toEqual(otherLikes) //expect no changes to other likes
			expect(instance.props.allRecipeLists[instance.props.route.key].slice(1).map(r => r.chef_liked)).toEqual(otherChefLikes) //expect no changes to other likes
		})

		test('liking a recipe with incorrect access token', async () => {
			postRecipeLike.mockImplementation(() => new Promise.reject({ name: 'Logout' }))
			await act(async () => { await card.likeRecipe(recipe.id) })
			expect(mockNavigate).toHaveBeenCalled()
			expect(mockNavigate).toHaveBeenCalledWith('Profile', { screen: 'Profile', params: { logout: true } })
		})

		test('liking a recipe and getting and error results in the offline error on the recipe card', async () => {
			postRecipeLike.mockImplementation(() => new Promise.reject({}))
			await act(async () => { await card.likeRecipe(recipe.id) })
			expect(instance.state.dataICantGet).toContain(recipe.id)
		})

		test('liking a recipe while offline results in general offline error', async () => {
			NetInfo.setReturnValue({ isConnected: false })
			expect(instance.state.renderOfflineMessage).toEqual(false)
			await act(async () => { await card.likeRecipe(recipe.id) })
			expect(instance.state.renderOfflineMessage).toEqual(true)
		})

		test('unliking a liked recipe calls to server and if successful subtracts a like count', async () => {
			recipe = instance.props.allRecipeLists[instance.props.route.key][1] // recipe is now a recipe liked by this chef
			destroyRecipeLike.mockImplementation(() => new Promise.resolve(true))
			let otherLikes = [...instance.props.allRecipeLists[instance.props.route.key].slice(0, 1), ...instance.props.allRecipeLists[instance.props.route.key].slice(2)].map(r => r.likes_count)
			let otherChefLikes = [...instance.props.allRecipeLists[instance.props.route.key].slice(0, 1), ...instance.props.allRecipeLists[instance.props.route.key].slice(2)].map(r => r.chef_liked)
			expect(recipe.likes_count).toEqual(6) //starting number for this recipe
			expect(recipe.chef_liked).toEqual(1) //starting number for this recipe
			await act(async () => { await card.unlikeRecipe(recipe.id) })
			expect(recipe.likes_count).toEqual(5) // add one to the recipe
			expect(recipe.chef_liked).toEqual(0) //change to recipe
			expect([...instance.props.allRecipeLists[instance.props.route.key].slice(0, 1), ...instance.props.allRecipeLists[instance.props.route.key].slice(2)].map(r => r.likes_count)).toEqual(otherLikes) //expect no changes to other likes
			expect([...instance.props.allRecipeLists[instance.props.route.key].slice(0, 1), ...instance.props.allRecipeLists[instance.props.route.key].slice(2)].map(r => r.chef_liked)).toEqual(otherChefLikes) //expect no changes to other likes
		})

		test('unliking a recipe with incorrect access token', async () => {
			destroyRecipeLike.mockImplementation(() => new Promise.reject({ name: 'Logout' }))
			await act(async () => { await card.unlikeRecipe(recipe.id) })
			expect(mockNavigate).toHaveBeenCalled()
			expect(mockNavigate).toHaveBeenCalledWith('Profile', { screen: 'Profile', params: { logout: true } })
		})

		test('unliking a recipe and getting and error results in the offline error on the recipe card', async () => {
			destroyRecipeLike.mockImplementation(() => new Promise.reject({}))
			await act(async () => { await card.unlikeRecipe(recipe.id) })
			expect(instance.state.dataICantGet).toContain(recipe.id)
		})

		test('unliking a recipe while offline results in general offline error', async () => {
			NetInfo.setReturnValue({ isConnected: false })
			expect(instance.state.renderOfflineMessage).toEqual(false)
			await act(async () => { await card.unlikeRecipe(recipe.id) })
			expect(instance.state.renderOfflineMessage).toEqual(true)
		})

		test('resharing a recipe calls to server and if successful adds a share count', async () => {
			postReShare.mockImplementation(() => new Promise.resolve(true))
			let otherShares = instance.props.allRecipeLists[instance.props.route.key].slice(1).map(r => r.shares_count)
			let otherChefShares = instance.props.allRecipeLists[instance.props.route.key].slice(1).map(r => r.chef_shared)
			expect(recipe.shares_count).toEqual(2) //starting number for this recipe
			expect(recipe.chef_shared).toEqual(0) //starting number for this recipe
			await act(async () => { await card.reShareRecipe(recipe.id) })
			expect(recipe.shares_count).toEqual(3) // add one to the recipe
			expect(recipe.chef_shared).toEqual(1) //change to recipe
			expect(instance.props.allRecipeLists[instance.props.route.key].slice(1).map(r => r.shares_count)).toEqual(otherShares) //expect no changes to other likes
			expect(instance.props.allRecipeLists[instance.props.route.key].slice(1).map(r => r.chef_shared)).toEqual(otherChefShares) //expect no changes to other likes
		})

		test('resharing a recipe with incorrect access token', async () => {
			postReShare.mockImplementation(() => new Promise.reject({ name: 'Logout' }))
			await act(async () => { await card.reShareRecipe(recipe.id) })
			expect(mockNavigate).toHaveBeenCalled()
			expect(mockNavigate).toHaveBeenCalledWith('Profile', { screen: 'Profile', params: { logout: true } })
		})

		test('resharing a recipe and getting and error results in the offline error on the recipe card', async () => {
			postReShare.mockImplementation(() => new Promise.reject({}))
			await act(async () => { await card.reShareRecipe(recipe.id) })
			expect(instance.state.dataICantGet).toContain(recipe.id)
		})

		test('resharing a recipe while offline results in general offline error', async () => {
			NetInfo.setReturnValue({ isConnected: false })
			expect(instance.state.renderOfflineMessage).toEqual(false)
			await act(async () => { await card.reShareRecipe(recipe.id) })
			expect(instance.state.renderOfflineMessage).toEqual(true)
		})

		test('unReSharing a liked recipe calls to server and if successful subtracts a share count', async () => {
			recipe = instance.props.allRecipeLists[instance.props.route.key][2] // recipe is now a recipe liked by this chef
			destroyReShare.mockImplementation(() => new Promise.resolve(true))
			let otherLikes = [...instance.props.allRecipeLists[instance.props.route.key].slice(0, 2), ...instance.props.allRecipeLists[instance.props.route.key].slice(3)].map(r => r.shares_count)
			let otherChefLikes = [...instance.props.allRecipeLists[instance.props.route.key].slice(0, 2), ...instance.props.allRecipeLists[instance.props.route.key].slice(3)].map(r => r.chef_shared)
			expect(recipe.shares_count).toEqual(1) //starting number for this recipe
			expect(recipe.chef_shared).toEqual(1) //starting number for this recipe
			await act(async () => { await card.unReShareRecipe(recipe.id) })
			expect(recipe.shares_count).toEqual(0) // add one to the recipe
			expect(recipe.chef_shared).toEqual(0) //change to recipe
			expect([...instance.props.allRecipeLists[instance.props.route.key].slice(0, 2), ...instance.props.allRecipeLists[instance.props.route.key].slice(3)].map(r => r.shares_count)).toEqual(otherLikes) //expect no changes to other likes
			expect([...instance.props.allRecipeLists[instance.props.route.key].slice(0, 2), ...instance.props.allRecipeLists[instance.props.route.key].slice(3)].map(r => r.chef_shared)).toEqual(otherChefLikes) //expect no changes to other likes
		})

		test('unReSharing a recipe with incorrect access token', async () => {
			destroyReShare.mockImplementation(() => new Promise.reject({ name: 'Logout' }))
			await act(async () => { await card.unReShareRecipe(recipe.id) })
			expect(mockNavigate).toHaveBeenCalled()
			expect(mockNavigate).toHaveBeenCalledWith('Profile', { screen: 'Profile', params: { logout: true } })
		})

		test('unReSharing a recipe and getting and error results in the offline error on the recipe card', async () => {
			destroyReShare.mockImplementation(() => new Promise.reject({}))
			await act(async () => { await card.unReShareRecipe(recipe.id) })
			expect(instance.state.dataICantGet).toContain(recipe.id)
		})

		test('unReSharing a recipe while offline results in general offline error', async () => {
			NetInfo.setReturnValue({ isConnected: false })
			expect(instance.state.renderOfflineMessage).toEqual(false)
			await act(async () => { await card.unReShareRecipe(recipe.id) })
			expect(instance.state.renderOfflineMessage).toEqual(true)
		})


		test('making a recipe calls to server and if successful adds a make count', async () => {
			postRecipeMake.mockImplementation(() => new Promise.resolve(true))
			let otherMakes = instance.props.allRecipeLists[instance.props.route.key].slice(1).map(r => r.makes_count)
			let otherChefMakes = instance.props.allRecipeLists[instance.props.route.key].slice(1).map(r => r.chef_made)
			expect(recipe.makes_count).toEqual(1) //starting number for this recipe
			expect(recipe.chef_made).toEqual(0) //starting number for this recipe
			await act(async () => { await card.makeRecipe(recipe.id) })
			expect(recipe.makes_count).toEqual(2) // add one to the recipe
			expect(recipe.chef_made).toEqual(1) //change to recipe
			expect(instance.props.allRecipeLists[instance.props.route.key].slice(1).map(r => r.makes_count)).toEqual(otherMakes) //expect no changes to other likes
			expect(instance.props.allRecipeLists[instance.props.route.key].slice(1).map(r => r.chef_made)).toEqual(otherChefMakes) //expect no changes to other likes
		})

		test('making a recipe with incorrect access token', async () => {
			postRecipeMake.mockImplementation(() => new Promise.reject({ name: 'Logout' }))
			await act(async () => { await card.makeRecipe(recipe.id) })
			expect(mockNavigate).toHaveBeenCalled()
			expect(mockNavigate).toHaveBeenCalledWith('Profile', { screen: 'Profile', params: { logout: true } })
		})

		test('making a recipe and getting and error results in the offline error on the recipe card', async () => {
			postRecipeMake.mockImplementation(() => new Promise.reject({}))
			await act(async () => { await card.makeRecipe(recipe.id) })
			expect(instance.state.dataICantGet).toContain(recipe.id)
		})

		test('making a recipe while offline results in general offline error', async () => {
			NetInfo.setReturnValue({ isConnected: false })
			expect(instance.state.renderOfflineMessage).toEqual(false)
			await act(async () => { await card.makeRecipe(recipe.id) })
			expect(instance.state.renderOfflineMessage).toEqual(true)
		})

	})

})
