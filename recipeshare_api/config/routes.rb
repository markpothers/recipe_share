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
  resources :sessions, only: [:new, :create, :destroy, :index]

  # get '/', to: 'recipes#index', as:'home'
  post '/login', to: 'chefs#authenticate'
  # post '/recipes/index', to: 'recipes#index'
  # post '/recipes/details', to: 'recipes#details'
  post '/chefs/index', to: 'chefs#index'
  post '/chefs/details', to: 'chefs#index'
  delete '/recipe_likes', to: 'recipe_likes#destroy'
  delete '/re_shares', to: 're_shares#destroy'
  post '/follows/check', to: 'follows#check'
  delete '/follows', to: 'follows#destroy'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
