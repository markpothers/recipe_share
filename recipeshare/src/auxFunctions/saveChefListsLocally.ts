import AsyncStorage from "@react-native-async-storage/async-storage";
import { ListChef } from "../centralTypes";

export const saveChefListsLocally = async (
	chefId: number,
	myId: number,
	listName: string,
	chefList: ListChef[]
): Promise<void> => {
	const date = new Date().getTime();
	// AsyncStorage.removeItem('localChefLists')
	try {
		const res = await AsyncStorage.getItem("localChefLists");
		if (res == null) {
			const newLocalChefsList = {
				[chefId]: {
					[listName]: {
						chefList,
						dateSaved: date,
					},
				},
			};
			await AsyncStorage.setItem("localChefLists", JSON.stringify(newLocalChefsList));
		} else {
			const localChefLists = JSON.parse(res);
			const listKeys = Object.keys(localChefLists);
			const oneWeek = 1000 * 60 * 60 * 24 * 7;

			// for every chef ...
			listKeys.forEach((key) => {
				// ...except if its one of my Chef lists (never expire this member's lists, just replace them)
				if (myId != parseInt(key)) {
					const chefLists = Object.keys(localChefLists[key]);
					// ...check every saved list and delete if it's > 7 days old
					chefLists.forEach((list) => {
						if (localChefLists[key][list].dateSaved < date - oneWeek) {
							delete localChefLists[key][list];
						}
					});
					// ...and if a chef has no lists remaining, delete the chef
					if (Object.keys(localChefLists[key]).length == 0) {
						delete localChefLists[key];
					}
				}
			});

			// add new list in its place
			localChefLists[chefId] = {
				...localChefLists[chefId],
				[listName]: {
					chefList,
					dateSaved: date,
				},
			};

			await AsyncStorage.setItem("localChefLists", JSON.stringify(localChefLists));
		}
	} catch {
		// Handle errors gracefully - don't throw to avoid crashing the app
	}
};

export const loadLocalChefLists = async (chefId: number, listName: string): Promise<ListChef[]> => {
	try {
		const res = await AsyncStorage.getItem("localChefLists");
		if (res) {
			const localChefLists = JSON.parse(res);
			if (Object.prototype.hasOwnProperty.call(localChefLists, chefId.toString())) {
				if (Object.prototype.hasOwnProperty.call(localChefLists[chefId.toString()], listName)) {
					return localChefLists[chefId.toString()][listName].chefList;
				}
			}
		}
		return [];
	} catch {
		// Handle errors gracefully by returning empty array
		return [];
	}
};
