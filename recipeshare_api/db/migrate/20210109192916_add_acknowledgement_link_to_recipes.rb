class AddAcknowledgementLinkToRecipes < ActiveRecord::Migration[5.2]
  def change
    add_column :recipes, :acknowledgement_link, :string
  end
end
