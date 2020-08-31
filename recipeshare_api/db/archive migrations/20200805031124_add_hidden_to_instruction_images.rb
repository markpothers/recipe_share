class AddHiddenToInstructionImages < ActiveRecord::Migration[5.2]
  def change
    add_column :instruction_images, :hidden, :boolean, default: false
  end
end
