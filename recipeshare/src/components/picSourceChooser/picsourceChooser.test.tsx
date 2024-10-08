import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import PicSourceChooser from "./picSourceChooser";

// manual mocks

describe("picSourceChooser", () => {
	let mockSaveImage,
		mockSourceChosen,
		mockCancelChooseImage,
		// getByTestId,
		// queryAllByTestId,
		// getByPlaceholderText,
		getByText,
		// queryAllByText,
		// getAllByRole,
		// findByText,
		// findByTestId,
		toJSON;

	beforeEach(async () => {
		jest.useFakeTimers();

		mockSaveImage = jest.fn();
		mockSourceChosen = jest.fn();
		mockCancelChooseImage = jest.fn();

		await waitFor(async () => {
			const rendered = render(
				<PicSourceChooser
					saveImage={mockSaveImage}
					sourceChosen={mockSourceChosen}
					key={"pic-chooser"}
					imageSource={"mockInitialImageUrl"}
					cancelChooseImage={mockCancelChooseImage}
				/>
			);

			// getByTestId = rendered.getByTestId;
			// queryAllByTestId = rendered.queryAllByTestId;
			// getByPlaceholderText = rendered.getByPlaceholderText;
			getByText = rendered.getByText;
			// queryAllByText = rendered.queryAllByText;
			toJSON = rendered.toJSON;
			// getAllByRole = rendered.getAllByRole;
			// findByText = rendered.findByText;
			// findByTestId = rendered.findByTestId;
		});
	});

	// afterEach(async () =>	});

	test("should load and render", async () => {
		await waitFor(() => expect(getByText("Take photo")).toBeTruthy());
		expect(getByText("Choose photo")).toBeTruthy();
		expect(toJSON()).toMatchSnapshot();
	});

	test("it should be possible to take a photo", async () => {
		await waitFor(() => expect(getByText("Take photo")).toBeTruthy());
		await act(async () => {
			fireEvent.press(getByText("Take photo"));
		});
		expect(mockSaveImage).toHaveBeenCalledWith({
			canceled: false,
			uri: "mockCameraUri",
		});
	});

	test("it should be possible to select a photo", async () => {
		await waitFor(() => expect(getByText("Choose photo")).toBeTruthy());
		await act(async () => {
			fireEvent.press(getByText("Choose photo"));
		});
		expect(mockSaveImage).toHaveBeenCalledWith({
			canceled: false,
			uri: "mockLibraryUri",
		});
	});

	test("it should be possible to delete the selected photo", async () => {
		fireEvent.press(getByText("Delete photo"));
		expect(mockSaveImage).toHaveBeenCalledWith({
			uri: "",
			width: 0,
			height: 0,
		});
	});

	test("it should be possible to cancel and close", async () => {
		fireEvent.press(getByText("Cancel"));
		expect(mockCancelChooseImage).toHaveBeenCalledWith("mockInitialImageUrl");
		expect(mockSourceChosen).toHaveBeenCalled();
	});

	test("it should be possible to save and close", async () => {
		fireEvent.press(getByText("Save & Close"));
		expect(mockSourceChosen).toHaveBeenCalled();
	});
});
