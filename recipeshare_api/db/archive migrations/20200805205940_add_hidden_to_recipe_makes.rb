class AddHiddenToRecipeMakes < ActiveRecord::Migration[5.2]
  def change
    add_column :recipe_makes, :hidden, :boolean, default: false
  end
end
