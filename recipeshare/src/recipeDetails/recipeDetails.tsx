import {
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
import { InstructionImage, MakePic, RecipeImage } from "../centralTypes";
import { RecipeDetailsNavigationProps, RecipeDetailsRouteProps } from "../../navigation";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import { AlertPopup } from "../alertPopup/alertPopup";
import DynamicMenu from "../dynamicMenu/DynamicMenu";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ImagePopup } from "./components/imagePopup";
import NetInfo from "@react-native-community/netinfo";
import OfflineMessage from "../offlineMessage/offlineMessage";
import PicSourceChooser from "../picSourceChooser/picSourceChooser";
import React from "react";
import RecipeComment from "./components/recipeComment";
import RecipeNewComment from "./components/recipeNewComment";
import SpinachAppContainer from "../spinachAppContainer/SpinachAppContainer";
import StyledActivityIndicator from "../customComponents/styledActivityIndicator/styledActivityIndicator";
import { WebView } from "react-native-webview";
import { centralStyles } from "../centralStyleSheet"; //eslint-disable-line no-unused-vars
import { getFilterSettings } from "../redux/selectors";
import { getTimeStringFromMinutes } from "../auxFunctions/getTimeStringFromMinutes";
import { styles } from "./recipeDetailsStyleSheet";
import { useAppSelector } from "../redux";
import { useRecipeDetailsModel } from "./hooks/useRecipeDetailsModel";

NetInfo.configure({ reachabilityShortTimeout: 5 }); //5ms

// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultRecipeImage = require("../../assets/images/default-recipe.jpg");

type OwnProps = {
	navigation: RecipeDetailsNavigationProps;
	route: RecipeDetailsRouteProps;
};

