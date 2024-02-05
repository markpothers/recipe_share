class InstructionImagesController < ApplicationController

    skip_before_action :verify_authenticity_token
    
    def create
        if instruction_image_params["chef_id"] === @chef.id || @chef.is_admin === true
            image = instruction_image_params
            # byebug
            if image["base64"] != nil && image["base64"] != ""
                instruction_image = InstructionImage.new(instruction_id: image["instruction_id"])
                hex = ApplicationRecord.get_file_name()
                mediaURL = ApplicationRecord.save_image(Rails.application.credentials.buckets[Rails.env.to_sym][:instruction_images], hex, image["base64"])
                instruction_image.image_url = mediaURL
                instruction_image.hex = hex
            elsif image["image_id"] != 0
                instruction_image = InstructionImage.find(image["image_id"])
                instruction_image.instruction_id = image["instruction_id"]
            end
            instruction_image.hidden = false
            if instruction_image.save
                render json: true
            else
                render json: {error: true, message: instruction_image.errors.full_messages}
            end
        else
            render json: {error: true, message: "Unauthorized"}
        end

    end

    private

    def instruction_image_params
        params.require(:instruction_image).permit(:chef_id, :instruction_id, :image_id, :base64)
    end

end
