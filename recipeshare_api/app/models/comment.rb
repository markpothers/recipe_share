class Comment < ApplicationRecord
  belongs_to :chef
  belongs_to :recipe

  def self.getRecipesComments(recipe_id)
    comments = Comment.find_by_sql(["SELECT comments.*, chefs.username, chefs.image_url
                                  FROM comments
                                  JOIN chefs ON chefs.id = comments.chef_id
                                  WHERE comments.recipe_id = ?
                                  AND comments.hidden = false
                                  ORDER BY comments.created_at DESC", recipe_id])
    comments.each { |comment| comment.image_url = ApplicationRecord.get_signed_url(comment.image_url) }
    return comments
  end

end
