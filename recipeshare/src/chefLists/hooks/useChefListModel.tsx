import { Animated, FlatList } from "react-native";
import { destroyFollow, getChefDetails, getChefList, postFollow } from "../../fetches";
import { loadLocalChefLists, saveChefListsLocally } from "../../auxFunctions/saveChefListsLocally";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { storeChefDetails, updateAllChefLists, updateSingleChefList, useAppDispatch, useAppSelector } from "../../redux";
import {
	Chef,
	ChefListQuery,
	ListChef,
} from "../../centralTypes";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { ChefsFollowingMeTabProps, ChefsIFollowTabProps, NewestChefsTabProps, TopChefsTabProps } from "../../navigation";

import AppHeader from "../../navigation/appHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import saveChefDetailsLocally from "../../auxFunctions/saveChefDetailsLocally";

NetInfo.configure({ reachabilityShortTimeout: 5 });

type NavigationType =
	| ChefsIFollowTabProps["navigation"]
	| ChefsFollowingMeTabProps["navigation"]
	| NewestChefsTabProps["navigation"]
	| TopChefsTabProps["navigation"];

type RouteType =
	| ChefsIFollowTabProps["route"]
	| ChefsFollowingMeTabProps["route"]
	| NewestChefsTabProps["route"]
	| TopChefsTabProps["route"];

type SearchBarRef = {
	focus: () => void;
};

