

export const launchCameraAsync = () => {
	return Promise.resolve({
		canceled: false,
		assets: [{uri: "mockCameraUri"}]
	})
}

export const launchImageLibraryAsync = () => {
	return Promise.resolve({
		canceled: false,
		assets: [{uri: "mockLibraryUri"}]
	})
}

export const requestCameraPermissionsAsync = () => {
	return Promise.resolve({
		status: "granted"
	})
}
