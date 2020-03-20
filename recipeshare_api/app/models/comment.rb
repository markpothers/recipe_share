class Comment < ApplicationRecord
  belongs_to :chef
  belongs_to :recipe

  def self.getRecipesComments(recipe_id)
    ApplicationRecord.db.exec("SELECT comments.*, chefs.username, chefs.image_url
                                  FROM comments
                                  JOIN chefs ON chefs.id = comments.chef_id
                                  WHERE comments.recipe_id = $1
                                  ORDER BY comments.created_at DESC", [recipe_id])
  end

end