type ChefListModel = {
	awaitingServer: boolean;
	isAdmin: boolean;
	renderOfflineMessage: boolean;
	offlineDiagnostics: unknown;
	searchTerm: string;
	yOffset: Animated.Value;
	clampedScroll: ReturnType<typeof Animated.diffClamp>;
	chefList: ListChef[];
	chefsICantGet: number[];
	getChefListName: () => ChefListQuery;
	setSearchTerm: (value: string) => void;
	handleSearchBarFocus: () => void;
	onSearchBarBlur: () => void;
	onEndReached: () => void;
	navigateToChefDetails: (chefID: number) => Promise<void>;
	followChef: (followeeID: number) => Promise<void>;
	unFollowChef: (followeeID: number) => Promise<void>;
	removeChefFromCantGetList: (chefID: number) => void;
	refresh: () => void;
	clearOfflineMessage: () => void;
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

const isChefDetails = (value: unknown): value is Chef => {
	if (!value || typeof value !== "object") {
		return false;
	}
	const maybeChef = value as { chef?: { id?: unknown } };
	return typeof maybeChef.chef?.id === "number";
};

export const useChefListModel = (
	navigation: NavigationType,
	route: RouteType,
	listChoice: ChefListQuery,
	queryChefID: number | undefined,
	searchBarRef: React.RefObject<SearchBarRef | null>,
	chefFlatListRef: React.RefObject<FlatList<ListChef> | null>
): ChefListModel => {
	const dispatch = useAppDispatch();
	const allChefLists = useAppSelector((state) => state.root.allChefLists);
	const loggedInChef = useAppSelector((state) => state.root.loggedInChef);

	const [limit, setLimit] = useState<number>(10);
	const [offset, setOffset] = useState<number>(0);
	const [awaitingServer, setAwaitingServer] = useState<boolean>(false);
	const [chefsICantGet, setChefsICantGet] = useState<number[]>([]);
	const [renderOfflineMessage, setRenderOfflineMessage] = useState<boolean>(false);
	const [searchTerm, setSearchTermValue] = useState<string>("");
	const yOffset = useRef(new Animated.Value(0)).current;
	const clampedScroll = useRef(Animated.diffClamp(yOffset, -responsiveHeight(7), responsiveHeight(7))).current;
	const [offlineDiagnostics, setOfflineDiagnostics] = useState<unknown>("");
	const lastFetchedOffsetRef = useRef<number>(0);
	const focusUnsubscribeRef = useRef<(() => void) | null>(null);
	const isPaginatingRef = useRef<boolean>(false);
	const limitRef = useRef(limit);
	const offsetRef = useRef(offset);
	const searchTermRef = useRef(searchTerm);

	const getQueryChefId = useCallback(() => {
		return queryChefID ? queryChefID : loggedInChef.id;
	}, [loggedInChef.id, queryChefID]);

	const getChefListName = useCallback(() => {
		return listChoice;
	}, [listChoice]);

	const chefList = useMemo<ListChef[]>(() => {
		return allChefLists[route.key] || [];
	}, [allChefLists, route.key]);

	const allChefListsRef = useRef(allChefLists);
	const chefListRef = useRef(chefList);

	useEffect(() => {
		allChefListsRef.current = allChefLists;
	}, [allChefLists]);

	useEffect(() => {
		chefListRef.current = chefList;
	}, [chefList]);

	useEffect(() => {
		limitRef.current = limit;
	}, [limit]);

	useEffect(() => {
		offsetRef.current = offset;
	}, [offset]);

	useEffect(() => {
		searchTermRef.current = searchTerm;
	}, [searchTerm]);

	const deleteChefList = useCallback(() => {
		const newAllChefLists = { ...allChefListsRef.current };
		delete newAllChefLists[route.key];
		dispatch(updateAllChefLists(newAllChefLists));
	}, [dispatch, route.key]);

	const loadChefsLocally = useCallback(async () => {
		const localChefList = await loadLocalChefLists(getQueryChefId(), getChefListName());
		if (localChefList.length > 0) {
			dispatch(updateSingleChefList({ listKey: route.key, chefList: localChefList }));
		}
		setAwaitingServer(false);
	}, [dispatch, getChefListName, getQueryChefId, route.key]);

	const fetchChefList = useCallback(async ({ limitOverride, offsetOverride, searchOverride }: { limitOverride?: number; offsetOverride?: number; searchOverride?: string } = {}) => {
		const effectiveLimit = limitOverride !== undefined ? limitOverride : limitRef.current;
		const effectiveOffset = offsetOverride !== undefined ? offsetOverride : offsetRef.current;
		const effectiveSearchTerm = searchOverride !== undefined ? searchOverride : searchTermRef.current;

		const netInfoState = await NetInfo.fetch();
		if (netInfoState.isConnected) {
			try {
				const chefs = await getChefList(
					getChefListName(),
					getQueryChefId(),
					effectiveLimit,
					effectiveOffset,
					loggedInChef.auth_token,
					effectiveSearchTerm
				);
				dispatch(updateSingleChefList({ listKey: route.key, chefList: chefs }));
				await saveChefListsLocally(getQueryChefId(), loggedInChef.id, getChefListName(), chefs);
			} catch (e: unknown) {
				if (getErrorName(e) === "Logout") {
					navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
				}
				if (chefListRef.current.length === 0) {
					loadChefsLocally();
				}
			}
		} else {
			setRenderOfflineMessage(true);
			setOfflineDiagnostics(netInfoState);
		}
	}, [
		dispatch,
		getChefListName,
		getQueryChefId,
		loadChefsLocally,
		loggedInChef.auth_token,
		loggedInChef.id,
		navigation,
		route.key,
	]);

	const fetchAdditionalChefs = useCallback(async (nextOffset: number) => {
		try {
			const additionalChefs = await getChefList(
				getChefListName(),
				getQueryChefId(),
				limit,
				nextOffset,
				loggedInChef.auth_token,
				searchTerm
			);
			const combinedChefs = [...chefListRef.current, ...additionalChefs];
			dispatch(updateSingleChefList({ listKey: route.key, chefList: combinedChefs }));
			await saveChefListsLocally(getQueryChefId(), loggedInChef.id, getChefListName(), combinedChefs);
		} catch (e: unknown) {
			if (getErrorName(e) === "Logout") {
				navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
			}
			// console.log('failed to get ADDITIONAL chefs')
		}
	}, [
		dispatch,
		getChefListName,
		getQueryChefId,
		limit,
		loggedInChef.auth_token,
		loggedInChef.id,
		navigation,
		route.key,
		searchTerm,
	]);

	const setupHeaderScrollTopTopButton = useCallback(() => {
		const parentNavigator = navigation ? navigation.getParent() : null;
		const routes = parentNavigator ? parentNavigator.getState().routes : [];
		if (navigation.isFocused() && parentNavigator) {
			parentNavigator.setOptions({
				headerTitle: (props: unknown) => (
					<AppHeader
						{...props}
						text={routes[routes.length - 1]?.params?.title}
						buttonAction={() => chefFlatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
					/>
				),
			});
		}
	}, [chefFlatListRef, navigation]);

	const respondToFocus = useCallback(async () => {
		setupHeaderScrollTopTopButton();
		setAwaitingServer(false);
	}, [setupHeaderScrollTopTopButton]);

	const updateAttributeCountInChefLists = useCallback(
		(chefId: number, attribute: "followers", toggle: "user_chef_following", diff: number) => {
			const newAllChefLists: Record<string, ListChef[]> = {};
			Object.keys(allChefLists).forEach((list) => {
				const listChefs = allChefLists[list].map((chef: ListChef) => {
					if (chef.id === chefId) {
						const newChef = { ...chef };
						newChef[attribute] += diff;
						newChef[toggle] = diff > 0 ? 1 : 0;
						return newChef;
					}
					return chef;
				});
				newAllChefLists[list] = listChefs;
			});
			dispatch(updateAllChefLists(newAllChefLists));
		},
		[allChefLists, dispatch]
	);

	const followChef = useCallback(
		async (followee_id: number) => {
			const netInfoState = await NetInfo.fetch();
			if (netInfoState.isConnected) {
				setAwaitingServer(true);
				try {
					const followPosted = await postFollow(loggedInChef.id, followee_id, loggedInChef.auth_token);
					if (followPosted) {
						updateAttributeCountInChefLists(followee_id, "followers", "user_chef_following", 1);
					}
				} catch (e: unknown) {
					if (getErrorName(e) === "Logout") {
						navigation.navigate("ProfileCover", {
							screen: "Profile",
							params: { logout: true },
						});
					}
					setRenderOfflineMessage(true);
					setOfflineDiagnostics(e);
				}
				setAwaitingServer(false);
			} else {
				setRenderOfflineMessage(true);
				setOfflineDiagnostics(netInfoState);
			}
		},
		[loggedInChef, navigation, updateAttributeCountInChefLists]
	);

	const unFollowChef = useCallback(
		async (followee_id: number) => {
			const netInfoState = await NetInfo.fetch();
			if (netInfoState.isConnected) {
				setAwaitingServer(true);
				try {
					const followPosted = await destroyFollow(loggedInChef.id, followee_id, loggedInChef.auth_token);
					if (followPosted) {
						updateAttributeCountInChefLists(followee_id, "followers", "user_chef_following", -1);
					}
				} catch (e: unknown) {
					if (getErrorName(e) === "Logout") {
						navigation.navigate("ProfileCover", {
							screen: "Profile",
							params: { logout: true },
						});
					}
					setRenderOfflineMessage(true);
					setOfflineDiagnostics(e);
				}
				setAwaitingServer(false);
			} else {
				setRenderOfflineMessage(true);
				setOfflineDiagnostics(netInfoState);
			}
		},
		[loggedInChef, navigation, updateAttributeCountInChefLists]
	);

	const navigateToChefDetails = useCallback(
		async (chefID: number) => {
			setAwaitingServer(true);
			try {
				const chefDetails = await getChefDetails(chefID, loggedInChef.auth_token);
				if (chefDetails) {
					dispatch(storeChefDetails({ chefID: `chef${chefDetails.chef.id}`, chef_details: chefDetails }));
					saveChefDetailsLocally(chefDetails, loggedInChef.id);
					setAwaitingServer(false);
					navigation.push("ChefDetails", { chefID: chefID });
				}
			} catch (e: unknown) {
				if (getErrorName(e) === "Logout") {
					navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
				}
				AsyncStorage.getItem("localChefDetails", (err, res) => {
					if (res != null) {
						const parsed = JSON.parse(res) as unknown;
						const localChefDetails = Array.isArray(parsed) ? parsed.filter(isChefDetails) : [];
						const thisChefDetails = localChefDetails.find((details) => details.chef.id === chefID);
						if (thisChefDetails) {
							dispatch(storeChefDetails({ chefID: `chef${thisChefDetails.chef.id}`, chef_details: thisChefDetails }));
							setAwaitingServer(false);
							navigation.push("ChefDetails", { chefID: chefID });
						} else {
							setChefsICantGet((state) => [...state, chefID]);
							setAwaitingServer(false);
						}
					} else {
						setChefsICantGet((state) => [...state, chefID]);
						setAwaitingServer(false);
					}
				});
				setAwaitingServer(false);
			}
		},
		[dispatch, loggedInChef.auth_token, loggedInChef.id, navigation]
	);

	const removeChefFromCantGetList = useCallback((chefID: number) => {
		setChefsICantGet((state) => state.filter((chef) => chef !== chefID));
	}, []);

	const refresh = useCallback(() => {
		isPaginatingRef.current = false;
		lastFetchedOffsetRef.current = 0;
		setLimit(20);
		setOffset(0);
		setAwaitingServer(true);
		fetchChefList({ limitOverride: 20, offsetOverride: 0, searchOverride: searchTermRef.current })
			.finally(() => {
				setAwaitingServer(false);
			});
	}, [fetchChefList]);

	const onEndReached = useCallback(() => {
		if (awaitingServer || isPaginatingRef.current) {
			return;
		}
		if (chefList.length % 10 === 0) {
			isPaginatingRef.current = true;
			setAwaitingServer(true);
			setOffset((prev) => prev + 10);
		}
	}, [awaitingServer, chefList.length]);

	useEffect(() => {
		if (offset > 0 && offset !== lastFetchedOffsetRef.current) {
			lastFetchedOffsetRef.current = offset;
			setAwaitingServer(true);
			fetchAdditionalChefs(offset).finally(() => {
				isPaginatingRef.current = false;
				setAwaitingServer(false);
			});
		}
	}, [fetchAdditionalChefs, offset]);

	const setSearchTerm = useCallback(
		(value: string) => {
			isPaginatingRef.current = false;
			lastFetchedOffsetRef.current = 0;
			setSearchTermValue(value);
			setAwaitingServer(true);
			setOffset(0);
			fetchChefList({ limitOverride: limitRef.current, offsetOverride: 0, searchOverride: value })
				.finally(() => {
				setAwaitingServer(false);
			});
		},
		[fetchChefList]
	);

	const handleSearchBarFocus = useCallback(() => {
		searchBarRef.current?.focus();
	}, [searchBarRef]);

	const clearOfflineMessage = useCallback(() => {
		setRenderOfflineMessage(false);
	}, []);

	const onSearchBarBlur = useCallback(() => {}, []);

	useEffect(() => {
		setupHeaderScrollTopTopButton();
		setAwaitingServer(true);
		if (focusUnsubscribeRef.current) {
			focusUnsubscribeRef.current();
		}
		focusUnsubscribeRef.current = navigation.addListener("focus", respondToFocus);
		fetchChefList().finally(() => {
			setAwaitingServer(false);
		});
	}, [fetchChefList, navigation, respondToFocus, setupHeaderScrollTopTopButton]);

	useEffect(() => {
		return () => {
			if (typeof focusUnsubscribeRef.current === "function") {
				focusUnsubscribeRef.current();
			} else {
				navigation.removeListener("focus", respondToFocus);
			}
			deleteChefList();
		};
	}, [deleteChefList, navigation, respondToFocus]);

	return {
		awaitingServer,
		isAdmin: loggedInChef.is_admin,
		renderOfflineMessage,
		offlineDiagnostics,
		searchTerm,
		yOffset,
		clampedScroll,
		chefList,
		chefsICantGet,
		getChefListName,
		setSearchTerm,
		handleSearchBarFocus,
		onSearchBarBlur,
		onEndReached,
		navigateToChefDetails,
		followChef,
		unFollowChef,
		removeChefFromCantGetList,
		refresh,
		clearOfflineMessage,
	};
};
