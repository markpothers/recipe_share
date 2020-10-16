// import 'react-native'
import React from 'react';
// import Adapter from 'enzyme-adapter-react-16'
// import { configure, shallow, mount } from 'enzyme'
import renderer, { act } from 'react-test-renderer';
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
// configure({adapter: new Adapter() })

import RecipesList, { RecipesList as NamedRecipesList } from './RecipesList.js'
import RecipeCard from './RecipeCard'
import { listProps } from '../../__mocks__/recipeList/mockCardContents.js'
import { TouchableOpacity } from 'react-native';

const mockStore = configureStore([])

describe('Recipe List', () => {

	let mountedRecipeList
	let mockCallBack
	let store
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
		store = mockStore({
			recipes: {
				all: [listProps[0]],
				// chef: [listProps[0]],
				// chef_feed: [listProps[0]],
				// chef_liked: [listProps[0]],
				// chef_made: [listProps[0]],
				// global_ranks: [listProps[0]],
				// most_liked: [listProps[0]],
				// most_made: [listProps[0]]
			},
			recipes_details: {},
			loggedInChef: {},
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
		mountedRecipeList.unmount()
	})

	afterAll(() => {
		// console.log('runs after all tests have completed')
	})

	// it('agrees that 1 = 1', () => {
	// 	expect(1).toEqual(1)
	// })

	// it('asyncly works', done => {
	// 	setTimeout(done, 100)
	// })

	// it('asyncly works using done()', done => {
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

	// it('asyncly works using await', async () => {
	// 	let bool = false
	// 	bool = await sleep(5000)
	// 	expect(bool).toEqual(true)
	// })

	it('can be rendered when all recipes are already in the store', async () => {
		mountedRecipeList = renderer.create(
			<Provider
				store={store}
			>
				<RecipesList
					listChoice={"all"}
					route={{ name: 'All Recipes' }}
					mockCallBack={mockCallBack}
					navigation={navigation}
				/>
			</Provider>
		)
		const image = mountedRecipeList.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('renders the expected number of RecipeCards with their associated buttons (sanity check)', async () => {
		//using the RecipeList FlatList InitialNumToRender value
		mountedRecipeList = await renderer.create(
			<NamedRecipesList
				listChoice={"all"}
				route={{ name: 'All Recipes' }}
				mockCallBack={mockCallBack}
				navigation={navigation}
				all_Recipes={listProps}
			/>
		)
		let root = mountedRecipeList.root
		const cards = root.findAllByType(RecipeCard)
		expect(cards.length).toEqual(5)
		buttonNames.forEach(buttonName => {
			let button = root.findAllByType(TouchableOpacity).filter(b => b.props.testID === buttonName)
			expect(button.length).toEqual(5)
		})
	})

	it('has a likeRecipe method which is called when likeButtons are pressed', async () => {
		act(() => {
			mountedRecipeList = renderer.create(
				<NamedRecipesList
					listChoice={"all"}
					route={{ name: 'All Recipes' }}
					navigation={navigation}
					all_Recipes={listProps}
				/>
			)
		})
		let instance = mountedRecipeList.getInstance()
		const spy = jest.spyOn(instance, 'likeRecipe')
		instance.forceUpdate()
		instance.likeRecipe()
		let root = mountedRecipeList.root
		let cards = root.findAllByType(RecipeCard)
		console.warn(cards[0].props.likeRecipe)
		cards[0].props.likeRecipe()
		let buttons = root.findAllByType(TouchableOpacity).filter(b => b.props.testID === 'likeButton')
		buttons[0].props.onPress()
		expect(cards[0].props.likeRecipe).toBe(instance.likeRecipe)
		expect(spy).toHaveBeenCalledTimes(3)
	})

	// it('can be rendered with chef recipes', () => {
	// 	mountedRecipeList = renderer.create(<Provider store={store}><RecipeList listChoice={"chef"} route={{name: 'My Recipes'}}  mockCallBack={mockCallBack} /></Provider>)
	// 	const image = mountedRecipeList.toJSON()
	// 	expect(image).toMatchSnapshot()
	// })

	// it('can be rendered with the chefs feed', () => {
	// 	mountedRecipeList = renderer.create(<Provider store={store}><RecipeList listChoice={"chef_feed"} route={{name: 'My Feed'}} mockCallBack={mockCallBack} /></Provider>)
	// 	const image = mountedRecipeList.toJSON()
	// 	expect(image).toMatchSnapshot()
	// })

	// it('can be rendered with the chef_liked feed', () => {
	// 	mountedRecipeList = renderer.create(<Provider store={store}><RecipeList listChoice={"chef_liked"} route={{name: 'Recipes I Like'}} mockCallBack={mockCallBack} /></Provider>)
	// 	const image = mountedRecipeList.toJSON()
	// 	expect(image).toMatchSnapshot()
	// })

	// it('can be rendered shallowly', () => {
	// 	mountedRecipeList = mount((<Provider store={store}><RecipesList mockCallBack={mockCallBack} /></Provider>))
	// 	console.warn(mountedRecipeList)
		// const image = mountedRecipeList.toJSON()
		// expect(image).toMatchSnapshot()
	// })

	// it('can be rendered shallowly', () => {
	// 	// mountedRecipeList = mount((<Provider store={store}><RecipeList mockCallBack={mockCallBack}/></Provider>))
	// 	mountedRecipeList = renderer.create(<Provider store={store}><RecipeList mockCallBack={mockCallBack} /></Provider>)
	// 	// mountedRecipeList = shallow(<RecipeList mockCallBack={mockCallBack}/>, {
	// 	//     wrappingComponent: props => <Provider store={store}>{props.children}</Provider>
	// 	// })
	// 	// let testButton = mountedRecipeList.findWhere((node) => node.prop('testID') === 'filterButton' )

	// 	console.log(mountedRecipeList)
	// 	// expect(mountedRecipeList.contains(<RecipeList/>)).toEqual(true)
	// 	let list = mountedRecipeList.root.findAllByProps({ testID: 'filterButton' })
	// 	console.log(list.length)
	// 	// expect(mountedRecipeList.contains('<Connect(RecipesList) mockCallBack={[Function: mockConstructor]} />')).toEqual(true)
	// })

	// it('can be rendered shallowly', () => {
	//     mountedRecipeList = shallow(<RecipeList mockCallBack={mockCallBack}/>, {wrappingComponent: (<Provider store={store}></Provider>)})
	//     // mountedRecipeList = shallow((<Provider store={store}><RecipeList mockCallBack={mockCallBack}/></Provider>))
	//     let testButton = mountedRecipeList.findWhere((node) => node.prop('testID') === 'filterButton' )
	//     console.log(testButton.length)
	//     // expect(mountedRecipeList.contains(<RecipeList/>)).toEqual(true)
	// })

	// it('has a filter button', () => {
	//     mountedRecipeList = shallow(<Provider store={store}><RecipeList mockCallBack={mockCallBack}/></Provider>)
	//     const instance = mountedRecipeList.root
	//     const filterButton = instance.findByType("TouchableOpacity")
	//     console.log(filterButton)
	// })

	// it('can be deeply rendered', () => {
	//     mountedRecipeList = renderer.create(<Provider store={store}><RecipeList mockCallBack={mockCallBack}/></Provider>)
	//     console.log(mountedRecipeList)
	// })

	// it('looks the same as it did previously', () => {
	//     const tree = mountedRecipeList.toJSON()
	//     expect(tree).toMatchSnapshot()
	// })

	// it('has some state', () => {
	//     let mountedRecipeList = shallow(<Provider store={store}><RecipeList/></Provider>)
	//     let recipeList = mountedRecipeList.find('RecipeList')
	//     console.log(recipeList.first())
	//     // expect(mountedRecipeList.first().state()).toEqual({ count: 0})
	// })

	// it('has a button for displaying the filter menu', () => {
	//             let mountedRecipeList = render(<RecipeList/>)

	//     let recipeList = mountedRecipeList.find('RecipeList')
	//     console.log(recipeList.length)
	//     // let filterButton = mountedRecipeList.findWhere((node) => node.prop('testID') === 'filterButton')

	//     // console.log(filterButton.length)
	//     // expect(filterButton.length).toBe(1)
	// })

	// it('the filter button causes a setState call when pressed', () => {
	//     let filterButton = mountedRecipeList.findWhere((node) => node.prop('testID') === 'filterButton')
	//     filterButton.first().props().onPress()
	//     expect(mockCallBack.mock.calls.length).toEqual(1)
	// })




	// it('contains some touchables', () => {
	//     let mountedRecipeList = shallow(<Provider store={store}><RecipeList/></Provider>)
	//     let touchables = mountedRecipeList('TouchableOpacity')
	//     expect(touchables.length).toBe(4)
	// })

});
