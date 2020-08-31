class AddDeactivatedColumnToChefs < ActiveRecord::Migration[5.2]
  def change
    add_column :chefs, :deactivated, :boolean, default: false
  end
end
