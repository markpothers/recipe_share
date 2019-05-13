class RecipeLikesController < ApplicationController

    # skip_before_action :verify_authenticity_token
    before_action :define_current_recipe_like
    skip_before_action :define_current_recipe_like, :only => [:index, :create]


    def index
        render json: RecipeLike.all
    end

    # def new
    #     @recipe_like = RecipeLike.new
    # end

    def create
        @recipe_like = RecipeLike.create(recipe_like_params)
        if @recipe_like.save
            render json: @recipe_like
        else
            render json: {error: true, message: 'Ooops.  Something went wrong saving the recipe_like.'}
        end
    end

    def show
        render json: @recipe_like
    end

    # def edit
    #     render json: @recipe_like
    # end

    def update
        @recipe_like.update(recipe_like_params)
        if @recipe_like.save
            render json: @recipe_like
        else
            render json: {error: true, message: 'Ooops.  Something went wrong updating the recipe_like.'}
        end
    end

    def destroy
        if @recipe_like.destroy
            render json: {message: "recipe_like deleted!"}
        else
            render json: {error: true, message: "Ooops.  That's embarassing.  We couldn't delete that recipe_like.  You shouldn't even be able to see this message!"}
        end
    end

    private

    def define_current_recipe_like
        @recipe_like = RecipeLike.find(params[:id])
    end

    def recipe_like_params
        params.require(:recipe_like).permit(:recipe_id, :chef_id, :time, :difficulty, :comment, :tastiness)
    end

end
