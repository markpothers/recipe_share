class Follow < ApplicationRecord
  belongs_to :follower, class_name: "Chef", :foreign_key => "follower_id"
  belongs_to :followee, class_name: "Chef", :foreign_key => "followee_id"
end
