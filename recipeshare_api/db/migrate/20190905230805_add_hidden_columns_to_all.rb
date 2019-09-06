class AddHiddenColumnsToAll < ActiveRecord::Migration[5.2]
  def change
    add_column :re_shares, :hidden, :boolean, default: false
    add_column :make_pics, :hidden, :boolean, default: false
    add_column :comments, :hidden, :boolean, default: false
    add_column :recipe_images, :hidden, :boolean, default: false
    add_column :recipe_likes, :hidden, :boolean, default: false
    add_column :follows, :hidden, :boolean, default: false
    add_column :friendships, :hidden, :boolean, default: false
  end
end