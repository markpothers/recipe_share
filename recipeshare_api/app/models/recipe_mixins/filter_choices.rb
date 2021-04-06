module RecipeMixins::FilterChoices
  def get_filters(
    type = "all",
    user_chef_id = 1,
    queryChefID = 1,
    filters = "",
    serves = "Any",
    cuisine = "Any",
    search_term = ""
  )
    filter_string = filters.split("/").map { |filter| filter.split(" ").join("_") }.map { |filter| "AND recipes.#{filter} = 't' " }.join("")
    cuisine_string = cuisine != "Any" ? "AND recipes.cuisine = '#{cuisine.split(" ").join("_")}' " : ""
    serves_string = serves != "Any" ? "AND recipes.serves = '#{serves}'" : ""
    columns =
      "CASE WHEN COUNT(*) FILTER (WHERE breakfast = true) > 0 THEN true ELSE false END AS " "breakfast" "
        ,CASE WHEN COUNT(*) FILTER (WHERE lunch = true) > 0 THEN true ELSE false END AS " "lunch" "
        ,CASE WHEN COUNT(*) FILTER (WHERE dinner = true) > 0 THEN true ELSE false END AS " "dinner" "
        ,CASE WHEN COUNT(*) FILTER (WHERE dessert = true) > 0 THEN true ELSE false END AS " "dessert" "
        ,CASE WHEN COUNT(*) FILTER (WHERE vegetarian = true) > 0 THEN true ELSE false END AS " "vegetarian" "
        ,CASE WHEN COUNT(*) FILTER (WHERE vegan = true) > 0 THEN true ELSE false END AS " "vegan" "
        ,CASE WHEN COUNT(*) FILTER (WHERE salad = true) > 0 THEN true ELSE false END AS " "salad" "
        ,CASE WHEN COUNT(*) FILTER (WHERE soup = true) > 0 THEN true ELSE false END AS " "soup" "
        ,CASE WHEN COUNT(*) FILTER (WHERE side = true) > 0 THEN true ELSE false END AS " "side" "
        ,CASE WHEN COUNT(*) FILTER (WHERE chicken = true) > 0 THEN true ELSE false END AS " "chicken" "
        ,CASE WHEN COUNT(*) FILTER (WHERE red_meat = true) > 0 THEN true ELSE false END AS " "red_meat" "
        ,CASE WHEN COUNT(*) FILTER (WHERE whole_30 = true) > 0 THEN true ELSE false END AS " "whole_30" "
        ,CASE WHEN COUNT(*) FILTER (WHERE paleo = true) > 0 THEN true ELSE false END AS " "paleo" "
        ,CASE WHEN COUNT(*) FILTER (WHERE keto = true) > 0 THEN true ELSE false END AS " "keto" "
        ,CASE WHEN COUNT(*) FILTER (WHERE gluten_free = true) > 0 THEN true ELSE false END AS " "gluten_free" "
        ,CASE WHEN COUNT(*) FILTER (WHERE freezer_meal = true) > 0 THEN true ELSE false END AS " "freezer_meal" "
        ,CASE WHEN COUNT(*) FILTER (WHERE weeknight = true) > 0 THEN true ELSE false END AS " "weeknight" "
        ,CASE WHEN COUNT(*) FILTER (WHERE weekend = true) > 0 THEN true ELSE false END AS " "weekend" "
        ,CASE WHEN COUNT(*) FILTER (WHERE bread = true) > 0 THEN true ELSE false END AS " "bread" "
        ,CASE WHEN COUNT(*) FILTER (WHERE dairy_free = true) > 0 THEN true ELSE false END AS " "dairy_free" "
        ,CASE WHEN COUNT(*) FILTER (WHERE white_meat = true) > 0 THEN true ELSE false END AS " "white_meat" "
        ,CASE WHEN COUNT(*) FILTER (WHERE seafood = true) > 0 THEN true ELSE false END AS " "seafood" "
        "

    if type == "chef" # recipes created by me ordered most-recent first
      filters = Recipe.find_by_sql([
        "SELECT
        #{columns}
        FROM recipes
        WHERE recipes.hidden = false
        AND recipes.chef_id = ?
        #{filter_string}
        #{cuisine_string}
        #{serves_string}
        AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')",
        queryChefID,
        search_term.downcase(),
      ])
    elsif type == "chef_liked" # recipes created by me ordered most-recent first
      filters = Recipe.find_by_sql([
        "SELECT
        #{columns}
        FROM recipes
        JOIN recipe_likes ON recipes.id = recipe_likes.recipe_id
        WHERE recipes.hidden = false
        AND recipe_likes.hidden = false
        AND recipe_likes.chef_id = ?
        #{filter_string}
        #{cuisine_string}
        #{serves_string}
        AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')",
        queryChefID,
        search_term.downcase(),
      ])
    elsif type == "chef_made" # recipes created by me ordered most-recent first
      filters = Recipe.find_by_sql([
        "SELECT
        #{columns}
        FROM recipes
        JOIN recipe_makes ON recipes.id = recipe_makes.recipe_id
        WHERE recipes.hidden = false
        AND recipe_makes.hidden = false
        AND recipe_makes.chef_id = ?
        #{filter_string}
        #{cuisine_string}
        #{serves_string}
        AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')",
        queryChefID,
        search_term.downcase(),
      ])
    elsif type == "chef_feed" # recipes by chefs I follow ordered most-recent first
      filters = Recipe.find_by_sql([
        "SELECT
        #{columns}
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
        #{cuisine_string}
        #{serves_string}
        AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')",
        user_chef_id,
        user_chef_id,
        user_chef_id,
        search_term.downcase(),
      ])
    else # if all else fails, just show all recipes ordered most recent first
      filters = Recipe.find_by_sql([
        "SELECT
        #{columns}
        FROM recipes
        WHERE recipes.hidden = false
        #{filter_string}
        #{cuisine_string}
        #{serves_string}
        AND LOWER(recipes.name) LIKE CONCAT('%', ?, '%')",
        search_term.downcase(),
      ])
    end

    filters = filters[0].attributes.keys.select { |key| filters[0][key] == true }

    return filters
  end
end
