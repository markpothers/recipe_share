class CreateReShares < ActiveRecord::Migration[5.2]
  def change
    create_table :re_shares do |t|
      t.belongs_to :recipe, foreign_key: true
      t.belongs_to :chef, foreign_key: true
      t.boolean :hidden, :default => false

      t.timestamps
    end
  end
end
