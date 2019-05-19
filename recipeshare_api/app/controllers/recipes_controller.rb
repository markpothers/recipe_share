class RecipesController < ApplicationController

    # skip_before_action :verify_authenticity_token
    before_action :define_current_recipe
    skip_before_action :define_current_recipe, :only => [:index, :create, :details]


    def index
        @recipes = Recipe.choose_list(recipe_params["listType"], recipe_params["chef_id"], recipe_params["limit"], recipe_params["offset"], recipe_params["ranking"])
        render json: @recipes #, methods: [:add_count]
    end

    def details
        # @recipes_details = Recipe.find_details(details_params["listed_recipes"])

            ingredientUses = IngredientUse.where(recipe_id: details_params["listed_recipes"])
            ingredients_ids = ingredientUses.map do |use|
                use = use.ingredient_id
            end

        details = {recipes: Recipe.where(id: details_params["listed_recipes"]),
            comments: Comment.where(recipe_id: details_params["listed_recipes"]),
            recipe_images: RecipeImage.where(recipe_id: details_params["listed_recipes"]),
            recipe_likes: RecipeLike.where(recipe_id: details_params["listed_recipes"]),
            recipe_makes: RecipeMake.where(recipe_id: details_params["listed_recipes"]),
            make_pics: MakePic.where(recipe_id: details_params["listed_recipes"]),
            ingredient_uses: IngredientUse.where(recipe_id: details_params["listed_recipes"]),
            ingredients: Ingredient.where(id: ingredients_ids.uniq)
            }
        render json: details #, methods: [:add_count]
    end

    # def new
    #     @recipe = Recipe.new
    # end

    def create
        @recipe = Recipe.create(recipe_params)
        @recipe.images.attach(recipe_params[:images])
        if @recipe.save
            render json: @recipe
        else
            render json: {error: true, message: 'Ooops.  Something went wrong saving the recipe.'}
        end
    end

    def show
        render json: @recipe
    end

    # def edit
    #     render json: @recipe
    # end

    def update
        @recipe.update(recipe_params)
        @recipe.images.attach(recipe_params[:images])
        if @recipe.save
            render json: @recipe
        else
            render json: {error: true, message: 'Ooops.  Something went wrong updating the recipe.'}
        end
    end

    def destroy
        if @recipe.destroy
            render json: {message: "Recipe deleted!"}
        else
            render json: {error: true, message: "Ooops.  That's embarassing.  We couldn't delete that recipe."}
        end
    end

    private

    def define_current_recipe
        @recipe = Recipe.find(params[:id])
    end

    def recipe_params
        params.require(:recipe).permit(:allRecipes, :listType, :limit, :offset, :ranking, :name, :chef_id, :time, :difficulty, :instructions, :content)
    end

    def details_params
        params.require(:details).permit(:listed_recipes => [])
    end

end
