class IngredientUsesController < ApplicationController

    # skip_before_action :verify_authenticity_token
    before_action :define_current_ingredient_use
    skip_before_action :define_current_ingredient_use, :only => [:index, :create]


    def index
        render json: IngredientUse.all
    end

    # def new
    #     @ingredient_use = IngredientUse.new
    # end

    def create
        @ingredient_use = IngredientUse.create(ingredient_use_params)
        if @ingredient_use.save
            render json: @ingredient_use
        else
            render json: {error: true, message: 'Ooops.  Something went wrong saving the ingredient_use.'}
        end
    end

    def show
        render json: @ingredient_use
    end

    # def edit
    #     render json: @ingredient_use
    # end

    def update
        @ingredient_use.update(ingredient_use_params)
        if @ingredient_use.save
            render json: @ingredient_use
        else
            render json: {error: true, message: 'Ooops.  Something went wrong updating the ingredient_use.'}
        end
    end

    def destroy
        if @ingredient_use.destroy
            render json: {message: "Ingredient use deleted!"}
        else
            render json: {error: true, message: "Ooops.  That's embarassing.  We couldn't delete that ingredient use.  You shouldn't even be able to see this message!"}
        end
    end

    private

    def define_current_ingredient_use
        @ingredient_use = IngredientUse.find(params[:id])
    end

    def ingredient_use_params
        params.require(:ingredient_use).permit(:recipe_id, :ingredient_id, :quantity, :unit)
    end

end
