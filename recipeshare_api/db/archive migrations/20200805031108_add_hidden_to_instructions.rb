class AddHiddenToInstructions < ActiveRecord::Migration[5.2]
  def change
    add_column :instructions, :hidden, :boolean, default: false
  end
end
