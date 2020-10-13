import 'react-native'
import React from 'react';
import renderer from 'react-test-renderer';

import RecipeCard from './RecipeCard.js'
import { listProps } from '../../__mocks__/recipeList/mockCardContents.js'

describe('Recipe Card', () => {

	let mountedRecipeCard

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

	// it('asyncly works', done => {
	// 	setTimeout(() => {
	// 		//do things
	// 		done()
	// 	}, 100)
	// })

	it('can be rendered using typical props and matches its previous image - 1', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:NORMAL"))
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		const image = mountedRecipeCard.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered using typical props and matches its previous image - 2', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:NORMAL2"))
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		const image = mountedRecipeCard.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered using typical props and matches its previous image - 3', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:NORMAL"))
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		const image = mountedRecipeCard.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered using typical props and matches its previous image - 4', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:NORMAL4"))
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		const image = mountedRecipeCard.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered using typical props and matches its previous image - 5', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:NORMAL5"))
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		const image = mountedRecipeCard.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered using typical props and matches its previous image - 6', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:NORMAL6"))
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		const image = mountedRecipeCard.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered when the recipe has been LIKED and matches its previous image', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:LIKED"))
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		const image = mountedRecipeCard.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered when the recipe has been COMMENTED and matches its previous image', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:COMMENTED"))
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		const image = mountedRecipeCard.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered when the recipe has been SHARED and matches its previous image', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:SHARED"))
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		const image = mountedRecipeCard.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered when the recipe has been LIKED, COMMENTED, and SHARED and matches its previous image', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:ALL"))
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		const image = mountedRecipeCard.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered when the recipe has been a LONG RECIPE NAME and matches its previous image', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:LONGRECIPENAME"))
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		const image = mountedRecipeCard.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered when the recipe has NO COVER IMAGE and matches its previous image', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:NOCOVERIMAGE"))
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		const image = mountedRecipeCard.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered when the recipe has been RE_SHARED BY SOMEONE and matches its previous image', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:RESHAREDBY"))
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		const image = mountedRecipeCard.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered when the recipe has a LONG RESHARER USERNAME and matches its previous image', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:LONGRESHARERUSERNAME"))
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		const image = mountedRecipeCard.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered when the recipe has is from a chef with a LONG USERNAME and matches its previous image', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:LONGUSERNAME"))
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		const image = mountedRecipeCard.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered when the recipe has is from a chef with NO CHEFIMAGE and matches its previous image', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:NOCHEFIMAGE"))
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		const image = mountedRecipeCard.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('has a PostedBy section if the recipe has been re-shared by someone', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:RESHARED"))
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		let root = mountedRecipeCard.root
		let element = root.findByProps({testID: "postedByElement"})
		expect(element).toBeTruthy()
	})

	it('has does not show the Re-shared section if the recipe is not re-shared', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:NORMAL"))
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		let root = mountedRecipeCard.root
		let elements = root.findAllByProps({testID: "postedByElement"})
		expect(elements.length).toBe(0)
	})

	it('has a reShare button that can be pressed and calls to share recipe', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:NORMAL"))
		const mockFn = jest.fn()
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} reShareRecipe={mockFn} />)
		let root = mountedRecipeCard.root
		let button = root.findByProps({testID: "reShareButton"})
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.id)
	})

	it('has a reShare button that, when the recipe has been shared, calls to unShare recipe', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:RESHARED"))
		const mockFn = jest.fn()
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} unReShareRecipe={mockFn} />)
		let root = mountedRecipeCard.root
		let button = root.findByProps({testID: "reShareButton"})
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.id)
	})

	it('has a like button that can be pressed and calls to like recipe', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:NORMAL"))
		const mockFn = jest.fn()
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} likeRecipe={mockFn} />)
		let root = mountedRecipeCard.root
		let button = root.findByProps({testID: "likeButton"})
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.id)
	})

	it('has a like button that, when the recipe has been liked, calls to unLike recipe', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:LIKED"))
		const mockFn = jest.fn()
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} unlikeRecipe={mockFn} />)
		let root = mountedRecipeCard.root
		let button = root.findByProps({testID: "likeButton"})
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.id)
	})

	it('has a comment button that can be pressed and calls to navigate to recipe with commenting true', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:NORMAL"))
		const mockFn = jest.fn()
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} navigateToRecipeDetails={mockFn} />)
		let root = mountedRecipeCard.root
		let button = root.findByProps({testID: "commentButton"})
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.id, true)
	})

	it('has a comment button that, when the recipe has been commented, calls to navigate to recipe with commenting true', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:COMMENTED"))
		const mockFn = jest.fn()
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} navigateToRecipeDetails={mockFn} />)
		let root = mountedRecipeCard.root
		let button = root.findByProps({testID: "commentButton"})
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.id, true)
	})

	it('has a button on the chef name that can be pressed and calls to navigate to the chef', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:NORMAL"))
		const mockFn = jest.fn()
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} navigateToChefDetails={mockFn} />)
		let root = mountedRecipeCard.root
		let button = root.findByProps({testID: "chefNameButton"})
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.chef_id, testProps.id)
	})

	it('has a button on the chef image that can be pressed and calls to navigate to the chef', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:NORMAL"))
		const mockFn = jest.fn()
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} navigateToChefDetails={mockFn} />)
		let root = mountedRecipeCard.root
		let button = root.findByProps({testID: "chefImageButton"})
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.chef_id, testProps.id)
	})

	it('has a button on the sharer name that can be pressed and calls to navigate to the chef', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:RESHAREDBY"))
		const mockFn = jest.fn()
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} navigateToChefDetails={mockFn} />)
		let root = mountedRecipeCard.root
		let button = root.findByProps({testID: "sharerNameButton"})
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.sharer_id, testProps.id)
	})

	it('has a button on the recipe name that can be pressed and calls to navigate to the recipe', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:NORMAL"))
		const mockFn = jest.fn()
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} navigateToRecipeDetails={mockFn} />)
		let root = mountedRecipeCard.root
		let button = root.findByProps({testID: "recipeNameButton"})
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.id)
	})

	it('has a button on the recipe image that can be pressed and calls to navigate to the recipe', () => {
		const testProps = listProps.find(p => p.name.includes("TEST:NORMAL"))
		const mockFn = jest.fn()
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} navigateToRecipeDetails={mockFn} />)
		let root = mountedRecipeCard.root
		let button = root.findByProps({testID: "recipeNameButton"})
		button.props.onPress()
		expect(mockFn).toHaveBeenCalled()
		expect(mockFn).toHaveBeenCalledWith(testProps.id)
	})
});
