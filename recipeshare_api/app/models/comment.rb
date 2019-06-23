class Comment < ApplicationRecord
  belongs_to :chef
  belongs_to :recipe

  def self.getRecipesComments(recipe_id)
    ApplicationRecord.db.execute("SELECT comments.*, chefs.username, chefs.imageURL
                                  FROM comments
                                  JOIN chefs ON chefs.id = comments.chef_id
                                  WHERE comments.recipe_id = (?)
                                  ORDER BY comments.created_at DESC", [recipe_id])
  end

end
