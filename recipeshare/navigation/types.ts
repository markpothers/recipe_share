import type { StackScreenProps } from "@react-navigation/stack";
import type { DrawerScreenProps } from "@react-navigation/drawer";
import type { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { Recipe } from "../src/centralTypes";
import { NavigatorScreenParams, CompositeScreenProps } from "@react-navigation/native";

// MainDrawer
export type MainDrawerParamList = {
	MyRecipeBookCover: NavigatorScreenParams<MyRecipeBookTabsParamList>;
	BrowseRecipesCover: NavigatorScreenParams<BrowseRecipesStackParamList>;
	ProfileCover: NavigatorScreenParams<ProfileStackParamList>;
};

export type MyRecipeBookCoverProps = DrawerScreenProps<MainDrawerParamList, "MyRecipeBookCover">;
export type BrowseRecipesCoverProps = DrawerScreenProps<MainDrawerParamList, "BrowseRecipesCover">;
export type ProfileCoverProps = DrawerScreenProps<MainDrawerParamList, "ProfileCover">;

type CommonParams = { title: string };

// MyRecipeBook
export type MyRecipeBookStackParamList = {
	NewRecipe: CommonParams & { recipe_details: Recipe };
	MyRecipeBook: CommonParams & NavigatorScreenParams<MyRecipeBookTabsParamList>;
	RecipeDetails: CommonParams;
	ChefDetails: CommonParams;
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
	"My Feed": undefined;
	"My Recipes": { refresh: boolean };
	"Recipes I Like": undefined;
	"Chefs I Follow": undefined;
	"Chefs Following Me": undefined;
};

export type MyFeedTabProps = CompositeScreenProps<
	MaterialTopTabScreenProps<MyRecipeBookTabsParamList, "My Feed">,
	MyRecipeBookProps
>;
export type MyRecipesTabProps = CompositeScreenProps<
	MaterialTopTabScreenProps<MyRecipeBookTabsParamList, "My Recipes">,
	MyRecipeBookProps
>;
export type RecipesILikeTabProps = CompositeScreenProps<
	MaterialTopTabScreenProps<MyRecipeBookTabsParamList, "Recipes I Like">,
	MyRecipeBookProps
>;
// export type RecipesIMadeTabProps = CompositeScreenProps<MaterialTopTabScreenProps<MyRecipeBookTabsParamList, "Recipes I Made">, MyRecipeBookProps>;
export type ChefsIFollowTabProps = CompositeScreenProps<
	MaterialTopTabScreenProps<MyRecipeBookTabsParamList, "Chefs I Follow">,
	MyRecipeBookProps
>;
export type ChefsFollowingMeTabProps = CompositeScreenProps<
	MaterialTopTabScreenProps<MyRecipeBookTabsParamList, "Chefs Following Me">,
	MyRecipeBookProps
>;

//BrowseRecipes
export type BrowseRecipesStackParamList = {
	NewRecipe: CommonParams & { recipe_details: Recipe };
	BrowseRecipes: CommonParams & NavigatorScreenParams<BrowseRecipesTabsParamList>;
	RecipeDetails: CommonParams;
	ChefDetails: CommonParams;
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
	"Newest Recipes": undefined;
	"Top Recipes": undefined;
	"Newest Chefs": undefined;
	"Top Chefs": undefined;
};

export type NewestRecipesTabProps = CompositeScreenProps<
	MaterialTopTabScreenProps<BrowseRecipesTabsParamList, "Newest Recipes">,
	BrowseRecipesProps
>;
export type TopRecipesTabProps = CompositeScreenProps<
	MaterialTopTabScreenProps<BrowseRecipesTabsParamList, "Top Recipes">,
	BrowseRecipesProps
>;
export type NewestChefsTabProps = CompositeScreenProps<
	MaterialTopTabScreenProps<BrowseRecipesTabsParamList, "Newest Chefs">,
	BrowseRecipesProps
>;
export type TopChefsTabProps = CompositeScreenProps<
	MaterialTopTabScreenProps<BrowseRecipesTabsParamList, "Top Chefs">,
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