const RecipeDetails = ({ navigation, route }: OwnProps) => {
	const filterSettings = useAppSelector(getFilterSettings);
	const {
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
		// makeRecipe,
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
		setWebviewLoading,
	} = useRecipeDetailsModel({ navigation, route });

	const renderDynamicMenu = () => {
		return (
			<DynamicMenu
				buttons={headerButtons}
				closeDynamicMenu={() => setDynamicMenuShowing(false)}
				// closeDynamicMenu={() => this.setState({ dynamicMenuShowing: false })}
			/>
		);
	};

	const renderRecipeIngredients = () => {
		const ingredient_uses = recipeDetails.ingredient_uses;
		const list_values = ingredient_uses.map((ingredient_use) => [
			ingredient_use.ingredient_id,
			ingredient_use.quantity,
			ingredient_use.unit,
		]);
		const ingredients = list_values.map((list_value) => [
			...list_value,
			recipeDetails.ingredients.find((ingredient) => ingredient.id == list_value[0]).name,
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

	const renderMakePicScrollView = () => {
		return (
			<ScrollView horizontal={true} style={styles.makePicScrollView} scrollEnabled={scrollEnabled}>
				{renderRecipeMakePics()}
			</ScrollView>
		);
	};

	const renderRecipeMakePics = () => {
		return recipeDetails.make_pics.map((make_pic) => {
			if (make_pic.image_url) {
				return (
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => {
							setScrollEnabled(false);
							setImagePopupShowing(true);
							setImagePopupDetails(make_pic);
						}}
						key={`${make_pic.id}${make_pic.image_url}`}
						style={styles.makePicContainer}
					>
						<Image
							style={{ width: "100%", height: "100%", marginHorizontal: 1 }}
							source={{ uri: make_pic.image_url }}
						></Image>
						{(make_pic.chef_id === loggedInChef.id || loggedInChef.is_admin) && (
							<TouchableOpacity
								style={styles.makePicTrashCanButton}
								onPress={() => {
									setDeleteMakePicPopUpShowing(true);
									setMakePicToDelete(make_pic.id);
								}}
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

	const renderRecipeComments = () => {
		if (recipeDetails.comments.length > 0 || commenting) {
			return recipeDetails.comments.map((comment) => {
				return (
					<RecipeComment
						// newCommentView={newCommentView}
						key={`${comment.id} ${comment.comment}`}
						{...comment}
						loggedInChefID={loggedInChef.id}
						is_admin={loggedInChef.is_admin}
						askDeleteComment={askDeleteComment}
						navigateToChefDetails={navigateToChefDetails}
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

	const renderLikeButton = () => {
		if (recipeDetails.likeable) {
			return (
				<TouchableOpacity onPress={likeRecipe} testID="likeButton" accessibilityLabel="like recipe">
					<Icon name="heart-outline" size={responsiveHeight(3.5)} style={styles.icon} />
				</TouchableOpacity>
			);
		} else {
			return (
				<TouchableOpacity onPress={unlikeRecipe} testID="unlikeButton" accessibilityLabel="unlike recipe">
					<Icon name="heart" size={responsiveHeight(3.5)} style={styles.icon} />
				</TouchableOpacity>
			);
		}
	};

	// const renderMakeButton = () => {
	// 	if (recipeDetails.makeable) {
	// 		return (
	// 			<TouchableOpacity onPress={makeRecipe}>
	// 				<Icon name="food" size={responsiveHeight(3.5)} style={styles.icon} />
	// 			</TouchableOpacity>
	// 		);
	// 	} else {
	// 		return (
	// 			<TouchableOpacity>
	// 				<Icon name="food-off" size={responsiveHeight(3.5)} style={styles.icon} />
	// 			</TouchableOpacity>
	// 		);
	// 	}
	// };

	const renderFilterCategories = () => {
		const categories = Object.keys(filterSettings)
			.sort()
			.filter((category) => recipeDetails.recipe[category.split(" ").join("_").toLowerCase()]);
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

	const renderAcknowledgement = () => {
		// console.log(recipeDetails.recipe)
		const displayLink =
			recipeDetails.recipe.acknowledgement_link && recipeDetails.recipe.acknowledgement_link.length > 0;
		const displayBlog =
			recipeDetails.recipe.show_blog_preview && recipeDetails.recipe.acknowledgement_link.length > 0;
		return (
			<React.Fragment>
				<View style={styles.detailsContainer}>
					<View style={{ flexDirection: "row" }}>
						<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>
							Acknowledgement:
						</Text>
						{displayLink ? ( //using && here creates a bug about text strings. no idea why
							<TouchableOpacity
								onPress={() => Linking.openURL(recipeDetails.recipe.acknowledgement_link)}
							>
								<Icon name="link" size={responsiveHeight(3.5)} style={styles.addIcon} />
							</TouchableOpacity>
						) : null}
					</View>
					<Text maxFontSizeMultiplier={2} style={styles.detailsContents}>
						{recipeDetails.recipe.acknowledgement}
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
									source={{ uri: recipeDetails.recipe.acknowledgement_link }}
									injectedJavaScript={`
											window.ReactNativeWebView.postMessage(
												Math.max(document.body.offsetHeight, document.body.scrollHeight)
											)
										`}
									onMessage={(e) => {
										const newHeight = parseInt(e.nativeEvent.data);
										if (newHeight > 0) {
											setWebviewHeight(newHeight);
										}
									}}
									contentContainerStyle={{ borderRadius: responsiveWidth(1.5) }}
									style={{
										borderRadius: responsiveWidth(1.5),
										height: webviewHeight,
										width: "100%",
									}}
									onShouldStartLoadWithRequest={(event) => {
										if (webviewCanRespondToEvents) {
											if (Platform.OS === "ios") {
												if (
													event.mainDocumentURL !== recipeDetails.recipe.acknowledgement_link
												) {
													Linking.openURL(event.mainDocumentURL);
													return false;
												}
											} else {
												if (event.url !== recipeDetails.recipe.acknowledgement_link) {
													Linking.openURL(event.url);
													return false;
												}
											}
										}
										return true;
									}}
									// onNavigationStateChange={(event) => {
									// 	if (event.url !== recipeDetails.recipe.acknowledgement_link) {
									// 		Linking.openURL(event.url)
									// 	}
									// }}
									onLoad={() => {
										setWebviewLoading(false);
										setWebviewCanRespondToEvents(true);
										// this.setState({
										// webviewLoading: false,
										// webviewCanRespondToEvents: true,
										// });
									}}
									allowsInlineMediaPlayback={true}
									mediaPlaybackRequiresUserAction={true}
								/>
							</ScrollView>
							{webviewLoading && <StyledActivityIndicator />}
						</View>
					</View>
				)}
			</React.Fragment>
		);
	};

	const renderDescription = () => {
		return (
			<View style={styles.detailsContainer}>
				<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>
					Description:
				</Text>
				<Text maxFontSizeMultiplier={2} style={styles.detailsContents}>
					{recipeDetails.recipe.description}
				</Text>
			</View>
		);
	};

	const renderCuisine = () => {
		return (
			<View style={styles.detailsContainer}>
				<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>
					Cuisine:
				</Text>
				<Text maxFontSizeMultiplier={2} style={styles.detailsContents}>
					{recipeDetails.recipe.cuisine}
				</Text>
			</View>
		);
	};

	const renderRecipeInstructions = () => {
		// console.log(recipeDetails.instructions)
		return recipeDetails.instructions.map((instruction, index) => {
			const instructionImage = recipeDetails.instruction_images.find(
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
									setScrollEnabled(false);
									setImagePopupShowing(true);
									setImagePopupDetails(instructionImage);
									// this.setState({
									// 	scrollEnabled: false,
									// 	imagePopupShowing: true,
									// 	imagePopupDetails: instructionImage,
									// });
								}}
								onPressOut={() => {
									setScrollEnabled(true);
									setImagePopupShowing(false);
									// this.setState({
									// scrollEnabled: true,
									// imagePopupShowing: false,
									// });
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
					{index < recipeDetails.instructions.length - 1 && (
						<View style={styles.detailsInstructionsSeparator}></View>
					)}
				</React.Fragment>
			);
		});
	};

	const renderPictureChooser = () => {
		const imageSource = makePicFileUri;
		return (
			<PicSourceChooser
				saveImage={saveImage}
				sourceChosen={saveMakePic}
				// key={"primary-pic-chooser"}
				imageSource={imageSource}
				// originalImage={makePicFileUri}
				cancelChooseImage={cancelChooseImage}
			/>
		);
	};

	const renderPrimaryImageBlobs = () => {
		return recipeDetails.recipe_images.map((image, index) => {
			if (primaryImageDisplayedIndex == index) {
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

	const renderDeleteMakePicAlertPopup = () => {
		return (
			<AlertPopup
				close={() => setDeleteCommentPopUpShowing(false)}
				title={"Are you sure you want to delete this picture?"}
				onYes={() => deleteMakePic()}
			/>
		);
	};

	const renderDeleteCommentAlertPopup = () => {
		return (
			<AlertPopup
				close={() => setDeleteCommentPopUpShowing(false)}
				title={"Are you sure you want to delete this comment?"}
				onYes={() => deleteComment()}
			/>
		);
	};

	const renderEditRecipeAlertPopup = () => {
		return (
			<AlertPopup
				close={() => setEditRecipePopUpShowing(false)}
				title={"Are you sure you want to edit this recipe?"}
				onYes={editRecipe}
			/>
		);
	};

	const renderDeleteRecipeAlertPopup = () => {
		return (
			<AlertPopup
				close={() => setDeleteRecipePopUpShowing(false)}
				title={"Are you sure you want to delete this recipe?"}
				onYes={deleteRecipe}
			/>
		);
	};

	if (recipeDetails != undefined && recipeDetails != null) {
		const notShowingAllTimes = recipeDetails.recipe.prep_time == 0 || recipeDetails.recipe.cook_time == 0;
		// console.log(notShowingAllTimes)
		// console.log(recipeDetails)
		return (
			<SpinachAppContainer awaitingServer={awaitingServer} scrollingEnabled={false}>
				{renderOfflineMessage && (
					<OfflineMessage
						message={`Sorry, can't do right now.${"\n"}You appear to be offline.`}
						topOffset={"10%"}
						clearOfflineMessage={() => setRenderOfflineMessage(false)}
						diagnostics={loggedInChef.is_admin ? offlineDiagnostics : null}
					/>
				)}
				{deleteMakePicPopUpShowing && renderDeleteMakePicAlertPopup()}
				{deleteCommentPopUpShowing && renderDeleteCommentAlertPopup()}
				{editRecipePopUpShowing && renderEditRecipeAlertPopup()}
				{deleteRecipePopUpShowing && renderDeleteRecipeAlertPopup()}
				{choosingPicSource && renderPictureChooser()}
				{dynamicMenuShowing && renderDynamicMenu()}
				{imagePopupShowing && "image_url" in imagePopupDetails && (
					<ImagePopup
						imageDetails={imagePopupDetails as MakePic | InstructionImage | RecipeImage}
						chef={
							"chef_id" in imagePopupDetails
								? recipeDetails.make_pics_chefs.find((chef) => chef.id == imagePopupDetails.chef_id)
								: undefined
						}
						navigateToChefDetails={navigateToChefDetails}
						close={() => {
							setImagePopupShowing(false);
							setScrollEnabled(true);
						}}
					/>
				)}
				<KeyboardAvoidingView
					style={centralStyles.fullPageKeyboardAvoidingView}
					// @ts-ignore
					behavior={Platform.OS === "ios" ? "padding" : ""}
					keyboardVerticalOffset={Platform.OS === "ios" ? responsiveHeight(9) + 20 : 0}
				>
					<ScrollView
						contentContainerStyle={{ flexGrow: 1 }}
						ref={myScroll}
						scrollEnabled={scrollEnabled}
						nestedScrollEnabled={true}
						onMomentumScrollEnd={resetKeepAwakeTimer}
					>
						<View style={styles.detailsHeader}>
							<View style={styles.detailsHeaderTopRow}>
								<View style={styles.headerTextView}>
									<Text maxFontSizeMultiplier={2} style={styles.detailsHeaderTextBox}>
										{recipeDetails.recipe.name}
										<Text
											maxFontSizeMultiplier={2}
											style={[styles.detailsChefTextBox, { color: chefNameTextColor }]}
											onPress={() => {
												setChefNameTextColor("#50505055");
												navigateToChefDetails(recipeDetails.recipe.chef_id);
												setTimeout(() => {
													setChefNameTextColor("#505050");
												}, 300);
											}}
										>
											&nbsp;by&nbsp;{recipeDetails.chef_username}
										</Text>
									</Text>
								</View>
							</View>
						</View>
						<View style={styles.detailsLikesAndMakes}>
							<View style={styles.detailsLikes}>
								<View style={styles.buttonAndText}>
									{renderLikeButton()}
									<Text
										maxFontSizeMultiplier={2}
										style={styles.detailsLikesAndMakesLowerContentsAllTimings}
									>
										&nbsp;Likes:&nbsp;{recipeDetails.recipe_likes}
									</Text>
								</View>
								{recipeDetails.recipe.serves != "Any" && (
									<View style={styles.buttonAndText}>
										<Text
											maxFontSizeMultiplier={2}
											style={styles.detailsLikesAndMakesLowerContentsAllTimings}
										>
											Serves:&nbsp;{recipeDetails.recipe.serves}
										</Text>
									</View>
								)}
								{recipeDetails.recipe.difficulty != 0 && (
									<View style={styles.buttonAndText}>
										<Text
											maxFontSizeMultiplier={2}
											style={styles.detailsLikesAndMakesLowerContentsAllTimings}
										>
											Difficulty:&nbsp;{recipeDetails.recipe.difficulty}
										</Text>
									</View>
								)}
							</View>
						</View>
						{(recipeDetails.recipe.prep_time != 0 ||
							recipeDetails.recipe.cook_time != 0 ||
							recipeDetails.recipe.total_time != 0) && (
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
													// eslint-disable-next-line no-mixed-spaces-and-tabs
											  }
											: null,
									]}
								>
									{recipeDetails.recipe.prep_time > 0 && (
										<Text
											maxFontSizeMultiplier={2}
											style={
												notShowingAllTimes
													? styles.detailsLikesAndMakesLowerContentsLimitedTimings
													: styles.detailsLikesAndMakesLowerContentsAllTimings
											}
										>
											Prep Time: {getTimeStringFromMinutes(recipeDetails.recipe.prep_time)}
										</Text>
									)}
									{recipeDetails.recipe.prep_time > 0 && recipeDetails.recipe.cook_time > 0 && (
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
									{recipeDetails.recipe.cook_time > 0 && (
										<Text
											maxFontSizeMultiplier={2}
											style={
												notShowingAllTimes
													? styles.detailsLikesAndMakesLowerContentsLimitedTimings
													: styles.detailsLikesAndMakesLowerContentsAllTimings
											}
										>
											Cook Time: {getTimeStringFromMinutes(recipeDetails.recipe.cook_time)}
										</Text>
									)}
									{recipeDetails.recipe.prep_time > 0 && recipeDetails.recipe.cook_time > 0 && (
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
									{/* {!(recipeDetails.recipe.prep_time > 0 && recipeDetails.recipe.cook_time > 0)
													&& (notShowingAllTimes)
													&& (
														<Text maxFontSizeMultiplier={2} style={notShowingAllTimes ? styles.detailsLikesAndMakesLowerContentsLimitedTimings : styles.detailsLikesAndMakesLowerContentsAllTimings}> / </Text>
													)
												} */}
									{(!notShowingAllTimes ||
										(recipeDetails.recipe.prep_time == 0 &&
											recipeDetails.recipe.cook_time == 0 &&
											recipeDetails.recipe.total_time > 0)) && (
										<Text
											maxFontSizeMultiplier={2}
											style={
												notShowingAllTimes
													? styles.detailsLikesAndMakesLowerContentsLimitedTimings
													: styles.detailsLikesAndMakesLowerContentsAllTimings
											}
										>
											Total Time: {getTimeStringFromMinutes(recipeDetails.recipe.total_time)}
										</Text>
									)}
								</View>
							</View>
						)}
						{recipeDetails.recipe.description != "" &&
							recipeDetails.recipe.description != null &&
							renderDescription()}
						{recipeDetails.recipe_images?.length > 0 && (
							<View style={styles.detailsImageWrapper}>
								<FlatList
									data={recipeDetails.recipe_images}
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
												item.item.image_url ? { uri: item.item.image_url } : defaultRecipeImage
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
										// eslint-disable-next-line @typescript-eslint/no-unused-vars
										const { x, y, width, height } = event.nativeEvent.layout;
										setPrimaryImageFlatListWidth(width);
										// this.setState({ primaryImageFlatListWidth: width });
									}}
									onScroll={(e) => {
										const nearestIndex = Math.round(
											e.nativeEvent.contentOffset.x / primaryImageFlatListWidth
										);
										if (nearestIndex != primaryImageDisplayedIndex) {
											setPrimaryImageDisplayedIndex(nearestIndex);
											// this.setState({ primaryImageDisplayedIndex: nearestIndex });
										}
									}}
								/>
								<View style={styles.primaryImageBlobsContainer}>
									{recipeDetails.recipe_images.length > 1 && renderPrimaryImageBlobs()}
								</View>
							</View>
						)}
						{recipeDetails.ingredient_uses?.length > 0 && (
							<View style={styles.detailsIngredients}>
								<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>
									Ingredients:
								</Text>
								{renderRecipeIngredients()}
							</View>
						)}
						{recipeDetails.instructions?.length > 0 && (
							<View style={styles.detailsContainer}>
								<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>
									Instructions:
								</Text>
								{renderRecipeInstructions()}
							</View>
						)}
						{recipeDetails.recipe.cuisine != "Any" ? renderCuisine() : null}
						{renderFilterCategories()}
						{recipeDetails.recipe.acknowledgement != "" &&
							recipeDetails.recipe.acknowledgement != null &&
							renderAcknowledgement()}
						<View style={styles.detailsMakePicsContainer}>
							<View style={{ flexDirection: "row" }}>
								<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>
									Images from other users:
								</Text>
								<TouchableOpacity onPress={newMakePic} accessibilityLabel="add your own image">
									<Icon name="image-plus" size={responsiveHeight(3.5)} style={styles.addIcon} />
								</TouchableOpacity>
							</View>
							{recipeDetails.make_pics.length === 0 && (
								<Text maxFontSizeMultiplier={2} style={styles.detailsContents}>
									No other images yet. Be the first!
								</Text>
							)}
							{recipeDetails.make_pics.length !== 0 && renderMakePicScrollView()}
						</View>
						<View
							style={styles.detailsComments}
							onLayout={(event) => {
								setCommentsTopY(event.nativeEvent.layout.y);
								// this.setState({ commentsTopY: event.nativeEvent.layout.y })}
							}}
						>
							<View style={{ flexDirection: "row" }}>
								<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>
									Comments:
								</Text>
								<TouchableOpacity
									onPress={
										commenting ? (commentText === "" ? cancelComment : saveComment) : newComment
									}
									accessibilityLabel={
										commenting
											? commentText === ""
												? "cancel commenting"
												: "save comment"
											: "new comment"
									}
								>
									<Icon
										name={
											commenting
												? commentText === ""
													? "comment-remove"
													: "comment-check"
												: "comment-plus"
										}
										size={responsiveHeight(3.5)}
										style={styles.addIcon}
									/>
								</TouchableOpacity>
							</View>
							{commenting ? (
								<RecipeNewComment
									// scrollToLocation={this.scrollToLocation}
									{...loggedInChef}
									commentText={commentText}
									handleCommentTextInput={handleCommentTextInput}
								/>
							) : null}
							{renderRecipeComments()}
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</SpinachAppContainer>
		);
	} else {
		return (
			<SpinachAppContainer awaitingServer={awaitingServer} scrollingEnabled={false}>
				{}
			</SpinachAppContainer>
		);
	}
};

export default RecipeDetails;
