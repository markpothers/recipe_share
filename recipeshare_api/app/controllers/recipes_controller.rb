class RecipesController < ApplicationController

    # skip_before_action :verify_authenticity_token
    before_action :define_current_recipe
    skip_before_action :define_current_recipe, :only => [:index, :create]


    def index
        @recipes = Recipe.choose_list
        render json: @recipes #, methods: [:add_count]
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
        params.require(:recipe).permit(:name, :chef_id, :time, :difficulty, :instructions, :content, images: [])
    end

end
