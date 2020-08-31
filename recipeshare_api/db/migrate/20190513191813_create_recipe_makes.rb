class CreateRecipeMakes < ActiveRecord::Migration[5.2]
  def change
    create_table :recipe_makes do |t|
      t.belongs_to :chef, foreign_key: true
      t.belongs_to :recipe, foreign_key: true
      t.integer :time
      t.integer :difficulty
      t.string :comment
      t.integer :tastiness
      t.boolean :hidden, :default => false

      t.timestamps
    end
  end
end
