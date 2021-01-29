import { apiCall } from './apiCall'
import NetInfo from '../../__mocks__/@react-native-community/netinfo'

describe('apiCall', () => {

    let mockSuccessfullCallback
    let mockFailingCallback
    let mockErrorCallback

    beforeEach(() => {
        mockSuccessfullCallback = jest.fn(() => {
            return {mockResult: true}
        })

        mockFailingCallback = jest.fn(() => {
            // eslint-disable-next-line no-undef
            throw new Exception
        })

        mockErrorCallback = jest.fn(() => {
            return {error: true}
        })

        NetInfo.setReturnValue({isConnected: true})
    })

    test('callback is called with no arguments', async() => {
        let response = await apiCall(mockSuccessfullCallback)
        expect(mockSuccessfullCallback).toHaveBeenCalled()
        expect(mockSuccessfullCallback).toHaveBeenCalledWith()
        expect(response).toEqual({mockResult: true})
    })

    test('callback is called with 1 argument', async() => {
        let response = await apiCall(mockSuccessfullCallback, 22)
        expect(mockSuccessfullCallback).toHaveBeenCalled()
        expect(mockSuccessfullCallback).toHaveBeenCalledWith(22)
        expect(response).toEqual({mockResult: true})
    })

    test('callback is called with 2 arguments', async() => {
        let response = await apiCall(mockSuccessfullCallback, 22, "test")
        expect(mockSuccessfullCallback).toHaveBeenCalled()
        expect(mockSuccessfullCallback).toHaveBeenCalledWith(22, "test")
        expect(response).toEqual({mockResult: true})
    })

    test('callback is called with 3 arguments', async() => {
        let response = await apiCall(mockSuccessfullCallback, 22, "test", true)
        expect(mockSuccessfullCallback).toHaveBeenCalled()
        expect(mockSuccessfullCallback).toHaveBeenCalledWith(22, "test", true)
        expect(response).toEqual({mockResult: true})
    })

    test('response has a fail key if exception is thrown', async() => {
        let response = await apiCall(mockFailingCallback, 22)
        expect(mockFailingCallback).toHaveBeenCalled()
        expect(mockFailingCallback).toHaveBeenCalledWith(22)
        expect(response).toEqual({fail: true})
    })

    test('response fails if internet not connected', async() => {
        NetInfo.setReturnValue({isConnected: false})
        let response = await apiCall(mockSuccessfullCallback, 22)
        expect(mockSuccessfullCallback).not.toHaveBeenCalled()
        expect(response).toEqual({fail: true})
    })
    test('response has an error key if the call returns an error', async() => {
        let response = await apiCall(mockErrorCallback, 22)
        expect(mockErrorCallback).toHaveBeenCalled()
        expect(mockErrorCallback).toHaveBeenCalledWith(22)
        expect(response).toEqual({error: true})
    })
})