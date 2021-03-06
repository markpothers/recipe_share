require 'net/http'

class Recipe < ApplicationRecord

  belongs_to :chef
  has_many :ingredient_uses
  has_many :ingredients, through: :ingredient_uses
  has_many :instructions
  has_many :recipe_likes
  has_many :likers, :through => :recipe_likes, :source => :chef
  has_many :comments
  has_many :commenters, :through => :comments, :source => :chef
  has_many :recipe_makes
  has_many :makers, :through => :recipe_makes, :source => :chef
  has_many :re_shares
  has_many :sharers, :through => :re_shares, :source => :chef
  has_many :recipe_images

  accepts_nested_attributes_for :ingredient_uses

  validates :acknowledgement_link, url: { allow_blank: true }
  validate :acknowledgement_link_must_be_safe

  def acknowledgement_link_must_be_safe
    if acknowledgement_link.present?
      # byebug

      # NOTE that the below would be a good test however, since many links will be to amazon, it won't work
      # because amazon blocks automated links
      # I'll leave this out for now but if I can stop amazon doing that, I may do so
      # response = Net::HTTP.get_response(URI(self.acknowledgement_link)).code
      # if response != "200"
      #   errors.add(:acknowledgement_link, "does not work")
      # end
    end
  end

  def self.choose_list(type = "all", queryChefID = 1, limit = 1, offset = 0, ranking = "liked", user_chef_id = 1, filters="", cuisine="None", serves="Any", search_term="")
    #types = "all", "chef", "chef_liked", "chef_made", "most_liked", "most_made" // "liked", "made"

    # pg = ApplicationRecord.db

    filter_string=filters.split("/").map{|filter| filter.split(" ").join("_")}.map{|filter| "AND recipes.#{filter} = 't' "}.join("")

    if cuisine != "Any"
      cuisine_string="AND recipes.cuisine = '#{cuisine.split(" ").join("_")}' "
    else
      cuisine_string=""
    end

    serves_string = ""
    if serves != "Any"
      serves_string ="AND recipes.serves = '#{serves}'"
    end

    if type == "all"

        recipes_results = Recipe.find_by_sql(["SELECT DISTINCT recipes.*,
                                      MAX(ri.image_url) AS image_url,
                                      MAX(chefs.username) AS username,
                                      MAX(chefs.image_url) AS chefimage_url,
                                      COALESCE((SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.hidden = false), 0) AS shares_count,
                                      COALESCE((SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.hidden = false AND re_shares.chef_id = ?), 0) AS chef_shared,
                                      COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.hidden = false), 0) AS likes_count,
                                      COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.hidden = false AND recipe_likes.chef_id = ?), 0) AS chef_liked,
                                      COALESCE((SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.hidden = false), 0) AS makes_count,
                                      COALESCE((SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.hidden = false AND recipe_makes.chef_id = ?), 0) AS chef_made,
                                      COALESCE((SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.hidden = false), 0) AS comments_count,
                                      COALESCE((SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.hidden = false AND comments.chef_id = ?), 0) AS chef_commented
                                    FROM recipes
                                    LEFT OUTER JOIN (
                                      SELECT
                                      *,
                                      ROW_NUMBER() OVER(PARTITION BY ri.recipe_id ORDER BY index ASC) as row_num
                                      FROM recipe_images ri
                                      WHERE hidden = false
                                    ) ri ON ri.recipe_id = recipes.id AND ri.row_num = 1
                                    LEFT OUTER JOIN chefs ON recipes.chef_id = chefs.id
                                    LEFT OUTER JOIN re_shares ON recipes.id = re_shares.recipe_id
                                    LEFT OUTER JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
                                    LEFT OUTER JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
                                    LEFT OUTER JOIN comments ON recipes.id = comments.recipe_id
                                    WHERE recipes.hidden = false
                                    #{filter_string}
                                    #{cuisine_string}
									#{serves_string}
									AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
                                    GROUP BY recipes.id
                                    ORDER BY recipes.updated_at DESC
                                    LIMIT ?
                                    OFFSET ?", user_chef_id, user_chef_id, user_chef_id, user_chef_id, search_term.downcase(), limit, offset])

    elsif type == "chef" # recipes created by me ordered most-recent first

      recipes_results = Recipe.find_by_sql(["SELECT DISTINCT recipes.*, 
                                        MAX(ri.image_url) AS image_url,
                                        MAX(chefs.username) AS username,
                                        MAX(chefs.image_url) AS chefimage_url,
                                      COALESCE((SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.hidden = false), 0) AS shares_count,
                                      COALESCE((SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.hidden = false AND re_shares.chef_id = ?), 0) AS chef_shared,
                                      COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.hidden = false), 0) AS likes_count,
                                      COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.hidden = false AND recipe_likes.chef_id = ?), 0) AS chef_liked,
                                      COALESCE((SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.hidden = false), 0) AS makes_count,
                                      COALESCE((SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.hidden = false AND recipe_makes.chef_id = ?), 0) AS chef_made,
                                      COALESCE((SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.hidden = false), 0) AS comments_count,
                                      COALESCE((SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.hidden = false AND comments.chef_id = ?), 0) AS chef_commented
                                      FROM recipes
                                      LEFT OUTER JOIN (
                                        SELECT
                                        *,
                                        ROW_NUMBER() OVER(PARTITION BY ri.recipe_id ORDER BY index ASC) as row_num
                                        FROM recipe_images ri
                                        WHERE hidden = false
                                      ) ri ON ri.recipe_id = recipes.id AND ri.row_num = 1
                                      LEFT OUTER JOIN chefs ON recipes.chef_id = chefs.id
                                      LEFT OUTER JOIN re_shares ON recipes.id = re_shares.recipe_id
                                      LEFT OUTER JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
                                      LEFT OUTER JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
                                      LEFT OUTER JOIN comments ON recipes.id = comments.recipe_id
                                      WHERE recipes.hidden = false AND recipes.chef_id = ?
                                      #{filter_string}
                                      #{cuisine_string}
									  #{serves_string}
									  AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
                                      GROUP BY recipes.id
                                      ORDER BY recipes.updated_at DESC
                                      LIMIT ?
                                      OFFSET ?", user_chef_id, user_chef_id, user_chef_id, user_chef_id, queryChefID, search_term.downcase(), limit, offset])

    elsif type == "chef_feed" # recipes by chefs I follow ordered most-recent first

      recipes_results = Recipe.find_by_sql(["SELECT DISTINCT recipes.*,
                                    MAX(ri.image_url) AS image_url,
                                    MAX(chefs.username) AS username,
                                    MAX(chefs.image_url) AS chefimage_url,
                                    MAX(sharers.sharer_username) AS sharer_username,
                                    MAX(sharers.sharer_id) AS sharer_id,
                                    MAX(sharers.shared_id) AS shared_id,
                                    COALESCE((SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.hidden = false), 0) AS shares_count,
                                    COALESCE((SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.hidden = false AND re_shares.chef_id = ?), 0) AS chef_shared,
                                    COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.hidden = false), 0) AS likes_count,
                                    COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.hidden = false AND recipe_likes.chef_id = ?), 0) AS chef_liked,
                                    COALESCE((SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.hidden = false), 0) AS makes_count,
                                    COALESCE((SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.hidden = false AND recipe_makes.chef_id = ?), 0) AS chef_made,
                                    COALESCE((SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.hidden = false), 0) AS comments_count,
                                    COALESCE((SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.hidden = false AND comments.chef_id = ?), 0) AS chef_commented
                                    FROM recipes
                                    LEFT OUTER JOIN (
                                      SELECT
                                      *,
                                      ROW_NUMBER() OVER(PARTITION BY ri.recipe_id ORDER BY index ASC) as row_num
                                      FROM recipe_images ri
                                      WHERE hidden = false
                                    ) ri ON ri.recipe_id = recipes.id AND ri.row_num = 1
                                    LEFT OUTER JOIN chefs ON recipes.chef_id = chefs.id
                                    LEFT OUTER JOIN re_shares ON recipes.id = re_shares.recipe_id
                                    LEFT OUTER JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
                                    LEFT OUTER JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
                                    LEFT OUTER JOIN comments ON recipes.id = comments.recipe_id
                                    LEFT OUTER JOIN (
                                        SELECT chefs.username AS sharer_username, chefs.id AS sharer_id, re_shares.recipe_id AS shared_id
                                        FROM chefs
                                        JOIN re_shares ON chefs.id = re_shares.chef_id
                                        WHERE re_shares.chef_id IN (SELECT follows.followee_id FROM follows WHERE follower_id = ? AND follows.hidden = false)
                                        AND re_shares.hidden = false
                                        ) AS sharers ON recipes.id = shared_id
                                    JOIN follows ON recipes.chef_id = follows.followee_id
                                    WHERE recipes.hidden = false AND follows.hidden = false AND ( follows.follower_id = ? OR re_shares.chef_id IN (SELECT follows.followee_id FROM follows WHERE follower_id = ? AND follows.hidden = false))
                                    #{filter_string}
                                    #{cuisine_string}
									#{serves_string}
									AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
                                    GROUP BY recipes.id
                                    ORDER BY recipes.updated_at DESC
                                    LIMIT ?
                                    OFFSET ?", user_chef_id, user_chef_id, user_chef_id, user_chef_id, queryChefID, queryChefID, queryChefID, search_term.downcase(), limit, offset])

    elsif type == "chef_liked" # recipes liked by use_chef ordered by most-recently liked
