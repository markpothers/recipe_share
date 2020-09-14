import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from "expo-image-manipulator";

export const getBase64FromFile = async (uri) => {
	if (uri) {
		try {
			const compressedImage = await ImageManipulator.manipulateAsync(
				uri,
				[],
				{ compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
			);
			const compressedImageBase64 = await FileSystem.readAsStringAsync(compressedImage.uri, { encoding: FileSystem.EncodingType.Base64 })
			FileSystem.deleteAsync(compressedImage.uri, { idempotent: true })
			return compressedImageBase64
		} catch {
			return ""
		}
	} else {
		return ""
	}
}
