import {
	AppState,
	FlatList,
	Image,
	KeyboardAvoidingView,
	Linking,
	Platform,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
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
} from "../redux";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import { AlertPopup } from "../components/alertPopup/alertPopup";
import AppHeaderRight from "../navigation/appHeaderRight";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DynamicMenu from "../dynamicMenu/DynamicMenu";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ImagePopup } from "./components/imagePopup";
import NetInfo from "@react-native-community/netinfo";
import OfflineMessage from "../offlineMessage/offlineMessage";
import PicSourceChooser from "../picSourceChooser/picSourceChooser";
import React from "react";
import RecipeComment from "./recipeComment";
import RecipeNewComment from "./recipeNewComment";
import SpinachAppContainer from "../spinachAppContainer/SpinachAppContainer";
import StyledActivityIndicator from "../components/styledActivityIndicator/styledActivityIndicator";
import { WebView } from "react-native-webview";
import { centralStyles } from "../centralStyleSheet"; //eslint-disable-line no-unused-vars
import { connect } from "react-redux";
import { destroyComment } from "../fetches/destroyComment";
import { destroyMakePic } from "../fetches/destroyMakePic";
import { destroyReShare } from "../fetches/destroyReShare";
import { destroyRecipe } from "../fetches/destroyRecipe";
import { destroyRecipeLike } from "../fetches/destroyRecipeLike";
import { getChefDetails } from "../fetches/getChefDetails";
import { getTimeStringFromMinutes } from "../auxFunctions/getTimeStringFromMinutes";
import { postComment } from "../fetches/postComment";
import { postMakePic } from "../fetches/postMakePic";
import { postReShare } from "../fetches/postReShare";
import { postRecipeLike } from "../fetches/postRecipeLike";
import { postRecipeMake } from "../fetches/postRecipeMake";
import saveChefDetailsLocally from "../auxFunctions/saveChefDetailsLocally";
import { styles } from "./recipeDetailsStyleSheet";

NetInfo.configure({ reachabilityShortTimeout: 5 }); //5ms

const defaultRecipeImage = require("../../assets/images/default-recipe.jpg");

let keepAwakeTimer;

const mapStateToProps = (state) => ({
	allRecipeLists: state.root.allRecipeLists,
	recipe_details: state.root.recipe_details,
	loggedInChef: state.root.loggedInChef,
	filter_settings: state.root.filter_settings,
});

