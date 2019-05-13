Rails.application.routes.draw do
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

  get '/', to: 'recipes#index', as:'home'
  post '/login', to: 'users#authenticate'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
