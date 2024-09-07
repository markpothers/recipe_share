import { Filters, InstructionImage } from "../centralTypes";
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useRef } from "react";
import { doubleTimes, times } from "../constants/times";
import { getMinutesFromTimeString, getTimeStringFromMinutes } from "../auxFunctions/getTimeStringFromMinutes";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import { AlertPopup } from "../components/alertPopup/alertPopup";
import { DragSortableView } from "react-native-drag-sort/lib";
import DualOSPicker from "../components/dualOSPicker/DualOSPicker";
import FilterMenu from "../components/filterMenu/filterMenu";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IngredientAutoComplete from "./ingredientAutoComplete";
import { InstructionRow } from "./components/instructionRow";
import MultiPicSourceChooser from "../components/picSourceChooser/multiPicSourceChooser";
import NetInfo from "@react-native-community/netinfo";
import { NewRecipeProps } from "../navigation";
import OfflineMessage from "../offlineMessage/offlineMessage";
import PicSourceChooser from "../components/picSourceChooser/picSourceChooser";
import SpinachAppContainer from "../components/spinachAppContainer/SpinachAppContainer";
import SwitchSized from "../components/switchSized/switchSized";
import { TextPopUp } from "../components/textPopUp/textPopUp";
import { centralStyles } from "../centralStyleSheet"; //eslint-disable-line no-unused-vars
import { clearedFilters } from "../constants/clearedFilters";
import { cuisines } from "../constants/cuisines";
import { difficulties } from "../constants/difficulties";
import helpTexts from "../constants/helpTexts";
import { serves } from "../constants/serves";
import { styles } from "./newRecipeStyleSheet";
import { useNewRecipeModel } from "./hooks/useNewRecipeModel";

NetInfo.configure({ reachabilityShortTimeout: 5 }); //5ms

type OwnProps = {
	navigation: string;
	route: string;
};