const mapDispatchToProps = {
	addRecipeLike: () => {
		return (dispatch) => {
			// dispatch({ type: "ADD_RECIPE_LIKE" });
			dispatch(addRecipeLike());
		};
	},
	removeRecipeLike: () => {
		return (dispatch) => {
			// dispatch({ type: "REMOVE_RECIPE_LIKE" });
			dispatch(removeRecipeLike());
		};
	},
	addRecipeMake: () => {
		return (dispatch) => {
			// dispatch({ type: "ADD_RECIPE_MAKE" });
			dispatch(addRecipeMake());
		};
	},
	updateComments: (comments) => {
		return (dispatch) => {
			// dispatch({ type: "UPDATE_COMMENTS", comments: comments });
			dispatch(updateComments(comments));
		};
	},
	addReShare: () => {
		return (dispatch) => {
			// dispatch({ type: "ADD_RECIPE_SHARE" });
			dispatch(addRecipeReShare());
		};
	},
	removeReShare: () => {
		return (dispatch) => {
			// dispatch({ type: "REMOVE_RECIPE_SHARE" });
			dispatch(removeRecipeReShare());
		};
	},
	addMakePic: (makePic) => {
		return (dispatch) => {
			// dispatch({ type: "ADD_MAKE_PIC", makePic: makePic });
			dispatch(addMakePic(makePic));
		};
	},
	addMakePicChef: (makePicChef) => {
		return (dispatch) => {
			// dispatch({ type: "ADD_MAKE_PIC_CHEF", makePicChef: makePicChef });
			dispatch(addMakePicChef(makePicChef));
		};
	},
	saveRemainingMakePics: (makePics) => {
		return (dispatch) => {
			// dispatch({ type: "SAVE_REMAINING_MAKE_PICS", makePics: makePics });
			dispatch(saveRemainingMakePics(makePics));
		};
	},
	// removeRecipeLikes: (remaining_likes, listType) => {
	// 	return (dispatch) => {
	// 		dispatch({ type: "REMOVE_RECIPE_LIKES", recipe_likes: remaining_likes, listType: listType });
	// 	};
	// },
	storeChefDetails: (chef_details) => {
		return (dispatch) => {
			// dispatch({ type: "STORE_CHEF_DETAILS", chefID: `chef${chef_details.chef.id}`, chef_details: chef_details });
			dispatch(storeChefDetails({ chefID: `chef${chef_details.chef.id}`, chef_details: chef_details }));
		};
	},
	updateAllRecipeLists: (allRecipeLists) => {
		return (dispatch) => {
			// dispatch({ type: "UPDATE_ALL_RECIPE_LISTS", allRecipeLists: allRecipeLists });
			dispatch(updateAllRecipeLists(allRecipeLists));
		};
	},
	// storeRecipeDetails: (recipe_details) => {
	//   return dispatch => {
	//     dispatch({ type: 'STORE_RECIPE_DETAILS', recipe_details: recipe_details})
	//   }
	// }
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(
	class RecipeDetails extends React.Component {
		state = {
			appState: "active",
			commenting: false,
			commentText: "",
			commentsTopY: 0,
			choosingPicSource: false,
			awaitingServer: false,
			scrollEnabled: true,
			makePicFileUri: "",
			renderOfflineMessage: false,
			offlineDiagnostics: "",
			primaryImageFlatListWidth: 0,
			primaryImageDisplayedIndex: 0,
			deleteMakePicPopUpShowing: false,
			deleteCommentPopUpShowing: false,
			editRecipePopUpShowing: false,
			deleteRecipePopUpShowing: false,
			makePicToDelete: 0,
			commentToDelete: 0,
			headerButtons: null,
			dynamicMenuShowing: false,
			chefNameTextColor: "#505050",
			imagePopupDetails: {},
			imagePopupShowing: false,
			webviewHeight: responsiveHeight(60),
			webviewLoading: true,
			webviewCanRespondToEvents: false,
			appStateListener: null,
		};

		generateHeaderButtonList = async () => {
			let headerButtons = [
				{
					icon: this.props.recipe_details.shareable ? "share-outline" : "share-off",
					text: this.props.recipe_details.shareable ? "Share with followers" : "Remove share",
					action: this.props.recipe_details.shareable
						? () => {
								this.setState({ dynamicMenuShowing: false }, this.reShareRecipe);
						  }
						: () => {
								this.setState({ dynamicMenuShowing: false }, this.unReShareRecipe);
						  },
				},
				{
					icon: this.props.recipe_details.likeable ? "heart-outline" : "heart-off",
					text: this.props.recipe_details.likeable ? "Like recipe" : "Unlike recipe",
					action: this.props.recipe_details.likeable
						? () => {
								this.setState({ dynamicMenuShowing: false }, this.likeRecipe);
						  }
						: () => {
								this.setState({ dynamicMenuShowing: false }, this.unlikeRecipe);
						  },
				},
				{
					icon: "image-plus",
					text: "Add picture",
					action: () => {
						this.setState({ dynamicMenuShowing: false }, this.newMakePic);
					},
				},
				{
					icon: "comment-plus",
					text: "Add a comment",
					action: () => {
						this.setState({ dynamicMenuShowing: false }, this.newComment);
					},
				},
			];
			if (
				this.props.recipe_details.recipe.chef_id === this.props.loggedInChef.id ||
				this.props.loggedInChef.is_admin
			) {
				headerButtons.push({
					icon: "playlist-edit",
					text: "Edit recipe",
					action: () =>
						this.setState({
							editRecipePopUpShowing: true,
							dynamicMenuShowing: false,
						}),
				});
				headerButtons.push({
					icon: "trash-can-outline",
					text: "Delete recipe",
					action: () =>
						this.setState({
							deleteRecipePopUpShowing: true,
							dynamicMenuShowing: false,
						}),
				});
			}
			headerButtons.push({
				icon: "food",
				text: "Create new recipe",
				action: () => {
					this.setState({ dynamicMenuShowing: false }, () => {
						this.props.navigation.navigate("NewRecipe");
					});
				},
			});
			this.setState({ headerButtons: headerButtons });
		};

		renderDynamicMenu = () => {
			return (
				<DynamicMenu
					buttons={this.state.headerButtons}
					closeDynamicMenu={() => this.setState({ dynamicMenuShowing: false })}
				/>
			);
		};

		addDynamicMenuButtonsToHeader = () => {
			this.props.navigation.setOptions({
				headerRight: Object.assign(
					() => (
						<AppHeaderRight
							buttonAction={() => this.setState({ dynamicMenuShowing: true })}
							accessibilityLabel={"Open action menu"}
						/>
					),
					{ displayName: "HeaderRight" }
				),
			});
		};

		componentDidMount = () => {
			const listener = AppState.addEventListener("change", this.handleAppStateChange);
			this.setState(
				{
					awaitingServer: true,
					appStateListener: listener,
				},
				async () => {
					await this.generateHeaderButtonList();
					this.addDynamicMenuButtonsToHeader();
					if (this.props.route.params.commenting === true) {
						let netInfoState = await NetInfo.fetch();
						if (netInfoState.isConnected) {
							this.setState({ commenting: true }, () => {
								setTimeout(() => {
									this.myScroll.scrollTo({ x: 0, y: this.state.commentsTopY - 100, animated: true });
								}, 300);
							});
						} else {
							this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState });
						}
					}
					this.setState({ awaitingServer: false });
				}
			);
			this.enableKeepAwake();
		};

		componentDidUpdate = async (prevProps) => {
			if (
				prevProps.recipe_details.likeable != this.props.recipe_details.likeable ||
				prevProps.recipe_details.shareable != this.props.recipe_details.shareable
			) {
				await this.generateHeaderButtonList();
			}
			// console.log('DETAILS')
			// console.log(this.props.navigation.getState().routes)
		};

		componentWillUnmount = () => {
			if (this.state.appStateListener) {
				this.state.appStateListener.remove();
			}
			this.disableKeepAwake();
		};

		handleAppStateChange = async (nextAppState) => {
			if (this.state.appState.match(/inactive|background/) && nextAppState === "active") {
				// console.log('App has come to the foreground!');
				await this.enableKeepAwake();
			} else if (this.state.appState === "active" && nextAppState.match(/inactive|background/)) {
				// console.log('App is going into background!');
				this.disableKeepAwake();
			}
			this.setState({ appState: nextAppState });
		};

		enableKeepAwake = async () => {
			await activateKeepAwakeAsync();
			keepAwakeTimer = setTimeout(() => {
				deactivateKeepAwake();
			}, 600000);
		};

		disableKeepAwake = () => {
			deactivateKeepAwake();
			clearTimeout(keepAwakeTimer);
		};

		resetKeepAwakeTimer = () => {
			this.disableKeepAwake();
			this.enableKeepAwake();
		};

		scrolled = () => {
			// console.log(e.nativeEvent)
		};

		navigateToChefDetails = (chefID) => {
			this.setState(
				{
					awaitingServer: true,
					imagePopupShowing: false,
				},
				async () => {
					try {
						const chefDetails = await getChefDetails(chefID, this.props.loggedInChef.auth_token);
						if (chefDetails) {
							this.props.storeChefDetails(chefDetails);
							saveChefDetailsLocally(chefDetails, this.props.loggedInChef.id);
							this.setState({ awaitingServer: false }, () => {
								this.props.navigation.navigate("ChefDetails", { chefID: chefID });
							});
						}
					} catch (e) {
						if (e.name === "Logout") {
							this.props.navigation.navigate("ProfileCover", {
								screen: "Profile",
								params: { logout: true },
							});
						}
						// console.log('looking for local chefs')
						AsyncStorage.getItem("localChefDetails", (err, res) => {
							if (res != null) {
								// console.log('found some local chefs')
								let localChefDetails = JSON.parse(res);
								let thisChefDetails = localChefDetails.find(
									(chefDetails) => chefDetails.chef.id === chefID
								);
								if (thisChefDetails) {
									this.props.storeChefDetails(thisChefDetails);
									this.setState({ awaitingServer: false }, () => {
										this.props.navigation.navigate("ChefDetails", { chefID: chefID });
									});
								} else {
									this.setState({ renderOfflineMessage: true, offlineDiagnostics: res });
								}
							} else {
								this.setState({ renderOfflineMessage: true, offlineDiagnostics: err });
							}
						});
					}
					this.setState({ awaitingServer: false });
				}
			);
		};

		editRecipe = async () => {
			let netInfoState = await NetInfo.fetch();
			if (netInfoState.isConnected) {
				this.setState(
					{
						awaitingServer: true,
						editRecipePopUpShowing: false,
					},
					() => {
						this.props.navigation.navigate("NewRecipe", { recipe_details: this.props.recipe_details });
						this.setState({ awaitingServer: false });
					}
				);
			} else {
				this.setState({
					renderOfflineMessage: true,
					offlineDiagnostics: netInfoState,
					editRecipePopUpShowing: false,
				});
			}
		};

		deleteRecipe = async () => {
			let netInfoState = await NetInfo.fetch();
			if (netInfoState.isConnected) {
				this.setState({ awaitingServer: true }, async () => {
					const deleted = await destroyRecipe(
						this.props.recipe_details.recipe.id,
						this.props.loggedInChef.auth_token
					);
					if (deleted) {
						// this.props.navigation.goBack()
						this.props.navigation.navigate("MyRecipeBook", {
							screen: "My Recipes",
							params: { deleteId: this.props.recipe_details.recipe.id },
						});
					}
				});
			} else {
				this.setState({
					renderOfflineMessage: true,
					offlineDiagnostics: netInfoState,
					deleteRecipePopUpShowing: false,
				});
			}
		};

		renderRecipeIngredients = () => {
			const ingredient_uses = this.props.recipe_details.ingredient_uses;
			const list_values = ingredient_uses.map((ingredient_use) => [
				ingredient_use.ingredient_id,
				ingredient_use.quantity,
				ingredient_use.unit,
			]);
			const ingredients = list_values.map((list_value) => [
				...list_value,
				this.props.recipe_details.ingredients.find((ingredient) => ingredient.id == list_value[0]).name,
			]);
			return ingredients.map((ingredient, index) => (
				<React.Fragment key={`${ingredient[0]}${ingredient[3]}${ingredient[1]}${ingredient[2]}`}>
					<View style={styles.ingredientsTable}>
						<View style={styles.ingredientsTableLeft}>
							<Text maxFontSizeMultiplier={2} style={[styles.detailsContents, styles.ingredientName]}>
								{ingredient[3]}
							</Text>
						</View>
						<View style={styles.ingredientsTableRight}>
							<Text maxFontSizeMultiplier={2} style={[styles.detailsContents, styles.ingredientQuantity]}>
								{ingredient[1]}
							</Text>
							<Text maxFontSizeMultiplier={2} style={[styles.detailsContents, styles.ingredientUnit]}>
								{ingredient[2]}
							</Text>
						</View>
					</View>
					{index < ingredients.length - 1 && <View style={styles.detailsIngredientsSeparator}></View>}
				</React.Fragment>
			));
		};

		renderMakePicScrollView = () => {
			return (
				<ScrollView horizontal={true} style={styles.makePicScrollView} scrollEnabled={this.state.scrollEnabled}>
					{this.renderRecipeMakePics()}
				</ScrollView>
			);
		};

		renderRecipeMakePics = () => {
			return this.props.recipe_details.make_pics.map((make_pic) => {
				// console.log(this.props.recipe_details.make_pics_chefs)
				if (make_pic.image_url) {
					return (
						<TouchableOpacity
							// delayPressIn={100}
							activeOpacity={0.7}
							onPress={() => {
								this.setState({
									scrollEnabled: false,
									imagePopupShowing: true,
									imagePopupDetails: make_pic,
								});
							}}
							// onPressOut={() => {
							// 	this.setState({
							// 		scrollEnabled: true,
							// 		imagePopupShowing: false,
							// 	})
							// }}
							// pressRetentionOffset={{
							// 	top: responsiveHeight(100),
							// 	left: responsiveWidth(100),
							// 	bottom: responsiveHeight(100),
							// 	right: responsiveWidth(100)
							// }}
							key={`${make_pic.id}${make_pic.image_url}`}
							style={styles.makePicContainer}
						>
							<Image
								style={[{ width: "100%", height: "100%", marginHorizontal: 1 }, styles.makePic]}
								source={{ uri: make_pic.image_url }}
							></Image>
							{(make_pic.chef_id === this.props.loggedInChef.id || this.props.loggedInChef.is_admin) && (
								<TouchableOpacity
									style={styles.makePicTrashCanButton}
									onPress={() =>
										this.setState({ deleteMakePicPopUpShowing: true, makePicToDelete: make_pic.id })
									}
								>
									<Icon
										name="trash-can-outline"
										size={responsiveHeight(3.5)}
										style={[styles.icon, styles.makePicTrashCan]}
									/>
								</TouchableOpacity>
							)}
						</TouchableOpacity>
					);
				}
			});
		};

		renderRecipeComments = () => {
			if (this.props.recipe_details.comments.length > 0 || this.state.commenting) {
				return this.props.recipe_details.comments.map((comment) => {
					return (
						<RecipeComment
							newCommentView={this.newCommentView}
							key={`${comment.id} ${comment.comment}`}
							{...comment}
							loggedInChefID={this.props.loggedInChef.id}
							is_admin={this.props.loggedInChef.is_admin}
							askDeleteComment={this.askDeleteComment}
							navigateToChefDetails={this.navigateToChefDetails}
						/>
					);
				});
			} else {
				return (
					<Text maxFontSizeMultiplier={2} style={styles.detailsContents}>
						No comments yet. Be the first!
					</Text>
				);
			}
		};

		renderLikeButton = () => {
			if (this.props.recipe_details.likeable) {
				return (
					<TouchableOpacity onPress={this.likeRecipe} testID="likeButton" accessibilityLabel="like recipe">
						<Icon name="heart-outline" size={responsiveHeight(3.5)} style={styles.icon} />
					</TouchableOpacity>
				);
			} else {
				return (
					<TouchableOpacity
						onPress={this.unlikeRecipe}
						testID="unlikeButton"
						accessibilityLabel="unlike recipe"
					>
						<Icon name="heart" size={responsiveHeight(3.5)} style={styles.icon} />
					</TouchableOpacity>
				);
			}
		};

		renderMakeButton = () => {
			if (this.props.recipe_details.makeable) {
				return (
					<TouchableOpacity onPress={this.makeRecipe}>
						<Icon name="food" size={responsiveHeight(3.5)} style={styles.icon} />
					</TouchableOpacity>
				);
			} else {
				return (
					<TouchableOpacity>
						<Icon name="food-off" size={responsiveHeight(3.5)} style={styles.icon} />
					</TouchableOpacity>
				);
			}
		};

		updateAttributeCountInRecipeLists = (recipeId, attribute, toggle, diff) => {
			let newAllRecipeLists = {};
			Object.keys(this.props.allRecipeLists).forEach((list) => {
				let recipeList = this.props.allRecipeLists[list].map((recipe) => {
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
			this.props.updateAllRecipeLists(newAllRecipeLists);
		};

		likeRecipe = async () => {
			let netInfoState = await NetInfo.fetch();
			if (netInfoState.isConnected) {
				this.setState({ awaitingServer: true }, async () => {
					try {
						const likePosted = await postRecipeLike(
							this.props.recipe_details.recipe.id,
							this.props.loggedInChef.id,
							this.props.loggedInChef.auth_token
						);
						if (likePosted) {
							this.props.addRecipeLike();
							this.updateAttributeCountInRecipeLists(
								this.props.recipe_details.recipe.id,
								"likes_count",
								"chef_liked",
								1
							);
						}
					} catch (e) {
						if (e.name === "Logout") {
							this.props.navigation.navigate("ProfileCover", {
								screen: "Profile",
								params: { logout: true },
							});
						}
						this.setState({ renderOfflineMessage: true, offlineDiagnostics: e });
					}
					this.setState({ awaitingServer: false });
				});
			} else {
				this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState });
			}
		};

		unlikeRecipe = async () => {
			let netInfoState = await NetInfo.fetch();
			if (netInfoState.isConnected) {
				this.setState({ awaitingServer: true }, async () => {
					try {
						const unlikePosted = await destroyRecipeLike(
							this.props.recipe_details.recipe.id,
							this.props.loggedInChef.id,
							this.props.loggedInChef.auth_token
						);
						if (unlikePosted) {
							this.props.removeRecipeLike();
							this.updateAttributeCountInRecipeLists(
								this.props.recipe_details.recipe.id,
								"likes_count",
								"chef_liked",
								-1
							);
						}
					} catch (e) {
						if (e.name === "Logout") {
							this.props.navigation.navigate("ProfileCover", {
								screen: "Profile",
								params: { logout: true },
							});
						}
						// console.log(e)
						this.setState({ renderOfflineMessage: true, offlineDiagnostics: e });
					}
					this.setState({ awaitingServer: false });
				});
			} else {
				this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState });
			}
		};

		makeRecipe = async () => {
			let netInfoState = await NetInfo.fetch();
			if (netInfoState.isConnected) {
				this.setState({ awaitingServer: true }, async () => {
					try {
						const makePosted = await postRecipeMake(
							this.props.recipe_details.recipe.id,
							this.props.loggedInChef.id,
							this.props.loggedInChef.auth_token
						);
						if (makePosted) {
							this.props.addRecipeMake();
							this.updateAttributeCountInRecipeLists(
								this.props.recipe_details.recipe.id,
								"makes_count",
								"chef_made",
								1
							);
						}
					} catch (e) {
						if (e.name === "Logout") {
							this.props.navigation.navigate("ProfileCover", {
								screen: "Profile",
								params: { logout: true },
							});
						}
						this.setState({ renderOfflineMessage: true, offlineDiagnostics: e });
					}
					this.setState({ awaitingServer: false });
				});
			} else {
				this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState });
			}
		};

		reShareRecipe = async () => {
			let netInfoState = await NetInfo.fetch();
			if (netInfoState.isConnected) {
				this.setState({ awaitingServer: true }, async () => {
					try {
						const reSharePosted = await postReShare(
							this.props.recipe_details.recipe.id,
							this.props.loggedInChef.id,
							this.props.loggedInChef.auth_token
						);
						if (reSharePosted) {
							this.props.addReShare();
							this.updateAttributeCountInRecipeLists(
								this.props.recipe_details.recipe.id,
								"shares_count",
								"chef_shared",
								1
							);
						}
					} catch (e) {
						if (e.name === "Logout") {
							this.props.navigation.navigate("ProfileCover", {
								screen: "Profile",
								params: { logout: true },
							});
						}
						this.setState({ renderOfflineMessage: true, offlineDiagnostics: e });
					}
					this.setState({ awaitingServer: false });
				});
			} else {
				this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState });
			}
		};

		unReShareRecipe = async () => {
			let netInfoState = await NetInfo.fetch();
			if (netInfoState.isConnected) {
				this.setState({ awaitingServer: true }, async () => {
					try {
						const unReShared = await destroyReShare(
							this.props.recipe_details.recipe.id,
							this.props.loggedInChef.id,
							this.props.loggedInChef.auth_token
						);
						if (unReShared) {
							this.props.removeReShare();
							this.updateAttributeCountInRecipeLists(
								this.props.recipe_details.recipe.id,
								"shares_count",
								"chef_shared",
								-1
							);
						}
					} catch (e) {
						if (e.name === "Logout") {
							this.props.navigation.navigate("ProfileCover", {
								screen: "Profile",
								params: { logout: true },
							});
						}
						this.setState({ renderOfflineMessage: true, offlineDiagnostics: e });
					}
					this.setState({ awaitingServer: false });
				});
			} else {
				this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState });
			}
		};

		newMakePic = async () => {
			let netInfoState = await NetInfo.fetch();
			if (netInfoState.isConnected) {
				this.setState({ choosingPicSource: true });
			} else {
				this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState });
			}
		};

		saveImage = (image) => {
			if (image.uri != undefined) {
				this.setState({ makePicFileUri: image.uri });
			}
		};

		cancelChooseImage = (image) => {
			this.setState({ makePicFileUri: image });
		};

		saveMakePic = async () => {
			this.setState(
				{
					awaitingServer: true,
					choosingPicSource: false,
				},
				async () => {
					if (this.state.makePicFileUri) {
						try {
							const makePic = await postMakePic(
								this.props.recipe_details.recipe.id,
								this.props.loggedInChef.id,
								this.props.loggedInChef.auth_token,
								this.state.makePicFileUri
							);
							if (makePic) {
								await this.props.addMakePic(makePic.make_pic);
								await this.props.addMakePicChef(makePic.make_pic_chef);
							}
						} catch (e) {
							if (e.name === "Logout") {
								this.props.navigation.navigate("ProfileCover", {
									screen: "Profile",
									params: { logout: true },
								});
							}
							// console.log(e)
							this.setState({ renderOfflineMessage: true, offlineDiagnostics: e });
						}
					}
					this.setState({
						awaitingServer: false,
						makePicFileUri: "",
					});
				}
			);
		};

		deleteMakePic = async () => {
			let netInfoState = await NetInfo.fetch();
			if (netInfoState.isConnected) {
				this.setState({ awaitingServer: true }, async () => {
					try {
						const destroyed = await destroyMakePic(
							this.props.loggedInChef.auth_token,
							this.state.makePicToDelete
						);
						if (destroyed) {
							this.props.saveRemainingMakePics(
								this.props.recipe_details.make_pics.filter(
									(pic) => pic.id !== this.state.makePicToDelete
								)
							);
						}
						this.setState({ deleteMakePicPopUpShowing: false });
					} catch (e) {
						if (e.name === "Logout") {
							this.props.navigation.navigate("ProfileCover", {
								screen: "Profile",
								params: { logout: true },
							});
						}
						this.setState({ renderOfflineMessage: true, offlineDiagnostics: e });
					}
					this.setState({
						awaitingServer: false,
						deleteMakePicPopUpShowing: false,
					});
				});
			} else {
				this.setState({
					renderOfflineMessage: true,
					offlineDiagnostics: netInfoState,
					deleteMakePicPopUpShowing: false,
				});
			}
		};

		newComment = async () => {
			let netInfoState = await NetInfo.fetch();
			if (netInfoState.isConnected) {
				this.setState({ commenting: true });
			} else {
				this.setState({ renderOfflineMessage: true, offlineDiagnostics: netInfoState });
			}
		};

		cancelComment = () => {
			this.setState({
				commenting: false,
				commentText: "",
			});
		};

		saveComment = async () => {
			this.setState({ awaitingServer: true }, async () => {
				try {
					const comments = await postComment(
						this.props.recipe_details.recipe.id,
						this.props.loggedInChef.id,
						this.props.loggedInChef.auth_token,
						this.state.commentText
					);
					if (comments) {
						this.props.updateComments(comments);
						this.updateAttributeCountInRecipeLists(
							this.props.recipe_details.recipe.id,
							"comments_count",
							"chef_commented",
							1
						);
						this.setState({
							commenting: false,
							commentText: "",
						});
					}
				} catch (e) {
					if (e.name === "Logout") {
						this.props.navigation.navigate("ProfileCover", { screen: "Profile", params: { logout: true } });
					}
					this.setState({ renderOfflineMessage: true, offlineDiagnostics: e });
				}
				this.setState({ awaitingServer: false });
			});
		};

		handleCommentTextInput = (commentText) => {
			this.setState({ commentText: commentText });
		};

		askDeleteComment = (commentID) => {
			this.setState({
				deleteCommentPopUpShowing: true,
				commentToDelete: commentID,
			});
		};

		deleteComment = async () => {
			let netInfoState = await NetInfo.fetch();
			if (netInfoState.isConnected) {
				this.setState({ awaitingServer: true }, async () => {
					try {
						const comments = await destroyComment(
							this.props.loggedInChef.auth_token,
							this.state.commentToDelete
						);
						if (comments) {
							this.props.updateComments(comments);
							this.updateAttributeCountInRecipeLists(
								this.props.recipe_details.recipe.id,
								"comments_count",
								"chef_commented",
								-1
							);
						}
						this.setState({ deleteCommentPopUpShowing: false });
					} catch (e) {
						if (e.name === "Logout") {
							this.props.navigation.navigate("ProfileCover", {
								screen: "Profile",
								params: { logout: true },
							});
						}
						this.setState({ renderOfflineMessage: true, offlineDiagnostics: e });
					}
					this.setState({
						awaitingServer: false,
						deleteCommentPopUpShowing: false,
					});
				});
			} else {
				this.setState({
					renderOfflineMessage: true,
					offlineDiagnostics: netInfoState,
					deleteCommentPopUpShowing: false,
				});
			}
		};

		renderFilterCategories = () => {
			const categories = Object.keys(this.props.filter_settings)
				.sort()
				.filter((category) => this.props.recipe_details.recipe[category.split(" ").join("_").toLowerCase()]);
			if (categories.length > 0) {
				return (
					<View style={styles.detailsContainer}>
						<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>
							Categories:
						</Text>
						<Text maxFontSizeMultiplier={2} style={styles.detailsContents}>
							{categories.join(",  ")}
						</Text>
					</View>
				);
			} else {
				return null;
			}
		};

		renderAcknowledgement = () => {
			// console.log(this.props.recipe_details.recipe)
			let displayLink =
				this.props.recipe_details.recipe.acknowledgement_link &&
				this.props.recipe_details.recipe.acknowledgement_link.length > 0;
			let displayBlog =
				this.props.recipe_details.recipe.show_blog_preview &&
				this.props.recipe_details.recipe.acknowledgement_link.length > 0;
			return (
				<React.Fragment>
					<View style={styles.detailsContainer}>
						<View style={{ flexDirection: "row" }}>
							<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>
								Acknowledgement:
							</Text>
							{displayLink ? ( //using && here creates a bug about text strings. no idea why
								<TouchableOpacity
									onPress={() =>
										Linking.openURL(this.props.recipe_details.recipe.acknowledgement_link)
									}
								>
									<Icon name="link" size={responsiveHeight(3.5)} style={styles.addIcon} />
								</TouchableOpacity>
							) : null}
						</View>
						<Text maxFontSizeMultiplier={2} style={styles.detailsContents}>
							{this.props.recipe_details.recipe.acknowledgement}
						</Text>
					</View>
					{displayBlog && (
						<View style={styles.detailsContainer}>
							<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>
								The blog:
							</Text>
							<View style={styles.webviewContainer}>
								<ScrollView nestedScrollEnabled={true}>
									<WebView
										source={{ uri: this.props.recipe_details.recipe.acknowledgement_link }}
										injectedJavaScript={`
											window.ReactNativeWebView.postMessage(
												Math.max(document.body.offsetHeight, document.body.scrollHeight)
											)
										`}
										onMessage={(e) => {
											let newHeight = parseInt(e.nativeEvent.data);
											if (newHeight > 0) {
												this.setState({ webviewHeight: newHeight });
											}
										}}
										contentContainerStyle={{ borderRadius: responsiveWidth(1.5) }}
										style={{
											borderRadius: responsiveWidth(1.5),
											height: this.state.webviewHeight,
											width: "100%",
										}}
										onShouldStartLoadWithRequest={(event) => {
											if (this.state.webviewCanRespondToEvents) {
												if (Platform.OS === "ios") {
													if (
														event.mainDocumentURL !==
														this.props.recipe_details.recipe.acknowledgement_link
													) {
														Linking.openURL(event.mainDocumentURL);
														return false;
													}
												} else {
													if (
														event.url !==
														this.props.recipe_details.recipe.acknowledgement_link
													) {
														Linking.openURL(event.url);
														return false;
													}
												}
											}
											return true;
										}}
										// onNavigationStateChange={(event) => {
										// 	if (event.url !== this.props.recipe_details.recipe.acknowledgement_link) {
										// 		Linking.openURL(event.url)
										// 	}
										// }}
										onLoad={() => {
											this.setState({
												webviewLoading: false,
												webviewCanRespondToEvents: true,
											});
										}}
										allowsInlineMediaPlayback={true}
										mediaPlaybackRequiresUserAction={true}
									/>
								</ScrollView>
								{this.state.webviewLoading && <StyledActivityIndicator />}
							</View>
						</View>
					)}
				</React.Fragment>
			);
		};

		renderDescription = () => {
			return (
				<View style={styles.detailsContainer}>
					<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>
						Description:
					</Text>
					<Text maxFontSizeMultiplier={2} style={styles.detailsContents}>
						{this.props.recipe_details.recipe.description}
					</Text>
				</View>
			);
		};

		renderCuisine = () => {
			return (
				<View style={styles.detailsContainer}>
					<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>
						Cuisine:
					</Text>
					<Text maxFontSizeMultiplier={2} style={styles.detailsContents}>
						{this.props.recipe_details.recipe.cuisine}
					</Text>
				</View>
			);
		};

		renderRecipeInstructions = () => {
			// console.log(this.props.recipe_details.instructions)
			return this.props.recipe_details.instructions.map((instruction, index) => {
				let instructionImage = this.props.recipe_details.instruction_images.find(
					(image) => image.instruction_id === instruction.id
				);
				return (
					<React.Fragment key={instruction.step}>
						<View style={styles.detailsInstructionContainer}>
							<View
								style={[
									styles.detailsInstructions,
									{ width: instructionImage ? responsiveWidth(73) : responsiveWidth(98) },
								]}
							>
								<Text maxFontSizeMultiplier={2} style={styles.detailsContents}>
									{instruction.instruction}
								</Text>
							</View>
							{instructionImage && (
								<TouchableOpacity
									style={styles.instructionImageContainer}
									delayPressIn={100}
									onPressIn={() => {
										this.setState({
											scrollEnabled: false,
											imagePopupShowing: true,
											imagePopupDetails: instructionImage,
										});
									}}
									onPressOut={() => {
										this.setState({
											scrollEnabled: true,
											imagePopupShowing: false,
										});
									}}
									pressRetentionOffset={{
										top: responsiveHeight(100),
										left: responsiveWidth(100),
										bottom: responsiveHeight(100),
										right: responsiveWidth(100),
									}}
								>
									<Image
										style={[
											{ width: responsiveWidth(25), height: responsiveWidth(25) },
											styles.detailsImage,
										]}
										source={{ uri: instructionImage.image_url }}
										resizeMode="cover"
									/>
								</TouchableOpacity>
							)}
						</View>
						{index < this.props.recipe_details.instructions.length - 1 && (
							<View style={styles.detailsInstructionsSeparator}></View>
						)}
					</React.Fragment>
				);
			});
		};

		renderPictureChooser = () => {
			let imageSource = this.state.makePicFileUri;
			return (
				<PicSourceChooser
					saveImage={this.saveImage}
					sourceChosen={this.saveMakePic}
					// key={"primary-pic-chooser"}
					imageSource={imageSource}
					originalImage={this.state.makePicFileUri}
					cancelChooseImage={this.cancelChooseImage}
				/>
			);
		};

		renderPrimaryImageBlobs = () => {
			return this.props.recipe_details.recipe_images.map((image, index) => {
				if (this.state.primaryImageDisplayedIndex == index) {
					return (
						<Icon
							key={image.hex}
							name={"checkbox-blank-circle"}
							size={responsiveHeight(3)}
							style={styles.primaryImageBlob}
						/>
					);
				} else {
					return (
						<Icon
							key={image.hex}
							name={"checkbox-blank-circle-outline"}
							size={responsiveHeight(3)}
							style={styles.primaryImageBlob}
						/>
					);
				}
			});
		};

		renderDeleteMakePicAlertPopup = () => {
			return (
				<AlertPopup
					close={() => this.setState({ deleteMakePicPopUpShowing: false })}
					title={"Are you sure you want to delete this picture?"}
					onYes={() => this.deleteMakePic(this.state.makePicToDelete)}
				/>
			);
		};

		renderDeleteCommentAlertPopup = () => {
			return (
				<AlertPopup
					close={() => this.setState({ deleteCommentPopUpShowing: false })}
					title={"Are you sure you want to delete this comment?"}
					onYes={() => this.deleteComment(this.state.commentToDelete)}
				/>
			);
		};

		renderEditRecipeAlertPopup = () => {
			return (
				<AlertPopup
					close={() => this.setState({ editRecipePopUpShowing: false })}
					title={"Are you sure you want to edit this recipe?"}
					onYes={this.editRecipe}
				/>
			);
		};

		renderDeleteRecipeAlertPopup = () => {
			return (
				<AlertPopup
					close={() => this.setState({ deleteRecipePopUpShowing: false })}
					title={"Are you sure you want to delete this recipe?"}
					onYes={this.deleteRecipe}
				/>
			);
		};

		render() {
			if (this.props.recipe_details != undefined && this.props.recipe_details != null) {
				let notShowingAllTimes =
					this.props.recipe_details.recipe.prep_time == 0 || this.props.recipe_details.recipe.cook_time == 0;
				// console.log(notShowingAllTimes)
				// console.log(this.props.recipe_details)
				return (
					<SpinachAppContainer awaitingServer={this.state.awaitingServer}>
						{this.state.renderOfflineMessage && (
							<OfflineMessage
								message={`Sorry, can't do right now.${"\n"}You appear to be offline.`}
								topOffset={"10%"}
								clearOfflineMessage={() => this.setState({ renderOfflineMessage: false })}
								diagnostics={this.props.loggedInChef.is_admin ? this.state.offlineDiagnostics : null}
							/>
						)}
						{this.state.deleteMakePicPopUpShowing && this.renderDeleteMakePicAlertPopup()}
						{this.state.deleteCommentPopUpShowing && this.renderDeleteCommentAlertPopup()}
						{this.state.editRecipePopUpShowing && this.renderEditRecipeAlertPopup()}
						{this.state.deleteRecipePopUpShowing && this.renderDeleteRecipeAlertPopup()}
						{this.state.choosingPicSource && this.renderPictureChooser()}
						{this.state.dynamicMenuShowing && this.renderDynamicMenu()}
						{this.state.imagePopupShowing && (
							<ImagePopup
								imageDetails={this.state.imagePopupDetails}
								chef={this.props.recipe_details.make_pics_chefs.find(
									(chef) => chef.id == this.state.imagePopupDetails.chef_id
								)}
								navigateToChefDetails={this.navigateToChefDetails}
								close={() =>
									this.setState({
										imagePopupShowing: false,
										scrollEnabled: true,
									})
								}
							/>
						)}
						<KeyboardAvoidingView
							style={centralStyles.fullPageKeyboardAvoidingView}
							behavior={Platform.OS === "ios" ? "padding" : ""}
							keyboardVerticalOffset={Platform.OS === "ios" ? responsiveHeight(9) + 20 : 0}
						>
							<ScrollView
								contentContainerStyle={{ flexGrow: 1 }}
								ref={(ref) => (this.myScroll = ref)}
								scrollEnabled={this.state.scrollEnabled}
								nestedScrollEnabled={true}
								onMomentumScrollEnd={this.resetKeepAwakeTimer}
							>
								<View style={styles.detailsHeader}>
									<View style={styles.detailsHeaderTopRow}>
										<View style={styles.headerTextView}>
											<Text maxFontSizeMultiplier={2} style={styles.detailsHeaderTextBox}>
												{this.props.recipe_details.recipe.name}
												<Text
													maxFontSizeMultiplier={2}
													style={[
														styles.detailsChefTextBox,
														{ color: this.state.chefNameTextColor },
													]}
													onPress={() => {
														this.setState({ chefNameTextColor: "#50505055" });
														this.navigateToChefDetails(
															this.props.recipe_details.recipe.chef_id
														);
														setTimeout(() => {
															this.setState({ chefNameTextColor: "#505050" });
														}, 300);
													}}
												>
													&nbsp;by&nbsp;{this.props.recipe_details.chef_username}
												</Text>
											</Text>
										</View>
									</View>
								</View>
								<View style={styles.detailsLikesAndMakes}>
									<View style={styles.detailsLikes}>
										<View style={styles.buttonAndText}>
											{this.renderLikeButton()}
											<Text
												maxFontSizeMultiplier={2}
												style={styles.detailsLikesAndMakesLowerContentsAllTimings}
											>
												&nbsp;Likes:&nbsp;{this.props.recipe_details.recipe_likes}
											</Text>
										</View>
										{this.props.recipe_details.recipe.serves != "Any" && (
											<View style={styles.buttonAndText}>
												<Text
													maxFontSizeMultiplier={2}
													style={styles.detailsLikesAndMakesLowerContentsAllTimings}
												>
													Serves:&nbsp;{this.props.recipe_details.recipe.serves}
												</Text>
											</View>
										)}
										{this.props.recipe_details.recipe.difficulty != 0 && (
											<View style={styles.buttonAndText}>
												<Text
													maxFontSizeMultiplier={2}
													style={styles.detailsLikesAndMakesLowerContentsAllTimings}
												>
													Difficulty:&nbsp;{this.props.recipe_details.recipe.difficulty}
												</Text>
											</View>
										)}
									</View>
								</View>
								{(this.props.recipe_details.recipe.prep_time != 0 ||
									this.props.recipe_details.recipe.cook_time != 0 ||
									this.props.recipe_details.recipe.total_time != 0) && (
									<View style={styles.detailsContainer}>
										<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>
											Timings:
										</Text>
										<View
											style={[
												styles.detailsTimings,
												notShowingAllTimes
													? {
															justifyContent: "flex-start",
															marginLeft: responsiveWidth(5),
															width: responsiveWidth(93),
															flexDirection: "column",
													  }
													: null,
											]}
										>
											{this.props.recipe_details.recipe.prep_time > 0 && (
												<Text
													maxFontSizeMultiplier={2}
													style={
														notShowingAllTimes
															? styles.detailsLikesAndMakesLowerContentsLimitedTimings
															: styles.detailsLikesAndMakesLowerContentsAllTimings
													}
												>
													Prep Time:{" "}
													{getTimeStringFromMinutes(
														this.props.recipe_details.recipe.prep_time
													)}
												</Text>
											)}
											{this.props.recipe_details.recipe.prep_time > 0 &&
												this.props.recipe_details.recipe.cook_time > 0 && (
													<Text
														maxFontSizeMultiplier={2}
														style={
															notShowingAllTimes
																? styles.detailsLikesAndMakesLowerContentsLimitedTimings
																: styles.detailsLikesAndMakesLowerContentsAllTimings
														}
													>
														{" "}
														+{" "}
													</Text>
												)}
											{this.props.recipe_details.recipe.cook_time > 0 && (
												<Text
													maxFontSizeMultiplier={2}
													style={
														notShowingAllTimes
															? styles.detailsLikesAndMakesLowerContentsLimitedTimings
															: styles.detailsLikesAndMakesLowerContentsAllTimings
													}
												>
													Cook Time:{" "}
													{getTimeStringFromMinutes(
														this.props.recipe_details.recipe.cook_time
													)}
												</Text>
											)}
											{this.props.recipe_details.recipe.prep_time > 0 &&
												this.props.recipe_details.recipe.cook_time > 0 && (
													<Text
														maxFontSizeMultiplier={2}
														style={
															notShowingAllTimes
																? styles.detailsLikesAndMakesLowerContentsLimitedTimings
																: styles.detailsLikesAndMakesLowerContentsAllTimings
														}
													>
														&asymp;
													</Text>
												)}
											{/* {!(this.props.recipe_details.recipe.prep_time > 0 && this.props.recipe_details.recipe.cook_time > 0)
													&& (notShowingAllTimes)
													&& (
														<Text maxFontSizeMultiplier={2} style={notShowingAllTimes ? styles.detailsLikesAndMakesLowerContentsLimitedTimings : styles.detailsLikesAndMakesLowerContentsAllTimings}> / </Text>
													)
												} */}
											{(!notShowingAllTimes ||
												(this.props.recipe_details.recipe.prep_time == 0 &&
													this.props.recipe_details.recipe.cook_time == 0 &&
													this.props.recipe_details.recipe.total_time > 0)) && (
												<Text
													maxFontSizeMultiplier={2}
													style={
														notShowingAllTimes
															? styles.detailsLikesAndMakesLowerContentsLimitedTimings
															: styles.detailsLikesAndMakesLowerContentsAllTimings
													}
												>
													Total Time:{" "}
													{getTimeStringFromMinutes(
														this.props.recipe_details.recipe.total_time
													)}
												</Text>
											)}
										</View>
									</View>
								)}
								{this.props.recipe_details.recipe.description != "" &&
									this.props.recipe_details.recipe.description != null &&
									this.renderDescription()}
								{this.props.recipe_details.recipe_images?.length > 0 && (
									<View style={styles.detailsImageWrapper}>
										<FlatList
											data={this.props.recipe_details.recipe_images}
											renderItem={(item) => (
												<Image
													style={{
														width: responsiveWidth(100) - 4,
														height: responsiveWidth(75) - 2,
														borderRadius: responsiveWidth(1.5),
														top: 1,
														left: 1,
														marginRight: 2,
													}}
													source={
														item.item.image_url
															? { uri: item.item.image_url }
															: defaultRecipeImage
													}
													resizeMode={"cover"}
												/>
											)}
											keyExtractor={(item) => item.hex}
											horizontal={true}
											style={styles.primaryImageFlatList}
											initialNumToRender={10}
											// contentContainerStyle={styles.primaryImageFlatListContentContainer}
											pagingEnabled={true}
											onLayout={(event) => {
												var { x, y, width, height } = event.nativeEvent.layout; //eslint-disable-line no-unused-vars
												this.setState({ primaryImageFlatListWidth: width });
											}}
											onScroll={(e) => {
												let nearestIndex = Math.round(
													e.nativeEvent.contentOffset.x / this.state.primaryImageFlatListWidth
												);
												if (nearestIndex != this.state.primaryImageDisplayedIndex) {
													this.setState({ primaryImageDisplayedIndex: nearestIndex });
												}
											}}
										/>
										<View style={styles.primaryImageBlobsContainer}>
											{this.props.recipe_details.recipe_images.length > 1 &&
												this.renderPrimaryImageBlobs()}
										</View>
									</View>
								)}
								{this.props.recipe_details.ingredient_uses?.length > 0 && (
									<View style={styles.detailsIngredients}>
										<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>
											Ingredients:
										</Text>
										{this.renderRecipeIngredients()}
									</View>
								)}
								{this.props.recipe_details.instructions?.length > 0 && (
									<View style={styles.detailsContainer}>
										<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>
											Instructions:
										</Text>
										{this.renderRecipeInstructions()}
									</View>
								)}
								{this.props.recipe_details.recipe.cuisine != "Any" ? this.renderCuisine() : null}
								{this.renderFilterCategories()}
								{this.props.recipe_details.recipe.acknowledgement != "" &&
									this.props.recipe_details.recipe.acknowledgement != null &&
									this.renderAcknowledgement()}
								<View style={styles.detailsMakePicsContainer}>
									<View style={{ flexDirection: "row" }}>
										<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>
											Images from other users:
										</Text>
										<TouchableOpacity
											onPress={this.newMakePic}
											accessibilityLabel="add your own image"
										>
											<Icon
												name="image-plus"
												size={responsiveHeight(3.5)}
												style={styles.addIcon}
											/>
										</TouchableOpacity>
									</View>
									{this.props.recipe_details.make_pics.length === 0 && (
										<Text maxFontSizeMultiplier={2} style={styles.detailsContents}>
											No other images yet. Be the first!
										</Text>
									)}
									{this.props.recipe_details.make_pics.length !== 0 && this.renderMakePicScrollView()}
								</View>
								<View
									style={styles.detailsComments}
									onLayout={(event) => this.setState({ commentsTopY: event.nativeEvent.layout.y })}
								>
									<View style={{ flexDirection: "row" }}>
										<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>
											Comments:
										</Text>
										<TouchableOpacity
											onPress={
												this.state.commenting
													? this.state.commentText === ""
														? this.cancelComment
														: this.saveComment
													: this.newComment
											}
											accessibilityLabel={
												this.state.commenting
													? this.state.commentText === ""
														? "cancel commenting"
														: "save comment"
													: "new comment"
											}
										>
											<Icon
												name={
													this.state.commenting
														? this.state.commentText === ""
															? "comment-remove"
															: "comment-check"
														: "comment-plus"
												}
												size={responsiveHeight(3.5)}
												style={styles.addIcon}
											/>
										</TouchableOpacity>
									</View>
									{this.state.commenting ? (
										<RecipeNewComment
											scrollToLocation={this.scrollToLocation}
											{...this.props.loggedInChef}
											commentText={this.state.commentText}
											handleCommentTextInput={this.handleCommentTextInput}
										/>
									) : null}
									{this.renderRecipeComments()}
								</View>
							</ScrollView>
						</KeyboardAvoidingView>
					</SpinachAppContainer>
				);
			} else {
				return <SpinachAppContainer awaitingServer={this.state.awaitingServer}></SpinachAppContainer>;
			}
		}
	}
);
