import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";

import type { DrawerScreenProps } from "@react-navigation/drawer";
import type { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { Recipe } from "../centralTypes";
import type { StackScreenProps } from "@react-navigation/stack";

// MainDrawer
export type MainDrawerParamList = {
	MyRecipeBookCover: NavigatorScreenParams<MyRecipeBookTabsParamList>;
	BrowseRecipesCover: NavigatorScreenParams<BrowseRecipesStackParamList>;
	ProfileCover: NavigatorScreenParams<ProfileStackParamList>;
};

export type MyRecipeBookCoverProps = DrawerScreenProps<MainDrawerParamList, "MyRecipeBookCover">;
export type BrowseRecipesCoverProps = DrawerScreenProps<MainDrawerParamList, "BrowseRecipesCover">;
export type ProfileCoverProps = DrawerScreenProps<MainDrawerParamList, "ProfileCover">;

type CommonParams = { title?: string };

export enum RecipeListChoice {
	newestRecipes = "Newest Recipes",
	topRecipes = "Top Recipes",
	myFeed = " My Feed",
	myRecipes = "My Recipes",
	recipesILike = "Recipes I Like"
}

export enum ChefListChoice {
	chefsIFollow = "Chefs I Follow",
	chefsFollowingMe = "Chefs Following Me",
	newestChefs = "Newest Chefs",
	topChefs = "Top Chefs"
}


// MyRecipeBook
export type MyRecipeBookStackParamList = {
	NewRecipe: { recipe_details: Recipe; title?: string };
	MyRecipeBook: CommonParams & NavigatorScreenParams<MyRecipeBookTabsParamList>;
	RecipeDetails: CommonParams & { commenting?: boolean };
	ChefDetails: CommonParams & { chefID: number };
};

export type NewRecipeProps = CompositeScreenProps<
	StackScreenProps<MyRecipeBookStackParamList, "NewRecipe">,
	MyRecipeBookCoverProps
>;
export type NewRecipeNavigationProps = NewRecipeProps["navigation"];
export type NewRecipeRouteProps = NewRecipeProps["route"];

export type RecipeDetailsProps = CompositeScreenProps<
	StackScreenProps<MyRecipeBookStackParamList, "RecipeDetails">,
	MyRecipeBookCoverProps
>;
export type RecipeDetailsNavigationProps = RecipeDetailsProps["navigation"];
export type RecipeDetailsRouteProps = RecipeDetailsProps["route"];

export type ChefDetailsProps = CompositeScreenProps<
	StackScreenProps<MyRecipeBookStackParamList, "ChefDetails">,
	MyRecipeBookCoverProps
>;
export type ChefDetailsNavigationProps = ChefDetailsProps["navigation"];
export type ChefDetailsRouteProps = ChefDetailsProps["route"];

export type MyRecipeBookProps = CompositeScreenProps<
	StackScreenProps<MyRecipeBookStackParamList, "MyRecipeBook">,
	MyRecipeBookCoverProps
>;
export type MyRecipeBookNavigationProps = MyRecipeBookProps["navigation"];
export type MyRecipeBookRouteProps = MyRecipeBookProps["route"];

export type MyRecipeBookTabsParamList = {
	[RecipeListChoice.myFeed]: undefined;
	[RecipeListChoice.myRecipes]: { refresh?: boolean; deleteId?: number };
	[RecipeListChoice.recipesILike]: undefined;
	[ChefListChoice.chefsIFollow]: undefined;
	[ChefListChoice.chefsFollowingMe]: undefined;
};

export type MyFeedTabProps = CompositeScreenProps<
	MaterialTopTabScreenProps<MyRecipeBookTabsParamList, RecipeListChoice.myFeed>,
	MyRecipeBookProps
>;
export type MyRecipesTabProps = CompositeScreenProps<
	MaterialTopTabScreenProps<MyRecipeBookTabsParamList, RecipeListChoice.myRecipes>,
	MyRecipeBookProps
>;
export type RecipesILikeTabProps = CompositeScreenProps<
	MaterialTopTabScreenProps<MyRecipeBookTabsParamList, RecipeListChoice.recipesILike>,
	MyRecipeBookProps
>;
// export type RecipesIMadeTabProps = CompositeScreenProps<MaterialTopTabScreenProps<MyRecipeBookTabsParamList, "Recipes I Made">, MyRecipeBookProps>;
export type ChefsIFollowTabProps = CompositeScreenProps<
	MaterialTopTabScreenProps<MyRecipeBookTabsParamList, ChefListChoice.chefsIFollow>,
	MyRecipeBookProps
>;
export type ChefsFollowingMeTabProps = CompositeScreenProps<
	MaterialTopTabScreenProps<MyRecipeBookTabsParamList, ChefListChoice.chefsFollowingMe>,
	MyRecipeBookProps
>;

//BrowseRecipes
export type BrowseRecipesStackParamList = {
	NewRecipe: CommonParams & { recipe_details: Recipe };
	BrowseRecipes: CommonParams & NavigatorScreenParams<BrowseRecipesTabsParamList>;
	RecipeDetails: CommonParams & { commenting?: boolean };
	ChefDetails: CommonParams & { chefID: number };
};

// export type NewRecipeProps = StackScreenProps<MyRecipeBookStackParamList, "NewRecipe">;
// export type NewRecipeNavigationProps = NewRecipeProps["navigation"];
// export type NewRecipeRouteProps = NewRecipeProps["route"];

// export type RecipeDetailsProps = StackScreenProps<MyRecipeBookStackParamList, "RecipeDetails">;
// export type RecipeDetailsNavigationProps = RecipeDetailsProps["navigation"];
// export type RecipeDetailsRouteProps = RecipeDetailsProps["route"];

// export type ChefDetailsProps = StackScreenProps<MyRecipeBookStackParamList, "ChefDetails">;
// export type ChefDetailsNavigationProps = ChefDetailsProps["navigation"];
// export type ChefDetailsRouteProps = ChefDetailsProps["route"];

export type BrowseRecipesProps = CompositeScreenProps<
	StackScreenProps<BrowseRecipesStackParamList, "BrowseRecipes">,
	BrowseRecipesCoverProps
>;
export type BrowseRecipesNavigationProps = BrowseRecipesProps["navigation"];
export type BrowseRecipesRouteProps = BrowseRecipesProps["route"];

export type BrowseRecipesTabsParamList = {
	[RecipeListChoice.newestRecipes]: undefined;
	[RecipeListChoice.topRecipes]: undefined;
	[ChefListChoice.newestChefs]: undefined;
	[ChefListChoice.topChefs]: undefined;
};

export type NewestRecipesTabProps = CompositeScreenProps<
	MaterialTopTabScreenProps<BrowseRecipesTabsParamList, RecipeListChoice.newestRecipes>,
	BrowseRecipesProps
>;
export type TopRecipesTabProps = CompositeScreenProps<
	MaterialTopTabScreenProps<BrowseRecipesTabsParamList, RecipeListChoice.topRecipes>,
	BrowseRecipesProps
>;
export type NewestChefsTabProps = CompositeScreenProps<
	MaterialTopTabScreenProps<BrowseRecipesTabsParamList, ChefListChoice.newestChefs>,
	BrowseRecipesProps
>;
export type TopChefsTabProps = CompositeScreenProps<
	MaterialTopTabScreenProps<BrowseRecipesTabsParamList, ChefListChoice.topChefs>,
	BrowseRecipesProps
>;

// Profile
export type ProfileStackParamList = {
	NewRecipe: CommonParams & { recipe_details: Recipe };
	Profile: CommonParams & { logout: boolean };
	About: CommonParams;
};

// export type NewRecipeProps = StackScreenProps<ProfileStackParamList, "NewRecipe">;
// export type NewRecipeNavigationProps = NewRecipeProps["navigation"];
// export type NewRecipeRouteProps = NewRecipeProps["route"];

export type ProfileProps = CompositeScreenProps<StackScreenProps<ProfileStackParamList, "Profile">, ProfileCoverProps>;
export type ProfileNavigationProps = ProfileProps["navigation"];
export type ProfileRouteProps = ProfileProps["route"];

export type AboutProps = CompositeScreenProps<StackScreenProps<ProfileStackParamList, "About">, ProfileCoverProps>;
export type AboutNavigationProps = AboutProps["navigation"];
export type AboutRouteProps = AboutProps["route"];

