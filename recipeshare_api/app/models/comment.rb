class Comment < ApplicationRecord
  belongs_to :chef
  belongs_to :recipe
end
