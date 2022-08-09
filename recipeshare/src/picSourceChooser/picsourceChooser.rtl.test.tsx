import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import PicSourceChooser from "./picSourceChooser";
import { ImagePickerResult } from "expo-image-picker";

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

		await waitFor(() => {
			const rendered = render(
				<PicSourceChooser
					saveImage={mockSaveImage}
					sourceChosen={mockSourceChosen}
					key={"pic-chooser"}
					imageSource={"mockInitialImageUrl"}
					originalImage={
						{
							cancelled: false,
							uri: "mockInitialImageUrl",
						} as ImagePickerResult
					}
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
		fireEvent.press(getByText("Take photo"));
		waitFor(() =>
			expect(mockSaveImage).toHaveBeenCalledWith({
				cancelled: false,
				uri: "mockCameraUri",
			})
		);
	});

	test("it should be possible to select a photo", async () => {
		fireEvent.press(getByText("Choose photo"));
		waitFor(() =>
			expect(mockSaveImage).toHaveBeenCalledWith({
				cancelled: false,
				uri: "mockLibraryUri",
			})
		);
	});

	test("it should be possible to delete the selected photo", async () => {
		fireEvent.press(getByText("Delete photo"));
		expect(mockSaveImage).toHaveBeenCalledWith({
			cancelled: false,
			uri: "",
		});
	});

	test("it should be possible to cancel and close", async () => {
		fireEvent.press(getByText("Cancel"));
		expect(mockCancelChooseImage).toHaveBeenCalledWith({ cancelled: false, uri: "mockInitialImageUrl" });
		expect(mockSourceChosen).toHaveBeenCalled();
	});

	test("it should be possible to save and close", async () => {
		fireEvent.press(getByText("Save & Close"));
		expect(mockSourceChosen).toHaveBeenCalled();
	});
});
