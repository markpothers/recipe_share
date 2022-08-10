import React from "react"
import { render } from "@testing-library/react-native"
import StyledActivityIndicator from "./styledActivityIndicator"

describe("StyledActivityIndicator", () => {

	test("can be rendered", async () => {
		const { toJSON } = render(<StyledActivityIndicator />)
		expect(toJSON()).toMatchSnapshot()
	})

})
