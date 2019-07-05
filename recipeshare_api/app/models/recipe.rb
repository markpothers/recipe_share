class Recipe < ApplicationRecord

  belongs_to :chef
  has_many :ingredient_uses
  has_many :ingredients, through: :ingredient_uses
  has_many :recipe_likes
  has_many :likers, :through => :recipe_likes, :source => :chef
  has_many :comments
  has_many :commenters, :through => :comments, :source => :chef
  has_many :recipe_makes
  has_many :makers, :through => :recipe_makes, :source => :chef
  has_many :re_shares
  has_many :sharers, :through => :re_shares, :source => :chef

  accepts_nested_attributes_for :ingredient_uses

  has_many_attached :images

  def self.choose_list(type = "all", query_chef_id = 1, limit = 1, offset = 0, ranking = "liked", user_chef_id = 1)
    #types = "all", "chef", "chef_liked", "chef_made", "most_liked", "most_made" // "liked", "made"
    if type == "all"

      # ApplicationRecord.db.execute("SELECT recipes.*, recipe_images.imageURL
      #                               FROM recipes
      #                               JOIN recipe_images ON recipe_images.recipe_id = recipes.id
      #                               WHERE hidden=0
      #                               ORDER BY (recipes.updated_at) DESC
      #                               LIMIT (?)
      #                               OFFSET (?)", [limit, offset])
