import { useNewRecipeState } from "./useNewRecipeState";
import { useNewRecipeMethods } from "./useNewRecipeMethods";
import { useSubmitRecipe } from "./useSubmitRecipe";

export const useNewRecipeModel = (navigation: boolean, route: boolean) => {
	return { ...useNewRecipeState(), ...useNewRecipeMethods(navigation, route), ...useSubmitRecipe(navigation, route) };
};
