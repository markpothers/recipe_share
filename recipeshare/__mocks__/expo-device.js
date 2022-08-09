let deviceType = 1

export const setMockDeviceType = (type) => {
    deviceType = type
}

export const getDeviceTypeAsync = jest.fn(() => {
    // console.warn("MOCKING EXPO DEVICE!")
    return new Promise(resolve => {
        resolve(deviceType)
    })
});
