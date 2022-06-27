import React from "react";
import renderer, { act } from "react-test-renderer";

import OfflineMessage from "./offlineMessage"
import { TouchableOpacity } from "react-native";

describe("OfflineMessage", () => {

	let component

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	})

	beforeEach(() => {
		// console.log('runs before every test')
		jest.useFakeTimers()
	})

	afterEach(() => {
		// console.log('runs after each test')
	})

	afterAll(() => {
		// console.log('runs after all tests have completed')
	})

	test("renders with an action button", () => {
		let mockClearOfflineMessage = jest.fn()
		let mockAction = jest.fn()
		act(() => {
			component = renderer.create(
				<OfflineMessage
					clearOfflineMessage={mockClearOfflineMessage}
					message={"Sorry, you can't do that right now, you appear to be offline"}
					action={mockAction}
				/>
			)
		})
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
		let root = component.root
		const buttons = root.findAllByType(TouchableOpacity)
		expect(buttons.length).toEqual(1)
	})

	test("renders without an action button", () => {
		let mockClearOfflineMessage = jest.fn()
		act(() => {
			component = renderer.create(
				<OfflineMessage
					clearOfflineMessage={mockClearOfflineMessage}
					message={"Sorry, you can't do that right now, you appear to be offline"}
				/>
			)
		})
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
		let root = component.root
		const buttons = root.findAllByType(TouchableOpacity)
		expect(buttons.length).toEqual(0)
	})

});
