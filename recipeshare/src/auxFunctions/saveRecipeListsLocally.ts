import AsyncStorage from "@react-native-async-storage/async-storage";
import { ListRecipe } from "../centralTypes";

export const saveRecipeListsLocally = async (
	chefId: number,
	myId: number,
	listName: string,
	recipeList: ListRecipe[]
): Promise<void> => {
	try {
		const date = new Date().getTime();
		const res = await AsyncStorage.getItem("localRecipeLists");

		if (res == null) {
			const newLocalRecipesList = {
				[chefId]: {
					[listName]: {
						recipeList,
						dateSaved: date,
					},
				},
			};
			await AsyncStorage.setItem("localRecipeLists", JSON.stringify(newLocalRecipesList));
		} else {
			const localRecipeLists = JSON.parse(res);
			const listKeys = Object.keys(localRecipeLists);
			const oneWeek = 1000 * 60 * 60 * 24 * 7;

			// for every chef ...
			listKeys.forEach((key) => {
				// ...except if its one of my recipe lists (never expire this member's lists, just replace them)
				if (myId != parseInt(key)) {
					const chefLists = Object.keys(localRecipeLists[key]);
					// ...check every saved list and delete if it's > 7 days old
					chefLists.forEach((list) => {
						if (localRecipeLists[key][list].dateSaved < date - oneWeek) {
							delete localRecipeLists[key][list];
						}
					});
					// ...and if a chef has no lists remaining, delete the chef
					if (Object.keys(localRecipeLists[key]).length == 0) {
						delete localRecipeLists[key];
					}
				}
			});

			// add new list in its place
			localRecipeLists[chefId] = {
				...localRecipeLists[chefId],
				[listName]: {
					recipeList,
					dateSaved: date,
				},
			};

			await AsyncStorage.setItem("localRecipeLists", JSON.stringify(localRecipeLists));
		}
	} catch {
		// Handle errors gracefully - silent fail for local storage
	}
};

export const loadLocalRecipeLists = async (chefId: number, listName: string): Promise<ListRecipe[]> => {
	try {
		const res = await AsyncStorage.getItem("localRecipeLists");
		if (res) {
			const localRecipeLists = JSON.parse(res);
			if (Object.prototype.hasOwnProperty.call(localRecipeLists, chefId.toString())) {
				if (Object.prototype.hasOwnProperty.call(localRecipeLists[chefId.toString()], listName)) {
					return localRecipeLists[chefId.toString()][listName].recipeList;
				}
			}
		}
		return [];
	} catch {
		// Handle errors gracefully by returning empty array
		return [];
	}
};
