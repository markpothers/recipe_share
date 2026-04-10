import {
	DualOSPicker,
	FilterMenu,
	MultiPicSourceChooser,
	OfflineMessage,
	PicSourceChooser,
	SpinachAppContainer,
	SwitchSized,
	TextPopup,
} from "../components";
import { Filters, Ingredient, RecipeIngredient, RecipeInstruction } from "../centralTypes";
import {
	FlatList,
	Keyboard,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useRef } from "react";
import { doubleTimes, times } from "../constants/times";
import { getMinutesFromTimeString, getTimeStringFromMinutes } from "../auxFunctions/getTimeStringFromMinutes";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import { AlertPopup } from "../components";
import DraggableFlatList from "react-native-draggable-flatlist";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IngredientAutoComplete from "./ingredientAutoComplete";
import { IngredientAutocompleteBar } from "./IngredientAutocompleteBar";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { InstructionRow } from "./components/instructionRow";
import NetInfo from "@react-native-community/netinfo";
import { NewRecipeProps } from "../navigation";
import { centralStyles } from "../centralStyleSheet"; //eslint-disable-line no-unused-vars
import { clearedFilters } from "../constants/clearedFilters";
import { cuisines } from "../constants/cuisines";
import { difficulties } from "../constants/difficulties";
import helpTexts from "../constants/helpTexts";
import { serves } from "../constants/serves";
import { styles } from "./newRecipeStyleSheet";
import { useNewRecipeModel } from "./hooks/useNewRecipeModel";

