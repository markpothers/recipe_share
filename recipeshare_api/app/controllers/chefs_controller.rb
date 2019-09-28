require 'securerandom'

class ChefsController < ApplicationController

    skip_before_action :logged_in?, :only => [:authenticate, :create, :activate, :password_reset, :reactivate]

    def authenticate
        if @chef = Chef.find_by(e_mail: chef_params[:e_mail])
            if !@chef.deactivated
                if @chef.activated
                    if (!@chef.password_is_auto) || (@chef.password_is_auto && (Time.now - @chef.password_created_at <= 86400))
                        if (@chef.authenticate(chef_params[:password]))
                            puts "logging in!"
                            render json: @chef, methods: [:auth_token]
                        else
                            puts "bad password"
                            render json: {error: true, message: 'password'}
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
            render json: {error: true, message: 'email'}
        end
    end

    def index
        @chefs = Chef.choose_list(params["listType"], params["queryChefID"], params["limit"], params["offset"], @chef.id)
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
                @chef.activation_digest = JWT.encode({id: @chef.id}, 'e9c25029ce138bee53480013fb005e5b')
                    if image_params[:imageURL] != ""
                        hex = SecureRandom.hex
                        until Chef.find_by(hex: hex) == nil
                            hex = SecureRandom.hex
                        end
                        File.open("public/chef_avatars/chef-avatar-#{hex}.jpg", 'wb') do |f|
                            f.write(Base64.decode64(image_params[:imageURL]))
                        end
                        @chef.imageURL = "/chef_avatars/chef-avatar-#{hex}.jpg"
                        @chef.hex=hex
                        @chef.save
                    end
                @chef.save
                ChefMailer.with(chef: @chef).account_activation.deliver_now
                render json: true
            else
                puts @chef.errors.full_messages
                render json: {error: true, message: @chef.errors.full_messages}
            end
        else
            render json: {error: true, message: ["Passwords do not match"] }
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
        @chef.username != chef_params[:username] ? @chef.update_attribute(:username, chef_params[:username]) : nil
        @chef.profile_text != chef_params[:profile_text] ? @chef.update_attribute(:profile_text, chef_params[:profile_text]) : nil
        @chef.country != chef_params[:country] ? @chef.update_attribute(:country, chef_params[:country]) : nil
        # byebug
        if image_params[:imageURL] != ""
            hex = SecureRandom.hex
            until Chef.find_by(hex: hex) == nil
                hex = SecureRandom.hex
            end
            File.open("public/chef_avatars/chef-avatar-#{hex}.jpg", 'wb') do |f|
                f.write(Base64.decode64(image_params[:imageURL]))
            end
            @chef.update_attribute(:imageURL, "/chef_avatars/chef-avatar-#{hex}.jpg")
            @chef.update_attribute(:hex, hex)
        end

        if chef_params[:updatingPassword]
            if chef_params[:password] == chef_params[:password_confirmation]
                @chef.password = chef_params[:password]
                @chef.password_confirmation = chef_params[:password_conformation]
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
        if @chef.deactivated  # reactivate chef
            @chef.update_attribute(:activation_digest, JWT.encode({id: @chef.id}, 'e9c25029ce138bee53480013fb005e5b'))
            ChefMailer.with(chef: @chef).reactivate_account.deliver_now
            render json: {error: false, message: "We've e-mailed you a link to re-activate your account."}
        else
            if @chef
                newHex = SecureRandom.hex(6)
                @chef.password = newHex
                @chef.password_confirmation = newHex
                @chef.password_is_auto = true
                @chef.password_created_at = Time.now
                @chef.save
                ChefMailer.with(chef: @chef, password: newHex).password_reset.deliver_now
                render json: {error: false, message: "We've sent you a new password.  Please check your e-mail"}
            else
                render json: {error: true, message: "Please enter your registered e-mail address to receive a new password."}
            end
        end
    end

    def reactivate
        @chef = Chef.find_by(e_mail: params[:email])
        if @chef.activation_digest == params[:token]
            @chef.update_attribute(:deactivated, false)
            @chef.update_attribute(:activation_digest, "")
            newHex = SecureRandom.hex(6)
            @chef.password = newHex
            @chef.password_confirmation = newHex
            @chef.password_is_auto = true
            @chef.password_created_at = Time.now
            @chef.save
            ChefMailer.with(chef: @chef, password: newHex).password_reset.deliver_now
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
        params.require(:chef).permit(:imageURL)
    end

    def list_params
        params.require(:chef).permit(:allRecipes, :listType, :limit, :offset, :ranking, :chef_id)
    end

end
