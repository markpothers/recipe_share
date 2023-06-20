import * as ImageManipulator from "expo-image-manipulator";

export const getBase64FromFile = async (uri: string): Promise<string> => {
	if (uri) {
		try {
			const compressedImage = await ImageManipulator.manipulateAsync(uri, [], {
				base64: true,
				compress: 0.75,
				format: ImageManipulator.SaveFormat.JPEG,
			});
			// const compressedImageBase64 = await FileSystem.readAsStringAsync(compressedImage.uri, {
				// encoding: FileSystem.EncodingType.Base64,
			// });
			// console.log("compressedImageBase64:", compressedImageBase64);
			// FileSystem.deleteAsync(compressedImage.uri, { idempotent: true });
			return compressedImage.base64;
		} catch {
			return "";
		}
	} else {
		return "";
	}
};
