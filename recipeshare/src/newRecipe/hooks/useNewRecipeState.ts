import { useState } from "react";
import { useAppSelector } from "../../redux";
import { Ingredient } from "../../centralTypes";
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

const isDev = __DEV__ ? true : false;

export const useNewRecipeState = () => {
	const loggedInChef = useAppSelector((state) => state.root.loggedInChef);
	const [hasPermission, setHasPermission] = useState<boolean>(false);
	const [renderOfflineMessage, setRenderOfflineMessage] = useState<boolean>(false);
	const [isFocused, setIsFocused] = useState<boolean>(true);
	const [alertPopupShowing, setAlertPopupShowing] = useState<boolean>(false);
	const [helpShowing, setHelpShowing] = useState<boolean>(false);
	const [helpText, setHelpText] = useState<string>("");
	const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);
	const [autoCompleteFocused, setAutoCompleteFocused] = useState<boolean | null>(null);
	const [choosingPrimaryPicture, setChoosingPrimaryPicture] = useState<boolean>(false);
	const [choosingInstructionPicture, setChoosingInstructionPicture] = useState<boolean>(false);
	const [instructionImageIndex, setInstructionImageIndex] = useState<number>(0);
	const [filterDisplayed, setFilterDisplayed] = useState<boolean>(false);
	const [awaitingServer, setAwaitingServer] = useState<boolean>(false);
	const [scrollingEnabled, setScrollingEnabled] = useState<boolean>(true);
	const [errors, setErrors] = useState<string | string[]>([]);
	const [offlineDiagnostics, setOfflineDiagnostics] = useState<string>("");
	const [testing] = useState<boolean>(isDev);
	const [newRecipeDetails, setNewRecipeDetails] = useState<Record<string, any>>({
		recipeId: null,
		name: "",
		instructions: [],
		instructionImages: [],
		ingredients: [],
		difficulty: "0",
		times: {
			prepTime: 0,
			cookTime: 0,
			totalTime: 0,
		},
		primaryImages: [{
			"uri": "",
		}],
		filter_settings: {
			"Breakfast": false,
			"Lunch": false,
			"Dinner": false,
			"Chicken": false,
			"Red meat": false,
			"Seafood": false,
			"Vegetarian": false,
			"Salad": false,
			"Vegan": false,
			"Soup": false,
			"Dessert": false,
			"Side": false,
			"Whole 30": false,
			"Paleo": false,
			"Freezer meal": false,
			"Keto": false,
			"Weeknight": false,
			"Weekend": false,
			"Gluten free": false,
			"Bread": false,
			"Dairy free": false,
			"White meat": false,
		},
		cuisine: "Any",
		serves: "Any",
		acknowledgement: "",
		acknowledgementLink: "",
		description: "",
		showBlogPreview: false
	});
	const [instructionHeights, setInstructionHeights] = useState<number[]>([]);
	const [averageInstructionHeight, setAverageInstructionHeight] = useState<number>(responsiveHeight(6.5));

	return {
		loggedInChef,
		hasPermission,
		setHasPermission,
		renderOfflineMessage,
		setRenderOfflineMessage,
		isFocused,
		setIsFocused,
		alertPopupShowing,
		setAlertPopupShowing,
		helpShowing,
		setHelpShowing,
		helpText,
		setHelpText,
		ingredientsList,
		setIngredientsList,
		autoCompleteFocused,
		setAutoCompleteFocused,
		choosingPrimaryPicture,
		setChoosingPrimaryPicture,
		choosingInstructionPicture,
		setChoosingInstructionPicture,
		instructionImageIndex,
		setInstructionImageIndex,
		filterDisplayed,
		setFilterDisplayed,
		awaitingServer,
		setAwaitingServer,
		scrollingEnabled,
		setScrollingEnabled,
		errors,
		setErrors,
		offlineDiagnostics,
		setOfflineDiagnostics,
		testing,
		newRecipeDetails,
		setNewRecipeDetails,
		instructionHeights,
		setInstructionHeights,
		averageInstructionHeight,
		setAverageInstructionHeight
	};
};
