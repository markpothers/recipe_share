class CreateIngredientUses < ActiveRecord::Migration[5.2]
  def change
    create_table :ingredient_uses do |t|
      t.belongs_to :recipe, foreign_key: true
      t.belongs_to :ingredient, foreign_key: true
      t.string :quantity
      t.string :unit
      t.integer :index
      t.boolean :hidden, :default => false

      t.timestamps
    end
  end
end
