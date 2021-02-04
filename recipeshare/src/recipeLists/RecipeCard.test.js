import 'react-native'
import React from 'react';
import renderer from 'react-test-renderer';

import RecipeCard from './RecipeCard.js'
import { mockRecipeList } from '../../__mocks__/recipeList/mockRecipeList.js'
// import OfflineMessage from '../offlineMessage/offlineMessage';


describe('Recipe Card', () => {

	let component

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	})

	beforeEach(() => {
		// console.log('runs before every test')
	})

	afterEach(() => {
		// console.log('runs after each test')
	})

	afterAll(() => {
		// console.log('runs after all tests have completed')
	})

	// test('asyncly works', done => {
	// 	setTimeout(() => {
	// 		//do things
	// 		done()
	// 	}, 100)
	// })

	test('can be rendered using typical props and matches its previous image - 1', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:NORMAL"))
		component = renderer.create(<RecipeCard {...testProps} />)
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
	})

	test('can be rendered using typical props and matches its previous image - 2', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:NORMAL2"))
		component = renderer.create(<RecipeCard {...testProps} />)
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
	})

	test('can be rendered using typical props and matches its previous image - 3', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:NORMAL"))
		component = renderer.create(<RecipeCard {...testProps} />)
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
	})

	test('can be rendered using typical props and matches its previous image - 4', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:NORMAL4"))
		component = renderer.create(<RecipeCard {...testProps} />)
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
	})

	test('can be rendered using typical props and matches its previous image - 5', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:NORMAL5"))
		component = renderer.create(<RecipeCard {...testProps} />)
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
	})

	test('can be rendered using typical props and matches its previous image - 6', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:NORMAL6"))
		component = renderer.create(<RecipeCard {...testProps} />)
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
	})

	test('can be rendered when the recipe has been LIKED and matches its previous image', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:LIKED"))
		component = renderer.create(<RecipeCard {...testProps} />)
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
	})

	test('can be rendered when the recipe has been COMMENTED and matches its previous image', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:COMMENTED"))
		component = renderer.create(<RecipeCard {...testProps} />)
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
	})

	test('can be rendered when the recipe has been SHARED and matches its previous image', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:SHARED"))
		component = renderer.create(<RecipeCard {...testProps} />)
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
	})

	test('can be rendered when the recipe has been LIKED, COMMENTED, and SHARED and matches its previous image', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:ALL"))
		component = renderer.create(<RecipeCard {...testProps} />)
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
	})

	test('can be rendered when the recipe has been a LONG RECIPE NAME and matches its previous image', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:LONGRECIPENAME"))
		component = renderer.create(<RecipeCard {...testProps} />)
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
	})

	test('can be rendered when the recipe has NO COVER IMAGE and matches its previous image', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:NOCOVERIMAGE"))
		component = renderer.create(<RecipeCard {...testProps} />)
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
	})

	test('can be rendered when the recipe has been RE_SHARED BY SOMEONE and matches its previous image', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:RESHAREDBY"))
		component = renderer.create(<RecipeCard {...testProps} />)
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
	})

	test('can be rendered when the recipe has a LONG RESHARER USERNAME and matches its previous image', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:LONGRESHARERUSERNAME"))
		component = renderer.create(<RecipeCard {...testProps} />)
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
	})

	test('can be rendered when the recipe has is from a chef with a LONG USERNAME and matches its previous image', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:LONGUSERNAME"))
		component = renderer.create(<RecipeCard {...testProps} />)
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
	})

	test('can be rendered when the recipe has is from a chef with NO CHEFIMAGE and matches its previous image', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:NOCHEFIMAGE"))
		component = renderer.create(<RecipeCard {...testProps} />)
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
	})

	test('has a PostedBy section if the recipe has been re-shared by someone', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:RESHARED"))
		component = renderer.create(<RecipeCard {...testProps} />)
		let root = component.root
		let element = root.findByProps({ testID: "postedByElement" })
		expect(element).toBeTruthy()
	})

	test('does not show the Re-shared section if the recipe is not re-shared', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:NORMAL"))
		component = renderer.create(<RecipeCard {...testProps} />)
		let root = component.root
		let elements = root.findAllByProps({ testID: "postedByElement" })
		expect(elements.length).toBe(0)
	})

	test('has a reShare button that can be pressed and calls to share recipe', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:NORMAL"))
		const mockFn = jest.fn()
		component = renderer.create(<RecipeCard {...testProps} reShareRecipe={mockFn} />)
		let root = component.root
		let button = root.findByProps({ testID: "reShareButton" })
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.id)
	})

	test('has a reShare button that, when the recipe has been shared, calls to unShare recipe', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:RESHARED"))
		const mockFn = jest.fn()
		component = renderer.create(<RecipeCard {...testProps} unReShareRecipe={mockFn} />)
		let root = component.root
		let button = root.findByProps({ testID: "reShareButton" })
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.id)
	})

	test('has a like button that can be pressed and calls to like recipe', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:NORMAL"))
		const mockFn = jest.fn()
		component = renderer.create(<RecipeCard {...testProps} likeRecipe={mockFn} />)
		let root = component.root
		let button = root.findByProps({ testID: "likeButton" })
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.id)
	})

	test('has a like button that, when the recipe has been liked, calls to unLike recipe', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:LIKED"))
		const mockFn = jest.fn()
		component = renderer.create(<RecipeCard {...testProps} unlikeRecipe={mockFn} />)
		let root = component.root
		let button = root.findByProps({ testID: "likeButton" })
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.id)
	})

	test('has a comment button that can be pressed and calls to navigate to recipe with commenting true', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:NORMAL"))
		const mockFn = jest.fn()
		component = renderer.create(<RecipeCard {...testProps} navigateToRecipeDetails={mockFn} />)
		let root = component.root
		let button = root.findByProps({ testID: "commentButton" })
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.id, true)
	})

	test('has a comment button that, when the recipe has been commented, calls to navigate to recipe with commenting true', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:COMMENTED"))
		const mockFn = jest.fn()
		component = renderer.create(<RecipeCard {...testProps} navigateToRecipeDetails={mockFn} />)
		let root = component.root
		let button = root.findByProps({ testID: "commentButton" })
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.id, true)
	})

	test('has a button on the chef name that can be pressed and calls to navigate to the chef', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:NORMAL"))
		const mockFn = jest.fn()
		component = renderer.create(<RecipeCard {...testProps} navigateToChefDetails={mockFn} />)
		let root = component.root
		let button = root.findByProps({ testID: "chefNameButton" })
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.chef_id, testProps.id)
	})

	test('has a button on the chef image that can be pressed and calls to navigate to the chef', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:NORMAL"))
		const mockFn = jest.fn()
		component = renderer.create(<RecipeCard {...testProps} navigateToChefDetails={mockFn} />)
		let root = component.root
		let button = root.findByProps({ testID: "chefImageButton" })
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.chef_id, testProps.id)
	})

	test('has a button on the sharer name that can be pressed and calls to navigate to the chef', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:RESHAREDBY"))
		const mockFn = jest.fn()
		component = renderer.create(<RecipeCard {...testProps} navigateToChefDetails={mockFn} />)
		let root = component.root
		let button = root.findByProps({ testID: "sharerNameButton" })
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.sharer_id, testProps.id)
	})

	test('has a button on the recipe name that can be pressed and calls to navigate to the recipe', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:NORMAL"))
		const mockFn = jest.fn()
		component = renderer.create(<RecipeCard {...testProps} navigateToRecipeDetails={mockFn} />)
		let root = component.root
		let button = root.findByProps({ testID: "recipeNameButton" })
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.id)
	})

	test('has a button on the recipe image that can be pressed and calls to navigate to the recipe', () => {
		const testProps = mockRecipeList.find(p => p.name.includes("TEST:NORMAL"))
		const mockFn = jest.fn()
		component = renderer.create(<RecipeCard {...testProps} navigateToRecipeDetails={mockFn} />)
		let root = component.root
		let button = root.findByProps({ testID: "recipeImageButton" })
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.id)
	})

	//this test doesn't work.  I think it needs reatDOM, not react-test-renderer
	// test('renders the offline message and clears it', () => {
	// 	jest.useFakeTimers()
	// 	const testProps = mockRecipeList.find(p => p.name.includes("TEST:OFFLINEMESSAGE"))
	// 	const mockFn = jest.fn()
	// 	component = renderer.create(<RecipeCard {...testProps} clearOfflineMessage={mockFn} />)
	// 	const image = component.toJSON()
	// 	expect(image).toMatchSnapshot()
	// 	let root = component.root
	// 	let offlineMessage = root.findAllByType(OfflineMessage)
	// 	expect(offlineMessage.length).toEqual(1)
	// 	setTimeout(() => {
	// 		expect(mockFn).toHaveBeenCalled()
	// 		expect(mockFn).toHaveBeenCalledWith(testProps.id)
	// 	}, 10000)
	// 	jest.runAllTimers()
	// })
});
