class FriendshipsController < ApplicationController

    # skip_before_action :verify_authenticity_token
    before_action :define_current_friendship
    skip_before_action :define_current_friendship, :only => [:index, :create]

    def index
        render json: Friendship.all
    end

    # def new
    #     @friendship = Friendship.new
    # end

    def create
        @friendship = Friendship.create(friendship_params)
        if @friendship.save
            render json: @friendship
        else
            render json: {error: true, message: 'Ooops.  Something went wrong saving the friendship.'}
        end
    end

    def show
        render json: @friendship
    end

    # def edit
    #     render json: @friendship
    # end

    def update
        @friendship.update(friendship_params)
        if @friendship.save
            render json: @friendship
        else
            render json: {error: true, message: 'Ooops.  Something went wrong updating the friendship.'}
        end
    end

    def destroy
        if @friendship.destroy
            render json: {message: "friendship deleted!"}
        else
            render json: {error: true, message: "Ooops.  That's embarassing.  We couldn't delete that friendship.  You shouldn't even be able to see this message!"}
        end
    end

    private

    def define_current_friendship
        @friendship = Friendship.find(params[:id])
    end

    def friendship_params
        params.require(:friendship).permit(:recipe_id, :chef_id, :time, :difficulty, :comment, :tastiness)
    end

end
