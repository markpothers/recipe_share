import { Animated, FlatList } from "react-native";
import { responsiveHeight } from "react-native-responsive-dimensions";
import {
	destroyReShare,
	destroyRecipeLike,
	getAvailableFilters,
	getChefDetails,
	getRecipeDetails,
	getRecipeList,
	postReShare,
	postRecipeLike,
	postRecipeMake,
} from "../../fetches";
import { loadLocalRecipeLists, saveRecipeListsLocally } from "../../auxFunctions/saveRecipeListsLocally";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Cuisine, FilterSettings, ListRecipe, LoggedInChef, Serves } from "../../centralTypes";
import { storeChefDetails, storeRecipeDetails, updateAllRecipeLists, updateSingleRecipeList, useAppDispatch } from "../../redux";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { NetInfoState } from "@react-native-community/netinfo";
import NetInfo from "@react-native-community/netinfo";
import AppHeader from "../../navigation/appHeader";
import { clearedFilters } from "../../constants/clearedFilters";
import { cuisines } from "../../constants/cuisines";
import React from "react";
import saveChefDetailsLocally from "../../auxFunctions/saveChefDetailsLocally";
import saveRecipeDetailsLocally from "../../auxFunctions/saveRecipeDetailsLocally";
import { serves } from "../../constants/serves";

NetInfo.configure({ reachabilityShortTimeout: 5 }); // 5ms

const startingLimit = 10;
const startingOffset = 0;

type RecipeListQueryOverrides = {
	limit?: number;
	offset?: number;
	searchTerm?: string;
	filterSettings?: FilterSettings;
	selectedCuisine?: Cuisine;
	selectedServes?: Serves;
};

const getErrorName = (error: unknown): string | undefined => {
	if (typeof error === "object" && error !== null && "name" in error) {
		const maybeName = (error as { name?: unknown }).name;
		if (typeof maybeName === "string") {
			return maybeName;
		}
	}
	return undefined;
};

export type RecipesListRouteParams = {
	deleteId?: number | null;
	refresh?: boolean;
	title?: string;
};

export type RecipesListRoute = {
	key: string;
	name: string;
	params?: RecipesListRouteParams;
};

export type RecipesListNavigation = {
	addListener: (eventName: "focus", callback: () => void | Promise<void>) => void;
	removeListener: (eventName: "focus", callback: () => void | Promise<void>) => void;
	navigate: (screen: string, params?: unknown) => void;
	setParams: (params: Partial<RecipesListRouteParams>) => void;
	isFocused: () => boolean;
	getParent: () =>
		| {
				getState: () => { routes: Array<{ params?: { title?: string } }> };
				setOptions: (options: unknown) => void;
			}
		| undefined;
};

export type RecipesListModelProps = {
	listChoice: string;
	queryChefID?: number;
	global_ranking?: string;
	fetchChefDetails?: () => void | Promise<void>;
	route: RecipesListRoute;
	navigation: RecipesListNavigation;
	allRecipeLists: Record<string, ListRecipe[]>;
	loggedInChef: LoggedInChef;
};

