import NetInfo from '@react-native-community/netinfo'
NetInfo.configure({reachabilityShortTimeout: 5}) //5ms


export const apiCall = async (callback, ...args) => {
    let netInfoState = await NetInfo.fetch()
    let response = {}
    if (netInfoState.isConnected) {
        try {
            response = await callback(...args)
			// console.log(response)
        } catch (e) {
			// console.log(e)
            response.fail = true
        }
    } else {
        response.fail = true
    }
    return response
}
