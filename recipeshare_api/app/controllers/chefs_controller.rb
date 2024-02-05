require 'securerandom'

class ChefsController < ApplicationController

    skip_before_action :logged_in?, :only => [:authenticate, :create, :activate, :password_reset, :reactivate]
    skip_before_action :verify_authenticity_token
    
    def authenticate
        # byebug
        if @chef = Chef.find_by(e_mail: chef_params[:e_mail])
            if !@chef.deactivated
                if @chef.activated
                    if (!@chef.password_is_auto) || (@chef.password_is_auto && (Time.now - @chef.password_created_at <= 86400))
                        if (@chef.authenticate(chef_params[:password]))
                            @chef.image_url = ApplicationRecord.get_signed_url(@chef.image_url)
                            puts "logging in!"
                            render json: @chef, methods: [:auth_token]
                        else
                            puts "bad password"
                            render json: {error: true, message: 'invalid'}
                        end
                    else
                        puts "auto password expired"
                        render json: {error: true, message: "password_expired"}
                    end
                else
                    puts "account hasn't been activated"
                    render json: {error: true, message: "activation"}
                end
            else
                puts "account has been deactivated"
                render json: {error: true, message: "deactivated"}
            end
        else
            puts "bad e-mail address"
            render json: {error: true, message: 'invalid'}
        end
    end

    def index
        # byebug
        @chefs = Chef.choose_list(params["listType"], params["queryChefID"], params["limit"], params["offset"], params["search_term"], @chef.id)
        # byebug
        @chefs = Chef.get_signed_urls(@chefs)
        render json: @chefs
    end

    # def new
    #     render json: {chef: Chef.new}
    # end

    def create
        if chef_params[:password] === chef_params[:password_confirmation]
            @chef = Chef.new(chef_params)
            @chef.password_is_auto = false
            @chef.password_created_at = Time.now
            if @chef.save
                @chef.activation_digest = JWT.encode({id: @chef.id},  Rails.application.credentials.JWT[:secret_key])
                    if image_params[:image_url] != ""
                        hex = ApplicationRecord.get_file_name()
                        mediaURL = ApplicationRecord.save_image(Rails.application.credentials.buckets[Rails.env.to_sym][:chef_avatars], hex, image_params[:image_url])
                        @chef.image_url = mediaURL
                        @chef.hex=hex
                        @chef.save
                    end
                @chef.save
                ChefMailer.with(chef: @chef).account_activation.deliver_now
                render json: true
            else
                puts @chef.errors.full_messages
                render json: {error: true, messages: @chef.errors.full_messages}
            end
        else
            render json: {error: true, messages: ["Passwords do not match"] }
        end
    end

    def activate
        @chef = Chef.find_by(e_mail: params[:email])
        if @chef.activation_digest == params[:token]
            @chef.update_attribute(:activated, true)
            @chef.update_attribute(:activation_digest, "")
            redirect_to '/account_confirmation/activated.html'
        else
            redirect_to '/account_confirmation/rejected.html'
        end
    end

    def show
        # byebug
        @queryChef = Chef.find(params[:id])
        render json: @queryChef.get_details(@chef)
    end

    # def edit
    #     byebug
    # end

    def update
        # byebug
        @chef = Chef.find(params[:id])
        if @chef.username != chef_params[:username]
            if !Chef.valid_attribute?(:username, chef_params[:username])
                render json: {error: true, message: ["Username must be unique and at least 3 characters"]}
                return
            else
                @chef.update_attribute(:username, chef_params[:username])
            end
        end
        @chef.profile_text != chef_params[:profile_text] ? @chef.update_attribute(:profile_text, chef_params[:profile_text]) : nil
        @chef.country != chef_params[:country] ? @chef.update_attribute(:country, chef_params[:country]) : nil
        if image_params[:image_url] == "DELETED"
            @chef.update_attribute(:image_url, "")
            @chef.update_attribute(:hex, "")
        elsif image_params[:image_url] != ""
            hex = ApplicationRecord.get_file_name()
            mediaURL = ApplicationRecord.save_image(Rails.application.credentials.buckets[Rails.env.to_sym][:chef_avatars], hex, image_params[:image_url])
            @chef.update_attribute(:image_url, mediaURL)
            @chef.update_attribute(:hex, hex)
        end
        @chef.image_url = ApplicationRecord.get_signed_url(@chef.image_url)

        if chef_params[:updatingPassword]
            if chef_params[:password] == chef_params[:password_confirmation]
				# byebug
                @chef.password = chef_params[:password]
                @chef.password_confirmation = chef_params[:password_confrmation]
                @chef.password_is_auto = false
                @chef.password_created_at = Time.now
                if @chef.save
                    render json: @chef, methods: [:auth_token]
                else
                    render json: {error: true, message: @chef.errors.full_messages}
                end
            else
                render json: {error: true, message: ["Passwords do not match"] }
            end
        else
            render json: @chef, methods: [:auth_token]
        end
    end

    def password_reset
        @chef = Chef.find_by(e_mail: params[:email])
        if @chef == nil
            render json: {error: true, message: "forgotPassword"}
        elsif @chef.deactivated  # reactivate chef
            @chef.update_attribute(:activation_digest, JWT.encode({id: @chef.id}, Rails.application.credentials.JWT[:secret_key]))
            ChefMailer.with(chef: @chef).reactivate_account.deliver_now
            render json: {error: true, message: "reactivate"}
        else
            if @chef
                newPassword = SecureRandom.base64(8)
                @chef.password = newPassword
                @chef.password_confirmation = newPassword
                @chef.password_is_auto = true
                @chef.password_created_at = Time.now
                @chef.save
                ChefMailer.with(chef: @chef, password: newPassword).password_reset.deliver_now
                render json: {error: true, message: "forgotPassword"}
            else
                render json: {error: true, message: "forgotPassword"}
            end
        end
    end

    def reactivate
        @chef = Chef.find_by(e_mail: params[:email])
        if @chef.activation_digest == params[:token]
            @chef.update_attribute(:deactivated, false)
            @chef.update_attribute(:activation_digest, "")
            newPassword = SecureRandom.base64(8)
            @chef.password = newPassword
            @chef.password_confirmation = newPassword
            @chef.password_is_auto = true
            @chef.password_created_at = Time.now
            @chef.save
            ChefMailer.with(chef: @chef, password: newPassword).password_reset.deliver_now
            redirect_to '/account_confirmation/reactivation_confirmed.html'
        else
            redirect_to '/account_confirmation/reactivation_rejected.html'
        end
    end

    def destroy
        # byebug
        if params[:deleteRecipes] === "true"
            @chef.hide_everything()
            render json: {error: false, deleted: true}
        else
            @chef.deactivate()
            render json: {error: false, deactivated: true}
        end
    end

    private

    def chef_params
        params.require(:chef).permit(:first_name, :last_name, :username, :e_mail, :password, :password_confirmation, :country, :profile_text, :updatingPassword)
    end

    def image_params
        params.require(:chef).permit(:image_url)
    end

    def list_params
        params.require(:chef).permit(:allRecipes, :listType, :limit, :offset, :ranking, :chef_id)
    end

end