# byebug
        recipes_results = Recipe.find_by_sql(["SELECT DISTINCT recipes.*,
                                      MAX(ri.image_url) AS image_url,
                                      MAX(chefs.username) AS username,
                                      MAX(chefs.image_url) AS chefimage_url,
                                      MAX(recipe_likes.updated_at) AS last_update,
                                      COALESCE((SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.hidden = false), 0) AS shares_count,
                                      COALESCE((SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.hidden = false AND re_shares.chef_id = ?), 0) AS chef_shared,
                                      COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.hidden = false), 0) AS likes_count,
                                      COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.hidden = false AND recipe_likes.chef_id = ?), 0) AS chef_liked,
                                      COALESCE((SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.hidden = false), 0) AS makes_count,
                                      COALESCE((SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.hidden = false AND recipe_makes.chef_id = ?), 0) AS chef_made,
                                      COALESCE((SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.hidden = false), 0) AS comments_count,
                                      COALESCE((SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.hidden = false AND comments.chef_id = ?), 0) AS chef_commented
                                      FROM recipes
                                      LEFT OUTER JOIN (
                                        SELECT
                                        *,
                                        ROW_NUMBER() OVER(PARTITION BY ri.recipe_id ORDER BY index ASC) as row_num
                                        FROM recipe_images ri
                                        WHERE hidden = false
                                      ) ri ON ri.recipe_id = recipes.id AND ri.row_num = 1
                                      LEFT OUTER JOIN chefs ON recipes.chef_id = chefs.id
                                      LEFT OUTER JOIN re_shares ON recipes.id = re_shares.recipe_id
                                      LEFT OUTER JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
                                      LEFT OUTER JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
                                      LEFT OUTER JOIN comments ON recipes.id = comments.recipe_id
                                      WHERE recipes.hidden = false AND (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.hidden = false AND recipe_likes.chef_id = ?)>0
                                      #{filter_string}
                                      #{cuisine_string}
									  #{serves_string}
									  AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
                                      GROUP BY recipes.id
                                      ORDER BY last_update DESC
                                      LIMIT ?
                                      OFFSET ?", user_chef_id, user_chef_id, user_chef_id, user_chef_id, queryChefID, search_term.downcase(), limit, offset])
  
    elsif type == "chef_made" # recipes liked by use_chef ordered by most-recently liked

        recipes_results = Recipe.find_by_sql(["SELECT DISTINCT recipes.*,
                                      MAX(ri.image_url) AS image_url,
                                      MAX(chefs.username) AS username,
                                      MAX(chefs.image_url) AS chefimage_url,
                                      MAX(recipe_likes.updated_at) AS last_update,
                                      COALESCE((SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.hidden = false), 0) AS shares_count,
                                      COALESCE((SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.hidden = false AND re_shares.chef_id = ?), 0) AS chef_shared,
                                      COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.hidden = false), 0) AS likes_count,
                                      COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.hidden = false AND recipe_likes.chef_id = ?), 0) AS chef_liked,
                                      COALESCE((SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.hidden = false), 0) AS makes_count,
                                      COALESCE((SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.hidden = false AND recipe_makes.chef_id = ?), 0) AS chef_made,
                                      COALESCE((SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.hidden = false), 0) AS comments_count,
                                      COALESCE((SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.hidden = false AND comments.chef_id = ?), 0) AS chef_commented
                                      FROM recipes
                                      LEFT OUTER JOIN (
                                        SELECT
                                        *,
                                        ROW_NUMBER() OVER(PARTITION BY ri.recipe_id ORDER BY index ASC) as row_num
                                        FROM recipe_images ri
                                        WHERE hidden = false
                                      ) ri ON ri.recipe_id = recipes.id AND ri.row_num = 1
                                      LEFT OUTER JOIN chefs ON recipes.chef_id = chefs.id
                                      LEFT OUTER JOIN re_shares ON recipes.id = re_shares.recipe_id
                                      LEFT OUTER JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
                                      LEFT OUTER JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
                                      LEFT OUTER JOIN comments ON recipes.id = comments.recipe_id
                                      WHERE recipes.hidden = false AND (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.hidden = false AND recipe_makes.chef_id = ?)>0
                                      #{filter_string}
                                      #{cuisine_string}
									  #{serves_string}
									  AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
                                      GROUP BY recipes.id
                                      ORDER BY last_update DESC
                                      LIMIT ?
                                      OFFSET ?", user_chef_id, user_chef_id, user_chef_id, user_chef_id, queryChefID, search_term.downcase(), limit, offset])

    elsif type =="most_liked" # recipes according to their global rankings # with filter bASed on chef name working if needed

        chefFilter = ""  # "WHERE recipes.chef_id = #{chef_id}"  # stitutute this line in if needed

     recipes_results = Recipe.find_by_sql(["SELECT DISTINCT recipes.*,
                                        MAX(ri.image_url) AS image_url,
                                        MAX(chefs.username) AS username,
                                        MAX(chefs.image_url) AS chefimage_url,
                                      COALESCE((SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.hidden = false), 0) AS shares_count,
                                      COALESCE((SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.hidden = false AND re_shares.chef_id = ?), 0) AS chef_shared,
                                      COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.hidden = false), 0) AS likes_count,
                                      COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.hidden = false AND recipe_likes.chef_id = ?), 0) AS chef_liked,
                                      COALESCE((SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.hidden = false), 0) AS makes_count,
                                      COALESCE((SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.hidden = false AND recipe_makes.chef_id = ?), 0) AS chef_made,
                                      COALESCE((SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.hidden = false), 0) AS comments_count,
                                      COALESCE((SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.hidden = false AND comments.chef_id = ?), 0) AS chef_commented
                                      FROM recipes
                                      LEFT OUTER JOIN (
                                        SELECT
                                        *,
                                        ROW_NUMBER() OVER(PARTITION BY ri.recipe_id ORDER BY index ASC) as row_num
                                        FROM recipe_images ri
                                        WHERE hidden = false
                                      ) ri ON ri.recipe_id = recipes.id AND ri.row_num = 1
                                      LEFT OUTER JOIN chefs ON recipes.chef_id = chefs.id
                                      LEFT OUTER JOIN re_shares ON recipes.id = re_shares.recipe_id
                                      LEFT OUTER JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
                                      LEFT OUTER JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
                                      LEFT OUTER JOIN comments ON recipes.id = comments.recipe_id
                                      WHERE recipes.hidden = false
                                      #{filter_string}
                                      #{cuisine_string}
									  #{serves_string}
									  AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
                                      GROUP BY recipes.id
                                      ORDER BY likes_count DESC
                                      LIMIT ?
                                      OFFSET ?", user_chef_id, user_chef_id, user_chef_id, user_chef_id, search_term.downcase(), limit, offset])

    elsif type =="most_made" # recipes according to their global rankings # with filter bASed on chef name working if needed

      chefFilter = ""  # "WHERE recipes.chef_id = #{chef_id}"  # stitutute this line in if needed
      recipes_results = Recipe.find_by_sql(["SELECT DISTINCT recipes.*,
                                  MAX(ri.image_url) AS image_url,
                                  MAX(chefs.username) AS username,
                                  MAX(chefs.image_url) AS chefimage_url,
                                COALESCE((SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.hidden = false), 0) AS shares_count,
                                COALESCE((SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.hidden = false AND re_shares.chef_id = ?), 0) AS chef_shared,
                                COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.hidden = false), 0) AS likes_count,
                                COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.hidden = false AND recipe_likes.chef_id = ?), 0) AS chef_liked,
                                COALESCE((SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.hidden = false), 0) AS makes_count,
                                COALESCE((SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.hidden = false AND recipe_makes.chef_id = ?), 0) AS chef_made,
                                COALESCE((SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.hidden = false), 0) AS comments_count,
                                COALESCE((SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.hidden = false AND comments.chef_id = ?), 0) AS chef_commented
                                FROM recipes
                                LEFT OUTER JOIN (
                                  SELECT
                                  *,
                                  ROW_NUMBER() OVER(PARTITION BY ri.recipe_id ORDER BY index ASC) as row_num
                                  FROM recipe_images ri
                                  WHERE hidden = false
                                ) ri ON ri.recipe_id = recipes.id AND ri.row_num = 1
                                LEFT OUTER JOIN chefs ON recipes.chef_id = chefs.id
                                LEFT OUTER JOIN re_shares ON recipes.id = re_shares.recipe_id
                                LEFT OUTER JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
                                LEFT OUTER JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
                                LEFT OUTER JOIN comments ON recipes.id = comments.recipe_id
                                WHERE recipes.hidden = false
                                #{filter_string}
                                #{cuisine_string}
								#{serves_string}
								AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
                                GROUP BY recipes.id
                                ORDER BY (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id) DESC
                                LIMIT ?
								OFFSET ?", user_chef_id, user_chef_id, user_chef_id, user_chef_id, search_term.downcase(), limit, offset])

    else # if all else fails, just show all recipes ordered most recent first

    recipes_results = Recipe.find_by_sql(["SELECT DISTINCT recipes.*,
                                  MAX(ri.image_url) AS image_url,
                                  MAX(chefs.username) AS username,
                                  MAX(chefs.image_url) AS chefimage_url,
                                COALESCE((SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.hidden = false), 0) AS shares_count,
                                COALESCE((SELECT COUNT(*) FROM re_shares WHERE re_shares.recipe_id = recipes.id AND re_shares.hidden = false AND re_shares.chef_id = ?), 0) AS chef_shared,
                                COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.hidden = false), 0) AS likes_count,
                                COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.recipe_id = recipes.id AND recipe_likes.hidden = false AND recipe_likes.chef_id = ?), 0) AS chef_liked,
                                COALESCE((SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.hidden = false), 0) AS makes_count,
                                COALESCE((SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.recipe_id = recipes.id AND recipe_makes.hidden = false AND recipe_makes.chef_id = ?), 0) AS chef_made,
                                COALESCE((SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.hidden = false), 0) AS comments_count,
                                COALESCE((SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.hidden = false AND comments.chef_id = ?), 0) AS chef_commented
                                FROM recipes
                                LEFT OUTER JOIN (
                                  SELECT
                                  *,
                                  ROW_NUMBER() OVER(PARTITION BY ri.recipe_id ORDER BY index ASC) as row_num
                                  FROM recipe_images ri
                                  WHERE hidden = false
                                ) ri ON ri.recipe_id = recipes.id AND ri.row_num = 1
                                LEFT OUTER JOIN chefs ON recipes.chef_id = chefs.id
                                LEFT OUTER JOIN re_shares ON recipes.id = re_shares.recipe_id
                                LEFT OUTER JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
                                LEFT OUTER JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
                                LEFT OUTER JOIN comments ON recipes.id = comments.recipe_id
                                WHERE recipes.hidden = false
                                #{filter_string}
                                #{cuisine_string}
								#{serves_string}
								AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
                                GROUP BY recipes.id
                                ORDER BY recipes.updated_at DESC
                                LIMIT ?
                                OFFSET ?", user_chef_id, user_chef_id, user_chef_id, user_chef_id, search_term.downcase(), limit, offset])
