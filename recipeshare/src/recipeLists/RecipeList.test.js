// import 'react-native'
import React from 'react';
// import Adapter from 'enzyme-adapter-react-16'
// import { configure, shallow, mount } from 'enzyme'
import renderer, { act } from 'react-test-renderer';
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
// configure({adapter: new Adapter() })

import RecipesList, { RecipesList as NamedRecipesList } from './RecipesList.js'
import RecipeCard from './RecipeCard'
import { mockRecipeList } from '../../__mocks__/recipeList/mockRecipeList.js'
import { TouchableOpacity } from 'react-native';
import SearchBar from '../searchBar/SearchBar.js'
import { store } from '../redux/store'


const middlewares = [thunk]
const mockStoreCreator = configureStore(middlewares)

describe('Recipe List', () => {

	let component
	let mockCallBack
	let mockStore
	let navigation
	let buttonNames = [
		'reShareButton',
		'likeButton',
		'commentButton',
		'chefNameButton',
		'chefImageButton',
		'recipeNameButton',
		'recipeImageButton'
	]

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	})

	beforeEach(() => {
		// console.log('runs before every test')

		mockCallBack = jest.fn()
		mockStore = mockStoreCreator({
			recipes: {
				all: mockRecipeList,
			},
			recipes_details: {},
			loggedInChef: {
				id: 1
			},
			global_ranking: '',
			filter_settings: {},
			cuisine: 'Any',
			serves: 'Any',
		})
		navigation = {
			addListener: jest.fn()
		}
	})

	afterEach(() => {
		// console.log('runs after each test')
		// component.unmount()
	})

	afterAll(() => {
		// console.log('runs after all tests have completed')
	})

	// test('asyncly works', done => {
	// 	setTimeout(done, 100)
	// })

	// test('asyncly works using done()', done => {
	// 	setTimeout(() => {
	// 		console.log('I ran within the set Timeout while waiting for done()')
	// 		done()
	// 	}, 3000)
	// })

	// function sleep(time) {
	// 	return new Promise((resolve) => setTimeout(() => {
	// 		console.log('waiting in the promise')
	// 		resolve(true)
	// 	}
	// 	), time);
	// }

	// test('asyncly works using await', async () => {
	// 	let bool = false
	// 	bool = await sleep(5000)
	// 	expect(bool).toEqual(true)
	// })

	test('can be rendered when all recipes are already in the store, and cards are displayed', () => {
		act(() => {
			component = renderer.create(
				<Provider
					store={mockStore}
				>
					<RecipesList
						listChoice={"all"}
						route={{ name: 'All Recipes' }}
						mockCallBack={mockCallBack}
						navigation={navigation}
					/>
				</Provider>
			)
		})
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
		let root = component.root
		const cards = root.findAllByType(RecipeCard)
		expect(cards.length).toEqual(5)
	})

	test('renders the expected number of RecipeCards with their associated buttons (sanity check)', () => {
		//using the RecipeList FlatList InitialNumToRender value
		act(() => {
			component = renderer.create(
				<NamedRecipesList
					listChoice={"all"}
					route={{ name: 'All Recipes' }}
					mockCallBack={mockCallBack}
					navigation={navigation}
					all_Recipes={mockRecipeList}
				/>
			)
		})
		let root = component.root
		const cards = root.findAllByType(RecipeCard)
		expect(cards.length).toEqual(5)
		buttonNames.forEach(buttonName => {
			let button = root.findAllByType(TouchableOpacity).filter(b => b.props.testID === buttonName)
			expect(button.length).toEqual(5)
		})
	})

	test('has a searchBar, the filling in of which updates a value in state', () => {
		act(() => {
			component = renderer.create(
				<NamedRecipesList
					listChoice={"all"}
					route={{ name: 'All Recipes' }}
					navigation={navigation}
					all_Recipes={mockRecipeList}
				/>
			)
		})
		let instance = component.getInstance()
		let root = component.root
		expect(instance.state.searchTerm).toEqual("")
		let input = root.findByProps({ testID: "searchTermInput" })
		let searchBar = root.findByType(SearchBar)
		expect(searchBar.props.setSearchTerm).toBe(instance.setSearchTerm)
		input.props.onChangeText('spaghetti')
		expect(instance.state.searchTerm).toEqual('spaghetti')
	})

	test('has a likeRecipe method which is called when likeButtons are pressed', async () => {
		act(() => {
			component = renderer.create(
				<NamedRecipesList
					listChoice={"all"}
					route={{ name: 'All Recipes' }}
					navigation={navigation}
					all_Recipes={mockRecipeList}
				/>
			)
		})
		let instance = component.getInstance()
		const spy = jest.spyOn(instance, 'likeRecipe')
		instance.forceUpdate()
		instance.likeRecipe()
		let root = component.root
		let cards = root.findAllByType(RecipeCard)
		cards[0].props.likeRecipe()
		let buttons = root.findAllByType(TouchableOpacity).filter(b => b.props.testID === 'likeButton')
		buttons[0].props.onPress()
		expect(cards[0].props['likeRecipe']).toBe(instance.likeRecipe)
		expect(spy).toHaveBeenCalledTimes(3)
	})

});
