class ChefsController < ApplicationController

    # skip_before_action :verify_authenticity_token
    # skip_before_action :authenticate, :only => [:new, :create]
    before_action :define_current_chef
    skip_before_action :define_current_chef, :only => [:index, :create]

    def authenticate
        @chef = Chef.find_by(name: parmas[:name])
        if @chef.authenticate(params[:password])
            render json: @chef, methods: [:auth_token]
        else
            render json: {error: true, message: 'Invalid Login'}
        end
    end

    def index
        render json: Chef.all
    end

    # def new
    #     render json: {chef: Chef.new}
    # end

    def create
        if chef_params[:password] === chef_params[:password_confirmation]
            @chef = Chef.new(chef_params)
                if @chef.save
                    render json: @chef, methods: [:auth_token]
                else
                    render json: {error: true, message: 'User could not be saved for reasons which need to be specified'}
                end
        else
            render json: {error: true, message: "Password confirmation did not match password", chef: chef_params}
        end
    end

    def show
        render json: @chef
    end

    # def edit
    # end

    def update
        @chef.update(chef_params)
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
        params.require(:chef).permit(:first_name, :last_name, :username, :password, :password_confirmation, :password_digest, :country, :imageURL)
    end

end