export type RecipesListModel = {
	searchBar: React.RefObject<{ focus?: () => void } | null>;
	recipeFlatList: React.RefObject<FlatList<ListRecipe> | null>;
	filterDisplayed: boolean;
	awaitingServer: boolean;
	dataICantGet: number[];
	renderOfflineMessage: boolean;
	offlineDiagnostics: string | Error | NetInfoState | null;
	renderNoRecipesMessage: boolean;
	searchTerm: string;
	yOffset: Animated.Value;
	clampedScroll: ReturnType<typeof Animated.diffClamp>;
	cuisineOptions: Cuisine[];
	selectedCuisine: Cuisine;
	servesOptions: Serves[];
	selectedServes: Serves;
	filterOptions: string[];
	filterSettings: FilterSettings;
	anyFilterActive: boolean;
	recipeList: ListRecipe[];
	respondToFocus: () => Promise<void>;
	handleFilterButton: () => void;
	closeFilterAndRefresh: () => void;
	setSearchTerm: (term: string) => void;
	handleSearchBarFocus: () => void;
	handleSearchBarBlur: () => void;
	hideOfflineMessage: () => void;
	hideNoRecipesMessage: () => void;
	setSelectedCuisine: (cuisine: Cuisine) => void;
	setSelectedServes: (serves: Serves) => void;
	setFilterSetting: (filter: keyof FilterSettings, value: boolean) => void;
	clearFilterSettings: () => void;
	fetchFilterChoices: () => Promise<void>;
	refresh: () => Promise<void>;
	onEndReached: () => void;
	navigateToRecipeDetails: (recipeID: number, commenting?: boolean) => Promise<void>;
	navigateToChefDetails: (chefID: number, recipeID: number) => Promise<void>;
	likeRecipe: (recipeID: number) => Promise<void>;
	unlikeRecipe: (recipeID: number) => Promise<void>;
	makeRecipe: (recipeID: number) => Promise<void>;
	reShareRecipe: (recipeID: number) => Promise<void>;
	unReShareRecipe: (recipeID: number) => Promise<void>;
	removeDataFromCantGetList: (recipeID: number) => void;
};

