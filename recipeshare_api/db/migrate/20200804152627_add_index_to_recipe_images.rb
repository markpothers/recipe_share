class AddIndexToRecipeImages < ActiveRecord::Migration[5.2]
  def change
    add_column :recipe_images, :index, :integer
  end
end
