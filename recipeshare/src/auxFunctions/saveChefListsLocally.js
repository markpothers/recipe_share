import AsyncStorage from '@react-native-async-storage/async-storage'

export const saveChefListsLocally = (chefId, myId, listName, chefList) => {
	const date = new Date().getTime()
	// AsyncStorage.removeItem('localChefLists')
	AsyncStorage.getItem('localChefLists', (err, res) => {
		if (res == null) {
			let newLocalChefsList = {
				[chefId]: {
					[listName]: {
						chefList,
						dateSaved: date
					}
				}
			}
			AsyncStorage.setItem('localChefLists', JSON.stringify(newLocalChefsList), () => { })
		} else {
			let localChefLists = JSON.parse(res)
			let listKeys = Object.keys(localChefLists)
			const oneWeek = 1000 * 60 * 3//60 * 24 * 7

			// for every chef ...
			listKeys.forEach(key => {
				// ...except if its one of my Chef lists (never expire this member's lists, just replace them)
				if (myId != parseInt(key)) {
					let chefLists = Object.keys(localChefLists[key])
					// ...check every saved list and delete if it's > 7 days old
					chefLists.forEach(list => {
						if (localChefLists[key][list].dateSaved < date - oneWeek) {
							delete localChefLists[key][list]
						}
					})
					// ...and if a chef has no lists remaining, delete the chef
					if (Object.keys(localChefLists[key]).length == 0) {
						delete localChefLists[key]
					}
				}
			})

			// add new list in its place
			localChefLists[chefId] = {
				...localChefLists[chefId],
				[listName]: {
					chefList,
					dateSaved: date
				}
			}

			AsyncStorage.setItem('localChefLists', JSON.stringify(localChefLists), () => { })
		}
	})
}

export const loadLocalChefLists = (chefId, listName) => {
	return new Promise(resolve => {
		AsyncStorage.getItem('localChefLists', (err, res) => {
			// console.log(res)
			if (res) {
				let localChefLists = JSON.parse(res)
				// console.log(Object.keys(localChefLists))
				// Object.keys(localChefLists).forEach( chef => {
					// console.log(Object.keys(localChefLists[chef]))
				// })
				// console.log(chefId)
				if (Object.prototype.hasOwnProperty.call(localChefLists, chefId.toString())) {
					if (Object.prototype.hasOwnProperty.call(localChefLists[chefId.toString()], listName)) {
						// console.log('found a saved Chef list')
						// console.log(localChefLists[chefId.toString()])
						// let ids = localChefLists[chefId.toString()][listName].chefList.map(r => r.id)
						// console.log(ids)
						resolve(localChefLists[chefId.toString()][listName].chefList)
					}
				}
			} else if (err) {
				//console.log(err)
			} else {
				//console.log("loading local Chefs went wrong but didn't error")
			}
			resolve([])
		})
	})
}

