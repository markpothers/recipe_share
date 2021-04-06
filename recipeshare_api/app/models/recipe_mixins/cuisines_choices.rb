module RecipeMixins::CuisinesChoices
  def get_cuisines(
    type = "all",
    user_chef_id = 1,
    queryChefID = 1,
    filters = "",
    serves = "Any",
    search_term = ""
  )
    filter_string = filters.split("/").map { |filter| filter.split(" ").join("_") }.map { |filter| "AND recipes.#{filter} = 't' " }.join("")
    # cuisine_string = cuisine != "Any" ? "AND recipes.cuisine = '#{cuisine.split(" ").join("_")}' " : ""
    serves_string = serves != "Any" ? "AND recipes.serves = '#{serves}'" : ""

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
        search_term.downcase(),
      ])
    elsif type == "chef_liked" # recipes created by me ordered most-recent first
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
        search_term.downcase(),
      ])
    elsif type == "chef_made" # recipes created by me ordered most-recent first
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
        search_term.downcase(),
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
        search_term.downcase(),
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
        search_term.downcase(),
      ])
    end
    cuisines = cuisines.map { |recipe| recipe.cuisine }
    cuisines = cuisines.filter { |cuisine| cuisine != "Any" }
    cuisines.insert(0, "Any")
    return cuisines
  end
end
