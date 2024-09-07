import { fireEvent, render } from "@testing-library/react-native";

import { AlertPopup } from "./alertPopup";
import React from "react";

describe("AlertPopup", () => {
	let mockClose;
	let mockYes;

	beforeEach(() => {
		mockClose = jest.fn();
		mockYes = jest.fn();
	});

	test("renders with 2 buttons and customizable text", () => {
		const { toJSON, getAllByRole } = render(
			<AlertPopup
				close={mockClose}
				closeText={"mock close text"}
				title={"Here is a mock alert question that's being asked"}
				onYes={mockYes}
				yesText={"mock yes text"}
			/>
		);
		expect(toJSON()).toMatchSnapshot();
		const buttons = getAllByRole("button");
		expect(buttons.length).toEqual(2);
	});

	test("renders with 2 buttons and default text", () => {
		const { toJSON, getAllByRole } = render(
			<AlertPopup
				close={mockClose}
				// closeText={"mock close text"}
				title={"Here is a mock alert question that's being asked"}
				onYes={mockYes}
				// yesText={"Yes button text"}
			/>
		);
		expect(toJSON()).toMatchSnapshot();
		const buttons = getAllByRole("button");
		expect(buttons.length).toEqual(2);
	});

	test("renders with 1 button when no close button and customizable text", () => {
		const { toJSON, getAllByRole } = render(
			<AlertPopup
				// close={mockClose}
				// closeText={"mock close text"}
				title={"Here is a mock alert question that's being asked"}
				onYes={mockYes}
				yesText={"Yes button text"}
			/>
		);
		expect(toJSON()).toMatchSnapshot();
		const buttons = getAllByRole("button");
		expect(buttons.length).toEqual(1);
	});

	test("calls the yes function when button pressed", () => {
		const { toJSON, getByText } = render(
			<AlertPopup
				close={mockClose}
				closeText={"mock close text"}
				title={"Here is a mock alert question that's being asked"}
				onYes={mockYes}
				yesText={"mock yes text"}
			/>
		);
		expect(toJSON()).toMatchSnapshot();
		fireEvent.press(getByText("mock yes text"));
		expect(mockYes).toHaveBeenCalled();
		expect(mockYes).toHaveBeenCalledTimes(1);
	});

	test("calls the close function when button pressed", () => {
		const { toJSON, getByText } = render(
			<AlertPopup
				close={mockClose}
				closeText={"mock close text"}
				title={"Here is a mock alert question that's being asked"}
				onYes={mockYes}
				yesText={"mock yes text"}
			/>
		);
		expect(toJSON()).toMatchSnapshot();
		fireEvent.press(getByText("mock close text"));
		expect(mockClose).toHaveBeenCalled();
		expect(mockClose).toHaveBeenCalledTimes(1);
	});
});
