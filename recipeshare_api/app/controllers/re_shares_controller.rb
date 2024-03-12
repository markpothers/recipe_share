class ReSharesController < ApplicationController

    skip_before_action :verify_authenticity_token
    
    def create
        # byebug
        if re_share_params["chef_id"] === @chef.id || @chef.is_admin === true
            @re_share = ReShare.find_or_create_by(re_share_params)
            @re_share.hidden = false
            if @re_share.save
                render json: true
            else
                render json: false
            end
        else
            render json: {error: true, message: "Unauthorized"}
        end
    end

    def destroy
        if re_share_params["chef_id"] === @chef.id || @chef.is_admin === true
            @re_shares = ReShare.where(recipe_id: re_share_params["recipe_id"], chef_id: re_share_params["chef_id"])
            @recipe_ids = @re_shares.map { |like| like.id }
            if ReShare.find(@recipe_ids).each { |re_share| re_share.update_attribute(:hidden, true) }
                render json: true
            else
                render json: {message: false}
            end
        else
            render json: {error: true, message: "Unauthorized"}
        end
    end

    private

    # def define_current_re_share
    #     @re_share = ReShare.find(params[:id])
    # end

    def re_share_params
        params.require(:recipe).permit(:recipe_id, :chef_id)
    end

end
