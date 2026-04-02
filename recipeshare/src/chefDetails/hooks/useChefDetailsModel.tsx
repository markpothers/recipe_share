import NetInfo from "@react-native-community/netinfo";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Chef, HeaderButton, ListChef } from "../../centralTypes";
import { destroyFollow, getChefDetails, postFollow } from "../../fetches";
import AppHeaderRight from "../../navigation/appHeaderRight";
import { ChefDetailsNavigationProps, ChefDetailsRouteProps } from "../../navigation";
import {
	storeChefDetails,
	storeNewFollowers,
	updateAllChefLists,
	useAppDispatch,
	useAppSelector,
} from "../../redux";

type UpdatableChefCountAttribute = "followers";
type UpdatableChefToggle = "user_chef_following";

type ChefDetailsModel = {
	awaitingServer: boolean;
	renderOfflineMessage: boolean;
	headerButtons: HeaderButton[];
	dynamicMenuShowing: boolean;
	chefDetails: Chef | undefined;
	clearOfflineMessage: () => void;
	closeDynamicMenu: () => void;
	followChef: () => Promise<void>;
	unFollowChef: () => Promise<void>;
	fetchChefDetails: () => Promise<void>;
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

NetInfo.configure({ reachabilityShortTimeout: 5 });

export const useChefDetailsModel = (
	navigation: ChefDetailsNavigationProps,
	route: ChefDetailsRouteProps
): ChefDetailsModel => {
	const dispatch = useAppDispatch();
	const loggedInChef = useAppSelector((state) => state.root.loggedInChef);
	const allChefLists = useAppSelector((state) => state.root.allChefLists);
	const chefDetailsById = useAppSelector((state) => state.root.chef_details);
	const chefID = route.params.chefID;

	const [awaitingServer, setAwaitingServer] = useState<boolean>(false);
	const [renderOfflineMessage, setRenderOfflineMessage] = useState<boolean>(false);
	const [headerButtons, setHeaderButtons] = useState<HeaderButton[]>([]);
	const [dynamicMenuShowing, setDynamicMenuShowing] = useState<boolean>(false);
	const [, setOfflineDiagnostics] = useState<unknown>("");

	const chefDetails = useMemo(() => chefDetailsById[`chef${chefID}`], [chefDetailsById, chefID]);

	const closeDynamicMenu = useCallback(() => {
		setDynamicMenuShowing(false);
	}, []);

	const openDynamicMenu = useCallback(() => {
		setDynamicMenuShowing(true);
	}, []);

	const updateAttributeCountInChefLists = useCallback(
		(chefId: number, attribute: UpdatableChefCountAttribute, toggle: UpdatableChefToggle, diff: number) => {
			const newAllChefLists: Record<string, ListChef[]> = {};
			Object.keys(allChefLists).forEach((list) => {
				const chefList = allChefLists[list].map((chef: ListChef) => {
					if (chef.id === chefId) {
						const newChef = { ...chef };
						newChef[attribute] += diff;
						newChef[toggle] = diff > 0 ? 1 : 0;
						return newChef;
					} else {
						return chef;
					}
				});
				newAllChefLists[list] = chefList;
			});
			dispatch(updateAllChefLists(newAllChefLists));
			// Object.keys(this.props.allChefLists).forEach(list => {
			// 	let newList = this.props.allChefLists[list].map(chef => {
			// 		if (chef.id == chefId) {
			// 			chef[attribute] += diff
			// 			chef[toggle] = diff > 0 ? 1 : 0
			// 			return chef
			// 		} else {
			// 			return chef
			// 		}
			// 	})
			// 	this.props.storeChefList(list, newList)
			// })
		},
		[allChefLists, dispatch]
	);

	const followChef = useCallback(async () => {
		const netInfoState = await NetInfo.fetch();
		if (netInfoState.isConnected) {
			setAwaitingServer(true);
			try {
				const followPosted = await postFollow(loggedInChef.id, chefID, loggedInChef.auth_token);
				if (followPosted) {
					updateAttributeCountInChefLists(chefID, "followers", "user_chef_following", 1);
					const newFollowers = (chefDetailsById[`chef${chefID}`]?.followers || 0) + 1;
					dispatch(storeNewFollowers({ chefID: `chef${chefID}`, followers: newFollowers }));
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
	}, [chefDetailsById, chefID, dispatch, loggedInChef, navigation, updateAttributeCountInChefLists]);

	const unFollowChef = useCallback(async () => {
		const netInfoState = await NetInfo.fetch();
		if (netInfoState.isConnected) {
			setAwaitingServer(true);
			try {
				const followPosted = await destroyFollow(loggedInChef.id, chefID, loggedInChef.auth_token);
				if (followPosted) {
					updateAttributeCountInChefLists(chefID, "followers", "user_chef_following", -1);
					const newFollowers = (chefDetailsById[`chef${chefID}`]?.followers || 0) - 1;
					dispatch(storeNewFollowers({ chefID: `chef${chefID}`, followers: newFollowers }));
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
	}, [chefDetailsById, chefID, dispatch, loggedInChef, navigation, updateAttributeCountInChefLists]);

	const fetchChefDetails = useCallback(async () => {
		const details = await getChefDetails(chefID, loggedInChef.auth_token);
		if (details) {
			dispatch(storeChefDetails({ chefID: `chef${details.chef.id}`, chef_details: details }));
		}
	}, [chefID, dispatch, loggedInChef.auth_token]);

	const generateHeaderButtonList = useCallback(() => {
		if (!chefDetails) {
			setHeaderButtons([]);
			return;
		}

		const buttons: HeaderButton[] = [
			{
				icon: !chefDetails.chef_followed ? "account-multiple-plus-outline" : "account-multiple-minus",
				text: !chefDetails.chef_followed ? "Follow chef" : "Stop following chef",
				action: !chefDetails.chef_followed
					? () => {
							closeDynamicMenu();
							followChef();
						}
					: () => {
							closeDynamicMenu();
							unFollowChef();
						},
			},
			{
				icon: "food",
				text: "Create new recipe",
				action: () => {
					closeDynamicMenu();
					navigation.navigate("NewRecipe");
				},
			},
		];
		setHeaderButtons(buttons);
	}, [chefDetails, closeDynamicMenu, followChef, navigation, unFollowChef]);

	const addDynamicMenuButtonsToHeader = useCallback(() => {
		navigation.setOptions({
			headerRight: Object.assign(
				() => (
					<AppHeaderRight buttonAction={openDynamicMenu} accessibilityLabel={"Open action menu"} />
				),
				{ displayName: "HeaderRight" }
			),
		});
	}, [navigation, openDynamicMenu]);

	const clearOfflineMessage = useCallback(() => {
		setRenderOfflineMessage(false);
	}, []);

	useEffect(() => {
		setAwaitingServer(true);
		addDynamicMenuButtonsToHeader();
		// await this.fetchChefDetails()
		setAwaitingServer(false);
	}, [addDynamicMenuButtonsToHeader]);

	useEffect(() => {
		generateHeaderButtonList();
	}, [generateHeaderButtonList]);

	return {
		awaitingServer,
		renderOfflineMessage,
		headerButtons,
		dynamicMenuShowing,
		chefDetails,
		clearOfflineMessage,
		closeDynamicMenu,
		followChef,
		unFollowChef,
		fetchChefDetails,
	};
};
