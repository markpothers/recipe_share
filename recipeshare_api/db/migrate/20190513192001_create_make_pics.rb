class CreateMakePics < ActiveRecord::Migration[5.2]
  def change
    create_table :make_pics do |t|
      t.belongs_to :chef, foreign_key: true
      t.belongs_to :recipe, foreign_key: true
      t.string :image_url
      t.string :hex
      t.boolean :hidden, :default => false
      t.string :comment

      t.timestamps
    end
  end
end
