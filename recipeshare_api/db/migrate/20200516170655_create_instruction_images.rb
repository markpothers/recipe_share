class CreateInstructionImages < ActiveRecord::Migration[5.2]
  def change
    create_table :instruction_images do |t|
      t.string :name
      t.belongs_to :instruction, foreign_key: true
      t.string :image_url
      t.string :hex
      t.boolean :hidden, :default => false

      t.timestamps
    end
  end
end
