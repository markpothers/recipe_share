import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import MultiPicSourceChooser, { ImageSource } from "./multiPicSourceChooser";

// manual mocks

const recipeImages = [
	{
		created_at: "2022-02-23T04:16:48.850Z",
		hex: "63d1f92fb2f9ca89f36f8935dcf048813ced9ca0-20220223_041648",
		hidden: false,
		id: 141,
		image_url:
			"https://storage.googleapis.com/test-images-be4d3e05-1e77-4efd-8571-364e22ea7c0d/recipe51.jpg?GoogleAccessId=recipe-share-image-handler%40recipe-share-272202.iam.gserviceaccount.com&Expires=6468590268&Signature=KxpAMV%2F6NUiU91OPDQJb8JCnwFjowwkeBWUnrwejz8MjYjD6SqHPIkxln9Zo6%2FlhROowJwb0jCfgeW7Bdd%2FkZ1wMR3LkgqiKjURrYIxzypqXh%2FSbP5thj9T27Rr2klDI1rqYJ9%2FzzJUlFGY%2FKgVb4bdnwaUszuVUdjJKndsKKvNQZky7BvdAxoeBFbhojA0Jsep48Zj1ByTephGpuIinmriRava93H9y4yl8o9tFIAKOqQK3qQ5LqtKZstN4SZUJ0pnbp0WveOSROyZs8LPU4Enj%2BzgFwepuDalrS4%2B3uioFw72ESvhgAalxF3ZAyV9pTZB4QQ13Oysq0f3rfG109g%3D%3D",
		index: 0,
		name: null,
		recipe_id: 111,
		updated_at: "2022-02-23T04:17:28.270Z",
	},
	{
		created_at: "2022-02-23T04:16:48.110Z",
		hex: "84fb2e077ba3659b27885706704c32a31e79916a-20220223_041647",
		hidden: false,
		id: 140,
		image_url:
			"https://storage.googleapis.com/test-images-be4d3e05-1e77-4efd-8571-364e22ea7c0d/recipe9.jpg?GoogleAccessId=recipe-share-image-handler%40recipe-share-272202.iam.gserviceaccount.com&Expires=6468590152&Signature=QE0BHb5NDCDLVlO6WaD%2B13tl7WJ0vrSCK3meugG%2BbKznZiP44B79nlAztn96%2Bvq2nk1P1ske9XqBK9PTRF65EX%2FdPyOr1MjVmlnOkOl%2BEj6KLIPIOmL1ymXr%2BTSEJ2eXI8iCf76%2BbszsNvHKaxaMN9ntA6b%2BB4E%2FOjt9gUc7Dr8RKWlSgvlBAuvmXgAAKaBd3Q6YOB%2B%2B%2FQn9AlzLUpQkdgNJ%2Fl1x6zYMfBRaqPopSZHgNJT36xlPIh1q5AK0ut7kb7m%2FkWAhYv%2FgJ4YevAXTCA6jb9%2BsV0Jbs8m6hE9llWdmKmpdZAKrxkh07xveRDWErmPopX%2Fws5xB08CNXpP50A%3D%3D",
		index: 1,
		name: null,
		recipe_id: 111,
		updated_at: "2022-02-23T04:17:28.284Z",
	},
];

