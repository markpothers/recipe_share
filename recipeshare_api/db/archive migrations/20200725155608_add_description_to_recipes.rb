class AddDescriptionToRecipes < ActiveRecord::Migration[5.2]
  def change
    add_column :recipes, :description, :string
  end
end
