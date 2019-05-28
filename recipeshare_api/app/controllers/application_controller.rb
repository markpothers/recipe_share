class ApplicationController < ActionController::API

    #    protect_from_forgery with: :exception

    #    before_action :authenticate

    # def authenticate
    #     if session[:username] == nil
    #         redirect_to '/sessions/new'
    #     end
    # end

    before_action :logged_in?
    # before_action :define_current_chef

    def logged_in?
        # byebug
        begin
            token = request.headers['Authorization'].split(" ")[1]
            payload = JWT.decode(token, 'my_secret_phrase')[0]
            if Chef.find(payload["id"])
                @chef = Chef.find(payload["id"])
                return true # i.e. the user is logged in
            else # couldn't find chef in database
                render json: {error: true, message: "Could not find user in Application Controller logged_in? method"}
            end
        rescue # bad token
            render json: {error: true, message: "Invalid authentication with JWT"}
        end
    end

    # def define_current_chef
    #     @chef = Chef.find(payload['id'])
    # end


end