export const useRecipesListModel = ({
	listChoice,
	queryChefID,
	global_ranking,
	route,
	navigation,
	allRecipeLists,
	loggedInChef,
	fetchChefDetails,
}: RecipesListModelProps): RecipesListModel => {
	const dispatch = useAppDispatch();
	const searchBar = useRef<{ focus?: () => void } | null>(null);
	const recipeFlatList = useRef<FlatList<ListRecipe> | null>(null);
	const abortController = useRef(new AbortController());
	const recipeListRef = useRef<ListRecipe[]>([]);
	const isFetchingMore = useRef(false);
	const routeRef = useRef(route);
	routeRef.current = route;

	const [limit, setLimit] = useState(startingLimit);
	const [offset, setOffset] = useState(startingOffset);
	const [filterDisplayed, setFilterDisplayed] = useState(false);
	const [awaitingServer, setAwaitingServer] = useState(false);
	const [dataICantGet, setDataICantGet] = useState<number[]>([]);
	const [renderOfflineMessage, setRenderOfflineMessage] = useState(false);
	const [offlineDiagnostics, setOfflineDiagnostics] = useState<string | Error | NetInfoState | null>(null);
	const [renderNoRecipesMessage, setRenderNoRecipesMessage] = useState(false);
	const [searchTerm, setSearchTermState] = useState("");
	const yOffset = useRef(new Animated.Value(0)).current;
	const clampedScroll = useRef(Animated.diffClamp(yOffset, -responsiveHeight(7), responsiveHeight(7))).current;
	const [cuisineOptions, setCuisineOptions] = useState<Cuisine[]>(cuisines);
	const [selectedCuisine, setSelectedCuisineState] = useState<Cuisine>("Any");
	const [servesOptions, setServesOptions] = useState<Serves[]>(serves);
	const [selectedServes, setSelectedServesState] = useState<Serves>("Any");
	const [filterOptions, setFilterOptions] = useState<string[]>(Object.keys(clearedFilters));
	const [filterSettings, setFilterSettingsState] = useState<FilterSettings>(clearedFilters);

	const recipeList = useMemo(() => allRecipeLists[route.key] || [], [allRecipeLists, route.key]);
	recipeListRef.current = recipeList;
	const globalRanking = global_ranking || "";

	const getQueryChefId = useCallback((): number => {
		return queryChefID ? queryChefID : loggedInChef.id;
	}, [queryChefID, loggedInChef.id]);

	const getRecipeListName = useCallback((): string => {
		return listChoice;
	}, [listChoice]);

	const updateSingleList = useCallback(
		(listKey: string, nextRecipeList: ListRecipe[]) => {
			dispatch(updateSingleRecipeList({ listKey, recipeList: nextRecipeList }));
		},
		[dispatch]
	);

	const updateAllLists = useCallback(
		(nextAllRecipeLists: Record<string, ListRecipe[]>) => {
			dispatch(updateAllRecipeLists(nextAllRecipeLists));
		},
		[dispatch]
	);

	const storeRecipe = useCallback(
		(recipeDetails: Parameters<typeof storeRecipeDetails>[0]) => {
			dispatch(storeRecipeDetails(recipeDetails));
		},
		[dispatch]
	);

	const storeChef = useCallback(
		(chefDetails: Parameters<typeof storeChefDetails>[0]["chef_details"]) => {
			dispatch(storeChefDetails({ chefID: `chef${chefDetails.chef.id}`, chef_details: chefDetails }));
		},
		[dispatch]
	);

	const loadRecipesLocally = useCallback(async () => {
		const localRecipeList = await loadLocalRecipeLists(getQueryChefId(), getRecipeListName());
		if (localRecipeList.length > 0) {
			updateSingleList(route.key, localRecipeList);
		}
		setAwaitingServer(false);
	}, [getQueryChefId, getRecipeListName, route.key, updateSingleList]);

	const fetchRecipeList = useCallback(async (overrides: RecipeListQueryOverrides = {}) => {
		const effectiveLimit = overrides.limit ?? limit;
		const effectiveOffset = overrides.offset ?? offset;
		const effectiveSearchTerm = overrides.searchTerm ?? searchTerm;
		const effectiveFilterSettings = overrides.filterSettings ?? filterSettings;
		const effectiveSelectedCuisine = overrides.selectedCuisine ?? selectedCuisine;
		const effectiveSelectedServes = overrides.selectedServes ?? selectedServes;
		const netInfoState = await NetInfo.fetch();
		if (netInfoState.isConnected) {
			setAwaitingServer(true);
			try {
				const result = await getRecipeList(
					getRecipeListName(),
					getQueryChefId(),
					effectiveLimit,
					effectiveOffset,
					globalRanking,
					loggedInChef.auth_token,
					effectiveFilterSettings,
					effectiveSelectedCuisine,
					effectiveSelectedServes,
					effectiveSearchTerm,
					abortController.current
				);
				if (result.recipes.length === 0) {
					setRenderNoRecipesMessage(true);
				}
				updateSingleList(route.key, result.recipes);
				setCuisineOptions(result.cuisines);
				setServesOptions(result.serves);
				setFilterOptions(result.filters);
				setAwaitingServer(false);
				await saveRecipeListsLocally(
					getQueryChefId(),
					loggedInChef.id,
					getRecipeListName(),
					result.recipes
				);
			} catch (error) {
				setAwaitingServer(false);
				const errorName = getErrorName(error);
				switch (errorName) {
					case "Logout":
						navigation.navigate("ProfileCover", {
							screen: "Profile",
							params: { logout: true },
						});
						break;
					case "AbortError":
						break;
					case "Timeout":
						if (recipeListRef.current.length === 0) {
							await loadRecipesLocally();
						}
						break;
					default:
						if (recipeListRef.current.length === 0) {
							await loadRecipesLocally();
						}
						break;
				}
			}
		} else {
			setRenderOfflineMessage(true);
			setOfflineDiagnostics(netInfoState);
		}
	}, [
		filterSettings,
		getQueryChefId,
		getRecipeListName,
		globalRanking,
		limit,
		loadRecipesLocally,
		loggedInChef.auth_token,
		loggedInChef.id,
		navigation,
		offset,
		route.key,
		searchTerm,
		selectedCuisine,
		selectedServes,
		updateSingleList,
	]);

	const fetchAdditionalRecipesForList = useCallback(async (requestedOffset?: number) => {
		const currentRecipeList = recipeListRef.current;
		if (currentRecipeList.length > 0) {
			const effectiveOffset = typeof requestedOffset === "number" ? requestedOffset : offset;
			try {
				const result = await getRecipeList(
					getRecipeListName(),
					getQueryChefId(),
					limit,
					effectiveOffset,
					globalRanking,
					loggedInChef.auth_token,
					filterSettings,
					selectedCuisine,
					selectedServes,
					searchTerm,
					abortController.current
				);
				setCuisineOptions(result.cuisines);
				setServesOptions(result.serves);
				setFilterOptions(result.filters);
				const combinedRecipes = [...recipeListRef.current, ...result.recipes];
				await saveRecipeListsLocally(
					getQueryChefId(),
					loggedInChef.id,
					getRecipeListName(),
					combinedRecipes
				);
				updateSingleList(route.key, combinedRecipes);
			} catch (error) {
				if (getErrorName(error) === "Logout") {
					navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
				}
			}
		}
	}, [
		filterSettings,
		getQueryChefId,
		getRecipeListName,
		globalRanking,
		limit,
		loggedInChef.auth_token,
		loggedInChef.id,
		navigation,
		offset,
		route.key,
		searchTerm,
		selectedCuisine,
		selectedServes,
		updateSingleList,
	]);

	const setupHeaderScrollToTopButton = useCallback(() => {
		const parentNavigation = navigation?.getParent();
		const routes = parentNavigation?.getState().routes || [];
		if (navigation.isFocused()) {
			parentNavigation?.setOptions({
				headerTitle: (props: unknown) =>
					React.createElement(AppHeader, {
						...(props as Record<string, unknown>),
						text: routes[routes.length - 1]?.params?.title || "",
						buttonAction: () => recipeFlatList.current?.scrollToOffset({ offset: 0, animated: true }),
					}),
			});
		}
	}, [navigation]);

	const deleteRecipeList = useCallback(() => {
		const newAllRecipeLists = { ...allRecipeLists };
		delete newAllRecipeLists[route.key];
		updateAllLists(newAllRecipeLists);
	}, [allRecipeLists, route.key, updateAllLists]);

	const deleteRecipeFromAllLists = useCallback(
		(recipeId: number) => {
			const newAllRecipeLists: Record<string, ListRecipe[]> = {};
			Object.keys(allRecipeLists).forEach((list) => {
				newAllRecipeLists[list] = allRecipeLists[list].filter((recipe) => recipe.id !== recipeId);
			});
			updateAllLists(newAllRecipeLists);
		},
		[allRecipeLists, updateAllLists]
	);

	const respondToFocus = useCallback(async () => {
		setupHeaderScrollToTopButton();
		setAwaitingServer(true);
		if (routeRef.current.params?.deleteId) {
			deleteRecipeFromAllLists(routeRef.current.params.deleteId);
			navigation.setParams({ deleteId: null });
			setAwaitingServer(false);
			return;
		}

		if (routeRef.current.params?.refresh) {
			navigation.setParams({ refresh: false });
			setOffset(startingOffset);
			setLimit(startingLimit);
			setAwaitingServer(true);
			await fetchRecipeList({ limit: startingLimit, offset: startingOffset });
			recipeFlatList.current?.scrollToOffset({ x: 0, y: 0, animated: true } as never);
			setAwaitingServer(false);
			return;
		}

		setAwaitingServer(false);
	}, [deleteRecipeFromAllLists, fetchRecipeList, navigation, setupHeaderScrollToTopButton]);

	useEffect(() => {
		void fetchRecipeList();
		navigation.addListener("focus", respondToFocus);
		setupHeaderScrollToTopButton();
		return () => {
			abortController.current.abort();
			navigation.removeListener("focus", respondToFocus);
			deleteRecipeList();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchFilterChoices = useCallback(async () => {
		try {
			const result = await getAvailableFilters(
				getRecipeListName(),
				getQueryChefId(),
				limit,
				offset,
				globalRanking,
				loggedInChef.auth_token,
				filterSettings,
				selectedCuisine,
				selectedServes,
				searchTerm,
				abortController.current
			);
			setCuisineOptions(result.cuisines);
			setServesOptions(result.serves);
			setFilterOptions(result.filters);
		} catch (error) {
			if (getErrorName(error) === "Logout") {
				navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
			}
		}
	}, [
		filterSettings,
		getQueryChefId,
		getRecipeListName,
		globalRanking,
		limit,
		loggedInChef.auth_token,
		navigation,
		offset,
		searchTerm,
		selectedCuisine,
		selectedServes,
	]);

	const navigateToRecipeDetails = useCallback(
		async (recipeID: number, commenting = false) => {
			setAwaitingServer(true);
			try {
				const recipeDetails = await getRecipeDetails(recipeID, loggedInChef.auth_token);
				if (recipeDetails) {
					await saveRecipeDetailsLocally(recipeDetails as Parameters<typeof saveRecipeDetailsLocally>[0], loggedInChef.id);
					storeRecipe(recipeDetails);
					setAwaitingServer(false);
					setFilterDisplayed(false);
					navigation.navigate("RecipeDetails", {
						recipeID,
						commenting,
					});
				}
			} catch (error) {
				if (getErrorName(error) === "Logout") {
					navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
				}
				try {
					const res = await AsyncStorage.getItem("localRecipeDetails");
					if (res != null) {
						const localRecipeDetails = JSON.parse(res) as Array<{ recipe: { id: number } }>;
						const thisRecipeDetails = localRecipeDetails.find(
							(recipeDetails) => recipeDetails.recipe.id === recipeID
						);

						if (thisRecipeDetails) {
							storeRecipe(thisRecipeDetails as Parameters<typeof storeRecipe>[0]);
							setAwaitingServer(false);
							navigation.navigate("RecipeDetails", {
								recipeID,
								commenting,
							});
						} else {
							setDataICantGet((state) => [...state, recipeID]);
							setAwaitingServer(false);
						}
					} else {
						setDataICantGet((state) => [...state, recipeID]);
						setAwaitingServer(false);
					}
				} catch {
					setDataICantGet((state) => [...state, recipeID]);
					setAwaitingServer(false);
				}
			}
			setAwaitingServer(false);
		},
		[loggedInChef.auth_token, loggedInChef.id, navigation, storeRecipe]
	);

	const navigateToChefDetails = useCallback(
		async (chefID: number, recipeID: number) => {
			setAwaitingServer(true);
			try {
				const chefDetails = await getChefDetails(chefID, loggedInChef.auth_token);
				if (chefDetails) {
					storeChef(chefDetails);
					void saveChefDetailsLocally(chefDetails, loggedInChef.id);
					setAwaitingServer(false);
					navigation.navigate("ChefDetails", { chefID });
				}
			} catch (error) {
				if (getErrorName(error) === "Logout") {
					navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
				}
				try {
					const res = await AsyncStorage.getItem("localChefDetails");
					if (res != null) {
						const localChefDetails = JSON.parse(res) as Array<{ chef: { id: number } }>;
						const thisChefDetails = localChefDetails.find((details) => details.chef.id === chefID);
						if (thisChefDetails) {
							storeChef(thisChefDetails as Parameters<typeof storeChef>[0]);
							setAwaitingServer(false);
							navigation.navigate("ChefDetails", { chefID });
						} else {
							setDataICantGet((state) => [...state, recipeID]);
							setAwaitingServer(false);
						}
					} else {
						setDataICantGet((state) => [...state, recipeID]);
						setAwaitingServer(false);
					}
				} catch {
					setDataICantGet((state) => [...state, recipeID]);
					setAwaitingServer(false);
				}
			}
			setAwaitingServer(false);
		},
		[loggedInChef.auth_token, loggedInChef.id, navigation, storeChef]
	);

	const removeDataFromCantGetList = useCallback((recipeID: number) => {
		setDataICantGet((state) => state.filter((data) => data !== recipeID));
	}, []);

	const refresh = useCallback(async () => {
		setLimit(startingLimit);
		setOffset(startingOffset);
		setAwaitingServer(true);
		await fetchRecipeList({ limit: startingLimit, offset: startingOffset });
		setAwaitingServer(false);
	}, [fetchRecipeList]);

	const onEndReached = useCallback(() => {
		if (isFetchingMore.current) return;
		const currentLength = recipeListRef.current.length;
		if (currentLength > 0 && currentLength % startingLimit === 0) {
			isFetchingMore.current = true;
			const nextOffset = currentLength;
			setOffset(nextOffset);
			void fetchAdditionalRecipesForList(nextOffset).finally(() => {
				isFetchingMore.current = false;
			});
		}
	}, [fetchAdditionalRecipesForList]);

	const updateAttributeCountInRecipeLists = useCallback(
		(recipeId: number, attribute: keyof ListRecipe, toggle: keyof ListRecipe, diff: number) => {
			const newAllRecipeLists: Record<string, ListRecipe[]> = {};
			Object.keys(allRecipeLists).forEach((list) => {
				const thisList = allRecipeLists[list];
				const mapped = thisList.map((recipe) => {
					if (recipe.id === recipeId) {
						const newRecipe = { ...recipe };
						const currentAttributeValue = newRecipe[attribute];
						if (typeof currentAttributeValue === "number") {
							(newRecipe[attribute] as number) = currentAttributeValue + diff;
						}
						(newRecipe[toggle] as number) = diff > 0 ? 1 : 0;
						return newRecipe;
					}
					return recipe;
				});
				newAllRecipeLists[list] = mapped;
			});
			updateAllLists(newAllRecipeLists);
		},
		[allRecipeLists, updateAllLists]
	);

	const withConnectivity = useCallback(
		async (onConnected: () => Promise<void>) => {
			const netInfoState = await NetInfo.fetch();
			if (netInfoState.isConnected) {
				setAwaitingServer(true);
				try {
					await onConnected();
				} finally {
					setAwaitingServer(false);
				}
			} else {
				setRenderOfflineMessage(true);
				setOfflineDiagnostics(netInfoState);
			}
		},
		[]
	);

	const likeRecipe = useCallback(
		async (recipeID: number) => {
			await withConnectivity(async () => {
				try {
					const likePosted = await postRecipeLike(recipeID, loggedInChef.id, loggedInChef.auth_token);
					if (likePosted) {
						updateAttributeCountInRecipeLists(recipeID, "likes_count", "chef_liked", 1);
						if (fetchChefDetails) {
							await fetchChefDetails();
						}
					}
				} catch (error) {
					if (getErrorName(error) === "Logout") {
						navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
					}
					setDataICantGet((state) => [...state, recipeID]);
				}
			});
		},
		[fetchChefDetails, loggedInChef.auth_token, loggedInChef.id, navigation, updateAttributeCountInRecipeLists, withConnectivity]
	);

	const unlikeRecipe = useCallback(
		async (recipeID: number) => {
			await withConnectivity(async () => {
				try {
					const unlikePosted = await destroyRecipeLike(recipeID, loggedInChef.id, loggedInChef.auth_token);
					if (unlikePosted) {
						updateAttributeCountInRecipeLists(recipeID, "likes_count", "chef_liked", -1);
						if (fetchChefDetails) {
							await fetchChefDetails();
						}
					}
				} catch (error) {
					if (getErrorName(error) === "Logout") {
						navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
					}
					setDataICantGet((state) => [...state, recipeID]);
				}
			});
		},
		[fetchChefDetails, loggedInChef.auth_token, loggedInChef.id, navigation, updateAttributeCountInRecipeLists, withConnectivity]
	);

	const makeRecipe = useCallback(
		async (recipeID: number) => {
			await withConnectivity(async () => {
				try {
					const makePosted = await postRecipeMake(recipeID, loggedInChef.id, loggedInChef.auth_token);
					if (makePosted) {
						updateAttributeCountInRecipeLists(recipeID, "makes_count", "chef_made", 1);
					}
				} catch (error) {
					if (getErrorName(error) === "Logout") {
						navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
					}
					setDataICantGet((state) => [...state, recipeID]);
				}
			});
		},
		[loggedInChef.auth_token, loggedInChef.id, navigation, updateAttributeCountInRecipeLists, withConnectivity]
	);

	const reShareRecipe = useCallback(
		async (recipeID: number) => {
			await withConnectivity(async () => {
				try {
					const reSharePosted = await postReShare(recipeID, loggedInChef.id, loggedInChef.auth_token);
					if (reSharePosted) {
						updateAttributeCountInRecipeLists(recipeID, "shares_count", "chef_shared", 1);
						if (fetchChefDetails) {
							await fetchChefDetails();
						}
					}
				} catch (error) {
					if (getErrorName(error) === "Logout") {
						navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
					}
					setDataICantGet((state) => [...state, recipeID]);
				}
			});
		},
		[fetchChefDetails, loggedInChef.auth_token, loggedInChef.id, navigation, updateAttributeCountInRecipeLists, withConnectivity]
	);

	const unReShareRecipe = useCallback(
		async (recipeID: number) => {
			await withConnectivity(async () => {
				try {
					const unReShared = await destroyReShare(recipeID, loggedInChef.id, loggedInChef.auth_token);
					if (unReShared) {
						updateAttributeCountInRecipeLists(recipeID, "shares_count", "chef_shared", -1);
						if (fetchChefDetails) {
							await fetchChefDetails();
						}
					}
				} catch (error) {
					if (getErrorName(error) === "Logout") {
						navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
					}
					setDataICantGet((state) => [...state, recipeID]);
				}
			});
		},
		[fetchChefDetails, loggedInChef.auth_token, loggedInChef.id, navigation, updateAttributeCountInRecipeLists, withConnectivity]
	);

	const handleFilterButton = useCallback(() => {
		setFilterDisplayed(true);
	}, []);

	const closeFilterAndRefresh = useCallback(() => {
		setFilterDisplayed(false);
		void refresh();
	}, [refresh]);

	const setSearchTerm = useCallback(
		(term: string) => {
			setSearchTermState(term);
			setLimit(startingLimit);
			setOffset(startingOffset);
			abortController.current.abort();
			abortController.current = new AbortController();
			recipeFlatList.current?.scrollToOffset({ animated: true, offset: 0 });
			void fetchRecipeList({ limit: startingLimit, offset: startingOffset, searchTerm: term });
		},
		[fetchRecipeList]
	);

	const handleSearchBarFocus = useCallback(() => {
		searchBar.current?.focus?.();
	}, []);

	const handleSearchBarBlur = useCallback(() => {}, []);

	const hideOfflineMessage = useCallback(() => {
		setRenderOfflineMessage(false);
	}, []);

	const hideNoRecipesMessage = useCallback(() => {
		setRenderNoRecipesMessage(false);
	}, []);

	const setSelectedCuisine = useCallback((cuisine: Cuisine) => {
		setSelectedCuisineState(cuisine);
	}, []);

	const setSelectedServes = useCallback((serves: Serves) => {
		setSelectedServesState(serves);
	}, []);

	const setFilterSetting = useCallback((filter: keyof FilterSettings, value: boolean) => {
		setFilterSettingsState((state) => ({
			...state,
			[filter]: value,
		}));
	}, []);

	const clearFilterSettings = useCallback(() => {
		setFilterSettingsState(clearedFilters);
		setSelectedCuisineState("Any");
		setSelectedServesState("Any");
	}, []);

	const checkFilterSetting = useCallback(
		(element: keyof FilterSettings) => {
			return filterSettings[element] === true;
		},
		[filterSettings]
	);

	const anyFilterActive =
		(Object.keys(filterSettings) as Array<keyof FilterSettings>).some(checkFilterSetting) ||
		selectedCuisine !== "Any" ||
		selectedServes !== "Any";

	const onScroll = useCallback(
		(...args: unknown[]) => {
			void args;
		},
		[]
	);

	return {
		searchBar,
		recipeFlatList,
		filterDisplayed,
		awaitingServer,
		dataICantGet,
		renderOfflineMessage,
		offlineDiagnostics,
		renderNoRecipesMessage,
		searchTerm,
		yOffset,
		clampedScroll,
		cuisineOptions,
		selectedCuisine,
		servesOptions,
		selectedServes,
		filterOptions,
		filterSettings,
		anyFilterActive,
		recipeList,
		respondToFocus,
		handleFilterButton,
		closeFilterAndRefresh,
		setSearchTerm,
		handleSearchBarFocus,
		handleSearchBarBlur,
		hideOfflineMessage,
		hideNoRecipesMessage,
		setSelectedCuisine,
		setSelectedServes,
		setFilterSetting,
		clearFilterSettings,
		fetchFilterChoices,
		refresh,
		onEndReached,
		navigateToRecipeDetails,
		navigateToChefDetails,
		likeRecipe,
		unlikeRecipe,
		makeRecipe,
		reShareRecipe,
		unReShareRecipe,
		removeDataFromCantGetList,
	};
};
