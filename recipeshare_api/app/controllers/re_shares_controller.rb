class ReSharesController < ApplicationController

    def create
        # byebug
        if re_share_params["chef_id"] === @chef.id || @chef.is_admin === true
            @re_share = ReShare.create(re_share_params)
            if @re_share.save
                render json: true
            else
                render json: false
        else
            render json: {error: true, message: "Unauthorized"}
        end
    end

    def destroy
        if re_share_params["chef_id"] === @chef.id || @chef.is_admin === true
            @re_shares = ReShare.where(recipe_id: re_share_params["recipe_id"]).where(chef_id: re_share_params["chef_id"] )
            @recipe_ids = @re_shares.map { |like| like.id }
            if ReShare.destroy(@recipe_ids)
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
