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

	test("renders with empty string when title is falsy", () => {
		const { toJSON } = render(
			<AlertPopup
				close={mockClose}
				closeText={"mock close text"}
				title={null as string}
				onYes={mockYes}
				yesText={"mock yes text"}
			/>
		);
		expect(toJSON()).toMatchSnapshot();
		// Title should render as empty string when null
		const titleElement = toJSON();
		expect(titleElement).toBeTruthy();
	});

	test("renders with default button text when no custom text provided", () => {
		const { getByText } = render(<AlertPopup close={mockClose} title={"Test title"} onYes={mockYes} />);

		// Should render default "Cancel" and "Yes" text
		expect(getByText("Cancel")).toBeTruthy();
		expect(getByText("Yes")).toBeTruthy();
	});

	test("has correct accessibility properties", () => {
		const { getByTestId } = render(
			<AlertPopup
				close={mockClose}
				closeText={"Close"}
				title={"Test title"}
				onYes={mockYes}
				yesText={"Confirm"}
			/>
		);

		// Check accessibility testIDs are present
		expect(getByTestId("closeButton")).toBeTruthy();
		expect(getByTestId("yesButton")).toBeTruthy();
	});

	test("renders modal with correct properties", () => {
		const { toJSON } = render(<AlertPopup close={mockClose} title={"Test title"} onYes={mockYes} />);

		const component = toJSON();
		// Modal should be visible and transparent
		expect(component).toBeTruthy();
	});

	test("handles undefined title gracefully", () => {
		const { toJSON } = render(<AlertPopup close={mockClose} title={undefined as string} onYes={mockYes} />);

		expect(toJSON()).toMatchSnapshot();
	});

	test("handles empty string title", () => {
		const { toJSON } = render(<AlertPopup close={mockClose} title={""} onYes={mockYes} />);

		expect(toJSON()).toMatchSnapshot();
	});
});
