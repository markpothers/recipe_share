import AsyncStorage from '@react-native-async-storage/async-storage'

export const saveActionsLocally = (action) => {
	// console.log(userId)
	// console.log('saving action locally')

	AsyncStorage.getItem('locallySavedActions', (err, res) => {
		if (res != null) {
			let locallySavedActions = JSON.parse(res)
			let actionsToSave = [...locallySavedActions, action]
			AsyncStorage.setItem('locallySavedActions', JSON.stringify(actionsToSave), () => {

			})
		} else {
			let actionsToSave = [action]
			AsyncStorage.setItem('locallySavedActions', JSON.stringify(actionsToSave), () => {

			})
		}
	})
}

export const runSavedActions = () => {
	// console.log(destroyRecipeLike)
	// console.log(userId)
	// console.log('running locally saved actions')
	// AsyncStorage.removeItem('locallySavedActions')

	AsyncStorage.getItem('locallySavedActions', (err, res) => {
		if (res != null) {
			// let locallySavedActions = JSON.parse(res)
			// locallySavedActions.forEach(action => {
				// console.log(`running: ${action}`)
				// console.log(action.split('(')[0])
				// console.log(eval(action.split('(')[0]))
				// eval(action)
				// .then (res => () => {
				//     console.log(res)
				// })
			// });
		}
	})
}
