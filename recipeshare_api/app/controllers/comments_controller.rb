class CommentsController < ApplicationController

    before_action :define_current_comment
    skip_before_action :define_current_comment, :only => [:index, :create]

    def index
        render json: Comment.all
    end

    # def new
    #     @comment = Comment.new
    # end

    def create
        if comment_params["chef_id"] === @chef.id || @chef.is_admin === true
            @comment = Comment.create(comment_params)
            if @comment.save
                render json: Comment.getRecipesComments(comment_params['recipe_id'])
            else
                render json: false
            end
        else
            render json: {error: true, message: "Unauthorized"}
        end
    end

    # def show
    #     render json: @comment
    # end

    # def edit
    #     render json: @comment
    # end

    def update
        if @comment.chef_id === @chef.id || @chef.is_admin === true
            @comment.update(comment_params)
            if @comment.save
                render json: @comment
            else
                render json: {error: true, message: 'Ooops.  Something went wrong updating the comment.'}
            end
        else
            render json: {error: true, message: "Unauthorized"}
        end
    end

    def destroy
        if @comment.chef_id === @chef.id || @chef.is_admin === true
            if Comment.find(params[:id]).update_attribute(:hidden, true)
                render json: Comment.getRecipesComments(@comment.recipe_id)
            else
                render json: false
            end
        else
            render json: {error: true, message: "Unauthorized"}
        end
    end

    private

    def define_current_comment
        @comment = Comment.find(params[:id])
    end

    def comment_params
        params.require(:comment).permit(:recipe_id, :chef_id, :comment)
    end

end
