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

  def self.choose_list(type = "global_ranks", chef_id = 44, limit = 50, offset = 0, ranking = "made")
    #types = "all", "chef", "chef_liked", "chef_made", "global_ranks" // "liked", "made"
    if type == "all"
      Recipe.order(created_at: :desc) # all recipes ordered most-recent first
            .limit(limit)
            .offset(offset)

    elsif type == "chef" # recipes created by me ordered most-recent first
      Recipe.where(chef_id: chef_id)
            .order(created_at: :desc)
            .limit(limit)
            .offset(offset)

    elsif type == "chef_liked" # recipes liked by use_chef ordered by most-recently liked
      Recipe.joins(:recipe_likes)
            .where({ recipe_likes: { chef_id: chef_id }})
            .order("recipe_likes.created_at desc")
            .limit(limit)
            .offset(offset)

    elsif type == "chef_made" # recipes liked by use_chef ordered by most-recently liked
      Recipe.joins(:recipe_makes)
            .where({ recipe_makes: { chef_id: chef_id }})
            .order("recipe_makes.created_at desc")
            .limit(limit)
            .offset(offset)

    elsif type =="global_ranks" # recipes according to their global rankings # with filter based on chef name working if needed

        chefFilter = ""  # "WHERE recipes.chef_id = #{chef_id}"  # stitutute this line in if needed

        if ranking == "made"
            table = "recipe_makes"
        else # if ranking == "liked"
            table= "recipe_likes"
        end

        #insert this to add rank "ROW_NUMBER() OVER(ORDER BY COUNT(recipe_likes.recipe_id) DESC) AS Row"

        ApplicationRecord.db.execute("SELECT
                                        recipes.*, COUNT(#{table}.recipe_id)
                                        FROM #{table}
                                        JOIN recipes ON #{table}.recipe_id = recipes.id
                                        #{chefFilter}
                                        GROUP BY #{table}.recipe_id
                                        ORDER BY count(#{table}.recipe_id) DESC
                                        LIMIT #{limit}
                                        OFFSET #{offset}")

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

end