# byebug

      ApplicationRecord.db.execute("SELECT recipes.*, recipe_images.imageURL,
                                    chefs.username ,chefs.imageURL as chefImageURL,
                                      (SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id) As sharesCount,
                                      (SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.chef_id = (?)) As chef_shared,
                                      (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id) As likesCount,
                                      (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.chef_id = (?)) As chef_liked,
                                      (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id) As makesCount,
                                      (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.chef_id = (?)) As chef_made,
                                      (SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id) As commentsCount,
                                      (SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.chef_id = (?)) As chef_commented
                                    FROM recipes
                                    LEFT OUTER JOIN recipe_images ON recipe_images.recipe_id = recipes.id
                                    LEFT OUTER JOIN chefs ON recipes.chef_id = chefs.id
                                    LEFT OUTER JOIN re_shares ON recipes.id = re_shares.recipe_id
                                    LEFT OUTER JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
                                    LEFT OUTER JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
                                    LEFT OUTER JOIN comments ON recipes.id = comments.recipe_id
                                    WHERE recipes.hidden=0
                                    GROUP BY recipes.id
                                    ORDER BY recipes.updated_at DESC
                                    LIMIT (?)
                                    OFFSET (?)", [user_chef_id, user_chef_id, user_chef_id, user_chef_id, limit, offset])

    elsif type == "chef" # recipes created by me ordered most-recent first

      # ApplicationRecord.db.execute("SELECT recipes.*, recipe_images.imageURL
      #                               FROM recipes
      #                               JOIN recipe_images ON recipe_images.recipe_id = recipes.id
      #                               WHERE hidden=0 AND chef_id = ?
      #                               ORDER BY (recipes.updated_at) DESC
      #                               LIMIT (?)
      #                               OFFSET (?)", [chef_id, limit, offset])

      ApplicationRecord.db.execute("SELECT recipes.*, recipe_images.imageURL,
                                      chefs.username ,chefs.imageURL as chefImageURL,
                                        (SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id) As sharesCount,
                                        (SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.chef_id = (?)) As chef_shared,
                                        (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id) As likesCount,
                                        (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.chef_id = (?)) As chef_liked,
                                        (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id) As makesCount,
                                        (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.chef_id = (?)) As chef_made,
                                        (SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id) As commentsCount,
                                        (SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.chef_id = (?)) As chef_commented
                                      FROM recipes
                                      LEFT OUTER JOIN recipe_images ON recipe_images.recipe_id = recipes.id
                                      LEFT OUTER JOIN chefs ON recipes.chef_id = chefs.id
                                      LEFT OUTER JOIN re_shares ON recipes.id = re_shares.recipe_id
                                      LEFT OUTER JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
                                      LEFT OUTER JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
                                      LEFT OUTER JOIN comments ON recipes.id = comments.recipe_id
                                      WHERE recipes.hidden=0 AND recipes.chef_id = (?)
                                      GROUP BY recipes.id
                                      ORDER BY recipes.updated_at DESC
                                      LIMIT (?)
                                      OFFSET (?)", [user_chef_id, user_chef_id, user_chef_id, user_chef_id, user_chef_id, limit, offset])

    elsif type == "chef_feed" # recipes by chefs I follow ordered most-recent first

      # ApplicationRecord.db.execute("SELECT recipes.id, recipes.name, recipes.chef_id, recipes.time, recipes.difficulty, recipes.instructions, recipes.updated_at, recipe_images.imageURL, follows.followee_id, follows.follower_id
      #                               FROM recipes
      #                               JOIN recipe_images ON recipe_images.recipe_id = recipes.id
      #                               JOIN follows ON recipes.chef_id = followee_id
      #                               WHERE follows.follower_id = ?
      #                               ORDER BY (recipes.updated_at) DESC
      #                               LIMIT (?)
      #                               OFFSET (?)", [owner_id, limit, offset])

      ApplicationRecord.db.execute("SELECT recipes.*, recipe_images.imageURL,
                                    chefs.username ,chefs.imageURL as chefImageURL, sharers.sharer_username, sharers.sharer_id, sharers.shared_id,
                                      (SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id) As sharesCount,
                                      (SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.chef_id = (?)) As chef_shared,
                                      (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id) As likesCount,
                                      (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.chef_id = (?)) As chef_liked,
                                      (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id) As makesCount,
                                      (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.chef_id = (?)) As chef_made,
                                      (SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id) As commentsCount,
                                      (SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.chef_id = (?)) As chef_commented
                                    FROM recipes
                                    LEFT OUTER JOIN recipe_images ON recipe_images.recipe_id = recipes.id
                                    LEFT OUTER JOIN chefs ON recipes.chef_id = chefs.id
                                    LEFT OUTER JOIN re_shares ON recipes.id = re_shares.recipe_id
                                    LEFT OUTER JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
                                    LEFT OUTER JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
                                    LEFT OUTER JOIN comments ON recipes.id = comments.recipe_id
                                    LEFT OUTER JOIN (
                                        SELECT chefs.username AS sharer_username, chefs.id AS sharer_id, re_shares.recipe_id AS shared_id
                                        FROM chefs
                                        JOIN re_shares ON chefs.id = re_shares.chef_id
                                        WHERE re_shares.chef_id IN (SELECT follows.followee_id FROM follows WHERE follower_id = (?))
                                        GROUP BY re_shares.recipe_id
                                        ) AS sharers ON recipes.id = shared_id
                                    JOIN follows ON recipes.chef_id = followee_id
                                    WHERE recipes.hidden=0 AND ( follows.follower_id = (?) OR re_shares.chef_id IN (SELECT follows.followee_id FROM follows WHERE follower_id = (?)))
                                    GROUP BY recipes.id
                                    ORDER BY recipes.updated_at DESC
                                      LIMIT (?)
                                      OFFSET (?)", [user_chef_id, user_chef_id, user_chef_id, user_chef_id, user_chef_id, user_chef_id, user_chef_id, limit, offset])

    elsif type == "chef_liked" # recipes liked by use_chef ordered by most-recently liked

      # ApplicationRecord.db.execute("SELECT recipes.id, recipes.name, recipes.chef_id, recipes.time, recipes.difficulty, recipes.instructions, recipe_likes.updated_at, recipe_likes.chef_id, recipe_images.imageURL
      #                               FROM recipes
      #                               JOIN recipe_images ON recipe_images.recipe_id = recipes.id
      #                               JOIN recipe_likes ON recipe_likes.recipe_id = recipes.id
      #                               WHERE (recipes.hidden=0 AND recipe_likes.chef_id = ?)
      #                               ORDER BY (recipe_likes.updated_at) DESC
      #                               LIMIT (?)
      #                               OFFSET (?)", [chef_id, limit, offset])

        ApplicationRecord.db.execute("SELECT recipes.*, recipe_images.imageURL,
                                      chefs.username ,chefs.imageURL as chefImageURL,
                                        (SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id) As sharesCount,
                                        (SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.chef_id = (?)) As chef_shared,
                                        (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id) As likesCount,
                                        (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.chef_id = (?)) As chef_liked,
                                        (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id) As makesCount,
                                        (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.chef_id = (?)) As chef_made,
                                        (SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id) As commentsCount,
                                        (SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.chef_id = (?)) As chef_commented
                                      FROM recipes
                                      LEFT OUTER JOIN recipe_images ON recipe_images.recipe_id = recipes.id
                                      LEFT OUTER JOIN chefs ON recipes.chef_id = chefs.id
                                      LEFT OUTER JOIN re_shares ON recipes.id = re_shares.recipe_id
                                      LEFT OUTER JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
                                      LEFT OUTER JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
                                      LEFT OUTER JOIN comments ON recipes.id = comments.recipe_id
                                      WHERE recipes.hidden=0 AND (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.chef_id = (?))>0
                                      GROUP BY recipes.id
                                      ORDER BY recipes.updated_at DESC
                                      LIMIT (?)
                                      OFFSET (?)", [user_chef_id, user_chef_id, user_chef_id, user_chef_id, user_chef_id, limit, offset])
  
    elsif type == "chef_made" # recipes liked by use_chef ordered by most-recently liked

      # recipes = ApplicationRecord.db.execute("SELECT recipes.id, recipes.name, recipes.chef_id, recipes.time, recipes.difficulty, recipes.instructions, recipe_makes.updated_at, recipe_makes.chef_id, recipe_images.imageURL
      #                               FROM recipes
      #                               JOIN recipe_images ON recipe_images.recipe_id = recipes.id
      #                               JOIN recipe_makes ON recipe_makes.recipe_id = recipes.id
      #                               WHERE (recipes.hidden=0 AND recipe_makes.chef_id = ?)
      #                               ORDER BY (recipe_makes.updated_at) DESC
      #                               LIMIT (?)
      #                               OFFSET (?)", [chef_id, limit, offset])

        ApplicationRecord.db.execute("SELECT recipes.*, recipe_images.imageURL,
                                      chefs.username ,chefs.imageURL as chefImageURL,
                                        (SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id) As sharesCount,
                                        (SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.chef_id = (?)) As chef_shared,
                                        (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id) As likesCount,
                                        (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.chef_id = (?)) As chef_liked,
                                        (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id) As makesCount,
                                        (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.chef_id = (?)) As chef_made,
                                        (SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id) As commentsCount,
                                        (SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.chef_id = (?)) As chef_commented
                                      FROM recipes
                                      LEFT OUTER JOIN recipe_images ON recipe_images.recipe_id = recipes.id
                                      LEFT OUTER JOIN chefs ON recipes.chef_id = chefs.id
                                      LEFT OUTER JOIN re_shares ON recipes.id = re_shares.recipe_id
                                      LEFT OUTER JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
                                      LEFT OUTER JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
                                      LEFT OUTER JOIN comments ON recipes.id = comments.recipe_id
                                      WHERE recipes.hidden=0 AND (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.chef_id = (?))>0
                                      GROUP BY recipes.id
                                      ORDER BY recipes.updated_at DESC
                                      LIMIT (?)
                                      OFFSET (?)", [user_chef_id, user_chef_id, user_chef_id, user_chef_id, user_chef_id, limit, offset])

    elsif type =="most_liked" # recipes according to their global rankings # with filter based on chef name working if needed

        chefFilter = ""  # "WHERE recipes.chef_id = #{chef_id}"  # stitutute this line in if needed

        #insert this to add rank "ROW_NUMBER() OVER(ORDER BY COUNT(recipe_likes.recipe_id) DESC) AS Row"

      # ApplicationRecord.db.execute("SELECT
      #                               recipes.*, recipe_images.imageURL, COUNT(recipe_likes.recipe_id) As count
      #                               FROM recipe_likes
      #                               JOIN recipes ON recipe_likes.recipe_id = recipes.id
      #                               JOIN recipe_images ON recipe_images.recipe_id = recipes.id
      #                               WHERE hidden=0
      #                               #{chefFilter}
      #                               GROUP BY recipe_likes.recipe_id
      #                               ORDER BY count(recipe_likes.recipe_id) DESC
      #                               LIMIT (?)
      #                               OFFSET (?)", [limit, offset])

        ApplicationRecord.db.execute("SELECT recipes.*, recipe_images.imageURL,
                                      chefs.username ,chefs.imageURL as chefImageURL,
                                        (SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id) As sharesCount,
                                        (SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.chef_id = (?)) As chef_shared,
                                        (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id) As likesCount,
                                        (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.chef_id = (?)) As chef_liked,
                                        (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id) As makesCount,
                                        (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.chef_id = (?)) As chef_made,
                                        (SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id) As commentsCount,
                                        (SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.chef_id = (?)) As chef_commented
                                      FROM recipes
                                      LEFT OUTER JOIN recipe_images ON recipe_images.recipe_id = recipes.id
                                      LEFT OUTER JOIN chefs ON recipes.chef_id = chefs.id
                                      LEFT OUTER JOIN re_shares ON recipes.id = re_shares.recipe_id
                                      LEFT OUTER JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
                                      LEFT OUTER JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
                                      LEFT OUTER JOIN comments ON recipes.id = comments.recipe_id
                                      WHERE recipes.hidden=0
                                      GROUP BY recipes.id
                                      ORDER BY (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id) DESC
                                      LIMIT (?)
                                      OFFSET (?)", [user_chef_id, user_chef_id, user_chef_id, user_chef_id, limit, offset])
  

            # correct SQL query:
            # SELECT ROW_NUMBER() OVER(ORDER BY COUNT(recipe_likes.recipe_id) DESC) AS Row,
            # recipes.*, COUNT(recipe_likes.recipe_id)
            # FROM recipe_likes
            # JOIN recipes ON recipe_likes.recipe_id = recipes.id
            # GROUP BY recipe_likes.recipe_id
            # ORDER BY count(recipe_likes.recipe_id) DESC
            # LIMIT 50
            # OFFSET 0

    elsif type =="most_made" # recipes according to their global rankings # with filter based on chef name working if needed

      chefFilter = ""  # "WHERE recipes.chef_id = #{chef_id}"  # stitutute this line in if needed

    # ApplicationRecord.db.execute("SELECT
    #                               recipes.*, recipe_images.imageURL, COUNT(recipe_makes.recipe_id) As count
    #                               FROM recipe_makes
    #                               JOIN recipes ON recipe_makes.recipe_id = recipes.id
    #                               JOIN recipe_images ON recipe_images.recipe_id = recipes.id
    #                               WHERE hidden=0
    #                               #{chefFilter}
    #                               GROUP BY recipe_makes.recipe_id
    #                               ORDER BY count(recipe_makes.recipe_id) DESC
    #                               LIMIT (?)
    #                               OFFSET (?)", [limit, offset])

    ApplicationRecord.db.execute("SELECT recipes.*, recipe_images.imageURL,
                                chefs.username ,chefs.imageURL as chefImageURL,
                                  (SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id) As sharesCount,
                                  (SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.chef_id = (?)) As chef_shared,
                                  (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id) As likesCount,
                                  (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.chef_id = (?)) As chef_liked,
                                  (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id) As makesCount,
                                  (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.chef_id = (?)) As chef_made,
                                  (SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id) As commentsCount,
                                  (SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.chef_id = (?)) As chef_commented
                                FROM recipes
                                LEFT OUTER JOIN recipe_images ON recipe_images.recipe_id = recipes.id
                                LEFT OUTER JOIN chefs ON recipes.chef_id = chefs.id
                                LEFT OUTER JOIN re_shares ON recipes.id = re_shares.recipe_id
                                LEFT OUTER JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
                                LEFT OUTER JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
                                LEFT OUTER JOIN comments ON recipes.id = comments.recipe_id
                                WHERE recipes.hidden=0
                                GROUP BY recipes.id
                                ORDER BY (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id) DESC
                                LIMIT (?)
                                OFFSET (?)", [user_chef_id, user_chef_id, user_chef_id, user_chef_id, limit, offset])

    else # if all else fails, just show all recipes ordered most recent first

    ApplicationRecord.db.execute("SELECT recipes.*, recipe_images.imageURL,
                                chefs.username ,chefs.imageURL as chefImageURL,
                                  (SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id) As sharesCount,
                                  (SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.chef_id = (?)) As chef_shared,
                                  (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id) As likesCount,
                                  (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.chef_id = (?)) As chef_liked,
                                  (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id) As makesCount,
                                  (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.chef_id = (?)) As chef_made,
                                  (SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id) As commentsCount,
                                  (SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.chef_id = (?)) As chef_commented
                                FROM recipes
                                LEFT OUTER JOIN recipe_images ON recipe_images.recipe_id = recipes.id
                                LEFT OUTER JOIN chefs ON recipes.chef_id = chefs.id
                                LEFT OUTER JOIN re_shares ON recipes.id = re_shares.recipe_id
                                LEFT OUTER JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
                                LEFT OUTER JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
                                LEFT OUTER JOIN comments ON recipes.id = comments.recipe_id
                                WHERE recipes.hidden=0
                                GROUP BY recipes.id
                                ORDER BY recipes.updated_at DESC
                                LIMIT (?)
                                OFFSET (?)", [user_chef_id, user_chef_id, user_chef_id, user_chef_id, limit, offset])
byebug
    end
  end

  def ingredients=(ingredients)
    IngredientUse.where(recipe_id: self.id).destroy_all
    ingredients["ingredients"].keys.each do |ingredient|
      dbIngredient = Ingredient.find_or_create_by(name: ingredients["ingredients"][ingredient]["name"])
      ing_use = IngredientUse.find_or_create_by(recipe_id: self.id, ingredient_id: dbIngredient.id, quantity: ingredients["ingredients"][ingredient]["quantity"], unit: ingredients["ingredients"][ingredient]["unit"])
    end
  end

  def get_details(chef)
    # byebug
    if (RecipeMake.where(chef_id: chef.id).where(recipe_id: self.id).last && Time.now - RecipeMake.where(chef_id: chef.id).where(recipe_id: self.id).last.updated_at > 86400) || !RecipeMake.where(chef_id: chef.id).where(recipe_id: self.id).last
      makeable = true
    else
        makeable = false
    end
    ingredientUses = IngredientUse.where(recipe_id: self.id)
    ingredients_ids = ingredientUses.map do |use|
        use = use.ingredient_id
    end
    return recipe_details = {recipe: self,
        comments: ApplicationRecord.db.execute("SELECT comments.*, chefs.username, chefs.imageURL
                                                FROM comments
                                                JOIN chefs ON chefs.id = comments.chef_id
                                                WHERE comments.recipe_id = (?)
                                                ORDER BY comments.updated_at DESC", [self.id]),
        recipe_images: RecipeImage.where(recipe_id: self.id),
        recipe_likes: RecipeLike.where(recipe_id: self.id).length,
        likeable: RecipeLike.where(chef_id: chef.id).where(recipe_id: self.id).empty?,
        recipe_makes: RecipeMake.where(recipe_id: self.id).length,
        makeable: makeable,
        make_pics: MakePic.where(recipe_id: self.id).order('updated_at DESC'),
        ingredient_uses: ingredientUses,
        ingredients: Ingredient.where(id: ingredients_ids)
    }
  end


end