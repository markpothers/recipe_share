class AddPrepTimeAndCookTimeAndTotalTimeToRecipes < ActiveRecord::Migration[5.2]
  def change
    add_column :recipes, :prep_time, :integer, :default => 0
    add_column :recipes, :cook_time, :integer, :default => 0
    add_column :recipes, :total_time, :integer, :default => 0
  end
end