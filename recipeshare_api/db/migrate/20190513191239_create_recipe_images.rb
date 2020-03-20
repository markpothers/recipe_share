class CreateRecipeImages < ActiveRecord::Migration[5.2]
  def change
    create_table :recipe_images do |t|
      t.string :name
      t.belongs_to :recipe, foreign_key: true
      t.string :image_url
      t.string :hex

      t.timestamps
    end
  end
end
