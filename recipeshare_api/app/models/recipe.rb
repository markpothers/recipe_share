class Recipe < ApplicationRecord

  belongs_to :chef
  has_many :ingredient_uses
  has_many :ingredients, through: :ingredient_uses
  has_many :recipe_likes
  has_many :likers, :through => :recipe_likes, :source => :chef
  has_many :comments
  has_many :commenters, :through => :comments, :source => :chef
  has_many :recipe_makes
  has_many :makers, :through => :recipe_makes, :source => :chef

  accepts_nested_attributes_for :ingredient_uses


end
