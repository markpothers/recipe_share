require 'securerandom'

class MakePicsController < ApplicationController

    def create
        # byebug
        if make_pic_params[:base64] != ""
            @make_pic = MakePic.create(recipe_id: make_pic_params[:recipe_id], chef_id: make_pic_params[:chef_id])
            hex = SecureRandom.hex
            until MakePic.find_by(hex: hex) == nil
                hex = SecureRandom.hex
            end
            File.open("public/make_pic_files/make_pic_#{hex}.jpg", 'wb') do |f|
                f.write(Base64.decode64(make_pic_params[:base64]))
            end
            @make_pic.imageURL = "/make_pic_files/make_pic_#{hex}.jpg"
            @make_pic.hex=hex
            @make_pic.save
        end
        if @make_pic.save
            render json: @make_pic
        else
            render json: false
        end
    end

    def destroy
        @make_pic = MakePic.find(params[:id])
        if @make_pic.chef_id === @chef.id || @chef.is_admin === true
            if MakePic.destroy(params[:id])
                render json: true
            else
                render json: false
            end
        else
            render json: {error: true, message: "Unauthorized"}
        end
    end


    private

    def make_pic_params
        params.require(:recipe).permit(:recipe_id, :chef_id, :base64)
    end

end
