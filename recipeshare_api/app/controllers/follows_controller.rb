class FollowsController < ApplicationController

    # skip_before_action :verify_authenticity_token
    before_action :define_current_follow
    skip_before_action :define_current_follow, :only => [:index, :create, :check, :destroy]


    def index
        render json: Follow.all
    end

    def check
        # byebug
        if Follow.where(follower_id: follow_params["follower_id"]).where(followee_id: follow_params["followee_id"]) != []
            render json: true
        else
            render json: false
        end
    end

    # def new
    #     @follow = follow.new
    # end

    def create
        @follow = Follow.create(follow_params)
        if @follow.save
            render json: @follow
        else
            render json: {error: true, message: @follow.errors.full_messages}
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
        @follows = Follow.where(follower_id: follow_params["follower_id"]).where(followee_id: follow_params["followee_id"] )
        @follow_ids = @follows.map { |like| like.id }
        if Follow.destroy(@follow_ids)
            render json: true
        else
            render json: false
        end
    end

    private

    def define_current_follow
        @follow = Follow.find(params[:id])
    end

    def follow_params
        params.require(:follow).permit(:follower_id, :followee_id)
    end

end
