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
  get '/api/database/manualbackup', to: 'databases#manualBackup'
  get '/api/database/autobackup', to: 'databases#autoBackup'
  get '/api/database/stopautobackup', to: 'databases#stopAutoBackup'
  get '/api/database/primaryrestore', to: 'databases#primaryRestore'
  get '/api/database/secondaryrestore', to: 'databases#secondaryRestore'
  get '*path' => redirect('/welcome.html')
  get '/' => redirect('/welcome.html')
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
