import * as ImagePicker from "expo-image-picker";

import { AppState, NativeEventSubscription, ScrollView } from "react-native";
import { HeaderButton, InstructionImage, MakePic, MakePicChef } from "../../centralTypes";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import React, { useCallback, useEffect, useRef } from "react";
import { RecipeDetailsNavigationProps, RecipeDetailsRouteProps } from "../../../navigation";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import {
	addMakePic,
	addMakePicChef,
	addRecipeLike,
	addRecipeMake,
	addRecipeReShare,
	removeRecipeLike,
	removeRecipeReShare,
	saveRemainingMakePics,
	storeChefDetails,
	updateAllRecipeLists,
	updateComments,
	useAppDispatch,
	useAppSelector,
} from "../../redux";
import { getAllRecipeLists, getLoggedInChef, getRecipeDetails } from "../../redux/selectors";

import AppHeaderRight from "../../../navigation/appHeaderRight";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { destroyComment } from "../../fetches/destroyComment";
import { destroyMakePic } from "../../fetches/destroyMakePic";
import { destroyReShare } from "../../fetches/destroyReShare";
import { destroyRecipe } from "../../fetches/destroyRecipe";
import { destroyRecipeLike } from "../../fetches/destroyRecipeLike";
import { getChefDetails } from "../../fetches/getChefDetails";
import { postComment } from "../../fetches/postComment";
import { postMakePic } from "../../fetches/postMakePic";
import { postReShare } from "../../fetches/postReShare";
import { postRecipeLike } from "../../fetches/postRecipeLike";
import { postRecipeMake } from "../../fetches/postRecipeMake";
import { responsiveHeight } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars
import saveChefDetailsLocally from "../../auxFunctions/saveChefDetailsLocally";
import { useSelector } from "react-redux";

NetInfo.configure({ reachabilityShortTimeout: 5 }); //5ms

let keepAwakeTimer: ReturnType<typeof setTimeout> | null = null;

type AppStates = "active" | "inactive" | "background";

type OwnProps = {
	navigation: RecipeDetailsNavigationProps;
	route: RecipeDetailsRouteProps;
};

