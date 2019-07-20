class CreateRecipes < ActiveRecord::Migration[5.2]
  def change
    create_table :recipes do |t|
      t.string :name
      t.belongs_to :chef, foreign_key: true
      t.string :time
      t.integer :difficulty
      t.string :instructions
      t.boolean :hidden, default: false
      t.boolean :breakfast
      t.boolean :lunch
      t.boolean :dinner
      t.boolean :dessert
      t.boolean :vegetarian
      t.boolean :vegan
      t.boolean :salad
      t.boolean :soup
      t.boolean :side
      t.boolean :chicken
      t.boolean :red_meat
      t.boolean :seafood
      t.boolean :whole_30
      t.boolean :paleo
      t.boolean :keto
      t.boolean :gluten_free
      t.boolean :freezer_meal
      t.boolean :weeknight
      t.boolean :weekend
      t.boolean :bread
      t.boolean :dairy_free
      t.boolean :white_meat
      t.string :cuisine
      t.string :serves

      t.timestamps
    end
  end
end
