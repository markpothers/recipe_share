/**
 * @jest-environment jsdom
 */
import React from 'react';
import { configure, shallow, mount } from 'enzyme'
import { act } from 'react-dom/test-utils';
import {createSerializer} from 'enzyme-to-json';
expect.addSnapshotSerializer(createSerializer({mode: 'deep'}));
import toJson from 'enzyme-to-json';

import { Switch } from 'react-native'
import { create } from 'react-test-renderer';
import SwitchSized from './switchSized.js'
import { setMockDeviceType } from '../../__mocks__/expo-device'

describe('SwitchSized', () => {

	let component
	let mockChangeFunction

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	})

	beforeEach(async() => {
		// console.log('runs before every test')
		mockChangeFunction = jest.fn()
		// await act(async () => {
		// 	component = await mount(
		// 		<SwitchSized
		// 			value={true}
		// 			onChange={mockChangeFunction}
		// 		/>
		// 	)
		// })
		// component.setProps({})
	})

	afterEach(() => {
		// console.log('runs after each test')
	})

	afterAll(() => {
		// console.log('runs after all tests have completed')
	})

	test('can be rendered on an iPhone with reduced size switches', async() => {
		setMockDeviceType(1)
		await act(async () => {
			component = await mount(
				<SwitchSized
					value={true}
					onChange={mockChangeFunction}
				/>
			)
		})
		component.setProps({})
		let json = toJson(component)
		expect(json).toMatchSnapshot();
	})

	test('can be rendered on non-iPhone with regular switch', async() => {
		setMockDeviceType(2)
		await act(async () => {
			component = await mount(
				<SwitchSized
					value={true}
					onChange={mockChangeFunction}
				/>
			)
		})
		component.setProps({})
		let json = toJson(component)
		expect(json).toMatchSnapshot();
	})

	test('can be rendered and switched', async() => {
		await act(async () => {
			component = await mount(
				<SwitchSized
					value={true}
					onChange={mockChangeFunction}
				/>
			)
		})
		component.setProps({})
		let testSwitch = component.find(Switch)
		expect(testSwitch.length).toEqual(1)
		testSwitch.props().onChange()
		expect(mockChangeFunction).toHaveBeenCalled()
		expect(mockChangeFunction).toHaveBeenCalledTimes(1)
	})

});