export const useRecipeDetailsModel = ({ navigation, route }: OwnProps) => {
	const dispatch = useAppDispatch();
	const loggedInChef = useAppSelector(getLoggedInChef);
	const allRecipeLists = useSelector(getAllRecipeLists);
	const recipeDetails = useAppSelector(getRecipeDetails);
	const myScroll = useRef<ScrollView>(null);
	const [appState, setAppState] = React.useState<AppStates>("active");
	const [commenting, setCommenting] = React.useState<boolean>(false);
	const [commentText, setCommentText] = React.useState<string>("");
	const [commentsTopY, setCommentsTopY] = React.useState<number>(0);
	const [choosingPicSource, setChoosingPicSource] = React.useState<boolean>(false);
	const [awaitingServer, setAwaitingServer] = React.useState<boolean>(false);
	const [scrollEnabled, setScrollEnabled] = React.useState<boolean>(true);
	const [makePicFileUri, setMakePicFileUri] = React.useState<string>("");
	const [renderOfflineMessage, setRenderOfflineMessage] = React.useState<boolean>(false);
	const [offlineDiagnostics, setOfflineDiagnostics] = React.useState<string | Error | NetInfoState>("");
	const [primaryImageFlatListWidth, setPrimaryImageFlatListWidth] = React.useState<number>(0);
	const [primaryImageDisplayedIndex, setPrimaryImageDisplayedIndex] = React.useState<number>(0);
	const [deleteMakePicPopUpShowing, setDeleteMakePicPopUpShowing] = React.useState<boolean>(false);
	const [deleteCommentPopUpShowing, setDeleteCommentPopUpShowing] = React.useState<boolean>(false);
	const [editRecipePopUpShowing, setEditRecipePopUpShowing] = React.useState<boolean>(false);
	const [deleteRecipePopUpShowing, setDeleteRecipePopUpShowing] = React.useState<boolean>(false);
	const [makePicToDelete, setMakePicToDelete] = React.useState<number>(0);
	const [commentToDelete, setCommentToDelete] = React.useState<number>(0);
	const [headerButtons, setHeaderButtons] = React.useState<HeaderButton[]>([]);
	const [dynamicMenuShowing, setDynamicMenuShowing] = React.useState<boolean>(false);
	const [chefNameTextColor, setChefNameTextColor] = React.useState<string>("#505050");
	const [imagePopupDetails, setImagePopupDetails] = React.useState<MakePic | InstructionImage | Record<string, never>>({});
	const [imagePopupShowing, setImagePopupShowing] = React.useState<boolean>(false);
	const [webviewHeight, setWebviewHeight] = React.useState<number>(responsiveHeight(60));
	const [webviewLoading, setWebviewLoading] = React.useState<boolean>(true);
	const [webviewCanRespondToEvents, setWebviewCanRespondToEvents] = React.useState<boolean>(false);
	const [appStateListener, setAppStateListener] = React.useState<NativeEventSubscription>(null);

	const addDynamicMenuButtonsToHeader = useCallback(() => {
		navigation.setOptions({
			headerRight: Object.assign(
				() => (
					<AppHeaderRight
						buttonAction={() => setDynamicMenuShowing(true)}
						accessibilityLabel={"Open action menu"}
					/>
				),
				{ displayName: "HeaderRight" }
			),
		});
	}, [navigation]);

	const handleAppStateChange = useCallback(
		async (nextAppState: AppStates) => {
			if (appState.match(/inactive|background/) && nextAppState === "active") {
				// console.log('App has come to the foreground!');
				await enableKeepAwake();
			} else if (appState === "active" && nextAppState.match(/inactive|background/)) {
				// console.log('App is going into background!');
				disableKeepAwake();
			}
			// this.setState({ appState: nextAppState });
			setAppState(nextAppState);
		},
		[appState]
	);

	const enableKeepAwake = async () => {
		await activateKeepAwakeAsync();
		keepAwakeTimer = setTimeout(() => {
			deactivateKeepAwake();
		}, 600000);
	};

	const disableKeepAwake = () => {
		deactivateKeepAwake();
		clearTimeout(keepAwakeTimer);
	};

	const resetKeepAwakeTimer = () => {
		disableKeepAwake();
		enableKeepAwake();
	};

	const navigateToChefDetails = async (chefID: number) => {
		setAwaitingServer(true);
		setImagePopupShowing(false);
		try {
			const chefDetails = await getChefDetails(chefID, loggedInChef.auth_token);
			if (chefDetails) {
				dispatch(storeChefDetails({ chefID: `chef${chefDetails.chef.id}`, chef_details: chefDetails }));
				saveChefDetailsLocally(chefDetails, loggedInChef.id);
				setAwaitingServer(false);
				navigation.navigate("ChefDetails", { chefID: chefID });
			}
		} catch (e) {
			if (e.name === "Logout") {
				navigation.navigate("ProfileCover", {
					screen: "Profile",
					params: { logout: true },
				});
			}
			// console.log('looking for local chefs')
			AsyncStorage.getItem("localChefDetails", (err, res) => {
				if (res != null) {
					// console.log('found some local chefs')
					const localChefDetails = JSON.parse(res);
					const thisChefDetails = localChefDetails.find((chefDetails) => chefDetails.chef.id === chefID);
					if (thisChefDetails) {
						storeChefDetails({ chefID: `chef${thisChefDetails.chef.id}`, chef_details: thisChefDetails });
						setAwaitingServer(false);
						navigation.navigate("ChefDetails", { chefID: chefID });
					} else {
						setRenderOfflineMessage(true);
						setOfflineDiagnostics(res);
					}
				} else {
					setRenderOfflineMessage(true);
					setOfflineDiagnostics(err);
				}
			});
		}
		setAwaitingServer(false);
	};

	const editRecipe = async () => {
		const netInfoState = await NetInfo.fetch();
		if (netInfoState.isConnected) {
			// setAwaitingServer(true);
			setEditRecipePopUpShowing(false);
			navigation.navigate("NewRecipe", { recipe_details: recipeDetails });
			// setAwaitingServer(false);
		} else {
			// setRenderOfflineMessage(true);
			setOfflineDiagnostics(netInfoState);
			setEditRecipePopUpShowing(false);
		}
	};

	const deleteRecipe = async () => {
		const netInfoState = await NetInfo.fetch();
		if (netInfoState.isConnected) {
			setAwaitingServer(true);
			// this.setState({ awaitingServer: true }, async () => {
			const deleted = await destroyRecipe(recipeDetails.recipe.id, loggedInChef.auth_token);
			if (deleted) {
				// this.props.navigation.goBack()
				navigation.navigate("MyRecipeBook", {
					screen: "My Recipes",
					params: { deleteId: recipeDetails.recipe.id },
				});
			}
			// });
		} else {
			setRenderOfflineMessage(true);
			setOfflineDiagnostics(netInfoState);
			setDeleteRecipePopUpShowing(false);
		}
	};

	const updateAttributeCountInRecipeLists = useCallback(
		(recipeId: number, attribute: string, toggle: string, diff: number) => {
			const newAllRecipeLists = {};
			Object.keys(allRecipeLists).forEach((list) => {
				const recipeList = allRecipeLists[list].map((recipe) => {
					if (recipe.id == recipeId) {
						const newRecipe = { ...recipe };
						newRecipe[attribute] += diff;
						newRecipe[toggle] = diff > 0 ? 1 : 0;
						return newRecipe;
					} else {
						return recipe;
					}
				});
				newAllRecipeLists[list] = recipeList;
			});
			dispatch(updateAllRecipeLists(allRecipeLists));
		},
		[allRecipeLists, dispatch]
	);

	const recipeAction = useCallback(
		async <T,>(
			action: (...args) => Promise<T>,
			successAction: (result?: T) => void,
			cleanupAction?: (...args) => void
		) => {
			const netInfoState = await NetInfo.fetch();
			if (netInfoState.isConnected) {
				setAwaitingServer(true);
				try {
					const result = await action;
					if (result) {
						successAction();
					}
				} catch (e) {
					if (e.name === "Logout") {
						navigation.navigate("ProfileCover", {
							screen: "Profile",
							params: { logout: true },
						});
					}
					setRenderOfflineMessage(true);
					setOfflineDiagnostics(e);
				}
				setAwaitingServer(false);
				if (cleanupAction) cleanupAction();
			} else {
				setRenderOfflineMessage(true);
				setOfflineDiagnostics(netInfoState);
				if (cleanupAction) cleanupAction();
			}
		},
		[navigation]
	);

	const likeRecipe = useCallback(async () => {
		await recipeAction(
			() => postRecipeLike(recipeDetails.recipe.id, loggedInChef.id, loggedInChef.auth_token),
			() => {
				dispatch(addRecipeLike());
				updateAttributeCountInRecipeLists(recipeDetails.recipe.id, "likes_count", "chef_liked", 1);
			}
		);
	}, [
		dispatch,
		loggedInChef.auth_token,
		loggedInChef.id,
		recipeAction,
		recipeDetails.recipe.id,
		updateAttributeCountInRecipeLists,
	]);

	const unlikeRecipe = useCallback(async () => {
		await recipeAction(
			() => destroyRecipeLike(recipeDetails.recipe.id, loggedInChef.id, loggedInChef.auth_token),
			() => {
				dispatch(removeRecipeLike());
				updateAttributeCountInRecipeLists(recipeDetails.recipe.id, "likes_count", "chef_liked", -1);
			}
		);
	}, [
		dispatch,
		loggedInChef.auth_token,
		loggedInChef.id,
		recipeAction,
		recipeDetails.recipe.id,
		updateAttributeCountInRecipeLists,
	]);

	const makeRecipe = async () => {
		await recipeAction(
			() => postRecipeMake(recipeDetails.recipe.id, loggedInChef.id, loggedInChef.auth_token),
			() => {
				dispatch(addRecipeMake());
				updateAttributeCountInRecipeLists(recipeDetails.recipe.id, "makes_count", "chef_made", 1);
			}
		);
	};

	const reShareRecipe = useCallback(async () => {
		await recipeAction(
			() => postReShare(recipeDetails.recipe.id, loggedInChef.id, loggedInChef.auth_token),
			() => {
				dispatch(addRecipeReShare());
				updateAttributeCountInRecipeLists(recipeDetails.recipe.id, "shares_count", "chef_shared", 1);
			}
		);
	}, [
		dispatch,
		loggedInChef.auth_token,
		loggedInChef.id,
		recipeAction,
		recipeDetails.recipe.id,
		updateAttributeCountInRecipeLists,
	]);

	const unReShareRecipe = useCallback(async () => {
		await recipeAction(
			() => destroyReShare(recipeDetails.recipe.id, loggedInChef.id, loggedInChef.auth_token),
			() => {
				dispatch(removeRecipeReShare());
				updateAttributeCountInRecipeLists(recipeDetails.recipe.id, "shares_count", "chef_shared", -1);
			}
		);
	}, [
		dispatch,
		loggedInChef.auth_token,
		loggedInChef.id,
		recipeAction,
		recipeDetails.recipe.id,
		updateAttributeCountInRecipeLists,
	]);

	const newMakePic = async () => {
		const netInfoState = await NetInfo.fetch();
		if (netInfoState.isConnected) {
			setChoosingPicSource(true);
		} else {
			setRenderOfflineMessage(true);
			setOfflineDiagnostics(netInfoState);
		}
	};

	const saveImage = (image: ImagePicker.ImagePickerAsset) => {
		if (image.uri != undefined) {
			setMakePicFileUri(image.uri);
		}
	};

	const cancelChooseImage = () => {
		setChoosingPicSource(false);
	};

	const saveMakePic = async () => {
		await recipeAction(
			() => postMakePic(recipeDetails.recipe.id, loggedInChef.id, loggedInChef.auth_token, makePicFileUri),
			(makePic: { make_pic: MakePic; make_pic_chef: MakePicChef }) => {
				dispatch(addMakePic(makePic.make_pic));
				dispatch(addMakePicChef(makePic.make_pic_chef));
			},
			() => setMakePicFileUri("")
		);
	};

	const deleteMakePic = async () => {
		await recipeAction(
			() => destroyMakePic(loggedInChef.auth_token, makePicToDelete),
			() => {
				saveRemainingMakePics(recipeDetails.make_pics.filter((pic) => pic.id !== makePicToDelete));
			},
			() => setDeleteMakePicPopUpShowing(false)
		);
	};

	const newComment = async () => {
		const netInfoState = await NetInfo.fetch();
		if (netInfoState.isConnected) {
			setCommenting(true);
		} else {
			setRenderOfflineMessage(true);
			setOfflineDiagnostics(netInfoState);
		}
	};

	const cancelComment = () => {
		setCommenting(false);
		setCommentText("");
	};

	const saveComment = async () => {
		await recipeAction(
			() => postComment(recipeDetails.recipe.id, loggedInChef.id, loggedInChef.auth_token, commentText),
			(comments) => {
				dispatch(updateComments(comments));
				updateAttributeCountInRecipeLists(recipeDetails.recipe.id, "comments_count", "chef_commented", 1);
				setCommenting(false);
				setCommentText("");
			}
		);
	};

	const handleCommentTextInput = (commentText: string) => {
		setCommentText(commentText);
	};

	const askDeleteComment = (commentID: number) => {
		setDeleteCommentPopUpShowing(true);
		setCommentToDelete(commentID);
	};

	const deleteComment = async () => {
		await recipeAction(
			() => destroyComment(loggedInChef.auth_token, commentToDelete),
			(comments) => {
				dispatch(updateComments(comments));
				updateAttributeCountInRecipeLists(recipeDetails.recipe.id, "comments_count", "chef_commented", -1);
			},
			() => setDeleteCommentPopUpShowing(false)
		);
	};

	const generateHeaderButtonList = useCallback(async () => {
		const newHeaderButtons = [
			{
				icon: recipeDetails.shareable ? "share-outline" : "share-off",
				text: recipeDetails.shareable ? "Share with followers" : "Remove share",
				action: recipeDetails.shareable
					? () => {
							// setState({ dynamicMenuShowing: false }, reShareRecipe);
							setDynamicMenuShowing(false);
							reShareRecipe();
							// eslint-disable-next-line no-mixed-spaces-and-tabs
					  }
					: () => {
							// setState({ dynamicMenuShowing: false }, unReShareRecipe);
							setDynamicMenuShowing(false);
							unReShareRecipe();
							// eslint-disable-next-line no-mixed-spaces-and-tabs
					  },
			},
			{
				icon: recipeDetails.likeable ? "heart-outline" : "heart-off",
				text: recipeDetails.likeable ? "Like recipe" : "Unlike recipe",
				action: recipeDetails.likeable
					? () => {
							// setState({ dynamicMenuShowing: false }, likeRecipe);
							setDynamicMenuShowing(false);
							likeRecipe();
							// eslint-disable-next-line no-mixed-spaces-and-tabs
					  }
					: () => {
							// setState({ dynamicMenuShowing: false }, unlikeRecipe);
							setDynamicMenuShowing(false);
							unlikeRecipe();
							// eslint-disable-next-line no-mixed-spaces-and-tabs
					  },
			},
			{
				icon: "image-plus",
				text: "Add picture",
				action: () => {
					// setState({ dynamicMenuShowing: false }, newMakePic);
					setDynamicMenuShowing(false);
					newMakePic();
				},
			},
			{
				icon: "comment-plus",
				text: "Add a comment",
				action: () => {
					// setState({ dynamicMenuShowing: false }, newComment);
					setDynamicMenuShowing(false);
					newComment();
				},
			},
		];
		if (recipeDetails.recipe.chef_id === loggedInChef.id || loggedInChef.is_admin) {
			newHeaderButtons.push({
				icon: "playlist-edit",
				text: "Edit recipe",
				action: () => {
					// setState({
					// 	editRecipePopUpShowing: true,
					// 	dynamicMenuShowing: false,
					// }),
					setDynamicMenuShowing(false);
					setEditRecipePopUpShowing(true);
				},
			});
			newHeaderButtons.push({
				icon: "trash-can-outline",
				text: "Delete recipe",
				action: () => {
					// setState({
					// 	deleteRecipePopUpShowing: true,
					// 	dynamicMenuShowing: false,
					// }),
					setDynamicMenuShowing(false);
					setDeleteRecipePopUpShowing(true);
				},
			});
		}
		newHeaderButtons.push({
			icon: "food",
			text: "Create new recipe",
			action: () => {
				// setState({ dynamicMenuShowing: false }, () => {
				// navigation.navigate("NewRecipe");
				// });
				setDynamicMenuShowing(false);
				navigation.navigate("NewRecipe");
			},
		});
		// setState({ headerButtons: headerButtons });
		setHeaderButtons(newHeaderButtons);
	}, [
		likeRecipe,
		loggedInChef.id,
		loggedInChef.is_admin,
		navigation,
		reShareRecipe,
		recipeDetails.likeable,
		recipeDetails.recipe.chef_id,
		recipeDetails.shareable,
		unReShareRecipe,
		unlikeRecipe,
	]);

	useEffect(() => {
		setAwaitingServer(true);
		if (!appStateListener) {
			const listener = AppState.addEventListener("change", handleAppStateChange);
			setAppStateListener(listener);
		}
		generateHeaderButtonList();
		addDynamicMenuButtonsToHeader();
		enableKeepAwake();
		setAwaitingServer(false);
		return () => {
			if (appStateListener) {
				appStateListener.remove();
			}
			disableKeepAwake();
		};
	}, [addDynamicMenuButtonsToHeader, appStateListener, generateHeaderButtonList, handleAppStateChange]);

	useEffect(() => {
		generateHeaderButtonList();
	}, [generateHeaderButtonList, recipeDetails.likeable, recipeDetails.shareable]);

	useEffect(() => {
		const setIsCommenting = async () => {
			const netInfoState = await NetInfo.fetch();
			if (netInfoState.isConnected) {
				setCommenting(true);
				setTimeout(() => {
					myScroll.current.scrollTo({ x: 0, y: commentsTopY - 100, animated: true });
				}, 300);
			} else {
				setRenderOfflineMessage(true);
				setOfflineDiagnostics(netInfoState);
			}
		};

		if (route.params.commenting === true) {
			setIsCommenting();
		}
	}, [commentsTopY, route.params.commenting]);

	return {
		recipeDetails,
		loggedInChef,
		myScroll,
		commenting,
		commentText,
		choosingPicSource,
		awaitingServer,
		scrollEnabled,
		makePicFileUri,
		renderOfflineMessage,
		offlineDiagnostics,
		primaryImageFlatListWidth,
		primaryImageDisplayedIndex,
		deleteMakePicPopUpShowing,
		deleteCommentPopUpShowing,
		editRecipePopUpShowing,
		deleteRecipePopUpShowing,
		headerButtons,
		dynamicMenuShowing,
		chefNameTextColor,
		imagePopupDetails,
		imagePopupShowing,
		webviewHeight,
		webviewLoading,
		webviewCanRespondToEvents,
		setCommentsTopY,
		setScrollEnabled,
		setRenderOfflineMessage,
		setPrimaryImageFlatListWidth,
		setPrimaryImageDisplayedIndex,
		setDeleteMakePicPopUpShowing,
		setDeleteCommentPopUpShowing,
		setEditRecipePopUpShowing,
		setDeleteRecipePopUpShowing,
		setMakePicToDelete,
		setDynamicMenuShowing,
		setChefNameTextColor,
		setImagePopupDetails,
		setImagePopupShowing,
		setWebviewHeight,
		setWebviewCanRespondToEvents,
		navigateToChefDetails,
		editRecipe,
		deleteRecipe,
		likeRecipe,
		unlikeRecipe,
		makeRecipe,
		newMakePic,
		saveImage,
		cancelChooseImage,
		saveMakePic,
		deleteMakePic,
		newComment,
		cancelComment,
		saveComment,
		handleCommentTextInput,
		askDeleteComment,
		deleteComment,
		resetKeepAwakeTimer,
		setWebviewLoading
	};
};
