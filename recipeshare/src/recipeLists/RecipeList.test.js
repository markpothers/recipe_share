import 'react-native'
import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'

import RecipeList from './RecipesList.js'
import { listProps } from '../../__mocks__/recipeList/mockCardContents.js'

const mockStore = configureStore([])

describe('Recipe List', () => {

	let mountedRecipeList
	let mockCallBack
	let store

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	})

	beforeEach(() => {
		// console.log('runs before every test')
		mockCallBack = jest.fn()
		store = mockStore({
			recipes: {
				all: listProps,
				chef: listProps,
				chef_feed: listProps,
				chef_liked: listProps,
				chef_made: listProps,
				global_ranks: listProps,
				most_liked: listProps,
				most_made: listProps
			},
			recipes_details: {},
			loggedInChef: {},
			global_ranking: '',
			filter_settings: {},
			cuisine: 'Any',
			serves: 'Any',
		})
	})

	afterEach(() => {
		// console.log('runs after each test')
	})

	afterAll(() => {
		// console.log('runs after all tests have completed')
	})

	// it('asyncly works', done => {
	// 	setTimeout(done, 100)
	// })

	// it('asyncly works in a different manner', done => {
	// 	setTimeout(() => {
	// 		console.log('I ran after 300 ms')
	// 		done()
	// 	}, 3000)
	// })

	// it('asyncly works using await', async() => {
	// 	await setTimeout(()=>{
	// 		console.log('I ran after 100 ms')
	// 	}, 100)
	// })

	it('can be rendered with all recipes', () => {
		mountedRecipeList = renderer.create(<Provider store={store}><RecipeList listChoice={"all"} route={{ name: 'All Recipes'}} mockCallBack={mockCallBack} /></Provider>)
		const image = mountedRecipeList.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered with chef recipes', () => {
		mountedRecipeList = renderer.create(<Provider store={store}><RecipeList listChoice={"chef"} route={{name: 'My Recipes'}}  mockCallBack={mockCallBack} /></Provider>)
		const image = mountedRecipeList.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered with the chefs feed', () => {
		mountedRecipeList = renderer.create(<Provider store={store}><RecipeList listChoice={"chef_feed"} route={{name: 'My Feed'}} mockCallBack={mockCallBack} /></Provider>)
		const image = mountedRecipeList.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered with the chef_liked feed', () => {
		mountedRecipeList = renderer.create(<Provider store={store}><RecipeList listChoice={"chef_liked"} route={{name: 'Recipes I Like'}} mockCallBack={mockCallBack} /></Provider>)
		const image = mountedRecipeList.toJSON()
		expect(image).toMatchSnapshot()
	})

	// it('can be rendered shallowly', () => {
	//     mountedRecipeList = shallow((<Provider store={store}><RecipeList mockCallBack={mockCallBack}/></Provider>))
	//     const image = mountedRecipeList.toJSON()
	//     expect(image).toMatchSnapshot()
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