# byebug
    end
    return recipes_results
  end

  def self.get_cuisines(type = "all", user_chef_id = 1, queryChefID = 1, filters="", serves="Any", search_term="")

    filter_string=filters.split("/").map{|filter| filter.split(" ").join("_")}.map{|filter| "AND recipes.#{filter} = 't' "}.join("")

    serves_string = ""
    if serves != "Any"
      serves_string ="AND recipes.serves = '#{serves}'"
    end

    if type == "chef" # recipes created by me ordered most-recent first

      cuisines = Recipe.find_by_sql([
          "SELECT DISTINCT recipes.cuisine
          FROM recipes
          WHERE recipes.hidden = false
          AND recipes.chef_id = ?
          #{filter_string}
          #{serves_string}
          AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
          ORDER BY recipes.cuisine",
          user_chef_id,
          search_term.downcase()
        ])

      elsif type == "chef_liked"  # recipes created by me ordered most-recent first

          # byebug
          cuisines = Recipe.find_by_sql([
              "SELECT DISTINCT recipes.cuisine
              FROM recipes
              JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
              WHERE recipes.hidden = false
              AND recipe_likes.hidden = false
              AND recipe_likes.chef_id = ?
              #{filter_string}
              #{serves_string}
              AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
              ORDER BY recipes.cuisine",
              queryChefID,
              search_term.downcase()
            ])

            # byebug

          elsif type == "chef_made"  # recipes created by me ordered most-recent first

            cuisines = Recipe.find_by_sql([
                "SELECT DISTINCT recipes.cuisine
                FROM recipes
                JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
                WHERE recipes.hidden = false
                AND recipe_makes.hidden = false
                AND recipe_makes.chef_id = ?
                #{filter_string}
                #{serves_string}
                AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
                ORDER BY recipes.cuisine",
                queryChefID,
                search_term.downcase()
              ])

    elsif type == "chef_feed" # recipes by chefs I follow ordered most-recent first

      cuisines = Recipe.find_by_sql([
        "SELECT DISTINCT recipes.cuisine
        FROM recipes
        LEFT OUTER JOIN re_shares ON recipes.id = re_shares.recipe_id
        LEFT OUTER JOIN (
        SELECT chefs.username AS sharer_username, chefs.id AS sharer_id, re_shares.recipe_id AS shared_id
        FROM chefs
        JOIN re_shares ON chefs.id = re_shares.chef_id
        WHERE re_shares.chef_id IN (SELECT follows.followee_id FROM follows WHERE follower_id = ? AND follows.hidden = false)
        AND re_shares.hidden = false
        ) AS sharers ON recipes.id = shared_id
        JOIN follows ON recipes.chef_id = follows.followee_id
        WHERE recipes.hidden = false AND follows.hidden = false AND ( follows.follower_id = ? OR re_shares.chef_id IN (SELECT follows.followee_id FROM follows WHERE follower_id = ? AND follows.hidden = false))
        #{filter_string}
        #{serves_string}
        AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
        GROUP BY recipes.id
        ORDER BY recipes.cuisine",
        user_chef_id,
        user_chef_id,
        user_chef_id,
        search_term.downcase()
      ])

    else # if all else fails, just show all recipes ordered most recent first

      cuisines = Recipe.find_by_sql([
        "SELECT DISTINCT recipes.cuisine
        FROM recipes
        WHERE recipes.hidden = false
        #{filter_string}
        #{serves_string}
        AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
        ORDER BY recipes.cuisine",
        search_term.downcase()
      ])

    end
    cuisines = cuisines.map{|recipe| recipe.cuisine}
    cuisines = cuisines.filter{|cuisine| cuisine != "Any"}
    cuisines.insert(0, "Any")
    # byebug
    return cuisines
  end

  def self.get_serves(type = "all", user_chef_id = 1, queryChefID = 1, filters="", serves="Any", search_term="")

    filter_string=filters.split("/").map{|filter| filter.split(" ").join("_")}.map{|filter| "AND recipes.#{filter} = 't' "}.join("")

    serves_string = ""
    if serves != "Any"
      serves_string ="AND recipes.serves = '#{serves}'"
    end

    if type == "chef" # recipes created by me ordered most-recent first

      serves = Recipe.find_by_sql([
          "SELECT DISTINCT recipes.serves
          FROM recipes
          WHERE recipes.hidden = false
          AND recipes.chef_id = ?
          #{filter_string}
          #{serves_string}
          AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
          ORDER BY recipes.serves",
          user_chef_id,
          search_term.downcase()
        ])

      elsif type == "chef_liked"  # recipes created by me ordered most-recent first

          # byebug
          serves = Recipe.find_by_sql([
              "SELECT DISTINCT recipes.serves
              FROM recipes
              JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
              WHERE recipes.hidden = false
              AND recipe_likes.hidden = false
              AND recipe_likes.chef_id = ?
              #{filter_string}
              #{serves_string}
              AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
              ORDER BY recipes.serves",
              queryChefID,
              search_term.downcase()
            ])

            # byebug

          elsif type == "chef_made"  # recipes created by me ordered most-recent first

            serves = Recipe.find_by_sql([
                "SELECT DISTINCT recipes.serves
                FROM recipes
                JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
                WHERE recipes.hidden = false
                AND recipe_makes.hidden = false
                AND recipe_makes.chef_id = ?
                #{filter_string}
                #{serves_string}
                AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
                ORDER BY recipes.serves",
                queryChefID,
                search_term.downcase()
              ])

    elsif type == "chef_feed" # recipes by chefs I follow ordered most-recent first

      serves = Recipe.find_by_sql([
        "SELECT DISTINCT recipes.serves
        FROM recipes
        LEFT OUTER JOIN re_shares ON recipes.id = re_shares.recipe_id
        LEFT OUTER JOIN (
        SELECT chefs.username AS sharer_username, chefs.id AS sharer_id, re_shares.recipe_id AS shared_id
        FROM chefs
        JOIN re_shares ON chefs.id = re_shares.chef_id
        WHERE re_shares.chef_id IN (SELECT follows.followee_id FROM follows WHERE follower_id = ? AND follows.hidden = false)
        AND re_shares.hidden = false
        ) AS sharers ON recipes.id = shared_id
        JOIN follows ON recipes.chef_id = follows.followee_id
        WHERE recipes.hidden = false AND follows.hidden = false AND ( follows.follower_id = ? OR re_shares.chef_id IN (SELECT follows.followee_id FROM follows WHERE follower_id = ? AND follows.hidden = false))
        #{filter_string}
        #{serves_string}
        AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
        GROUP BY recipes.id
        ORDER BY recipes.serves",
        user_chef_id,
        user_chef_id,
        user_chef_id,
        search_term.downcase()
      ])

    else # if all else fails, just show all recipes ordered most recent first

      serves = Recipe.find_by_sql([
        "SELECT DISTINCT recipes.serves
        FROM recipes
        WHERE recipes.hidden = false
        #{filter_string}
        #{serves_string}
        AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
        ORDER BY recipes.serves",
        search_term.downcase()
      ])

    end
    serves = serves.map{|recipe| recipe.serves}
    serves = serves.filter{|serve| serve != "Any"}
    serves = serves.map{|serve| serve.to_i}.sort()
    # serves.insert(0, "Any")
    # byebug
    return serves
  end

  def self.get_signed_urls(recipes_list)
    recipes_list.each { |recipe| recipe.image_url = ApplicationRecord.get_signed_url(recipe.image_url) }
    return recipes_list
  end

  def primary_images=(newRecipe_primary_images_params)
    recipe_images = RecipeImage.where(recipe_id: self.id)
    recipe_images.each { |use| use.hidden = true}
    recipe_images.each { |use| use.save}
	  newRecipe_primary_images_params["primary_images"].each_with_index do |image, index|
		# byebug
      if image["base64"] != nil && image["base64"] != ""
        recipe_image = RecipeImage.new(recipe_id: self.id)
        hex = SecureRandom.hex(20)
        until RecipeImage.find_by(hex: hex) == nil
            hex = SecureRandom.hex(20)
        end
        mediaURL = ApplicationRecord.save_image(Rails.application.credentials.buckets[:recipe_images], hex, image["base64"])
        recipe_image.image_url = mediaURL
        recipe_image.hex = hex
      elsif image["id"] != 0 && image["recipe_id"] == self.id
        recipe_image = RecipeImage.find(image["id"])
      end
      recipe_image.index = index
      recipe_image.hidden = false
      recipe_image.save
    end
  end

  def ingredients=(ingredient_params)
    recipe_images = IngredientUse.where(recipe_id: self.id)
    ingredient_uses.each { |use| use.hidden = true}
    ingredient_uses.each { |use| use.save}
    ingredient_params["ingredients"].each_with_index do |ingredient, index|
      if ingredient["name"] != ""
        ing_name = ingredient["name"].downcase
        first_letter = ing_name[0].upcase
        ing_name = [first_letter, ing_name.split("").drop(1).join("")].join("")
        dbIngredient = Ingredient.find_or_create_by(name: ing_name)
        ing_use = IngredientUse.find_or_initialize_by(recipe_id: self.id, ingredient_id: dbIngredient.id)
        ing_use.index = index
        ing_use.quantity = ingredient["quantity"]
        ing_use.unit = ingredient["unit"]
        ing_use.hidden = false
        ing_use.save
      end
    end
  end

  def instructions=(instructions_params)
    pre_existing_instructions = Instruction.where(recipe: self)
    pre_existing_instructions.each { |use| use.hidden = true}
    pre_existing_instructions.each { |use| use.save}
    pre_existing_instructions_ids = pre_existing_instructions.map{|ins| ins.id}
    pre_existing_instruction_image = InstructionImage.where(instruction_id: pre_existing_instructions_ids)
    pre_existing_instruction_image.each { |image| image.hidden = true}
    pre_existing_instruction_image.each { |image| image.save}
    instructions_params["instructions"].each_with_index do |instruction, index|
      if instruction != ""
        instruction = Instruction.find_or_initialize_by(instruction: instruction, recipe: self)
        instruction.step = index
        instruction.hidden = false
        instruction.save
        # if the respective image is an object, then re-assign the google image to a new InstructionImage
        if instructions_params["instruction_images"][index]["id"] != nil
          instruction_image = InstructionImage.find(instructions_params["instruction_images"][index]["id"])
          instruction_image.hidden = false
          instruction_image.instruction_id = instruction.id
          instruction_image.save
        # otherwise if you have base64 string create and save new instruction image
        elsif instructions_params["instruction_images"][index]["base64"] != nil && instructions_params["instruction_images"][index]["base64"] != ''
          instruction_image = InstructionImage.new(instruction_id: instruction.id)
          hex = SecureRandom.hex(20)
          until InstructionImage.find_by(hex: hex) == nil
              hex = SecureRandom.hex(20)
          end
          mediaURL = ApplicationRecord.save_image(Rails.application.credentials.buckets[:instruction_images], hex, instructions_params["instruction_images"][index]["base64"])
          instruction_image.image_url = mediaURL
          instruction_image.hex=hex
          instruction_image.hidden = false
          instruction_image.instruction_id = instruction.id
          instruction_image.save
        end
      end
    end
  end

  def get_details(chef)
    if (RecipeMake.where(chef_id: chef.id).where(recipe_id: self.id).last && Time.now - RecipeMake.where(chef_id: chef.id).where(recipe_id: self.id).last.updated_at > 86400) || !RecipeMake.where(chef_id: chef.id).where(recipe_id: self.id).last
      makeable = true
    else
      makeable = false
    end
    ingredientUses = IngredientUse.where(recipe_id: self.id, hidden: false).order(:index)
    ingredients_ids = ingredientUses.map {|use| use.ingredient_id}
    instructions = Instruction.where(recipe: self, hidden: false).order(:step)
    instructions_ids = instructions.map {|instruction| instruction.id}
    instruction_images = InstructionImage.where(instruction_id: instructions_ids, hidden: false)
    instruction_images.each { |image| image.image_url = ApplicationRecord.get_signed_url(image.image_url)}
    make_pics = MakePic.where(recipe_id: self.id, hidden: false).order('updated_at DESC')
    make_pics.each { |image| image.image_url = ApplicationRecord.get_signed_url(image.image_url)}
    make_pic_chef_ids = make_pics.map {|pic| pic.chef_id}
    make_pic_chefs_data = Chef.where(id: make_pic_chef_ids)
    make_pic_chefs_data = make_pic_chefs_data.map {|chef| {id: chef.id, profile_text: chef.profile_text, username: chef.username, image_url: ApplicationRecord.get_signed_url(chef.image_url)} }
    recipe_images = RecipeImage.where(recipe_id: self.id, hidden: false).order(:index)
    recipe_images.each{ |image | image.image_url = ApplicationRecord.get_signed_url(image.image_url) }
    return recipe_details = {
        recipe: self,
        comments: Comment.find_by_sql(["SELECT comments.*, chefs.username, chefs.image_url
                                                FROM comments
                                                JOIN chefs ON chefs.id = comments.chef_id
                                                WHERE comments.recipe_id = ?
                                                AND comments.hidden = false
                                                ORDER BY comments.updated_at DESC", self.id]),
        recipe_images: recipe_images,
        recipe_likes: RecipeLike.where(recipe_id: self.id, hidden: false).length,
        likeable: RecipeLike.where(chef_id: chef.id, hidden: false, recipe_id: self.id).empty?,
        re_shares: ReShare.where(recipe_id: self.id, hidden: false).length,
        shareable: ReShare.where(chef_id: chef.id, hidden: false, recipe_id: self.id).empty?,
        recipe_makes: RecipeMake.where(recipe_id: self.id, hidden: false).length,
        makeable: makeable,
        make_pics: make_pics,
        make_pics_chefs: make_pic_chefs_data,
        ingredient_uses: ingredientUses,
        ingredients: Ingredient.where(id: ingredients_ids),
        instructions: instructions,
        instruction_images: instruction_images,
        chef_username: self.chef.username,
        chef_id: self.chef.id,
    }
  end

end
