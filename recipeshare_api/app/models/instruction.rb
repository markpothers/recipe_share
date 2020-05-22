class Instruction < ApplicationRecord
  belongs_to :recipe
  has_many :instruction_images
end