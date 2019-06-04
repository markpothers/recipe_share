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

  accepts_nested_attributes_for :ingredient_uses

  has_many_attached :images

  def self.choose_list(type = "global_ranks", chef_id = 1, limit = 1, offset = 0, ranking = "liked", owner_id = 1)
    #types = "all", "chef", "chef_liked", "chef_made", "global_ranks" // "liked", "made"
    if type == "all"

      ApplicationRecord.db.execute("SELECT recipes.*, recipe_images.imageURL
                                    FROM recipes
                                    JOIN recipe_images ON recipe_images.recipe_id = recipes.id
                                    WHERE hidden=0
                                    ORDER BY (recipes.created_at) DESC
                                    LIMIT (?)
                                    OFFSET (?)", [limit, offset])

    elsif type == "chef" # recipes created by me ordered most-recent first

      ApplicationRecord.db.execute("SELECT recipes.*, recipe_images.imageURL
                                    FROM recipes
                                    JOIN recipe_images ON recipe_images.recipe_id = recipes.id
                                    WHERE hidden=0 AND chef_id = ?
                                    ORDER BY (recipes.created_at) DESC
                                    LIMIT (?)
                                    OFFSET (?)", [chef_id, limit, offset])

    elsif type == "chef_feed" # recipes created by me ordered most-recent first

      ApplicationRecord.db.execute("SELECT recipes.id, recipes.name, recipes.chef_id, recipes.time, recipes.difficulty, recipes.instructions, recipes.created_at, recipe_images.imageURL, follows.followee_id, follows.follower_id
                                    FROM recipes
                                    JOIN recipe_images ON recipe_images.recipe_id = recipes.id
                                    JOIN follows ON recipes.chef_id = followee_id
                                    WHERE follows.follower_id = ?
                                    ORDER BY (recipes.created_at) DESC
                                    LIMIT (?)
                                    OFFSET (?)", [owner_id, limit, offset])

    elsif type == "chef_liked" # recipes liked by use_chef ordered by most-recently liked

      ApplicationRecord.db.execute("SELECT recipes.id, recipes.name, recipes.chef_id, recipes.time, recipes.difficulty, recipes.instructions, recipe_likes.created_at, recipe_likes.chef_id, recipe_images.imageURL
                                    FROM recipes
                                    JOIN recipe_images ON recipe_images.recipe_id = recipes.id
                                    JOIN recipe_likes ON recipe_likes.recipe_id = recipes.id
                                    WHERE (recipes.hidden=0 AND recipe_likes.chef_id = ?)
                                    ORDER BY (recipe_likes.created_at) DESC
                                    LIMIT (?)
                                    OFFSET (?)", [chef_id, limit, offset])

    elsif type == "chef_made" # recipes liked by use_chef ordered by most-recently liked

      recipes = ApplicationRecord.db.execute("SELECT recipes.id, recipes.name, recipes.chef_id, recipes.time, recipes.difficulty, recipes.instructions, recipe_makes.created_at, recipe_makes.chef_id, recipe_images.imageURL
                                    FROM recipes
                                    JOIN recipe_images ON recipe_images.recipe_id = recipes.id
                                    JOIN recipe_makes ON recipe_makes.recipe_id = recipes.id
                                    WHERE (recipes.hidden=0 AND recipe_makes.chef_id = ?)
                                    ORDER BY (recipe_makes.created_at) DESC
                                    LIMIT (?)
                                    OFFSET (?)", [chef_id, limit, offset])

    elsif type =="global_ranks" # recipes according to their global rankings # with filter based on chef name working if needed

        chefFilter = ""  # "WHERE recipes.chef_id = #{chef_id}"  # stitutute this line in if needed

        if ranking == "made"
            table = "recipe_makes"
        else # if ranking == "liked"
            table= "recipe_likes"
        end

        #insert this to add rank "ROW_NUMBER() OVER(ORDER BY COUNT(recipe_likes.recipe_id) DESC) AS Row"

      ApplicationRecord.db.execute("SELECT
                                    recipes.*, recipe_images.imageURL, COUNT(#{table}.recipe_id) As count
                                    FROM #{table}
                                    JOIN recipes ON #{table}.recipe_id = recipes.id
                                    JOIN recipe_images ON recipe_images.recipe_id = recipes.id
                                    WHERE hidden=0
                                    #{chefFilter}
                                    GROUP BY #{table}.recipe_id
                                    ORDER BY count(#{table}.recipe_id) DESC
                                    LIMIT (?)
                                    OFFSET (?)", [limit, offset])


            # correct SQL query:
            # SELECT ROW_NUMBER() OVER(ORDER BY COUNT(recipe_likes.recipe_id) DESC) AS Row,
            # recipes.*, COUNT(recipe_likes.recipe_id)
            # FROM recipe_likes
            # JOIN recipes ON recipe_likes.recipe_id = recipes.id
            # GROUP BY recipe_likes.recipe_id
            # ORDER BY count(recipe_likes.recipe_id) DESC
            # LIMIT 50
            # OFFSET 0


    else # if all else fails, just show all recipes ordered most recent first
      Recipe.order(created_at: :desc)
            .limit(limit)
            .offset(offset)
    end
  end

  def ingredients=(ingredients)
    ingredients["ingredients"].keys.each do |ingredient|
      dbIngredient = Ingredient.find_or_create_by(name: ingredients["ingredients"][ingredient]["name"])
      IngredientUse.create(recipe_id: self.id, ingredient_id: dbIngredient.id, quantity: ingredients["ingredients"][ingredient]["quantity"], unit: ingredients["ingredients"][ingredient]["unit"])
    end
  end

  def get_details(chef)
    # byebug
    if (RecipeMake.where(chef_id: chef.id).where(recipe_id: self.id).last && Time.now - RecipeMake.where(chef_id: chef.id).where(recipe_id: self.id).last.created_at > 86400) || !RecipeMake.where(chef_id: chef.id).where(recipe_id: self.id).last
      makeable = true
    else
        makeable = false
    end
    ingredientUses = IngredientUse.where(recipe_id: self.id)
    ingredients_ids = ingredientUses.map do |use|
        use = use.ingredient_id
    end
    return recipe_details = {recipe: self,
        comments: Comment.where(recipe_id: self.id),
        recipe_images: RecipeImage.where(recipe_id: self.id),
        recipe_likes: RecipeLike.where(recipe_id: self.id).length,
        likeable: RecipeLike.where(chef_id: chef.id).where(recipe_id: self.id).empty?,
        recipe_makes: RecipeMake.where(recipe_id: self.id).length,
        makeable: makeable,
        make_pics: MakePic.where(recipe_id: self.id),
        ingredient_uses: ingredientUses,
        ingredients: Ingredient.where(id: ingredients_ids)
    }
  end


end