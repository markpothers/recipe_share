import 'react-native'
import React from 'react';
import { FlatList, TouchableOpacity, AsyncStorage, View, Switch } from 'react-native'
// import { configure, shallow, mount } from 'enzyme'
// import Adapter from 'enzyme-adapter-react-16'
import renderer, {create, act} from 'react-test-renderer';
import configureStore from 'redux-mock-store'

import { Provider } from 'react-redux'
// import { store } from '../src/functionalComponents/store'

// configure({adapter: new Adapter()})

import RecipeList from '../src/recipeLists/RecipesList.js'

const mockStore = configureStore([])

describe('Recipe List', () => {

    let mountedRecipeList
    let mockCallBack
    let store

    beforeEach(() => {
        mockCallBack = jest.fn()
        store = mockStore({
            recipes:{
                all: [],
                chef: [],
                chef_feed: [],
                chef_liked: [],
                chef_made: [],
                global_ranks: [],
                most_liked: [],
                most_made: []
            },
            recipes_details: {},
            loggedInChef: {},
            global_ranking: '',
            filter_settings: {},
            cuisine: 'Any',
            serves: 'Any',
        })
        mountedRecipeList = renderer.create(<Provider store={store}><RecipeList umockCallBack={mockCallBack}/></Provider>)
    })

    // it('can be rendered and matches its previous image', () => {
    //     const image = mountedRecipeList.toJSON()
    //     expect(image).toMatchSnapshot()
    // })

    // it('can be rendered shallowly', () => {
    //     mountedRecipeList = shallow((<Provider store={store}><RecipeList mockCallBack={mockCallBack}/></Provider>))
    //     const image = mountedRecipeList.toJSON()
    //     expect(image).toMatchSnapshot()
    // })

    it('can be worked on', () => {
        // mountedRecipeList = mount((<Provider store={store}><RecipeList mockCallBack={mockCallBack}/></Provider>))
        act(() => {
			mountedRecipeList = renderer.create(<Provider store={store}><RecipeList mockCallBack={mockCallBack}/></Provider>)
		})
        // mountedRecipeList = shallow(<RecipeList mockCallBack={mockCallBack}/>, {
        //     wrappingComponent: props => <Provider store={store}>{props.children}</Provider>
        // })
        // let testButton = mountedRecipeList.findWhere((node) => node.prop('testID') === 'filterButton' )

        // console.log(mountedRecipeList)
		// expect(mountedRecipeList.contains(<RecipeList/>)).toEqual(true)
		// expect(mountedRecipeList.toJSON()).toMatchSnapshot()

        let list = mountedRecipeList.root.findAllByType(TouchableOpacity)
		// console.log(list[0].props)
		expect(list.length).toEqual(1)


        // let switches = mountedRecipeList.root.findAllByType(Switch)
		// expect(switches.length).toEqual(0)
		// console.warn(`switches: ${switches.length}`)


		act(() => {
			list[0].props.onPress()
		})

		let newList = mountedRecipeList.root.findAllByType(TouchableOpacity)
		// console.log(list[0].props)
		expect(newList.length).toEqual(5)


		// setTimeout(() => {
			// let newSwitches = mountedRecipeList.root.findAllByType(Switch)
			// console.warn(`new switches: ${newSwitches.length}`)
			// expect(mountedRecipeList.toJSON()).toMatchSnapshot()
			// expect(newSwitches.length).toEqual(10)

			// done()
		// }, 2000)



        // expect(mountedRecipeList.contains('<Connect(RecipesList) mockCallBack={[Function: mockConstructor]} />')).toEqual(true)
    })

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
