import AsyncStorage from "@react-native-async-storage/async-storage"
import { Chef } from "../centralTypes"

const saveChefDetailsLocally = (chefDetails: Chef & { dateSaved?: number }, userId: number): void => {
	AsyncStorage.getItem("localChefDetails", (err, res) => {
		if (res != null) {
			const localChefDetails = JSON.parse(res)
			let newChefsList = localChefDetails.filter((localChef) => localChef.chef.id !== chefDetails.chef.id)

			const date = new Date().getTime()
			chefDetails.dateSaved = date
			newChefsList.push(chefDetails)

			//get rid of recipes that have been saved too long
			const oneWeek = 1000 * 60 * 60 * 24 * 7
			newChefsList = newChefsList.filter((listChef) => {
				if (listChef.chef.id == userId) {
					//keep my own details
					// console.log('chef is me')
					return listChef
				} else if (listChef.dateSaved >= date - oneWeek) {
					//keep viewed recipes for one month
					// console.log('recipe is young')
					return listChef
				} else {
					return
				}
			})

			AsyncStorage.setItem("localChefDetails", JSON.stringify(newChefsList))
		} else {
			const newChefsList = [chefDetails]
			AsyncStorage.setItem("localChefDetails", JSON.stringify(newChefsList))
		}
	})
}

export default saveChefDetailsLocally
