

export const launchCameraAsync = () => {
	return Promise.resolve({
		cancelled: false,
		uri: "mockCameraUri"
	})
}

export const launchImageLibraryAsync = () => {
	return Promise.resolve({
		cancelled: false,
		uri: "mockLibraryUri"
	})
}
