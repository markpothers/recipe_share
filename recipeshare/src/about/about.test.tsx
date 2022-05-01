import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import About from "./about"

describe("About Page", () => {

	test("renders displaying t & c by default", () => {
		const { toJSON } = render(<About/>)
		expect(toJSON()).toMatchSnapshot()
	})

	test("renders displaying privacy policy", () => {
		const { toJSON, getByText } = render(<About/>)
		fireEvent.press(getByText("View privacy policy"))
		expect(toJSON()).toMatchSnapshot()
	})

	test("renders displaying licenses", () => {
		const { toJSON, getByText } = render(<About/>)
		fireEvent.press(getByText("View licenses"))
		expect(toJSON()).toMatchSnapshot()
	})

})
