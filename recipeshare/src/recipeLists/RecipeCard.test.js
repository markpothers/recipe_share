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

	// it('can be rendered using different props including a really long recipe title matches its previous image', () => {
	// 	const testProps = listProps.find(p => p.testTitle == "longStrings")
	// 	mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
	// 	const image = mountedRecipeCard.toJSON()
	// 	expect(image).toMatchSnapshot()
	// })

	// it('can render all the different example of recipe card data', () => {
	// 	listProps.forEach(recipe => {
	// 		mountedRecipeCard = renderer.create(<RecipeCard {...recipe} />)
	// 		const image = mountedRecipeCard.toJSON()
	// 		expect(image).toMatchSnapshot()
	// 	})
	// })

});
