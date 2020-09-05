require 'securerandom'

class RecipesController < ApplicationController

    before_action :define_current_recipe
    skip_before_action :define_current_recipe, :only => [:index, :create, :details]

    def index
        @recipes = Recipe.choose_list(params["listType"], params["queryChefID"], params["limit"], params["offset"], params["global_ranking"], @chef.id, params["filters"], params["cuisine"], params["serves"], params["search_term"])
        # byebug
        render json: @recipes
    end

    # def new
    #     @recipe = Recipe.new
    # end

    def create
        if newRecipe_params[:chef_id] === @chef.id || @chef.is_admin === true
            @recipe = Recipe.new(newRecipe_params)
            @recipe.chef_id=@chef.id
            newRecipe_filter_settings["filter_settings"].keys.each do |category|
                newRecipe_filter_settings["filter_settings"][category] ? @recipe[category.downcase.split(" ").join("_")] = true : @recipe[category.downcase.split(" ").join("_")] = false
            end
            if @recipe.save
                # byebug
                if newRecipe_primary_images_params["primary_images"].length > 0
                    @recipe.primary_images=(newRecipe_primary_images_params)
                end
                @recipe.ingredients=(newRecipe_Ingredient_params)
                @recipe.instructions=(newRecipe_Instructions_params)
                @recipe.save
                render json: @recipe
            else
                render json: {error: true, message: @recipe.errors.full_messages}
            end
        else
            render json: {error: true, message: "Unauthorized"}
        end
    end

    def show
        render json: @recipe.get_details(@chef)
    end

    # def edit
    #     render json: @recipe
    # end

    def update
        if newRecipe_params[:chef_id] === @chef.id || @chef.is_admin === true
            @recipe.update(newRecipe_params)
            newRecipe_filter_settings["filter_settings"].keys.each do |category|
                newRecipe_filter_settings["filter_settings"][category] ? @recipe[category.downcase.split(" ").join("_")] = true : @recipe[category.downcase.split(" ").join("_")] = false
            end
            # byebug
            @recipe.primary_images=(newRecipe_primary_images_params)
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
        params.require(:recipe).permit(:chef_id, :name, :time, :difficulty, :cuisine, :serves, :acknowledgement, :description)
    end

    # def newRecipe_primary_image_as_base64_params
    #     params.require(:recipe).permit(:primaryImageBase64)
    # end

    # this is not currently used as if a primary image comes back as an object, then it is unchanged and thus no actions are required
    # if you want to use the object in some way though, this will permit its id and recipe_id through
    def newRecipe_primary_images_params
        params.require(:recipe).permit(primary_images: [:id, :recipe_id, :base64, :hex, :image_url])
    end

    def newRecipe_Ingredient_params
        params.require(:recipe).permit(ingredients: [:name, :quantity, :unit])
    end

    def newRecipe_Instructions_params
        params.require(:recipe).permit(instructions: [], instruction_images: [:id, :index, :image_url, :hex, :base64])
    end

    def newRecipe_filter_settings
        params.require(:recipe).permit(:filter_settings => {})
    end

end