// Type assertion for Icon component to fix TypeScript issues
const IconComponent = Icon as React.ComponentType<{
	name: string;
	size: number;
	style?: object;
	color?: string;
}>;

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
		// setAutoCompleteFocused, // unused in current implementation
		choosingPrimaryPicture,
		choosingInstructionPicture,
		filterDisplayed,
		awaitingServer,
		scrollingEnabled,
		errors,
		offlineDiagnostics,
		newRecipeDetails,
		// instructionHeights, // unused in current implementation
		// averageInstructionHeight, // unused in current implementation
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
	const [ingredientAutocompleteVisible, setIngredientAutocompleteVisible] = React.useState(false);
	const [ingredientAutocompleteId, setIngredientAutocompleteId] = React.useState<string | null>(null);
	const [ingredientAutocompleteValue, setIngredientAutocompleteValue] = React.useState("");
	const [keyboardHeight, setKeyboardHeight] = React.useState(0);

	React.useEffect(() => {
		// Use correct type for keyboard event
		const onKeyboardDidShow = (e: { endCoordinates?: { height: number } }) => {
			setKeyboardHeight(e.endCoordinates ? e.endCoordinates.height : 0);
		};
		const onKeyboardDidHide = () => {
			setKeyboardHeight(0);
		};
		const showSub = Keyboard.addListener("keyboardDidShow", onKeyboardDidShow);
		const hideSub = Keyboard.addListener("keyboardDidHide", onKeyboardDidHide);
		return () => {
			showSub.remove();
			hideSub.remove();
		};
	}, []);

	// Handler for IngredientAutoComplete focus
	const handleIngredientNameFocus = (ingredientId: string, currentName: string) => {
		setIngredientAutocompleteId(ingredientId);
		setIngredientAutocompleteValue(currentName);
		setIngredientAutocompleteVisible(true);
	};

	// Handler for IngredientAutoComplete blur
	const handleIngredientNameBlur = () => {
		setIngredientAutocompleteVisible(false);
		setIngredientAutocompleteId(null);
	};

	// Handler for selecting an autocomplete suggestion
	const handleIngredientAutocompleteSelect = (ingredient: Ingredient) => {
		if (ingredientAutocompleteId) {
			const ing = newRecipeDetails.ingredients.find((i) => i.id === ingredientAutocompleteId);
			if (ing) {
				updateIngredientEntry(ingredientAutocompleteId, ingredient.name, ing.quantity, ing.unit);
			}
		}
		setIngredientAutocompleteVisible(false);
		setIngredientAutocompleteId(null);
	};

	// Handler for closing the autocomplete bar
	const handleIngredientAutocompleteClose = () => {
		setIngredientAutocompleteVisible(false);
		setIngredientAutocompleteId(null);
	};

	// Handler for toggling autocomplete bar from icon
	const handleIngredientAutocompleteIconPress = (ingredientId: string, currentName: string) => {
		if (ingredientAutocompleteVisible && ingredientAutocompleteId === ingredientId) {
			setIngredientAutocompleteVisible(false);
			setIngredientAutocompleteId(null);
		} else {
			setIngredientAutocompleteId(ingredientId);
			setIngredientAutocompleteValue(currentName);
			setIngredientAutocompleteVisible(true);
		}
	};

	// Filter suggestions based on current input
	const ingredientSuggestions = ingredientsList
		.filter(
			(ing) =>
				ing.name.toLowerCase().startsWith(ingredientAutocompleteValue.toLowerCase()) &&
				ingredientAutocompleteValue.length > 1
		)
		.sort((a, b) => (a.name > b.name ? 1 : -1));

	// Only show autocomplete bar if more than one suggestion
	const showAutocompleteBar = ingredientAutocompleteVisible && ingredientSuggestions.length > 1;

	const renderAlertPopup = () => {
		const isEditing = props.route.params?.recipe_details !== undefined;

		const handleYes = () => {
			if (isEditing) {
				clearEditRecipeDetails(false);
			} else {
				clearNewRecipeDetails();
			}
		};

		return (
			<AlertPopup
				close={() => setAlertPopupShowing(false)}
				title={
					isEditing
						? "Are you sure you want to clear your changes and revert to the original recipe"
						: "Are you sure you want to clear this form and start a new recipe?"
				}
				onYes={handleYes}
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

	// Remove all references to instructionImageIndex and update renderInstructionPictureChooser to use the id-based approach.
	const renderInstructionPictureChooser = () => {
		Keyboard.dismiss();
		// Find the instruction being edited (e.g., the one for which choosingInstructionPicture is true)
		// For this refactor, let's assume you store the id of the instruction being edited in a variable, e.g., choosingInstructionPictureId
		// If not, you should add it to your state in useNewRecipeModel and update all logic accordingly.
		const instruction = newRecipeDetails.instructions.find((inst) => inst.id === choosingInstructionPicture);
		const imageSource =
			instruction && instruction.image
				? typeof instruction.image === "object"
					? instruction.image.image_url
					: instruction.image
				: "";
		return (
			<PicSourceChooser
				saveImage={saveInstructionImage}
				index={instruction ? instruction.id : undefined}
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
			<TextPopup close={() => setHelpShowing(false)} title={`Help - ${helpText.title}`} text={helpText.text} />
		);
	};

	// Handler for updating ingredient name and showing autocomplete
	const handleIngredientNameChange = (ingredientId: string, newName: string) => {
		setIngredientAutocompleteId(ingredientId);
		setIngredientAutocompleteValue(newName);
		setIngredientAutocompleteVisible(true);
	};

	// Abstracted renderItem for Ingredient
	const renderIngredientItem = ({
		item,
		index,
		drag,
		isActive,
	}: {
		item: RecipeIngredient;
		index: number;
		drag?: () => void;
		isActive?: boolean;
	}) => {
		// Compute suggestions for this ingredient's name
		const ingredientSuggestions = ingredientsList
			.filter((ing) => ing.name.toLowerCase().startsWith(item.name.toLowerCase()) && item.name.length > 1)
			.sort((a, b) => (a.name > b.name ? 1 : -1));
		return (
			<View
				style={{
					marginTop: responsiveHeight(0.5),
					zIndex: alertPopupShowing ? 0 : Math.min(10, newRecipeDetails.ingredients.length - index),
				}}
			>
				<IngredientAutoComplete
					removeIngredient={removeIngredient}
					ingredient={item}
					index={index}
					ingredientsLength={newRecipeDetails.ingredients.length}
					thisAutocompleteIsFocused={autocompleteIsFocused}
					updateIngredientEntry={updateIngredientEntry}
					setNextIngredientInput={(element: TextInput | null) => {
						nextIngredientInput.current = element;
					}}
					inputToFocus={index === newRecipeDetails.ingredients.length - 1}
					{...(drag && { onLongPress: drag })}
					{...(isActive !== undefined && { isActive })}
					onIngredientNameFocus={handleIngredientNameFocus}
					onIngredientNameBlur={handleIngredientNameBlur}
					onIngredientNameChange={(newName: string) => handleIngredientNameChange(item.id, newName)}
					onAutocompleteIconPress={handleIngredientAutocompleteIconPress}
					ingredientSuggestions={ingredientSuggestions}
					autocompleteOpenIngredientId={ingredientAutocompleteId}
				/>
			</View>
		);
	};

	// Update renderInstructionItem to use id-based props and pass RecipeInstruction item to InstructionRow.
	const renderInstructionItem = ({
		item,
		index,
		drag,
		isActive,
	}: {
		item: RecipeInstruction;
		index: number;
		drag?: () => void;
		isActive?: boolean;
	}) => (
		<InstructionRow
			removeInstruction={removeInstruction}
			handleInstructionChange={handleInstructionChange}
			item={item}
			index={index}
			handleInstructionSizeChange={handleInstructionSizeChange}
			chooseInstructionPicture={chooseInstructionPicture}
			instructionImagePresent={!!item.image && item.image !== ""}
			setNextInstructionInput={(element) => {
				nextInstructionInput.current = element;
			}}
			inputToFocus={index === newRecipeDetails.instructions.length - 1}
			onInstructionMicrophonePress={startInstructionSpeechRecognition}
			isRecording={recordingInstructionIndex === item.id}
			{...(drag && { onLongPress: drag })}
			{...(isActive !== undefined && { isActive })}
		/>
	);

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
			<KeyboardAwareScrollView
				style={centralStyles.fullPageScrollView}
				nestedScrollEnabled={true}
				scrollEnabled={scrollingEnabled}
				keyboardShouldPersistTaps={"always"}
				bottomOffset={16}
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
									<IconComponent
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(3)}
										name="help"
									></IconComponent>
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
										placeholderTextColor="#888"
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
								<IconComponent
									style={centralStyles.greenButtonIcon}
									size={responsiveHeight(3)}
									name="help"
								></IconComponent>
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
										placeholderTextColor="#888"
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
									<IconComponent
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
									<IconComponent
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(4)}
										name="camera"
									></IconComponent>
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
									<IconComponent
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(3)}
										name="help"
									></IconComponent>
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
									<IconComponent
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(3)}
										name="help"
									></IconComponent>
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
									<IconComponent
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(3)}
										name="help"
									></IconComponent>
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
									<IconComponent
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(4)}
										name="filter"
									></IconComponent>
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
									<IconComponent
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(3)}
										name="help"
									></IconComponent>
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
									<IconComponent
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(3)}
										name="help"
									></IconComponent>
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
										placeholderTextColor="#888"
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
									<IconComponent
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
										placeholderTextColor="#888"
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
									<IconComponent
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(3)}
										name="help"
									></IconComponent>
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
										<IconComponent
											style={centralStyles.greenButtonIcon}
											size={responsiveHeight(3)}
											name="help"
										></IconComponent>
									</TouchableOpacity>
								</View>
								<View
									style={[
										centralStyles.formSection,
										// autoCompleteFocused !== null && { zIndex: 1 },
										{
											// paddingBottom:
											// newRecipeDetails.ingredients.length > 0 ? responsiveHeight(11) : 0,
											// borderWidth: 5,
											// borderColor: "yellow",
											// backgroundColor: "yellow",
										},
									]}
								>
									{alertPopupShowing ? (
										<FlatList
											data={newRecipeDetails.ingredients}
											keyExtractor={(item) => item.id!}
											renderItem={({ item, index }) => renderIngredientItem({ item, index })}
											scrollEnabled={false}
											style={{
												height:
													newRecipeDetails.ingredients.length > 0
														? newRecipeDetails.ingredients.length * responsiveHeight(13) +
															responsiveHeight(0.5)
														: 0,
											}}
										/>
									) : !(
											alertPopupShowing ||
											helpShowing ||
											choosingPrimaryPicture ||
											choosingInstructionPicture ||
											filterDisplayed ||
											autoCompleteFocused !== null
									  ) ? (
										<DraggableFlatList
											data={newRecipeDetails.ingredients}
											keyExtractor={(item) => item.id!}
											onDragBegin={() => {
												deactivateScrollView();
												Keyboard.dismiss();
											}}
											onDragEnd={({ data }) => {
												handleIngredientSort(data);
												activateScrollView();
											}}
											renderItem={({ item, drag, isActive, getIndex }) => {
												const index = getIndex() ?? 0;
												return renderIngredientItem({ item, index, drag, isActive });
											}}
											// nestedScrollEnabled={true}
											scrollEnabled={false}
											style={{
												height:
													newRecipeDetails.ingredients.length > 0
														? newRecipeDetails.ingredients.length * responsiveHeight(13) +
															responsiveHeight(0.5)
														: 0,
											}}
										/>
									) : (
										<FlatList
											data={newRecipeDetails.ingredients}
											keyExtractor={(item) => item.id!}
											renderItem={({ item, index }) => renderIngredientItem({ item, index })}
											scrollEnabled={false}
											style={{
												height:
													newRecipeDetails.ingredients.length > 0
														? newRecipeDetails.ingredients.length * responsiveHeight(13) +
															responsiveHeight(0.5)
														: 0,
											}}
										/>
									)}
								</View>
								<View
									style={[
										styles.plusButtonContainer,
										{
											// marginTop:
											// 	newRecipeDetails.ingredients.length > 0
											// 		? -responsiveHeight(17)
											// 		: responsiveHeight(0.5),
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
										<IconComponent
											style={centralStyles.greenButtonIcon}
											size={responsiveHeight(5)}
											name="plus"
										></IconComponent>
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
										<IconComponent
											style={centralStyles.greenButtonIcon}
											size={responsiveHeight(3)}
											name="help"
										></IconComponent>
									</TouchableOpacity>
								</View>
								<View style={centralStyles.formSection}>
									{alertPopupShowing ? (
										<FlatList
											data={newRecipeDetails.instructions}
											keyExtractor={(item, index) => `instruction-${index}`}
											renderItem={({ item, index }) => renderInstructionItem({ item, index })}
											scrollEnabled={false}
										/>
									) : !(
											alertPopupShowing ||
											helpShowing ||
											choosingPrimaryPicture ||
											choosingInstructionPicture ||
											filterDisplayed ||
											autoCompleteFocused !== null
									  ) ? (
										<DraggableFlatList
											data={newRecipeDetails.instructions}
											keyExtractor={(item) => item.id}
											onDragBegin={() => {
												deactivateScrollView();
												Keyboard.dismiss();
											}}
											onDragEnd={({ data }) => {
												handleInstructionsSort(data);
												activateScrollView();
											}}
											renderItem={({ item, drag, isActive, getIndex }) => {
												const index = getIndex() ?? 0;
												return renderInstructionItem({ item, index, drag, isActive });
											}}
											// nestedScrollEnabled={true}
											scrollEnabled={false}
										/>
									) : (
										<FlatList
											data={newRecipeDetails.instructions}
											keyExtractor={(item, index) => `instruction-${index}`}
											renderItem={({ item, index }) => renderInstructionItem({ item, index })}
											scrollEnabled={false}
										/>
									)}
								</View>
								<View style={styles.plusButtonContainer}>
									<TouchableOpacity
										style={[centralStyles.yellowRectangleButton, styles.addButton]}
										activeOpacity={0.7}
										onPress={addNewInstruction}
									>
										<IconComponent
											style={centralStyles.greenButtonIcon}
											size={responsiveHeight(5)}
											name="plus"
										></IconComponent>
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
									<IconComponent
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(4)}
										name="alert-circle-outline"
									></IconComponent>
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
									<IconComponent
										style={centralStyles.greenButtonIcon}
										size={responsiveHeight(4)}
										name="login"
									></IconComponent>
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
			</KeyboardAwareScrollView>
			{/* Autocomplete Bar absolutely positioned above the keyboard using keyboard height */}
			{showAutocompleteBar && (
				<IngredientAutocompleteBar
					visible={showAutocompleteBar}
					suggestions={ingredientSuggestions}
					onSelect={handleIngredientAutocompleteSelect}
					onRequestClose={handleIngredientAutocompleteClose}
					keyboardHeight={keyboardHeight}
				/>
			)}
		</SpinachAppContainer>
	);
};

export default NewRecipe;