const NewRecipe = (props: OwnProps & NewRecipeProps) => {
	const nextInstructionInput = useRef(null);
	const nextIngredientInput = useRef(null);
	const {
		loggedInChef,
		renderOfflineMessage,
		setRenderOfflineMessage,
		alertPopupShowing,
		setAlertPopupShowing,
		helpShowing,
		setHelpShowing,
		helpText,
		setHelpText,
		ingredientsList,
		autoCompleteFocused,
		setAutoCompleteFocused,
		choosingPrimaryPicture,
		choosingInstructionPicture,
		instructionImageIndex,
		filterDisplayed,
		awaitingServer,
		scrollingEnabled,
		errors,
		offlineDiagnostics,
		newRecipeDetails,
		instructionHeights,
		averageInstructionHeight,
		activateScrollView,
		deactivateScrollView,
		askToReset,
		choosePrimaryPicture,
		primarySourceChosen,
		autocompleteIsFocused,
		savePrimaryImages,
		updateIngredientEntry,
		handleIngredientSort,
		addNewIngredient,
		removeIngredient,
		handleInput,
		clearNewRecipeDetails,
		clearEditRecipeDetails,
		handleCategoriesButton,
		handleInstructionChange,
		handleInstructionSizeChange,
		handleInstructionsSort,
		addNewInstruction,
		removeInstruction,
		chooseInstructionPicture,
		instructionSourceChosen,
		saveInstructionImage,
		cancelChooseInstructionImage,
		toggleFilterCategory,
		clearFilterSettings,
		submitRecipe,
		startInstructionSpeechRecognition,
		recordingInstructionIndex,
		startAboutSpeechRecognition,
		isRecordingAbout,
		startAcknowledgementSpeechRecognition,
		isRecordingAcknowledgement,
	} = useNewRecipeModel(props.navigation, props.route, nextInstructionInput, nextIngredientInput);

	const renderAlertPopup = () => {
		const isEditing = props.route.params?.recipe_details !== undefined;
		return (
			<AlertPopup
				close={() => setAlertPopupShowing(false)}
				title={
					isEditing
						? "Are you sure you want to clear your changes and revert to the original recipe"
						: "Are you sure you want to clear this form and start a new recipe?"
				}
				onYes={isEditing ? () => clearEditRecipeDetails(false) : () => clearNewRecipeDetails()}
			/>
		);
	};

	const renderPrimaryPictureChooser = () => {
		Keyboard.dismiss();
		return (
			<MultiPicSourceChooser
				saveImages={savePrimaryImages}
				sourceChosen={primarySourceChosen}
				key={"primary-pic-chooser"}
				imageSources={newRecipeDetails.primaryImages}
			/>
		);
	};

	const renderInstructionPictureChooser = () => {
		Keyboard.dismiss();
		const imageSource =
			typeof newRecipeDetails.instructionImages[instructionImageIndex] === "object"
				? (newRecipeDetails.instructionImages[instructionImageIndex] as InstructionImage).image_url
				: (newRecipeDetails.instructionImages[instructionImageIndex] as string);
		return (
			<PicSourceChooser
				saveImage={saveInstructionImage}
				index={instructionImageIndex}
				sourceChosen={instructionSourceChosen}
				key={"instruction-pic-chooser"}
				imageSource={imageSource}
				cancelChooseImage={cancelChooseInstructionImage}
			/>
		);
	};

	const renderErrors = () => {
		if (typeof errors == "string") {
			return (
				<View style={centralStyles.formErrorView}>
					<Text testID={"invalidErrorMessage"} maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>
						{errors}
					</Text>
				</View>
			);
		} else {
			return errors.map((errorMessage) => (
				<View style={centralStyles.formErrorView} key={errorMessage}>
					<Text testID={"invalidErrorMessage"} maxFontSizeMultiplier={2} style={centralStyles.formErrorText}>
						{errorMessage}
					</Text>
				</View>
			));
		}
	};

	const renderHelp = () => {
		return (
			<TextPopUp close={() => setHelpShowing(false)} title={`Help - ${helpText.title}`} text={helpText.text} />
		);
	};

	return (
		<SpinachAppContainer awaitingServer={awaitingServer} scrollingEnabled={false}>
			{renderOfflineMessage && (
				<OfflineMessage
					message={`Sorry, can't save your recipe right now.${"\n"}You appear to be offline.${"\n"}Don't worry though, new recipes are saved until you can reconnect and try again.`}
					topOffset={"10%"}
					clearOfflineMessage={() => setRenderOfflineMessage(false)}
					diagnostics={loggedInChef.is_admin ? offlineDiagnostics : null}
				/>
			)}
			{filterDisplayed && (
				<FilterMenu
					handleCategoriesButton={handleCategoriesButton}
					newRecipe
					switchNewRecipeFilterValue={toggleFilterCategory}
					setNewRecipeServes={handleInput}
					setNewRecipeCuisine={handleInput}
					confirmButtonText={"Save"}
					title={"Select categories for your recipe"}
					cuisineOptions={cuisines}
					selectedCuisine={newRecipeDetails.cuisine}
					servesOptions={serves}
					selectedServes={newRecipeDetails.serves}
					filterOptions={Object.keys(clearedFilters) as Filters[]}
					filterSettings={newRecipeDetails.filter_settings}
					clearFilterSettings={clearFilterSettings}
				/>
			)}
			{choosingPrimaryPicture && renderPrimaryPictureChooser()}
			{choosingInstructionPicture && renderInstructionPictureChooser()}
			{alertPopupShowing && renderAlertPopup()}
			{helpShowing && renderHelp()}
			<KeyboardAvoidingView
				style={centralStyles.fullPageKeyboardAvoidingView}
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				behavior={Platform.OS === "ios" ? "padding" : ""}
				keyboardVerticalOffset={Platform.OS === "ios" ? responsiveHeight(9) + 12 : 0}
			>
				<ScrollView
					style={centralStyles.fullPageScrollView}
					nestedScrollEnabled={true}
					scrollEnabled={scrollingEnabled}
					keyboardShouldPersistTaps={"always"}
				>
					<TouchableOpacity
						style={[
							centralStyles.formContainer,
							{ width: responsiveWidth(100), marginLeft: 0, marginRight: 0 },
						]}
						onPress={Keyboard.dismiss}
						activeOpacity={1}
					>
						{/* recipe name */}
						<View style={centralStyles.formSection}>
							<View
								style={[
									centralStyles.formInputContainer,
									{ justifyContent: "center", marginTop: responsiveHeight(1) },
								]}
							>
								<View style={[styles.timeAndDifficultyTitleItem, styles.sectionTitle]}>
									<Text
										maxFontSizeMultiplier={1.7}
										style={[styles.timeAndDifficultyTitle, { fontWeight: "bold" }]}
									>
										Recipe Name
									</Text>
								</View>
								<TouchableOpacity
									style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
									activeOpacity={0.7}
									onPress={() => {
										setHelpShowing(true);
										setHelpText(helpTexts.recipeName);
									}}
									accessibilityLabel={"recipe name help"}
								>
									<Icon
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(3)}
										name="help"
									></Icon>
								</TouchableOpacity>
							</View>
							<View style={centralStyles.formInputContainer}>
								<View style={centralStyles.formInputWhiteBackground}>
									<TextInput
										multiline={true}
										maxFontSizeMultiplier={2}
										style={centralStyles.formInput}
										value={newRecipeDetails.name}
										placeholder="Recipe name"
										onChangeText={(t) => handleInput(t, "name")}
									/>
								</View>
							</View>
						</View>
						{/* separator */}
						<View style={centralStyles.formSectionSeparatorContainer}>
							<View style={centralStyles.formSectionSeparator}></View>
						</View>
						{/* description */}
						<View style={[centralStyles.formInputContainer, { justifyContent: "center" }]}>
							<View style={[styles.timeAndDifficultyTitleItem, styles.sectionTitle]}>
								<Text
									maxFontSizeMultiplier={1.7}
									style={[styles.timeAndDifficultyTitle, { fontWeight: "bold" }]}
								>
									About
								</Text>
							</View>
							<TouchableOpacity
								style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
								activeOpacity={0.7}
								onPress={() => {
									setHelpShowing(true);
									setHelpText(helpTexts.about);
								}}
								accessibilityLabel={"about help"}
							>
								<Icon
									style={centralStyles.greenButtonIcon}
									size={responsiveHeight(3)}
									name="help"
								></Icon>
							</TouchableOpacity>
						</View>
						<View style={centralStyles.formSection}>
							<View style={centralStyles.formInputContainer}>
								<View style={[centralStyles.formInputWhiteBackground, { width: "90%" }]}>
									<TextInput
										multiline={true}
										numberOfLines={3}
										maxFontSizeMultiplier={2}
										style={[centralStyles.formInput, { padding: responsiveHeight(0.5) }]}
										value={newRecipeDetails.description}
										placeholder="Tell us about this recipe (optional; if you leave this section blank, it won't be displayed)"
										onChangeText={(t) => handleInput(t, "description")}
									/>
								</View>
								<TouchableOpacity
									style={[
										styles.deleteInstructionContainer,
										{ width: "9%", backgroundColor: isRecordingAbout ? "#505050" : "white" },
									]}
									onPress={startAboutSpeechRecognition}
									activeOpacity={0.7}
								>
									<Icon
										name="microphone"
										size={responsiveHeight(3.5)}
										style={[
											styles.ingredientTrashCan,
											{ color: isRecordingAbout ? "white" : "#505050" },
										]}
									/>
								</TouchableOpacity>
							</View>
						</View>
						{/* separator */}
						<View style={centralStyles.formSectionSeparatorContainer}>
							<View style={centralStyles.formSectionSeparator}></View>
						</View>
						{/* main pictures*/}
						<View style={centralStyles.formSection}>
							<View style={[centralStyles.formInputContainer, { justifyContent: "center" }]}>
								<TouchableOpacity
									style={[centralStyles.yellowRectangleButton, styles.addButton]}
									activeOpacity={0.7}
									onPress={choosePrimaryPicture}
								>
									<Icon
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(4)}
										name="camera"
									></Icon>
									<Text
										maxFontSizeMultiplier={2}
										style={[
											centralStyles.greenButtonText,
											{
												marginLeft: responsiveWidth(3),
												fontSize: responsiveFontSize(2.3),
											},
										]}
									>
										Cover Pictures
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
									activeOpacity={0.7}
									onPress={() => {
										setHelpShowing(true);
										setHelpText(helpTexts.coverPictures);
									}}
									accessibilityLabel={"cover pictures help"}
								>
									<Icon
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(3)}
										name="help"
									></Icon>
								</TouchableOpacity>
							</View>
						</View>
						{/* separator */}
						<View style={centralStyles.formSectionSeparatorContainer}>
							<View style={centralStyles.formSectionSeparator}></View>
						</View>
						{/* times */}
						<View style={centralStyles.formSection}>
							<View style={[centralStyles.formInputContainer, { justifyContent: "center" }]}>
								<View style={[styles.timeAndDifficultyTitleItem, styles.sectionTitle]}>
									<Text
										maxFontSizeMultiplier={1.7}
										style={[styles.timeAndDifficultyTitle, { fontWeight: "bold" }]}
									>
										Approximate Timings
									</Text>
								</View>
								<TouchableOpacity
									style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
									activeOpacity={0.7}
									onPress={() => {
										setHelpShowing(true);
										setHelpText(helpTexts.timings);
									}}
									accessibilityLabel={"timings help"}
								>
									<Icon
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(3)}
										name="help"
									></Icon>
								</TouchableOpacity>
							</View>
							<View style={centralStyles.formInputContainer}>
								<View style={styles.timeAndDifficultyTitleItem}>
									<Text maxFontSizeMultiplier={1.7} style={styles.timeAndDifficultyTitle}>
										Prep Time (optional):
									</Text>
								</View>
								<View style={styles.timeAndDifficulty}>
									<DualOSPicker
										onChoiceChange={(choice) => {
											const newTimes = {
												prepTime: getMinutesFromTimeString(choice),
												cookTime: newRecipeDetails.times?.cookTime ?? 0,
												totalTime:
													getMinutesFromTimeString(choice) +
													(newRecipeDetails.times?.cookTime ?? 0),
											};
											handleInput(newTimes, "times");
										}}
										options={times}
										selectedChoice={getTimeStringFromMinutes(newRecipeDetails.times?.prepTime)}
										testID={"prepTime"}
										accessibilityLabel={"prep time picker"}
									/>
								</View>
							</View>
							<View style={centralStyles.formInputContainer}>
								<View style={styles.timeAndDifficultyTitleItem}>
									<Text maxFontSizeMultiplier={1.7} style={styles.timeAndDifficultyTitle}>
										Cook Time (optional):
									</Text>
								</View>
								<View style={styles.timeAndDifficulty}>
									<DualOSPicker
										onChoiceChange={(choice) => {
											const newTimes = {
												prepTime: newRecipeDetails.times?.prepTime ?? 0,
												cookTime: getMinutesFromTimeString(choice),
												totalTime:
													getMinutesFromTimeString(choice) +
													(newRecipeDetails.times?.prepTime ?? 0),
											};
											handleInput(newTimes, "times");
										}}
										options={times}
										selectedChoice={getTimeStringFromMinutes(newRecipeDetails.times?.cookTime)}
										testID={"cookTime"}
										accessibilityLabel={"cook time picker"}
									/>
								</View>
							</View>
							<View style={centralStyles.formInputContainer}>
								<View style={styles.timeAndDifficultyTitleItem}>
									<Text maxFontSizeMultiplier={1.7} style={styles.timeAndDifficultyTitle}>
										Total Time:
									</Text>
								</View>
								<View style={styles.timeAndDifficulty}>
									<DualOSPicker
										onChoiceChange={(choice) => {
											const newTimes = {
												prepTime: newRecipeDetails.times?.prepTime ?? 0,
												cookTime: newRecipeDetails.times?.cookTime ?? 0,
												totalTime: getMinutesFromTimeString(choice),
											};
											handleInput(newTimes, "times");
										}}
										options={[...times, ...doubleTimes]}
										selectedChoice={getTimeStringFromMinutes(newRecipeDetails.times?.totalTime)}
										testID={"totalTime"}
										accessibilityLabel={"total time picker"}
									/>
								</View>
							</View>
						</View>
						{/* separator */}
						<View style={centralStyles.formSectionSeparatorContainer}>
							<View style={centralStyles.formSectionSeparator}></View>
						</View>
						{/* difficulty */}
						<View style={centralStyles.formSection}>
							<View style={[centralStyles.formInputContainer, { justifyContent: "center" }]}>
								<View style={[styles.timeAndDifficultyTitleItem, styles.sectionTitle]}>
									<Text
										maxFontSizeMultiplier={1.7}
										style={[styles.timeAndDifficultyTitle, { fontWeight: "bold" }]}
									>
										Difficulty
									</Text>
								</View>
								<TouchableOpacity
									style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
									activeOpacity={0.7}
									onPress={() => {
										setHelpShowing(true);
										setHelpText(helpTexts.difficulty);
									}}
									accessibilityLabel={"difficulty help"}
								>
									<Icon
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(3)}
										name="help"
									></Icon>
								</TouchableOpacity>
							</View>
							<View style={centralStyles.formInputContainer}>
								<View style={styles.timeAndDifficultyTitleItem}>
									<Text maxFontSizeMultiplier={1.7} style={styles.timeAndDifficultyTitle}>
										Difficulty:
									</Text>
								</View>
								<View style={styles.timeAndDifficulty}>
									<DualOSPicker
										onChoiceChange={(choice) => handleInput(choice, "difficulty")}
										options={difficulties}
										selectedChoice={newRecipeDetails.difficulty}
										testID={"difficulty"}
										accessibilityLabel={"difficulty picker"}
									/>
								</View>
							</View>
						</View>
						{/* separator */}
						<View style={centralStyles.formSectionSeparatorContainer}>
							<View style={centralStyles.formSectionSeparator}></View>
						</View>
						{/* filter categories*/}
						<View style={centralStyles.formSection}>
							<View style={[centralStyles.formInputContainer, { justifyContent: "center" }]}>
								<TouchableOpacity
									style={[centralStyles.yellowRectangleButton, styles.addButton]}
									activeOpacity={0.7}
									onPress={handleCategoriesButton}
								>
									<Icon
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(4)}
										name="filter"
									></Icon>
									<Text
										maxFontSizeMultiplier={2}
										style={[
											centralStyles.greenButtonText,
											{
												marginLeft: responsiveWidth(3),
												fontSize: responsiveFontSize(2.3),
											},
										]}
									>
										Filter categories
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
									activeOpacity={0.7}
									onPress={() => {
										setHelpShowing(true);
										setHelpText(helpTexts.filterCategories);
									}}
									accessibilityLabel={"filter categories help"}
								>
									<Icon
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(3)}
										name="help"
									></Icon>
								</TouchableOpacity>
							</View>
						</View>
						{/* separator */}
						<View style={centralStyles.formSectionSeparatorContainer}>
							<View style={centralStyles.formSectionSeparator}></View>
						</View>
						{/* acknowledgement */}
						<View style={centralStyles.formSection}>
							<View style={[centralStyles.formInputContainer, { justifyContent: "center" }]}>
								<View style={[styles.timeAndDifficultyTitleItem, styles.sectionTitle]}>
									<Text
										maxFontSizeMultiplier={1.7}
										style={[styles.timeAndDifficultyTitle, { fontWeight: "bold" }]}
									>
										Acknowledgement
									</Text>
								</View>
								<TouchableOpacity
									style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
									activeOpacity={0.7}
									onPress={() => {
										setHelpShowing(true);
										setHelpText(helpTexts.acknowledgement);
									}}
									accessibilityLabel={"acknowledgement help"}
								>
									<Icon
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(3)}
										name="help"
									></Icon>
								</TouchableOpacity>
							</View>
							<View style={centralStyles.formInputContainer}>
								<View style={[centralStyles.formInputWhiteBackground, { width: "90%" }]}>
									<TextInput
										maxFontSizeMultiplier={2}
										style={centralStyles.formInput}
										value={newRecipeDetails.acknowledgement}
										placeholder={`Acknowledge your recipe's source${
											newRecipeDetails.showBlogPreview ? "" : " (optional)"
										}`}
										onChangeText={(t) => handleInput(t, "acknowledgement")}
									/>
								</View>
								<TouchableOpacity
									style={[
										styles.deleteInstructionContainer,
										{
											width: "9%",
											backgroundColor: isRecordingAcknowledgement ? "#505050" : "white",
										},
									]}
									onPress={() => startAcknowledgementSpeechRecognition()}
									activeOpacity={0.7}
								>
									<Icon
										name="microphone"
										size={responsiveHeight(3.5)}
										style={[
											styles.ingredientTrashCan,
											{ color: isRecordingAcknowledgement ? "white" : "#505050" },
										]}
									/>
								</TouchableOpacity>
							</View>
						</View>
						{/* acknowledgement link */}
						<View style={centralStyles.formSection}>
							<View style={centralStyles.formInputContainer}>
								<View style={centralStyles.formInputWhiteBackground}>
									<TextInput
										maxFontSizeMultiplier={2}
										style={centralStyles.formInput}
										value={newRecipeDetails.acknowledgementLink}
										placeholder={`Link to the original book or blog${
											newRecipeDetails.showBlogPreview ? "" : " (optional)"
										}`}
										onChangeText={(t) => handleInput(t, "acknowledgementLink")}
										autoCapitalize={"none"}
									/>
								</View>
							</View>
						</View>
						{/* separator */}
						<View style={centralStyles.formSectionSeparatorContainer}>
							<View style={centralStyles.formSectionSeparator}></View>
						</View>
						{/* display toggle */}
						<View style={centralStyles.formSection}>
							<View style={[centralStyles.formInputContainer, { justifyContent: "center" }]}>
								<View style={[styles.timeAndDifficultyTitleItem, styles.sectionTitle]}>
									<Text
										maxFontSizeMultiplier={1.7}
										style={[styles.timeAndDifficultyTitle, { fontWeight: "bold" }]}
									>
										Display as...
									</Text>
								</View>
								<TouchableOpacity
									style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
									activeOpacity={0.7}
									onPress={() => {
										setHelpShowing(true);
										setHelpText(helpTexts.acknowledgementLink);
									}}
									accessibilityLabel={"display as help"}
								>
									<Icon
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(3)}
										name="help"
									></Icon>
								</TouchableOpacity>
							</View>
							<View style={centralStyles.formInputContainer}>
								<View style={[styles.timeAndDifficultyTitleItem, { width: responsiveWidth(39) }]}>
									<Text
										maxFontSizeMultiplier={1.7}
										style={[
											styles.timeAndDifficultyTitle,
											{
												textAlign: "center",
												fontWeight: "bold",
												paddingVertical: responsiveHeight(0.5),
											},
										]}
									>
										Full recipe
									</Text>
								</View>
								<View style={styles.switchContainer}>
									<SwitchSized
										value={newRecipeDetails.showBlogPreview}
										onValueChange={(value) => handleInput(value, "showBlogPreview")}
										trackColor={{ true: "#5c8a5199", false: "#5c8a5199" }}
										thumbColor={"#4b7142"}
										// testID={"showBlogPreviewSwitch"}
										accessibilityLabel={"show blog switch"}
									/>
								</View>
								<View style={[styles.timeAndDifficultyTitleItem, { width: responsiveWidth(39) }]}>
									<Text
										maxFontSizeMultiplier={1.7}
										style={[
											styles.timeAndDifficultyTitle,
											{
												textAlign: "center",
												fontWeight: "bold",
												paddingVertical: responsiveHeight(0.5),
											},
										]}
									>
										Blog view
									</Text>
								</View>
							</View>
						</View>

						{!newRecipeDetails.showBlogPreview && (
							<>
								{/* separator */}
								<View style={centralStyles.formSectionSeparatorContainer}>
									<View style={centralStyles.formSectionSeparator}></View>
								</View>
								{/* ingredients */}
								<View style={[centralStyles.formInputContainer, { justifyContent: "center" }]}>
									<View style={[styles.timeAndDifficultyTitleItem, styles.sectionTitle]}>
										<Text
											maxFontSizeMultiplier={1.7}
											style={[styles.timeAndDifficultyTitle, { fontWeight: "bold" }]}
										>
											Ingredients
										</Text>
									</View>
									<TouchableOpacity
										style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
										activeOpacity={0.7}
										onPress={() => {
											setHelpShowing(true);
											setHelpText(helpTexts.ingredients);
										}}
										accessibilityLabel={"ingredients help"}
									>
										<Icon
											style={centralStyles.greenButtonIcon}
											size={responsiveHeight(3)}
											name="help"
										></Icon>
									</TouchableOpacity>
								</View>
								<View
									style={[
										centralStyles.formSection,
										autoCompleteFocused !== null && { zIndex: 1 },
										{
											// paddingBottom:
											// newRecipeDetails.ingredients.length > 0 ? responsiveHeight(11) : 0,
											// borderWidth: 1,
											// borderColor: "yellow",
										},
									]}
								>
									<DragSortableView
										// padding gives room for the bottom autocomplete dropdown to be fully responsive
										containerStyle={{
											height:
												newRecipeDetails.ingredients.length > 0
													? newRecipeDetails.ingredients.length * responsiveHeight(13) +
													  responsiveHeight(17) +
													  responsiveHeight(0.5)
													: 0,
										}}
										dataSource={newRecipeDetails.ingredients}
										parentWidth={responsiveWidth(100)}
										childrenWidth={responsiveWidth(100)}
										childrenHeight={responsiveHeight(12.5)}
										reverseChildZIndexing={true}
										marginChildrenTop={responsiveHeight(0.5)}
										onDataChange={(newIngredients) => handleIngredientSort(newIngredients)}
										onClickItem={() => {
											if (autoCompleteFocused !== null) {
												setAutoCompleteFocused(null);
											}
											// Keyboard.dismiss()
										}}
										onDragStart={() => {
											deactivateScrollView();
											Keyboard.dismiss();
										}}
										onDragEnd={activateScrollView}
										delayLongPress={200}
										keyExtractor={(item, index) => `${index}`}
										renderItem={(item, index) => {
											return (
												<IngredientAutoComplete
													removeIngredient={removeIngredient}
													// key={index}
													ingredientIndex={index}
													ingredient={item}
													ingredientsList={ingredientsList}
													focused={autoCompleteFocused}
													index={index}
													ingredientsLength={newRecipeDetails.ingredients.length}
													thisAutocompleteIsFocused={autocompleteIsFocused}
													updateIngredientEntry={updateIngredientEntry}
													setNextIngredientInput={(element) => {
														nextIngredientInput.current = element;
													}}
													inputToFocus={index === newRecipeDetails.ingredients.length - 1}
												/>
											);
										}}
									/>
									{/*negative margin to bring the button into line under the padding added to the dragSortableScrollView */}
								</View>
								<View
									style={[
										styles.plusButtonContainer,
										{
											marginTop:
												newRecipeDetails.ingredients.length > 0
													? -responsiveHeight(17)
													: responsiveHeight(0.5),
											// borderWidth: 1,
											// borderColor: "orange",
											// zIndex: 'unset'
										},
									]}
								>
									<TouchableOpacity
										style={[centralStyles.yellowRectangleButton, styles.addButton]}
										activeOpacity={0.7}
										onPress={addNewIngredient}
									>
										<Icon
											style={centralStyles.greenButtonIcon}
											size={responsiveHeight(5)}
											name="plus"
										></Icon>
										<Text
											maxFontSizeMultiplier={2}
											style={[
												centralStyles.greenButtonText,
												{
													marginLeft: responsiveWidth(3),
													fontSize: responsiveFontSize(2.3),
												},
											]}
										>
											Add ingredient
										</Text>
									</TouchableOpacity>
								</View>
								{/* separator */}
								<View style={centralStyles.formSectionSeparatorContainer}>
									<View style={centralStyles.formSectionSeparator}></View>
								</View>
								{/* instructions */}
								<View style={[centralStyles.formInputContainer, { justifyContent: "center" }]}>
									<View style={[styles.timeAndDifficultyTitleItem, styles.sectionTitle]}>
										<Text
											maxFontSizeMultiplier={1.7}
											style={[styles.timeAndDifficultyTitle, { fontWeight: "bold" }]}
										>
											Instructions
										</Text>
									</View>
									<TouchableOpacity
										style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
										activeOpacity={0.7}
										onPress={() => {
											setHelpShowing(true);
											setHelpText(helpTexts.instructions);
										}}
										accessibilityLabel={"instructions help"}
									>
										<Icon
											style={centralStyles.greenButtonIcon}
											size={responsiveHeight(3)}
											name="help"
										></Icon>
									</TouchableOpacity>
								</View>
								<View style={centralStyles.formSection}>
									<DragSortableView
										dataSource={newRecipeDetails.instructions}
										parentWidth={responsiveWidth(100)}
										childrenWidth={responsiveWidth(100)}
										childrenHeight={averageInstructionHeight}
										childrenHeights={instructionHeights.map((height) => height ?? 0)}
										reverseChildZIndexing={false}
										marginChildrenTop={0}
										onDataChange={(newInstructions) => handleInstructionsSort(newInstructions)}
										onDragStart={() => {
											deactivateScrollView();
											Keyboard.dismiss();
										}}
										// onClickItem={Keyboard.dismiss()}
										onDragEnd={activateScrollView}
										delayLongPress={100}
										keyExtractor={(item, index) => `${index}`}
										renderItem={(item, index) => {
											return (
												<InstructionRow
													removeInstruction={removeInstruction}
													handleInstructionChange={handleInstructionChange}
													item={item}
													index={index}
													handleInstructionSizeChange={handleInstructionSizeChange}
													chooseInstructionPicture={chooseInstructionPicture}
													instructionImagePresent={
														newRecipeDetails.instructionImages[index] != ""
													}
													// setFocusedInstructionInput={setFocusedInstructionInput}
													setNextInstructionInput={(element) => {
														nextInstructionInput.current = element;
													}}
													inputToFocus={index === newRecipeDetails.instructions.length - 1}
													onInstructionMicrophonePress={startInstructionSpeechRecognition}
													isRecording={recordingInstructionIndex === index}
												/>
											);
										}}
									/>
								</View>
								<View style={styles.plusButtonContainer}>
									<TouchableOpacity
										style={[centralStyles.yellowRectangleButton, styles.addButton]}
										activeOpacity={0.7}
										onPress={addNewInstruction}
									>
										<Icon
											style={centralStyles.greenButtonIcon}
											size={responsiveHeight(5)}
											name="plus"
										></Icon>
										<Text
											maxFontSizeMultiplier={2}
											style={[
												centralStyles.greenButtonText,
												{
													marginLeft: responsiveWidth(3),
													fontSize: responsiveFontSize(2.3),
												},
											]}
										>
											Add instruction
										</Text>
									</TouchableOpacity>
								</View>
							</>
						)}
						{/* separator */}
						<View style={centralStyles.formSectionSeparatorContainer}>
							<View style={centralStyles.formSectionSeparator}></View>
						</View>
						{/* errors */}
						{errors.length > 0 && renderErrors()}
						{/* submit */}
						<View style={[centralStyles.formSection, { width: responsiveWidth(80) }]}>
							<View style={centralStyles.formInputContainer}>
								<TouchableOpacity
									style={centralStyles.yellowRectangleButton}
									activeOpacity={0.7}
									onPress={askToReset}
									disabled={awaitingServer}
								>
									<Icon
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(4)}
										name="alert-circle-outline"
									></Icon>
									<Text
										maxFontSizeMultiplier={2}
										style={[centralStyles.greenButtonText, { fontSize: responsiveFontSize(2.2) }]}
									>
										{props.route.params?.recipe_details !== undefined ? "Reset" : "Clear"}
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={centralStyles.yellowRectangleButton}
									activeOpacity={0.7}
									onPress={submitRecipe}
									disabled={awaitingServer}
								>
									<Icon
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(4)}
										name="login"
									></Icon>
									<Text
										maxFontSizeMultiplier={2}
										style={[centralStyles.greenButtonText, { fontSize: responsiveFontSize(2.2) }]}
									>
										Submit
									</Text>
								</TouchableOpacity>
							</View>
						</View>
						{/* separator */}
						<View style={[centralStyles.formSectionSeparatorContainer, { marginBottom: 0 }]}></View>
					</TouchableOpacity>
				</ScrollView>
			</KeyboardAvoidingView>
		</SpinachAppContainer>
	);
};

export default NewRecipe;
