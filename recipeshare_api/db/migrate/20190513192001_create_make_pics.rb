class CreateMakePics < ActiveRecord::Migration[5.2]
  def change
    create_table :make_pics do |t|
      t.belongs_to :chef, foreign_key: true
      t.belongs_to :recipe, foreign_key: true
      t.string :imageURL
      t.string :hex

      t.timestamps
    end
  end
end
