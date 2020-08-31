class AddIndexAndHiddenToIngredientUses < ActiveRecord::Migration[5.2]
  def change
    add_column :ingredient_uses, :index, :integer
    add_column :ingredient_uses, :hidden, :boolean, default: false
  end
end
