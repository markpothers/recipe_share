class RecipeImagesController < ApplicationController

    skip_before_action :verify_authenticity_token
    
def create
    if recipe_image_params["chef_id"] === @chef.id || @chef.is_admin === true
        image = recipe_image_params
        if image["base64"] != nil && image["base64"] != ""
            recipe_image = RecipeImage.new(recipe_id: image["recipe_id"])
            hex = ApplicationRecord.get_file_name()
            mediaURL = ApplicationRecord.save_image(Rails.application.credentials.buckets[Rails.env.to_sym][:recipe_images], hex, image["base64"])
            recipe_image.image_url = mediaURL
            recipe_image.hex = hex
        elsif image["image_id"] != 0
            recipe_image = RecipeImage.find(image["image_id"])
            recipe_image.recipe_id = image["recipe_id"]
        else # if the image is just nothing i.e. they submitted an empty slot
            render json: true
            return
        end
        recipe_image.index = image["image_index"]
        recipe_image.hidden = false
        if recipe_image.save
            render json: true
        else
            render json: {error: true, message: recipe_image.errors.full_messages}
        end
    else
        render json: {error: true, message: "Unauthorized"}
    end

end

private

def recipe_image_params
    params.require(:recipe_image).permit(:chef_id, :recipe_id, :image_id, :image_index, :base64)
end

end