describe("multiPicSourceChooser", () => {
	describe("multiPicSourceChooser with no pictures", () => {
		let mockSaveImages,
			mockSourceChosen,
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

			mockSaveImages = jest.fn();
			mockSourceChosen = jest.fn();

			await waitFor(() => {
				const rendered = render(
					<MultiPicSourceChooser
						saveImages={mockSaveImages}
						sourceChosen={mockSourceChosen}
						key={"multi-pic-chooser"}
						imageSources={[{ uri: "" }] as ImageSource[]}
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

		test("it should be possible to add a slot", async () => {
			fireEvent.press(getByText("Add slot"));
			expect(mockSaveImages).toHaveBeenCalledWith([{ uri: "" }, { uri: "" }]);
		});

		test("it should be possible to delete the only photo", async () => {
			fireEvent.press(getByText("Delete"));
			expect(mockSaveImages).toHaveBeenCalledWith([{ uri: "" }]);
		});

		test("it should be possible to take a photo", async () => {
			await waitFor(() => expect(getByText("Take photo")).toBeTruthy());
			await act(async () => {
				fireEvent.press(getByText("Take photo"));
			});
			expect(mockSaveImages).toHaveBeenCalledWith([
				{
					cancelled: false,
					uri: "mockCameraUri",
				},
			]);
		});

		test("it should be possible to select a photo", async () => {
			await waitFor(() => expect(getByText("Choose photo")).toBeTruthy());
			await act(async () => {
				fireEvent.press(getByText("Choose photo"));
			});
			expect(mockSaveImages).toHaveBeenCalledWith([
				{
					cancelled: false,
					uri: "mockLibraryUri",
				},
			]);
		});

		test("it should be possible to cancel and close", async () => {
			fireEvent.press(getByText("Cancel"));
			expect(mockSaveImages).toHaveBeenCalledWith([{ uri: "" }]);
			await waitFor(() => expect(mockSourceChosen).toHaveBeenCalled());
		});

		test("it should be possible to save and close", async () => {
			fireEvent.press(getByText("Save & Close"));
			expect(mockSourceChosen).toHaveBeenCalled();
		});
	});

	describe("multiPicSourceChooser with some pictures", () => {
		let mockSaveImages,
			mockSourceChosen,
			getByTestId,
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

			mockSaveImages = jest.fn();
			mockSourceChosen = jest.fn();

			await waitFor(() => {
				const rendered = render(
					<MultiPicSourceChooser
						saveImages={mockSaveImages}
						sourceChosen={mockSourceChosen}
						key={"multi-pic-chooser"}
						imageSources={[...recipeImages]}
					/>
				);

				getByTestId = rendered.getByTestId;
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

		test("it should be possible to add a slot to the right of the current index when at 0", async () => {
			fireEvent.press(getByText("Add slot"));
			expect(mockSaveImages).toHaveBeenCalledWith([recipeImages[0], { uri: "" }, recipeImages[1]]);
		});

		test("it should be possible to add a slot to the right of the current index when not at 0", async () => {
			fireEvent.scroll(getByTestId("multiPicFlatList"), {
				nativeEvent: {
					contentSize: { height: 300, width: 600 },
					contentOffset: { y: 0, x: 300 },
					layoutMeasurement: { height: 300, width: 300 }, // Dimensions of the device
				},
			});
			fireEvent.press(getByText("Add slot"));
			expect(mockSaveImages).toHaveBeenCalledWith([...recipeImages, { uri: "" }]);
		});

		test("it should be possible to delete the photo photo at the beginning", async () => {
			fireEvent.press(getByText("Delete"));
			await waitFor(() => expect(getByText("Take photo")).toBeTruthy());
			expect(mockSaveImages).toHaveBeenCalledWith([recipeImages[1]]);
		});

		test("it should be possible to swipe and delete the photo photo at the end", async () => {
			fireEvent.scroll(getByTestId("multiPicFlatList"), {
				nativeEvent: {
					contentSize: { height: 300, width: 600 },
					contentOffset: { y: 0, x: 300 },
					layoutMeasurement: { height: 300, width: 300 }, // Dimensions of the device
				},
			});
			fireEvent.press(getByText("Delete"));
			await waitFor(() => expect(getByText("Take photo")).toBeTruthy());
			expect(mockSaveImages).toHaveBeenCalledWith([recipeImages[0]]);
		});

		test("it should be possible to take a photo replacing an existing photo", async () => {
			await waitFor(() => expect(getByText("Take photo")).toBeTruthy());
			await act(async () => {
				fireEvent.press(getByText("Take photo"));
			});
			expect(mockSaveImages).toHaveBeenCalledWith([
				{
					cancelled: false,
					uri: "mockCameraUri",
				},
				recipeImages[1],
			]);
		});

		test("it should be possible to select a photo replacing an existing photo later in the list", async () => {
			await waitFor(() => expect(getByText("Choose photo")).toBeTruthy());
			fireEvent.scroll(getByTestId("multiPicFlatList"), {
				nativeEvent: {
					contentSize: { height: 300, width: 600 },
					contentOffset: { y: 0, x: 300 },
					layoutMeasurement: { height: 300, width: 300 }, // Dimensions of the device
				},
			});
			await act(async () => {
				fireEvent.press(getByText("Choose photo"));
			});
			expect(mockSaveImages).toHaveBeenCalledWith([
				recipeImages[0],
				{
					cancelled: false,
					uri: "mockLibraryUri",
				},
			]);
		});

		test("it should be possible to cancel and close", async () => {
			await waitFor(() => expect(getByText("Choose photo")).toBeTruthy());
			fireEvent.press(getByText("Cancel"));
			expect(mockSaveImages).toHaveBeenCalledWith(recipeImages);
			expect(mockSourceChosen).toHaveBeenCalled();
		});

		test("it should be possible to cancel and close after changing an image leaving you with the original images unchanged", async () => {
			await waitFor(() => expect(getByText("Take photo")).toBeTruthy());
			await act(async () => {
				fireEvent.press(getByText("Take photo"));
			});
			fireEvent.press(getByText("Cancel"));
			expect(mockSaveImages).toHaveBeenLastCalledWith(recipeImages);
			expect(mockSourceChosen).toHaveBeenCalled();
		});

		test("it should be possible to save and close", async () => {
			await waitFor(() => expect(getByText("Take photo")).toBeTruthy());
			fireEvent.press(getByText("Save & Close"));
			expect(mockSourceChosen).toHaveBeenCalled();
		});
	});
});
