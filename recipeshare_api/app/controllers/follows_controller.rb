class FollowsController < ApplicationController

    before_action :define_current_follow
    skip_before_action :define_current_follow, :only => [:index, :create, :check, :destroy]


    # def index
    #     render json: Follow.all
    # end

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
        # byebug
        if follow_params[:follower_id] === @chef.id || @chef.is_admin === true
            @follow = Follow.find_or_create_by(follow_params)
            @follow.hidden = false
            if @follow.save
                render json: @follow
            else
                render json: {error: true, message: @follow.errors.full_messages}
            end
        else
            render json: {error: true, message: "Unauthorized"}
        end
    end

    # def show
    #     render json: @follow
    # end

    # def edit
    #     render json: @follow
    # end

    # def update
    #     @follow.update(follow_params)
    #     if @follow.save
    #         render json: @follow
    #     else
    #         render json: {error: true, message: 'Ooops.  Something went wrong updating the follow.'}
    #     end
    # end
    
    def destroy
        # byebug
        if follow_params[:follower_id] === @chef.id || @chef.is_admin === true
            @follows = Follow.where(follower_id: follow_params["follower_id"], followee_id: follow_params["followee_id"])
            @follow_ids = @follows.map { |like| like.id }
            if Follow.find(@follow_ids).each { |follow| follow.update_attribute(:hidden, true) }
                render json: true
            else
                render json: false
            end
        else
            render json: {error: true, message: "Unauthorized"}
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
