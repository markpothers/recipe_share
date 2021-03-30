class AddShowBlogPreviewToRecipes < ActiveRecord::Migration[5.2]
  def change
    add_column :recipes, :show_blog_preview, :boolean, default: false
  end
end
