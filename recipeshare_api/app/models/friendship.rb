class Friendship < ApplicationRecord
  belongs_to :requestor, class_name: "Chef", :foreign_key => "acceptor_id"
  belongs_to :acceptor, class_name: "Chef", :foreign_key => "requestor_id"
end
