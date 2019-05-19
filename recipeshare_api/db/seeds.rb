# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'faker'
# ActiveRecord::Migration.drop_table(:likes)
# ActiveRecord::Migration.drop_table(:follows)
# ActiveRecord::Migration.drop_table(:friendships)
# ActiveRecord::Migration.drop_table(:recipes)
# ActiveRecord::Migration.drop_table(:chefs)
# ActiveRecord::Migration.drop_table(:ingredients)
# ActiveRecord::Migration.drop_table(:ingredient_uses)
# ActiveRecord::Migration.create_table(:likes)
# ActiveRecord::Migration.create_table(:follows)
# ActiveRecord::Migration.create_table(:friendships)
# ActiveRecord::Migration.create_table(:recipes)
# ActiveRecord::Migration.create_table(:chefs)
# ActiveRecord::Migration.create_table(:ingredients)
# ActiveRecord::Migration.create_table(:ingredient_uses)

RecipeLike.destroy_all
Follow.destroy_all
Friendship.destroy_all
Ingredient_Use.destroy_all
Recipe.destroy_all
Chef.destroy_all
Ingredient.destroy_all

# ActiveRecord::Base.connection.reset_pk_sequence!('RecipeLikes')
# ActiveRecord::Base.connection.reset_pk_sequence!('Follows')
# ActiveRecord::Base.connection.reset_pk_sequence!('Friendships')
# ActiveRecord::Base.connection.reset_pk_sequence!('IngredientUses')
# ActiveRecord::Base.connection.reset_pk_sequence!('Recipes')
# ActiveRecord::Base.connection.reset_pk_sequence!('Ingredients')
# ActiveRecord::Base.connection.reset_pk_sequence!('Chefs')


500.times do
    Ingredient.create(name: Faker::Food.ingredient, created_at: Time.now)
end

100.times do
    Chef.create(first_name: Faker::TvShows::StarTrek.character, last_name: Faker::TvShows::StarTrek.specie, username: Faker::Books::CultureSeries.planet, imageURL:Faker::Avatar.image, e_mail:Faker::Internet.email, country: Faker::TvShows::StarTrek.location, created_at: Time.now)
end

500.times do
    Recipe.create(name: Faker::Food.dish, chef_id: Chef.all.sample.id, instructions: Faker::Food.description, time: rand(600..6000), difficulty: rand(10), created_at: Time.now)
end

200.times do
    Friendship.create(requestor_id: Chef.all.sample.id, acceptor_id: Chef.all.sample.id, created_at: Time.now)
end

199.times do
    Follow.create(followee_id: Chef.all.sample.id, follower_id: Chef.all.sample.id, created_at: Time.now)
end

200.times do
    RecipeLike.create(chef_id: Chef.all.sample.id, recipe_id: Recipe.all.sample.id, created_at: Time.now)
end

5.times do
    Recipe.all.each do |recipe|
        string = Faker::Food.measurement
        array = string.split(" ")
        IngredientUse.create(recipe_id: recipe.id, ingredient_id: Ingredient.all.sample.id, quantity: array[0], unit: array[1], created_at: Time.now)
    end
end

200.times do
    RecipeMake.create(chef_id: Chef.all.sample.id, recipe_id: Recipe.all.sample.id, created_at: Time.now, time: rand(600..6000), difficulty: rand(10), tastiness: rand(10), comment: Faker::ChuckNorris.fact)
end

200.times do
    Comment.create(chef_id: Chef.all.sample.id, recipe_id: Recipe.all.sample.id, comment: Faker::GreekPhilosophers.quote)
end

images = ["/recipe_images/recipe2", "/recipe_images/recipe3", "/recipe_images/recipe4", "/recipe_images/recipe5", "/recipe_images/recipe6", "/recipe_images/recipe7", "/recipe_images/recipe8", "/recipe_images/recipe9", "/recipe_images/recipe10", "/recipe_images/recipe11", "/recipe_images/recipe12", "/recipe_images/recipe13", "/recipe_images/recipe14", "/recipe_images/recipe15", "/recipe_images/recipe16", "/recipe_images/recipe17", "/recipe_images/recipe1", "/recipe_images/recipe24", "/recipe_images/recipe26", "/recipe_images/recipe29", "/recipe_images/recipe30", "/recipe_images/recipe33", "/recipe_images/recipe34", "/recipe_images/recipe35", "/recipe_images/recipe36", "/recipe_images/recipe37", "/recipe_images/recipe39", "/recipe_images/recipe45", "/recipe_images/recipe49", "/recipe_images/recipe50", "/recipe_images/recipe51", "/recipe_images/recipe52", "/recipe_images/recipe53", "/recipe_images/recipe54", "/recipe_images/recipe55", "/recipe_images/recipe56", "/recipe_images/recipe57", "/recipe_images/recipe58", "/recipe_images/recipe59", "/recipe_images/recipe60", "/recipe_images/recipe61", "/recipe_images/recipe62", "/recipe_images/recipe63", "/recipe_images/recipe65", "/recipe_images/recipe66"]

200.times do
    RecipeImage.create(recipe: Recipe.all.sample, imageURL: images.sample)
end

200.times do
    MakePic.create(chef: Chef.all.sample, recipe: Recipe.all.sample, imageURL: images.sample)
end