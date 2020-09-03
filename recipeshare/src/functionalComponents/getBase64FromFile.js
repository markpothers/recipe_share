import * as FileSystem from 'expo-file-system';

export function getBase64FromFile(uri) {
	if (uri) {
		return FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })
			.then(res => {
				return res
			});
	} else {
		return ""
	}
}
