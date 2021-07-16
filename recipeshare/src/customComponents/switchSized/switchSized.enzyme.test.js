/**
 * @jest-environment jsdom
 */
import React from 'react';
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils';
import { createSerializer } from 'enzyme-to-json';
expect.addSnapshotSerializer(createSerializer({ mode: 'deep' }));
import toJson from 'enzyme-to-json';

import { Switch, Platform } from 'react-native'
import SwitchSized from './switchSized.js'
import { setMockDeviceType } from '../../../__mocks__/expo-device'

describe('SwitchSized', () => {

	let component
	let mockChangeFunction

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	})

	beforeEach(async () => {
		// console.log('runs before every test')
		mockChangeFunction = jest.fn()
	})

	afterEach(() => {
		// console.log('runs after each test')
	})

	afterAll(() => {
		// console.log('runs after all tests have completed')
	})

	test('can be rendered on an iPhone with reduced size switches where switch is on', async () => {
		setMockDeviceType(1) //phone
		await act(async () => {
			component = await mount(
				<SwitchSized
					value={true}
					onValueChange={mockChangeFunction}
				/>
			)
		})
		component.setProps({})
		let json = toJson(component)
		expect(json).toMatchSnapshot();
	})

	test('can be rendered on an iPhone with reduced size switches where switch is off', async () => {
		setMockDeviceType(1)
		await act(async () => {
			component = await mount(
				<SwitchSized
					value={false}
					onValueChange={mockChangeFunction}
				/>
			)
		})
		component.setProps({})
		let json = toJson(component)
		expect(json).toMatchSnapshot();
	})

	test('can be rendered on an android switch is off', async () => {
		Platform.OS = 'android'
		setMockDeviceType(1)
		await act(async () => {
			component = await mount(
				<SwitchSized
					value={false}
					onValueChange={mockChangeFunction}
				/>
			)
		})
		component.setProps({})
		let json = toJson(component)
		expect(json).toMatchSnapshot();
	})

	test('can be rendered on an android where switch is on', async () => {
		Platform.OS = 'android'
		setMockDeviceType(1)
		await act(async () => {
			component = await mount(
				<SwitchSized
					value={true}
					onValueChange={mockChangeFunction}
				/>
			)
		})
		component.setProps({})
		let json = toJson(component)
		expect(json).toMatchSnapshot();
	})

	test('can be rendered on iPad with regular switch where switch is on', async () => {
		setMockDeviceType(2) //iPad
		await act(async () => {
			component = await mount(
				<SwitchSized
					value={true}
					onValueChange={mockChangeFunction}
				/>
			)
		})
		component.setProps({})
		let json = toJson(component)
		expect(json).toMatchSnapshot();
	})

	test('can be rendered on iPad with regular switch where switch is off', async () => {
		setMockDeviceType(2)
		await act(async () => {
			component = await mount(
				<SwitchSized
					value={false}
					onValueChange={mockChangeFunction}
				/>
			)
		})
		component.setProps({})
		let json = toJson(component)
		expect(json).toMatchSnapshot();
	})

	test('can be rendered and switched off', async () => {
		await act(async () => {
			component = await mount(
				<SwitchSized
					value={true}
					onValueChange={mockChangeFunction}
				/>
			)
		})
		component.setProps({})
		let testSwitch = component.find(Switch)
		expect(testSwitch.length).toEqual(1)
		testSwitch.props().onValueChange()
		expect(mockChangeFunction).toHaveBeenCalled()
		expect(mockChangeFunction).toHaveBeenCalledTimes(1)
	})

	test('can be rendered and switched on', async () => {
		await act(async () => {
			component = await mount(
				<SwitchSized
					value={false}
					onValueChange={mockChangeFunction}
				/>
			)
		})
		component.setProps({})
		let testSwitch = component.find(Switch)
		expect(testSwitch.length).toEqual(1)
		testSwitch.props().onValueChange()
		expect(mockChangeFunction).toHaveBeenCalled()
		expect(mockChangeFunction).toHaveBeenCalledTimes(1)
	})

	test('can be rendered and switched on and off', async () => {
		await act(async () => {
			component = await mount(
				<SwitchSized
					value={false}
					onValueChange={mockChangeFunction}
				/>
			)
		})
		component.setProps({})
		let testSwitch = component.find(Switch)
		expect(testSwitch.length).toEqual(1)
		testSwitch.props().onValueChange()
		testSwitch.props().onValueChange()
		expect(mockChangeFunction).toHaveBeenCalled()
		expect(mockChangeFunction).toHaveBeenCalledTimes(2)
	})

});
