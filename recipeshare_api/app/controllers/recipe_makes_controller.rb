class RecipeMakesController < ApplicationController

    # skip_before_action :verify_authenticity_token
    before_action :define_current_recipe_make
    skip_before_action :define_current_recipe_make, :only => [:index, :create]


    def index
        render json: RecipeMake.all
    end

    # def new
    #     @recipe_make = Recipe_make.new
    # end

    def create
        @recipe_make = RecipeMake.create(recipe_make_params)
        if @recipe_make.save
            render json: @recipe_make
        else
            render json: {error: true, message: 'Ooops.  Something went wrong saving the recipe_make.'}
        end
    end

    def show
        render json: @recipe_make
    end

    # def edit
    #     render json: @recipe_make
    # end

    def update
        @recipe_make.update(recipe_make_params)
        if @recipe_make.save
            render json: @recipe_make
        else
            render json: {error: true, message: 'Ooops.  Something went wrong updating the recipe_make.'}
        end
    end

    def destroy
        if @recipe_make.destroy
            render json: {message: "recipe_make deleted!"}
        else
            render json: {error: true, message: "Ooops.  That's embarassing.  We couldn't delete that recipe_make.  You shouldn't even be able to see this message!"}
        end
    end

    private

    def define_current_recipe_make
        @recipe_make = RecipeMake.find(params[:id])
    end

    def recipe_make_params
        params.require(:recipe_make).permit(:recipe_id, :chef_id, :time, :difficulty, :comment, :tastiness)
    end

end
