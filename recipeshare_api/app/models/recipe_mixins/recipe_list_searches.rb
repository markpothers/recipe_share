module RecipeMixins::RecipeListSearches
  def choose_list(
    type = "all",
    queryChefID = 1,
    limit = 1,
    offset = 0,
    ranking = "liked",
    user_chef_id = 1,
    filters = "",
    cuisine = "Any",
    serves = "Any",
    search_term = ""
  )
    #types = "all", "chef", "chef_liked", "chef_made", "most_liked", "most_made" // "liked", "made"
    filter_string = filters.split("/").map { |filter| filter.split(" ").join("_") }.map { |filter| "AND recipes.#{filter} = 't' " }.join("")
    cuisine_string = cuisine != "Any" ? "AND recipes.cuisine = '#{cuisine.split(" ").join("_")}' " : ""
    serves_string = serves != "Any" ? "AND recipes.serves = '#{serves}'" : ""

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
                                        ORDER BY recipes.created_at DESC
                                        LIMIT ?
                                        OFFSET ?", user_chef_id, user_chef_id, user_chef_id, user_chef_id, search_term.downcase(), limit, offset])
    elsif type == "chef" # recipes created by me ordered most-recent first
      # byebug
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
                                          ORDER BY recipes.created_at DESC
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
                                        COALESCE((SELECT COUNT(*) FROM comments WHERE comments.recipe_id = recipes.id AND comments.hidden = false AND comments.chef_id = ?), 0) AS chef_commented,
                                        MAX(CASE WHEN recipes.created_at > COALESCE(sharers.updated_at, TIMESTAMP '2000-01-01') THEN recipes.created_at ELSE sharers.updated_at END ) AS ordering_param
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
                                            SELECT chefs.username AS sharer_username, 
                                                    chefs.id AS sharer_id, 
                                                    re_shares.recipe_id AS shared_id,
                                                    re_shares.updated_at AS updated_at
                                            FROM chefs
                                            JOIN re_shares ON chefs.id = re_shares.chef_id
                                            WHERE re_shares.chef_id IN (SELECT follows.followee_id FROM follows WHERE follower_id = ? AND follows.hidden = false)
                                            AND re_shares.hidden = false
                                            ORDER BY re_shares.updated_at DESC
                                            LIMIT 1
                                            ) AS sharers ON recipes.id = shared_id
                                        JOIN follows ON recipes.chef_id = follows.followee_id
                                        WHERE recipes.hidden = false AND follows.hidden = false AND ( follows.follower_id = ? OR re_shares.chef_id IN (SELECT follows.followee_id FROM follows WHERE follower_id = ? AND follows.hidden = false))
                                        #{filter_string}
                                        #{cuisine_string}
                                        #{serves_string}
                                        AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')
                                        GROUP BY recipes.id
                                        ORDER BY MAX(CASE WHEN recipes.created_at > COALESCE(sharers.updated_at, TIMESTAMP '2000-01-01') THEN recipes.created_at ELSE sharers.updated_at END ) DESC
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
    elsif type == "most_liked" # recipes according to their global rankings # with filter bASed on chef name working if needed
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
    elsif type == "most_made" # recipes according to their global rankings # with filter bASed on chef name working if needed
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
                                    ORDER BY recipes.created_at DESC
                                    LIMIT ?
                                    OFFSET ?", user_chef_id, user_chef_id, user_chef_id, user_chef_id, search_term.downcase(), limit, offset])
    end
    return recipes_results
  end
end
