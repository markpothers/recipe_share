let deviceType = 1

export const setMockDeviceType = (type) => {
    deviceType = type
}

export const getDeviceTypeAsync = jest.fn(() => {
    // console.warn('Im here!')
    return new Promise(resolve => {
        resolve(deviceType)
    })
});