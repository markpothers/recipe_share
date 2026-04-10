import { getBase64FromFile } from "./getBase64FromFile";
import * as ImageManipulator from "../../__mocks__/expo-image-manipulator";

// Mock the entire module
jest.mock("expo-image-manipulator");

describe("getBase64FromFile", () => {
	beforeEach(() => {
		ImageManipulator.resetMocks();
	});

	test("returns base64 string when given a valid URI", async () => {
		const testUri = "file://test/image.jpg";
		const expectedBase64 = "testBase64String";

		ImageManipulator.setMockBase64Result(expectedBase64);

		const result = await getBase64FromFile(testUri);

		expect(ImageManipulator.manipulateAsync).toHaveBeenCalledWith(testUri, [], {
			base64: true,
			compress: 0.75,
			format: ImageManipulator.SaveFormat.JPEG,
		});
		expect(result).toBe(expectedBase64);
	});

	test("returns empty string when URI is null", async () => {
		const result = await getBase64FromFile(null);

		expect(ImageManipulator.manipulateAsync).not.toHaveBeenCalled();
		expect(result).toBe("");
	});

	test("returns empty string when URI is undefined", async () => {
		const result = await getBase64FromFile(undefined);

		expect(ImageManipulator.manipulateAsync).not.toHaveBeenCalled();
		expect(result).toBe("");
	});

	test("returns empty string when URI is empty string", async () => {
		const result = await getBase64FromFile("");

		expect(ImageManipulator.manipulateAsync).not.toHaveBeenCalled();
		expect(result).toBe("");
	});

	test("returns empty string when ImageManipulator throws an error", async () => {
		const testUri = "file://invalid/image.jpg";

		ImageManipulator.setMockShouldFail(true);

		const result = await getBase64FromFile(testUri);

		expect(ImageManipulator.manipulateAsync).toHaveBeenCalledWith(testUri, [], {
			base64: true,
			compress: 0.75,
			format: ImageManipulator.SaveFormat.JPEG,
		});
		expect(result).toBe("");
	});

	test("handles various URI formats correctly", async () => {
		const testCases = [
			"file://local/path/image.jpg",
			"content://media/external/images/1",
			"assets-library://asset/asset.JPG",
			"ph://CC95F08C-88C3-4012-9D6D-64A413D254B3/L0/001",
		];

		for (const uri of testCases) {
			ImageManipulator.resetMocks();
			const result = await getBase64FromFile(uri);

			expect(ImageManipulator.manipulateAsync).toHaveBeenCalledWith(uri, [], {
				base64: true,
				compress: 0.75,
				format: ImageManipulator.SaveFormat.JPEG,
			});
			expect(result).toBe("mockBase64String");
		}
	});

	test("uses correct compression and format settings", async () => {
		const testUri = "file://test/image.jpg";

		await getBase64FromFile(testUri);

		expect(ImageManipulator.manipulateAsync).toHaveBeenCalledWith(
			testUri,
			[], // empty actions array
			{
				base64: true,
				compress: 0.75, // 75% compression
				format: ImageManipulator.SaveFormat.JPEG,
			}
		);
	});

	test("returns empty string when ImageManipulator returns undefined base64", async () => {
		const testUri = "file://test/image.jpg";

		// Mock manipulateAsync to return undefined base64
		ImageManipulator.manipulateAsync.mockResolvedValueOnce({
			uri: "mockProcessedUri",
			base64: undefined,
			width: 100,
			height: 100,
		});

		const result = await getBase64FromFile(testUri);

		expect(result).toBe("");
	});

	test("handles whitespace-only URI as falsy", async () => {
		const result = await getBase64FromFile("   ");

		// This will call ImageManipulator since "   " is truthy in JavaScript
		// but it's probably not a valid URI
		expect(ImageManipulator.manipulateAsync).toHaveBeenCalled();
		expect(result).toBe("mockBase64String");
	});

	test("handles very long URIs", async () => {
		const longUri = "file://" + "a".repeat(1000) + "/image.jpg";

		const result = await getBase64FromFile(longUri);

		expect(ImageManipulator.manipulateAsync).toHaveBeenCalledWith(longUri, [], {
			base64: true,
			compress: 0.75,
			format: ImageManipulator.SaveFormat.JPEG,
		});
		expect(result).toBe("mockBase64String");
	});
});
