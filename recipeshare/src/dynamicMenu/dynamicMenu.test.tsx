import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import DynamicMenu from "./DynamicMenu"

describe("DynamicMenu", () => {

	let mockCloseDynamicMenu
	let mockCallback
	let buttons

	beforeEach(() => {
		jest.useFakeTimers()
		mockCloseDynamicMenu = jest.fn()
		mockCallback = jest.fn()
		buttons = [
			{
				action: mockCallback,
				icon: "share-off",
				text: "Remove share"
			},
			{
				action: mockCallback,
				icon: "heart-outline",
				text: "Like recipe"
			},
			{
				action: mockCallback,
				icon: "image-plus",
				text: "Add picture"
			},
			{
				action: mockCallback,
				icon: "comment-plus",
				text: "Add a comment"
			},
			{
				action: mockCallback,
				icon: "playlist-edit",
				text: "Edit recipe"
			},
			{
				action: mockCallback,
				icon: "trash-can-outline",
				text: "Delete recipe"
			},
			{
				action: mockCallback,
				icon: "food",
				text: "Create new recipe"
			}
		]
	})

	test("renders with an outer close container and as many buttons as in list", () => {
		const { toJSON, getAllByRole } = render(
			<DynamicMenu buttons={buttons} closeDynamicMenu={mockCloseDynamicMenu} />
		)
		expect(toJSON()).toMatchSnapshot()
		const renderedButtons = getAllByRole("button")
		expect(renderedButtons.length).toEqual(buttons.length + 1)
	})

	test("pressing a button calls the callback", () => {
		const { getByText } = render(
			<DynamicMenu buttons={buttons} closeDynamicMenu={mockCloseDynamicMenu} />
		)
		fireEvent.press(getByText("Add a comment"))
		expect(mockCallback).toHaveBeenCalled()
		expect(mockCallback).toHaveBeenCalledTimes(1)
	})

	test("pressing a button calls the callback", () => {
		const { getByHintText } = render(
			<DynamicMenu buttons={buttons} closeDynamicMenu={mockCloseDynamicMenu} />
		)
		fireEvent.press(getByHintText("Close menu"))
		expect(mockCloseDynamicMenu).toHaveBeenCalled()
		expect(mockCloseDynamicMenu).toHaveBeenCalledTimes(1)
	})
})
