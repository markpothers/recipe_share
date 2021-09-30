import AsyncStorage from '@react-native-async-storage/async-storage'

export const saveRecipeListsLocally = (chefId, myId, listName, recipeList) => {
	const date = new Date().getTime()

	// AsyncStorage.removeItem('localRecipeLists')
	AsyncStorage.getItem('localRecipeLists', (err, res) => {
		if (res == null) {
			let newLocalRecipesList = {
				[chefId]: {
					[listName]: {
						recipeList,
						dateSaved: date
					}
				}
			}
			AsyncStorage.setItem('localRecipeLists', JSON.stringify(newLocalRecipesList), () => { })
		} else {
			let localRecipeLists = JSON.parse(res)
			let listKeys = Object.keys(localRecipeLists)
			const oneWeek = 1000 * 60 * 60 * 24 * 7

			// for every chef ...
			listKeys.forEach(key => {
				// ...except if its one of my recipe lists (never expire this member's lists, just replace them)
				if (myId != parseInt(key)) {
					let chefLists = Object.keys(localRecipeLists[key])
					// ...check every saved list and delete if it's > 7 days old
					chefLists.forEach(list => {
						if (localRecipeLists[key][list].dateSaved < date - oneWeek) {
							delete localRecipeLists[key][list]
						}
					})
					// ...and if a chef has no lists remaining, delete the chef
					if (Object.keys(localRecipeLists[key]).length == 0) {
						delete localRecipeLists[key]
					}
				}
			})

			// add new list in its place
			localRecipeLists[chefId] = {
				...localRecipeLists[chefId],
				[listName]: {
					recipeList,
					dateSaved: date
				}
			}

			AsyncStorage.setItem('localRecipeLists', JSON.stringify(localRecipeLists), () => { })
		}
	})
}

export const loadLocalRecipeLists = (chefId, listName) => {
	return new Promise(resolve => {
		AsyncStorage.getItem('localRecipeLists', (err, res) => {
			if (res) {
				let localRecipeLists = JSON.parse(res)
				// console.log(Object.keys(localRecipeLists))
				// Object.keys(localRecipeLists).forEach( chef => {
				// 	console.log(Object.keys(localRecipeLists[chef]))
				// })
				if (Object.prototype.hasOwnProperty.call(localRecipeLists, chefId.toString())) {
					if (Object.prototype.hasOwnProperty.call(localRecipeLists[chefId.toString()], listName)) {
						// console.log('found a saved recipe list')
						// let ids = localRecipeLists[chefId.toString()][listName].recipeList.map(r => r.id)
						// console.log(ids)
						resolve(localRecipeLists[chefId.toString()][listName].recipeList)
					}
				}
			} else if (err) {
				//console.log(err)
			} else {
				//console.log("loading local recipes went wrong but didn't error")
			}
			resolve([])
		})
	})
}

