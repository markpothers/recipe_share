require "securerandom"

class MakePicsController < ApplicationController
  def create
    # byebug
    if make_pic_params["chef_id"] == @chef.id || @chef.is_admin == true
      if make_pic_params[:base64] != ""
        @make_pic = MakePic.new(recipe_id: make_pic_params[:recipe_id], chef_id: make_pic_params[:chef_id])
        hex = ApplicationRecord.get_file_name()
        mediaURL = ApplicationRecord.save_image(Rails.application.credentials.buckets[:make_pics], hex, make_pic_params[:base64])
        @make_pic.image_url = mediaURL
        @make_pic.hex = hex
        @make_pic.save
      end
      if @make_pic.save
        puts @make_pic.errors.full_messages
        @make_pic.image_url = ApplicationRecord.get_signed_url(@make_pic.image_url)
        @make_pic.image_url
        make_pic_data = {
          make_pic: @make_pic,
          make_pic_chef: {
            id: @chef.id,
            profile_text: @chef.profile_text,
            username: @chef.username,
            image_url: ApplicationRecord.get_signed_url(@chef.image_url),
          },
        }
        puts make_pic_data
        render json: make_pic_data
      else
        render json: false
      end
    else
      render json: { error: true, message: "Unauthorized" }
    end
  end

  def destroy
    @make_pic = MakePic.find(params[:id])
    if @make_pic.chef_id === @chef.id || @chef.is_admin === true
      if MakePic.find(params[:id]).update_attribute(:hidden, true)
        render json: true
      else
        render json: false
      end
    else
      render json: { error: true, message: "Unauthorized" }
    end
  end

  private

  def make_pic_params
    params.require(:recipe).permit(:recipe_id, :chef_id, :base64)
  end
end
