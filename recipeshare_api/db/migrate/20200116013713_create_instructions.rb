class CreateInstructions < ActiveRecord::Migration[5.2]
  def change
    create_table :instructions do |t|
      t.string :instruction
      t.integer :step
      t.belongs_to :recipe, foreign_key: true
      t.boolean :hidden, :default => false

      t.timestamps
    end
  end
end
