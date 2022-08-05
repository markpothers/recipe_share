let returnValue = {
    isConnected: true
}

export default {
    setReturnValue: (isConnected: boolean): void => {
        returnValue = { isConnected }
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
	configure: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
};
