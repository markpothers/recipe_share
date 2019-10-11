class ApplicationController < ActionController::API

    before_action :logged_in?

    def logged_in?
        # byebug
        begin
            token = request.headers['Authorization'].split(" ")[1]
            payload = JWT.decode(token,  Rails.application.credentials.JWT[:secret_key])[0]
            if Chef.find(payload["id"])
                @chef = Chef.find(payload["id"])
                if @chef.activated
                    # byebug
                    return true # i.e. the user is logged in
                else
                    render json: {error: true, message: "This user is not yet active"}
                end

            else # couldn't find chef in database
                render json: {error: true, message: "Could not find user in the database"}
            end
        rescue # bad token
            # byebug
            render json: {error: true, message: "Invalid authentication"}
        end
    end

    def self.upload_file

    end

end
