require 'securerandom'

class RecipesController < ApplicationController

    # skip_before_action :verify_authenticity_token
    before_action :define_current_recipe
    skip_before_action :define_current_recipe, :only => [:index, :create, :details]


    def index
        # byebug
        @recipes = Recipe.choose_list(params["listType"], params["queryChefID"], params["limit"], params["offset"], params["global_ranking"], @chef.id, params["filters"], params["cuisine"], params["serves"])
        render json: @recipes #, methods: [:add_count]
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
                @recipe_image = RecipeImage.create(recipe_id: @recipe.id)
                hex = SecureRandom.hex
                until RecipeImage.find_by(hex: hex) == nil
                    hex = SecureRandom.hex
                end
                File.open("public/recipe_image_files/recipe-image-#{hex}.jpg", 'wb') do |f|
                    f.write(Base64.decode64(newRecipe_image_params[:imageBase64]))
                end
                puts "public/recipe_image_files/recipe-image-#{hex}.jpg"
                @recipe_image.imageURL = "/recipe_image_files/recipe-image-#{hex}.jpg"
                @recipe_image.hex=hex
                @recipe_image.save
            end
            @recipe.ingredients=(newRecipe_Ingredient_params)
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
            @recipe.cuisine=newRecipe_filter_settings["cuisine"]
            if newRecipe_image_params[:imageBase64] != "" && newRecipe_image_params[:imageBase64] != nil
                @recipe_image = RecipeImage.create(recipe_id: @recipe.id)

                File.open("public/recipe_image_files/recipe-image-#{@recipe_image.id}.jpg", 'wb') do |f|
                    f.write(Base64.decode64(newRecipe_image_params[:imageBase64]))
                end
                puts "public/recipe_image_files/recipe-image-#{@recipe_image.id}.jpg"
                @recipe_image.imageURL = "/recipe_image_files/recipe-image-#{@recipe_image.id}.jpg"
                @recipe_image.save
            end
            @recipe.ingredients=(newRecipe_Ingredient_params)
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
        params.require(:recipe).permit(:name, :time, :difficulty, :instructions, :cuisine, :serves)
    end

    def newRecipe_image_params
        params.require(:recipe).permit(:imageBase64)
    end

    def newRecipe_Ingredient_params
        params.require(:recipe).permit(ingredients: {})
    end

    def newRecipe_filter_settings
        params.require(:recipe).permit(:filter_settings => {})
    end

end
