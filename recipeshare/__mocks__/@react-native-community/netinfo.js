let returnValue = {
    isConnected: true
}

export default {
    setReturnValue: (newValue) => {
        returnValue = newValue
    },

    getCurrentConnectivity: jest.fn(),
    isConnectionMetered: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
    // isConnected: {
    //     fetch: () => {
    //         return Promise.resolve(returnValue);
    //     },
    //     addEventListener: jest.fn(),
    //     removeEventListener: jest.fn(),
    // },
    fetch: () => {
        return Promise.resolve(returnValue);
    },
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
};