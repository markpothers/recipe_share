class FollowsController < ApplicationController

    # skip_before_action :verify_authenticity_token
    before_action :define_current_follow
    skip_before_action :define_current_follow, :only => [:index, :create]


    def index
        render json: Follow.all
    end

    # def new
    #     @follow = follow.new
    # end

    def create
        @follow = Follow.create(follow_params)
        if @follow.save
            render json: @follow
        else
            render json: {error: true, message: 'Ooops.  Something went wrong saving the follow.'}
        end
    end

    def show
        render json: @follow
    end

    # def edit
    #     render json: @follow
    # end

    def update
        @follow.update(follow_params)
        if @follow.save
            render json: @follow
        else
            render json: {error: true, message: 'Ooops.  Something went wrong updating the follow.'}
        end
    end

    def destroy
        if @follow.destroy
            render json: {message: "follow deleted!"}
        else
            render json: {error: true, message: "Ooops.  That's embarassing.  We couldn't delete that follow.  You shouldn't even be able to see this message!"}
        end
    end

    private

    def define_current_follow
        @follow = Follow.find(params[:id])
    end

    def follow_params
        params.require(:follow).permit(:recipe_id, :chef_id, :time, :difficulty, :comment, :tastiness)
    end

end
