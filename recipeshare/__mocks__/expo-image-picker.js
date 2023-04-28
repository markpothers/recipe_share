

export const launchCameraAsync = () => {
	return Promise.resolve({
		canceled: false,
		uri: "mockCameraUri"
	})
}

export const launchImageLibraryAsync = () => {
	return Promise.resolve({
		canceled: false,
		uri: "mockLibraryUri"
	})
}
