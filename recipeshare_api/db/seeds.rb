# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'faker'
require 'securerandom'
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

ReShare.destroy_all
MakePic.destroy_all
Comment.destroy_all
RecipeImage.destroy_all
RecipeLike.destroy_all
RecipeMake.destroy_all
Follow.destroy_all
Friendship.destroy_all
IngredientUse.destroy_all
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
    Chef.create(
        username: Faker::Books::CultureSeries.planet, 
        imageURL:Faker::Avatar.image, 
        e_mail:Faker::Internet.email, 
        country: Faker::TvShows::StarTrek.location, 
        created_at: Time.now, 
        password: '123456', 
        password_confirmation: '123456', 
        hex: SecureRandom.hex, 
        profile_text: Faker::GreekPhilosophers.quote,
        activated: true,
        password_is_auto: false,
        password_created_at: Time.now
        )
end


difficulties = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

times = [
    "00:15",
    "00:30",
    "00:45",
    "01:00",
    "01:15",
    "01:30",
    "01:45",
    "02:00",
    "02:15",
    "02:30",
    "02:45",
    "03:00",
    "03:15",
    "03:30",
    "03:45",
    "04:00",
    "04:15",
    "04:30",
    "04:45",
    "05:00",
    "05:15",
    "05:30",
    "05:45",
    "06:00",
]

const cuisines = [
    "Any",
    "American",
    "Brazilian",
    "British",
    "Cajun",
    "Caribbean",
    "Chinese",
    "Cuban",
    "Egyptian",
    "French",
    "German",
    "Greek",
    "Indian",
    "Italian",
    "Japanese",
    "Korean",
    "Mediterranean",
    "Mexican",
    "Moroccan",
    "Peruvian",
    "Polish",
    "Portuguese",
    "Spanish",
    "Swedish",
    "Thai",
    "Turkish",
    "Vietnamese"
]

serves = ['Any', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

250.times do
    Recipe.create(name: Faker::Food.dish,
        hidden: false,
        chef_id: Chef.all.sample.id,
        instructions: Faker::Food.description,
        time: times.sample,
        difficulty: difficulties.sample,
        created_at: Time.now,
        breakfast: Faker::Boolean.boolean,
        lunch: Faker::Boolean.boolean,
        dinner: Faker::Boolean.boolean,
        chicken: Faker::Boolean.boolean,
        red_meat: Faker::Boolean.boolean,
        seafood: Faker::Boolean.boolean,
        vegetarian: Faker::Boolean.boolean,
        salad: Faker::Boolean.boolean,
        vegan: Faker::Boolean.boolean,
        soup: Faker::Boolean.boolean,
        dessert: Faker::Boolean.boolean,
        side: Faker::Boolean.boolean,
        whole_30: Faker::Boolean.boolean,
        paleo: Faker::Boolean.boolean,
        freezer_meal: Faker::Boolean.boolean,
        keto: Faker::Boolean.boolean,
        weeknight: Faker::Boolean.boolean,
        weekend: Faker::Boolean.boolean,
        gluten_free: Faker::Boolean.boolean,
        bread: Faker::Boolean.boolean,
        dairy_free: Faker::Boolean.boolean,
        white_meat: Faker::Boolean.boolean,
        cuisine: cuisines.sample,
        serves: serves.sample,
        )
end

# 200.times do
#     Friendship.create(requestor_id: Chef.all.sample.id, acceptor_id: Chef.all.sample.id, created_at: Time.now)
# end

300.times do
    Follow.create(followee_id: Chef.all.sample.id, follower_id: Chef.all.sample.id, created_at: Time.now)
end

1000.times do
    RecipeLike.create(chef_id: Chef.all.sample.id, recipe_id: Recipe.all.sample.id, created_at: Time.now)
end

units = [
    "Oz",
    "lb",
    "g",
    "tsp",
    "tbsp",
    "fl oz",
    "cup",
    "ml",
    "each"
]

8.times do
    Recipe.all.each do |recipe|
        string = Faker::Food.measurement
        array = string.split(" ")
        IngredientUse.create(recipe_id: recipe.id, ingredient_id: Ingredient.all.sample.id, quantity: array[0], unit: units.sample, created_at: Time.now)
    end
end

500.times do
    RecipeMake.create(chef_id: Chef.all.sample.id, recipe_id: Recipe.all.sample.id, created_at: Time.now, time: rand(600..6000), difficulty: rand(10), tastiness: rand(10), comment: Faker::ChuckNorris.fact)
end

500.times do
    Comment.create(chef_id: Chef.all.sample.id, recipe_id: Recipe.all.sample.id, comment: Faker::GreekPhilosophers.quote)
end

images = ["/recipe_image_files/recipe2.jpg", "/recipe_image_files/recipe3.jpg", "/recipe_image_files/recipe4.jpg", "/recipe_image_files/recipe5.jpg", "/recipe_image_files/recipe6.jpg", "/recipe_image_files/recipe7.jpg", "/recipe_image_files/recipe8.jpg", "/recipe_image_files/recipe9.jpg", "/recipe_image_files/recipe10.jpg", "/recipe_image_files/recipe11.jpg", "/recipe_image_files/recipe12.jpg", "/recipe_image_files/recipe13.jpg", "/recipe_image_files/recipe14.jpg", "/recipe_image_files/recipe15.jpg", "/recipe_image_files/recipe16.jpg", "/recipe_image_files/recipe17.jpg", "/recipe_image_files/recipe1.jpg", "/recipe_image_files/recipe24.jpg", "/recipe_image_files/recipe26.jpg", "/recipe_image_files/recipe29.jpg", "/recipe_image_files/recipe30.jpg", "/recipe_image_files/recipe33.jpg", "/recipe_image_files/recipe34.jpg", "/recipe_image_files/recipe35.jpg", "/recipe_image_files/recipe36.jpg", "/recipe_image_files/recipe37.jpg", "/recipe_image_files/recipe39.jpg", "/recipe_image_files/recipe45.jpg", "/recipe_image_files/recipe49.jpg", "/recipe_image_files/recipe50.jpg", "/recipe_image_files/recipe51.jpg", "/recipe_image_files/recipe52.jpg", "/recipe_image_files/recipe53.jpg", "/recipe_image_files/recipe54.jpg", "/recipe_image_files/recipe55.jpg", "/recipe_image_files/recipe56.jpg", "/recipe_image_files/recipe57.jpg", "/recipe_image_files/recipe58.jpg", "/recipe_image_files/recipe59.jpg", "/recipe_image_files/recipe60.jpg", "/recipe_image_files/recipe61.jpg", "/recipe_image_files/recipe62.jpg", "/recipe_image_files/recipe63.jpg", "/recipe_image_files/recipe65.jpg", "/recipe_image_files/recipe66.jpg"]

# 200.times do
#     RecipeImage.create(recipe: Recipe.all.sample, imageURL: images.sample)
# end

Recipe.all.each do |recipe|
    RecipeImage.create(recipe_id: recipe.id, imageURL: images.sample, hex: SecureRandom.hex)
end

5.times do
    Recipe.all.each do |recipe|
        MakePic.create(chef: Chef.all.sample, recipe: recipe, imageURL: images.sample, hex: SecureRandom.hex)
    end
end

200.times do
    ReShare.create(chef_id: Chef.all.sample.id, recipe_id: Recipe.all.sample.id, created_at: Time.now)
end

# 3.times do 
#     MakePic.last.destroy
# end

# Recipe.all.each do |recipe|
#     recipe.cuisine=""
# end