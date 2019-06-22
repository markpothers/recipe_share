class MakePicsController < ApplicationController

    def create
        # byebug
        # @make_pic = MakePic.create(make_pic_params)
        if make_pic_params[:base64] != ""
            @make_pic = MakePic.create(recipe_id: make_pic_params[:recipe_id], chef_id: make_pic_params[:chef_id])

            File.open("public/make_pic_files/make_pic_#{@make_pic.id}.jpg", 'wb') do |f|
                f.write(Base64.decode64(make_pic_params[:base64]))
            end
            puts "public/make_pic_files/make_pic_#{@make_pic.id}.jpg"
            @make_pic.imageURL = "/make_pic_files/make_pic_#{@make_pic.id}.jpg"
            @make_pic.save
        end
        if @make_pic.save
            render json: @make_pic
        else
            render json: false
        end
    end

    def destroy
        if MakePic.destroy(params[:id])
            render json: true
        else
            render json: false
        end
    end


    private

    def define_current_make_pic
        @make_pic = MakePic.find(params[:id])
    end

    def make_pic_params
        params.require(:recipe).permit(:recipe_id, :chef_id, :base64)
    end

end
