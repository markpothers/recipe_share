class AddAknowledgementToRecipes < ActiveRecord::Migration[5.2]
  def change
    add_column :recipes, :acknowledgement, :string
  end
end
