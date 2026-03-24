module JwtConfig
  module_function

  def env_scoped_credential(key_suffix)
    Rails.application.credentials.dig(:JWT, "#{Rails.env}_#{key_suffix}".to_sym)
  end

  def secret_key
    ENV["JWT_SECRET_KEY"].presence ||
      env_scoped_credential("secret_key").presence ||
      Rails.application.credentials.dig(:JWT, :secret_key)
  end

  def issuer
    ENV["JWT_ISSUER"].presence ||
      env_scoped_credential("issuer").presence ||
      Rails.application.credentials.dig(:JWT, :issuer).presence ||
      "recipe-share-#{Rails.env}"
  end

  def audience
    ENV["JWT_AUDIENCE"].presence ||
      env_scoped_credential("audience").presence ||
      Rails.application.credentials.dig(:JWT, :audience).presence ||
      "recipe-share-mobile-#{Rails.env}"
  end

  def auth_token_ttl_seconds
    env_value = ENV["JWT_AUTH_TTL_SECONDS"].presence
    return env_value.to_i if env_value

    credential_value = env_scoped_credential("auth_token_ttl_seconds") ||
      Rails.application.credentials.dig(:JWT, :auth_token_ttl_seconds)
    return credential_value.to_i if credential_value

    30.days.to_i
  end
end
