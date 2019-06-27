class IngredientsController < ApplicationController

    # skip_before_action :verify_authenticity_token
    before_action :define_current_ingredient
    skip_before_action :define_current_ingredient, :only => [:index, :create]
    skip_before_action :logged_in?, :only => [:index]



    def index
        # byebug
        # @ingredients = Ingredient.where("name LIKE '%#{params[:subString]}%'")
        @ingredients = Ingredient.all
        # byebug
        render json: @ingredients
    end

    # def new
    #     @ingredient = Ingredient.new
    # end

    def create
        @ingredient.new(ingredient_params)
        if @ingredient.save
            render json: @ingredient
        else
            render json: {error: true, message: 'Ooops.  Something went wrong saving the ingredient.'}
        end
    end

    def show
        render json: @ingredient
    end

    # def edit
    #     render json: @ingredient
    # end

    def update
        @ingredient.update(ingredient_params)
        if @ingredient.save
            render json: @ingredient
        else
            render json: {error: true, message: 'Ooops.  Something went wrong updating the ingredient.'}
        end
    end

    def destroy
        if @ingredient.destroy
            render json: {message: "Ingredient deleted!"}
        else
            render json: {error: true, message: "Ooops.  That's embarassing.  We couldn't delete that ingredient.  It might be in use in other places"}
        end
    end

    private

    def define_current_ingredient
        @ingredient = Ingredient.find(params[:id])
    end

    def ingredient_params
        params.require(:ingredient).permit(:name)
    end

end
