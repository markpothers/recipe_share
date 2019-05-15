class RecipeMake < ApplicationRecord

  belongs_to :chef
  belongs_to :recipe

  has_many_attached :images

end
