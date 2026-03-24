class ApplicationController < ActionController::Base
  before_action :logged_in?

  def logged_in?
    # byebug

    token = request.headers["Authorization"].split(" ")[1]
    decode_options = {
      algorithm: "HS256",
      verify_iss: true,
      iss: JwtConfig.issuer,
      verify_aud: true,
      aud: JwtConfig.audience,
      verify_expiration: true,
    }
    payload = JWT.decode(token, JwtConfig.secret_key, true, decode_options)[0]
    if Chef.find(payload["id"])
      @chef = Chef.find(payload["id"])
      if @chef.activated
        # byebug
        true # i.e. the user is logged in
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
