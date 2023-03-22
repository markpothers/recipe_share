# routes

Rails.application.routes.draw do

    scope 'api' do
        resources :instruction_images
        resources :instructions
        resources :re_shares
        resources :make_pics
        resources :comments
        resources :recipe_makes
        resources :recipe_likes
        resources :follows
        resources :friendships
        resources :ingredient_uses
        resources :recipe_images
        resources :recipes
        resources :ingredients
        resources :chefs
    end
    
      get '/api/activate', to: 'chefs#activate'
      get '/api/reactivate', to: 'chefs#reactivate'
      get '/api/password_reset', to: 'chefs#password_reset'
      post '/api/chefs/authenticate', to: 'chefs#authenticate'
      delete '/api/recipe_likes', to: 'recipe_likes#destroy'
      delete '/api/re_shares', to: 're_shares#destroy'
      delete '/api/follows', to: 'follows#destroy'
      get '/api/get_available_filters', to: 'recipes#get_available_filters'
      get '/api/database/manualbackup', to: 'databases#manualBackup'
      get '/api/database/autobackup', to: 'databases#autoBackup'
      get '/api/database/stopautobackup', to: 'databases#stopAutoBackup'
      get '/api/database/primaryrestore', to: 'databases#primaryRestore'
      get '/api/database/secondaryrestore', to: 'databases#secondaryRestore'
      get '*path' => redirect('/welcome.html')
      get '/' => redirect('/welcome.html')
      get '/support' => redirect('/support.html')
      # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
    end
    

    # application.rb
    require_relative 'boot'

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
require "sprockets/railtie"
require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module RecipeshareApi
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
	config.load_defaults 5.2

	# configure logging level to :warn if you want to stop base64 logging
	config.log_level = :debug
	# config.log_level = :info
	# config.log_level = :warn




    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true
  end
end


# cable.yml
development:
  adapter: async

test:
  adapter: async

production:
  adapter: redis
  url: <%= ENV.fetch("REDIS_URL") { "redis://localhost:6379/1" } %>
  channel_prefix: recipeshare_api_production




  # development.rb

  Rails.application.configure do
    # Settings specified here will take precedence over those in config/application.rb.
  
    # In the development environment your application's code is reloaded on
    # every request. This slows down response time but is perfect for development
    # since you don't have to restart the web server when you make code changes.
    config.cache_classes = false
  
    # Do not eager load code on boot.
    config.eager_load = true
  
    # Show full error reports.
    config.consider_all_requests_local = true
  
    # Enable/disable caching. By default caching is disabled.
    # Run rails dev:cache to toggle caching.
    if Rails.root.join('tmp', 'caching-dev.txt').exist?
      config.action_controller.perform_caching = true
  
      config.cache_store = :memory_store
      config.public_file_server.headers = {
        'Cache-Control' => "public, max-age=#{2.days.to_i}"
      }
    else
      config.action_controller.perform_caching = false
  
      config.cache_store = :null_store
    end
  
    # Store uploaded files on the local file system (see config/storage.yml for options)
    config.active_storage.service = :local
  
    # Don't care if the mailer can't send.
    config.action_mailer.raise_delivery_errors = false
  
    config.action_mailer.perform_caching = false
  
    # Print deprecation notices to the Rails logger.
    config.active_support.deprecation = :log
  
    # Raise an error on page load if there are pending migrations.
    config.active_record.migration_error = :page_load
  
    # Highlight code that triggered database queries in logs.
    config.active_record.verbose_query_logs = true
  
  
    # Raises error for missing translations
    # config.action_view.raise_on_missing_translations = true
  
    # Use an evented file watcher to asynchronously detect changes in source code,
    # routes, locales, etc. This feature depends on the listen gem.
    config.file_watcher = ActiveSupport::EventedFileUpdateChecker
  
    config.action_mailer.delivery_method = :sendmail
    config.action_mailer.perform_deliveries = true
    config.action_mailer.raise_delivery_errors = true
    config.action_mailer.default_options = {from: 'admin@recipe-share.com'}
  
    config.action_mailer.delivery_method = :smtp
    config.action_mailer.smtp_settings = Rails.application.credentials.email[:details]
  end

  
