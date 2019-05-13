class CreateFollows < ActiveRecord::Migration[5.2]
  def change
    create_table :follows do |t|
      t.belongs_to :followee
      t.belongs_to :follower

      t.timestamps
    end
  end
end
