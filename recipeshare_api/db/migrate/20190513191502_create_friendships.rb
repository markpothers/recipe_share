class CreateFriendships < ActiveRecord::Migration[5.2]
  def change
    create_table :friendships do |t|
      t.belongs_to :requestor
      t.belongs_to :acceptor

      t.timestamps
    end
  end
end
