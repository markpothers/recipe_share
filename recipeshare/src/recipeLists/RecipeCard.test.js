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

	it('can be rendered using typical props and matches its previous image', () => {
		const testProps = listProps.find(p => p.testTitle == "default")
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		const image = mountedRecipeCard.toJSON()
		expect(image).toMatchSnapshot()
	})

	it('can be rendered using different props including a really long recipe title matches its previous image', () => {
		const testProps = listProps.find(p => p.testTitle == "longStrings")
		mountedRecipeCard = renderer.create(<RecipeCard {...testProps} />)
		const image = mountedRecipeCard.toJSON()
		expect(image).toMatchSnapshot()
	})

});
