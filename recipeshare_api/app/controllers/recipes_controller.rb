require 'securerandom'

class RecipesController < ApplicationController

    before_action :define_current_recipe
    skip_before_action :define_current_recipe, :only => [:index, :create, :details, :get_available_filters]
    skip_before_action :verify_authenticity_token
    
    def index
        # byebug
        # puts "getting recipe list: #{params["listType"]}"
        @recipes = Recipe.choose_list(params["listType"], params["queryChefID"], params["limit"], params["offset"], params["global_ranking"], @chef.id, params["filters"], params["cuisine"], params["serves"], params["search_term"])
        @recipes = Recipe.get_signed_urls(@recipes)
        @cuisines = Recipe.get_cuisines(params["listType"], @chef.id, params["queryChefID"], params["filters"], params["serves"], params["search_term"])
        @serves = Recipe.get_serves(params["listType"], @chef.id, params["queryChefID"], params["filters"], params["cuisine"], params["search_term"])
        @filters = Recipe.get_filters(params["listType"], @chef.id, params["queryChefID"], params["filters"], params["serves"], params["cuisine"], params["search_term"])
        # puts "rendering"
        # byebug
        render json: {recipes: @recipes, cuisines: @cuisines, serves: @serves, filters: @filters}
    end

    # def new
    #     @recipe = Recipe.new
    # end

    def create
        # if newRecipe_params[:chef_id] === @chef.id || @chef.is_admin === true
            @recipe = Recipe.new(newRecipe_params)
            # byebug
            if newRecipe_params["time"] != nil #to accept input from older app version (pre-release)
                @recipe.total_time = newRecipe_params["time"]
            end
                @recipe.chef_id = @chef.id
                newRecipe_filter_settings["filter_settings"].keys.each do |category|
                newRecipe_filter_settings["filter_settings"][category] ? @recipe[category.downcase.split(" ").join("_")] = true : @recipe[category.downcase.split(" ").join("_")] = false
            end
            # byebug
            if @recipe.save
                # byebug
                # if newRecipe_primary_images_params["primary_images"].length.positive?
                    @recipe.primary_images
                # end
                @recipe.ingredients = (newRecipe_Ingredient_params)
                @recipe.instructions = (newRecipe_Instructions_params)
                @recipe.save
                render json: { recipe: @recipe, instructions: @recipe.instructions }
            else
                render json: { error: true, message: @recipe.errors.full_messages }
            end
        # else
        #     render json: {error: true, message: "Unauthorized"}
        # end
    end

    def show
        render json: @recipe.get_details(@chef)
    end

    # def edit
    #     render json: @recipe
    # end

    def update
        if @recipe.chef_id === @chef.id || @chef.is_admin === true
            @recipe.update(newRecipe_params)
            newRecipe_filter_settings["filter_settings"].keys.each do |category|
                newRecipe_filter_settings["filter_settings"][category] ? @recipe[category.downcase.split(" ").join("_")] = true : @recipe[category.downcase.split(" ").join("_")] = false
            end
            # byebug
            @recipe.primary_images
            @recipe.ingredients=(newRecipe_Ingredient_params)
            @recipe.instructions=(newRecipe_Instructions_params)
            if @recipe.save
                # byebug
                render json: { recipe: @recipe, instructions: @recipe.instructions.where(hidden: false) }
            else
                # byebug
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

    def get_available_filters
        @filters = Recipe.get_filters(params["listType"], @chef.id, params["queryChefID"], params["filters"], params["serves"], params["cuisine"], params["search_term"])
        @cuisines = Recipe.get_cuisines(params["listType"], @chef.id, params["queryChefID"], params["filters"], params["serves"], params["search_term"])
        @serves = Recipe.get_serves(params["listType"], @chef.id, params["queryChefID"], params["filters"], params["cuisine"], params["search_term"])
        render json: {filters: @filters, cuisines: @cuisines, serves: @serves}
    end

    private

    def define_current_recipe
        @recipe = Recipe.find(params[:id])
    end

    def list_params
        params.require(:recipe).permit(:listType, :limit, :offset, :ranking, :chef_id)
    end

    def details_params
        params.require(:details).permit(listed_recipes: [])
    end

    def newRecipe_params
        params.require(:recipe).permit(:name, :prep_time, :cook_time, :total_time, :time, :difficulty, :cuisine, :serves, :acknowledgement, :acknowledgement_link, :description, :show_blog_preview)
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
