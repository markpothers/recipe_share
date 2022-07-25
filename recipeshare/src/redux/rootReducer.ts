import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListChef, ListRecipe, LoginChef, MakePic, MakePicChef, Recipe, Comment } from "../centralTypes";
import { initialRootState } from "./initialRootState";
import {
	ParameterContent,
	RootStateType,
	StoreChefDetails,
	StoreNewFollowers,
	UpdateSingleChefList,
	UpdateSingleRecipeList,
} from "./types";

const rootReducer = createSlice({
	name: "root",
	initialState: initialRootState,
	reducers: {
		updateSingleRecipeList(state, action: PayloadAction<UpdateSingleRecipeList>) {
			state.allRecipeLists[action.payload.listKey] = action.payload.recipeList;
		},
		updateAllRecipeLists(state, action: PayloadAction<Record<string, ListRecipe[]>>) {
			state.allRecipeLists = action.payload;
		},
		updateSingleChefList(state, action: PayloadAction<UpdateSingleChefList>) {
			state.allChefLists[action.payload.listKey] = action.payload.chefList;
		},
		updateAllChefLists(state, action: PayloadAction<Record<string, ListChef[]>>) {
			state.allChefLists = action.payload;
		},
		storeRecipeDetails(state, action: PayloadAction<Recipe>) {
			state.recipe_details = action.payload;
		},
		updateNewUserDetails(state, action: PayloadAction<ParameterContent>) {
			state.newUserDetails[action.payload.parameter] = action.payload.content;
		},
		clearNewUserDetails(state) {
			state.newUserDetails = initialRootState.newUserDetails;
		},
		updateLoginUserDetails(state, action: PayloadAction<ParameterContent>) {
			state.loginUserDetails[action.payload.parameter] = action.payload.content;
		},
		clearLoginUserDetails(state) {
			state.loginUserDetails = initialRootState.loginUserDetails;
		},
		addRecipeLike(state) {
			state.recipe_details.recipe_likes += 1;
			state.recipe_details.likeable = false;
		},
		removeRecipeLike(state) {
			state.recipe_details.recipe_likes -= 1;
			state.recipe_details.likeable = true;
		},
		addRecipeReShare(state) {
			state.recipe_details.re_shares += 1;
			state.recipe_details.shareable = false;
		},
		removeRecipeReShare(state) {
			state.recipe_details.re_shares -= 1;
			state.recipe_details.shareable = true;
		},
		addRecipeMake(state) {
			state.recipe_details.recipe_makes += 1;
			state.recipe_details.makeable = false;
		},
		addMakePic(state, action: PayloadAction<MakePic>) {
			state.recipe_details.make_pics.unshift(action.payload);
		},
		addMakePicChef(state, action: PayloadAction<MakePicChef>) {
			state.recipe_details.make_pics_chefs.unshift(action.payload);
		},
		saveRemainingMakePics(state, action: PayloadAction<MakePic[]>) {
			state.recipe_details.make_pics = action.payload;
		},
		updateComments(state, action: PayloadAction<Comment[]>) {
			state.recipe_details.comments = action.payload;
		},
		storeNewFollowers(state, action: PayloadAction<StoreNewFollowers>) {
			state.chef_details[action.payload.chefID].followers = action.payload.followers;
			state.chef_details[action.payload.chefID].chef_followed =
				!state.chef_details[action.payload.chefID].chef_followed;
		},
		updateLoggedInChef(state, action: PayloadAction<RootStateType["loggedInChef"]>) {
			state.loggedInChef = {
				id: action.payload.id,
				e_mail: action.payload.e_mail,
				username: action.payload.username,
				auth_token: action.payload.auth_token,
				image_url: action.payload.image_url,
				is_admin: action.payload.is_admin,
				is_member: action.payload.is_member,
			};
		},
		storeChefDetails(state, action: PayloadAction<StoreChefDetails>) {
			state.chef_details[action.payload.chefID] = action.payload.chef_details;
		},
		clearChefDetails(state) {
			state.chef_details = initialRootState.chef_details;
		},
		stayLoggedIn(state, action: PayloadAction<boolean>) {
			state.stayLoggedIn = action.payload;
		},
	},
});

// dispatch(stayLoggedIn(true))

export const {
	updateSingleRecipeList,
	updateAllRecipeLists,
	updateSingleChefList,
	updateAllChefLists,
	storeRecipeDetails,
	updateNewUserDetails,
	clearNewUserDetails,
	updateLoginUserDetails,
	clearLoginUserDetails,
	addRecipeLike,
	removeRecipeLike,
	addRecipeReShare,
	removeRecipeReShare,
	addRecipeMake,
	addMakePic,
	addMakePicChef,
	saveRemainingMakePics,
	updateComments,
	storeNewFollowers,
	updateLoggedInChef,
	storeChefDetails,
	clearChefDetails,
	stayLoggedIn,
} = rootReducer.actions;

export default rootReducer.reducer;
