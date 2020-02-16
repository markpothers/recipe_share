require 'securerandom'

class RecipesController < ApplicationController

    before_action :define_current_recipe
    skip_before_action :define_current_recipe, :only => [:index, :create, :details]


    def index
        # byebug
        @recipes = Recipe.choose_list(params["listType"], params["queryChefID"], params["limit"], params["offset"], params["global_ranking"], @chef.id, params["filters"], params["cuisine"], params["serves"])
        render json: @recipes
    end

    # def new
    #     @recipe = Recipe.new
    # end

    def create
        # byebug
        @recipe = Recipe.new(newRecipe_params)
        @recipe.chef_id=@chef.id
        newRecipe_filter_settings["filter_settings"].keys.each do |category|
            newRecipe_filter_settings["filter_settings"][category] ? @recipe[category.downcase.split(" ").join("_")] = true : @recipe[category.downcase.split(" ").join("_")] = false
        end
        if @recipe.save
            if newRecipe_image_params[:imageBase64] != "" && newRecipe_image_params[:imageBase64] != nil
                recipe_image = RecipeImage.create(recipe_id: @recipe.id)
                hex = SecureRandom.hex(20)
                until RecipeImage.find_by(hex: hex) == nil
                    hex = SecureRandom.hex(20)
                end
                mediaURL = ApplicationRecord.save_image(Rails.application.credentials.buckets[:recipe_images], hex, newRecipe_image_params[:imageBase64])
                recipe_image.imageURL = mediaURL
                recipe_image.hex=hex
                recipe_image.save
            end
            @recipe.ingredients=(newRecipe_Ingredient_params)
            @recipe.instructions=(newRecipe_Instructions_params)
            @recipe.save
            render json: @recipe
        else
            render json: {error: true, message: @recipe.errors.full_messages}
        end
    end

    def show
        render json: @recipe.get_details(@chef)
    end

    # def edit
    #     render json: @recipe
    # end

    def update
        # byebug
        if @recipe.chef_id === @chef.id || @chef.is_admin === true
            @recipe.update(newRecipe_params)
            newRecipe_filter_settings["filter_settings"].keys.each do |category|
                newRecipe_filter_settings["filter_settings"][category] ? @recipe[category.downcase.split(" ").join("_")] = true : @recipe[category.downcase.split(" ").join("_")] = false
            end
            if newRecipe_image_params[:imageBase64] != "" && newRecipe_image_params[:imageBase64] != nil
                recipe_image = RecipeImage.create(recipe_id: @recipe.id)
                hex = SecureRandom.hex(20)
                until RecipeImage.find_by(hex: hex) == nil
                    hex = SecureRandom.hex(20)
                end
                mediaURL = ApplicationRecord.save_image(Rails.application.credentials.buckets[:recipe_images], hex, newRecipe_image_params[:imageBase64])
                recipe_image.imageURL = mediaURL
                recipe_image.hex=hex
                recipe_image.save
            end
            @recipe.ingredients=(newRecipe_Ingredient_params)
            @recipe.instructions=(newRecipe_Instructions_params)
            if @recipe.save
                render json: @recipe
            else
                render json: {error: true, message: @recipe.errors.full_messages}
            end
        else
            render json: {error: true, message: "Unauthorized"}
        end
    end

    def destroy
        # byebug
        if @recipe.chef_id === @chef.id || @chef.is_admin === true
            @recipe.hidden=(true)
            @recipe.save
            if @recipe.hidden=(true)
                render json: true
            else
                render json: false
            end
        else
            render json: {error: true, message: "Unauthorized"}
        end
    end

    private

    def define_current_recipe
        @recipe = Recipe.find(params[:id])
    end

    def list_params
        params.require(:recipe).permit(:listType, :limit, :offset, :ranking, :chef_id)
    end

    def details_params
        params.require(:details).permit(:listed_recipes => [])
    end

    def newRecipe_params
        params.require(:recipe).permit(:name, :time, :difficulty, :cuisine, :serves, :acknowledgement)
    end

    def newRecipe_image_params
        params.require(:recipe).permit(:imageBase64)
    end

    def newRecipe_Ingredient_params
        params.require(:recipe).permit(ingredients: {})
    end

    def newRecipe_Instructions_params
        params.require(:recipe).permit(instructions: {}, :instructionsOrder => [] )
    end

    def newRecipe_filter_settings
        params.require(:recipe).permit(:filter_settings => {})
    end

end
