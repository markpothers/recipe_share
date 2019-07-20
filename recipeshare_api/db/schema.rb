# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_06_14_164549) do

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.integer "record_id", null: false
    t.integer "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "chefs", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "username"
    t.string "e_mail"
    t.string "country"
    t.string "password"
    t.string "password_confirmation"
    t.string "password_digest"
    t.string "imageURL"
    t.boolean "hidden", default: false
    t.string "hex"
    t.boolean "is_admin", default: false
    t.datetime "created_at", null: false
    t.string "profile_text"
    t.boolean "is_member", default: false
    t.boolean "activated", default: false
    t.string "activation_digest"
    t.datetime "updated_at", null: false
  end

  create_table "comments", force: :cascade do |t|
    t.integer "chef_id"
    t.integer "recipe_id"
    t.string "comment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chef_id"], name: "index_comments_on_chef_id"
    t.index ["recipe_id"], name: "index_comments_on_recipe_id"
  end

  create_table "follows", force: :cascade do |t|
    t.integer "followee_id"
    t.integer "follower_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["followee_id"], name: "index_follows_on_followee_id"
    t.index ["follower_id"], name: "index_follows_on_follower_id"
  end

  create_table "friendships", force: :cascade do |t|
    t.integer "requestor_id"
    t.integer "acceptor_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["acceptor_id"], name: "index_friendships_on_acceptor_id"
    t.index ["requestor_id"], name: "index_friendships_on_requestor_id"
  end

  create_table "ingredient_uses", force: :cascade do |t|
    t.integer "recipe_id"
    t.integer "ingredient_id"
    t.string "quantity"
    t.string "unit"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ingredient_id"], name: "index_ingredient_uses_on_ingredient_id"
    t.index ["recipe_id"], name: "index_ingredient_uses_on_recipe_id"
  end

  create_table "ingredients", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "make_pics", force: :cascade do |t|
    t.integer "chef_id"
    t.integer "recipe_id"
    t.string "imageURL"
    t.string "hex"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chef_id"], name: "index_make_pics_on_chef_id"
    t.index ["recipe_id"], name: "index_make_pics_on_recipe_id"
  end

  create_table "re_shares", force: :cascade do |t|
    t.integer "recipe_id"
    t.integer "chef_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chef_id"], name: "index_re_shares_on_chef_id"
    t.index ["recipe_id"], name: "index_re_shares_on_recipe_id"
  end

  create_table "recipe_images", force: :cascade do |t|
    t.string "name"
    t.integer "recipe_id"
    t.string "imageURL"
    t.string "hex"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["recipe_id"], name: "index_recipe_images_on_recipe_id"
  end

  create_table "recipe_likes", force: :cascade do |t|
    t.integer "chef_id"
    t.integer "recipe_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chef_id"], name: "index_recipe_likes_on_chef_id"
    t.index ["recipe_id"], name: "index_recipe_likes_on_recipe_id"
  end

  create_table "recipe_makes", force: :cascade do |t|
    t.integer "chef_id"
    t.integer "recipe_id"
    t.integer "time"
    t.integer "difficulty"
    t.string "comment"
    t.integer "tastiness"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chef_id"], name: "index_recipe_makes_on_chef_id"
    t.index ["recipe_id"], name: "index_recipe_makes_on_recipe_id"
  end

  create_table "recipes", force: :cascade do |t|
    t.string "name"
    t.integer "chef_id"
    t.string "time"
    t.integer "difficulty"
    t.string "instructions"
    t.boolean "hidden", default: false
    t.boolean "breakfast"
    t.boolean "lunch"
    t.boolean "dinner"
    t.boolean "dessert"
    t.boolean "vegetarian"
    t.boolean "vegan"
    t.boolean "salad"
    t.boolean "soup"
    t.boolean "side"
    t.boolean "chicken"
    t.boolean "red_meat"
    t.boolean "seafood"
    t.boolean "whole_30"
    t.boolean "paleo"
    t.boolean "keto"
    t.boolean "gluten_free"
    t.boolean "freezer_meal"
    t.boolean "weeknight"
    t.boolean "weekend"
    t.boolean "bread"
    t.boolean "dairy_free"
    t.boolean "white_meat"
    t.string "cuisine"
    t.string "serves"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chef_id"], name: "index_recipes_on_chef_id"
  end

end
