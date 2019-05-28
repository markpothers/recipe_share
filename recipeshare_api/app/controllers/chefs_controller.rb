class ChefsController < ApplicationController

    # skip_before_action :verify_authenticity_token
    # skip_before_action :authenticate, :only => [:new, :create]
    before_action :define_current_chef
    skip_before_action :define_current_chef, :only => [:index, :create, :authenticate]
    skip_before_action :logged_in?, :only => [:authenticate, :create]

    def authenticate
        if @chef = Chef.find_by(e_mail: chef_params[:e_mail])
            if @chef.authenticate(chef_params[:password])
                puts "logging in!"
                render json: @chef, methods: [:auth_token]
            else
                puts "bad password"
                render json: {error: true, message: 'password'}
            end
        else
            puts "bad e-mail address"
            render json: {error: true, message: 'email'}
        end
    end

    def index
        @chefs = Chef.choose_list
        render json: @chefs
    end

    # def new
    #     render json: {chef: Chef.new}
    # end

    def create
        if chef_params[:password] === chef_params[:password_confirmation]
            @chef = Chef.new(chef_params)
            if @chef.save
                if image_params[:imageURL] != ""
                    File.open("public/chef_avatars/chef-avatar-#{@chef.id}.jpg", 'wb') do |f|
                        f.write(Base64.decode64(image_params[:imageURL]))
                    end
                    @chef.imageURL = "/chef_avatars/chef-avatar-#{@chef.id}.jpg"
                    @chef.save
                end
                render json: @chef, methods: [:auth_token]
            else
                puts @chef.errors.full_messages
                render json: {error: true, message: @chef.errors.full_messages}
            end
        else
            render json: {error: true, message: ["Passwords do not match"] } #, chef: chef_params}
        end
    end

    def show
        # byebug
        render json: @chef
    end

    # def edit
    # end

    def update
        puts @chef
        puts params
        byebug
        @chef.update(imageURL: params[imageURL])

        if @chef.save

            render json: @chef, methods: [:auth_token]
        else
            render json: {error: true, message: "Chef updating failed for reasons that need to be specified", chef: chef_params}
        end
    end

    def destroy
        @chef.destroy
        render json: {message: "Chef deleted.  Sorry to see you go but thanks for checking us out."}
    end

    private

    def define_current_chef
        @chef = Chef.find(params[:id])
    end

    def chef_params
        params.require(:chef).permit(:first_name, :last_name, :username, :e_mail, :password, :password_confirmation, :country)
    end

    def image_params
        params.require(:chef).permit(:imageURL)
    end

end
