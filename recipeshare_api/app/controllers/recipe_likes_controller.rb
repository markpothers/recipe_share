class RecipeLikesController < ApplicationController

    before_action :define_current_recipe_like
    skip_before_action :define_current_recipe_like, :only => [:index, :create, :destroy]
    skip_before_action :verify_authenticity_token

    def index
        render json: RecipeLike.all
    end

    # def new
    #     @recipe_like = RecipeLike.new
    # end

    def create
        # byebug
        if recipe_like_params["chef_id"] === @chef.id || @chef.is_admin === true
            @recipe_like = RecipeLike.find_or_create_by(recipe_like_params)
            @recipe_like.hidden = false
            # byebug
            if @recipe_like.save
                render json: true
            else
                render json: false
            end
        else
            render json: {error: true, message: "Unauthorized"}
        end
    end

    # def show
    #     render json: @recipe_like
    # end

    # def edit
    #     render json: @recipe_like
    # end

    # def update
    #     @recipe_like.update(recipe_like_params)
    #     if @recipe_like.save
    #         render json: @recipe_like
    #     else
    #         render json: {error: true, message: 'Ooops.  Something went wrong updating the recipe_like.'}
    #     end
    # end

    def destroy
        if recipe_like_params["chef_id"] === @chef.id || @chef.is_admin === true
            @recipe_likes = RecipeLike.where(recipe_id: recipe_like_params["recipe_id"], chef_id: recipe_like_params["chef_id"])
            @recipe_ids = @recipe_likes.map { |like| like.id }
            if RecipeLike.find(@recipe_ids).each { |recipe_like| recipe_like.update_attribute(:hidden, true) }
                render json: true
            else
                render json: {message: false}
            end
        else
            render json: {error: true, message: "Unauthorized"}
        end
    end

    private

    # def define_current_recipe_like
    #     @recipe_like = RecipeLike.find(params[:id])
    # end

    def recipe_like_params
        params.require(:recipe).permit(:recipe_id, :chef_id)
    end

end
