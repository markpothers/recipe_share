Rails.application.routes.draw do
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

  get '/account_activation', to: 'chefs#activate'
  get '/password_reset', to: 'chefs#password_reset'
  get 'forgot_password', to: 'chefs#forgot_password'
  post '/login', to: 'chefs#authenticate'
  delete '/recipe_likes', to: 'recipe_likes#destroy'
  delete '/re_shares', to: 're_shares#destroy'
  delete '/follows', to: 'follows#destroy'
  get '/database/manualbackup', to: 'databases#manualBackup'
  get '/database/autobackup', to: 'databases#autoBackup'
  get '/database/stopautobackup', to: 'databases#stopAutoBackup'
  get '/database/primaryrestore', to: 'databases#primaryRestore'
  get '/database/secondaryrestore', to: 'databases#secondaryRestore'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
