require "net/http"
require "google/cloud/web_risk"
require_relative "./recipe_mixins/recipe_list_searches"
require_relative "./recipe_mixins/serves_choices"
require_relative "./recipe_mixins/cuisines_choices"
require_relative "./recipe_mixins/filter_choices"
require_relative "./recipe_mixins/create_recipe"

class Recipe < ApplicationRecord
  extend RecipeMixins::RecipeListSearches
  extend RecipeMixins::CuisinesChoices
  extend RecipeMixins::ServesChoices
  extend RecipeMixins::FilterChoices
  include RecipeMixins::CreateRecipe
  belongs_to :chef
  has_many :ingredient_uses
  has_many :ingredients, through: :ingredient_uses
  has_many :instructions
  has_many :recipe_likes
  has_many :likers, through: :recipe_likes, source: :chef
  has_many :comments
  has_many :commenters, through: :comments, source: :chef
  has_many :recipe_makes
  has_many :makers, through: :recipe_makes, source: :chef
  has_many :re_shares
  has_many :sharers, through: :re_shares, source: :chef
  has_many :recipe_images

  accepts_nested_attributes_for :ingredient_uses

  validates :name, presence: { message: "is required." }
  # validates :total_time, numericality: { greater_than: 0, message: 'is required.' }
  validates :acknowledgement_link, url: { allow_blank: true }
  validate :acknowledgement_link_must_be_safe
  validate :show_blog_preview_must_have_a_link

  def acknowledgement_link_must_be_safe
    return unless acknowledgement_link.present?

    risk = Google::Cloud::WebRisk
    risk.configure.credentials = Rails.application.credentials.Google[:image_storage_handler_credentials]
    risk_response = risk.web_risk_service.search_uris(uri: acknowledgement_link, threat_types: [1, 2, 3])
    return if risk_response.threat.nil?

    puts "risky web address"
    errors.add(:acknowledgement_link, "appears to be malicious.")
    # byebug
    # NOTE that the below would be a good test however, since many links will be to amazon, it won't work
    # because amazon blocks automated links
    # I'll leave this out for now but if I can stop amazon doing that, I may do so
    # response = Net::HTTP.get_response(URI(self.acknowledgement_link)).code
    # if response != "200"
    #   errors.add(:acknowledgement_link, "does not work")
    # end
  end

  def show_blog_preview_must_have_a_link
    return unless show_blog_preview && acknowledgement_link.strip.empty?

    errors.add(:base, "We can't show a blog preview unless you provide a link.")
  end

  def self.get_signed_urls(recipes_list)
    recipes_list.each { |recipe| recipe.image_url = ApplicationRecord.get_signed_url(recipe.image_url) }
    return recipes_list
  end

  def get_details(chef)
    if (RecipeMake.where(chef_id: chef.id).where(recipe_id: self.id).last && Time.now - RecipeMake.where(chef_id: chef.id).where(recipe_id: self.id).last.updated_at > 86400) || !RecipeMake.where(chef_id: chef.id).where(recipe_id: self.id).last
      makeable = true
    else
      makeable = false
    end
    ingredientUses = IngredientUse.where(recipe_id: self.id, hidden: false).order(:index)
    ingredients_ids = ingredientUses.map { |use| use.ingredient_id }
    instructions = Instruction.where(recipe: self, hidden: false).order(:step)
    instructions_ids = instructions.map { |instruction| instruction.id }
    instruction_images = InstructionImage.where(instruction_id: instructions_ids, hidden: false)
    instruction_images.each { |image| image.image_url = ApplicationRecord.get_signed_url(image.image_url) }
    make_pics = MakePic.where(recipe_id: self.id, hidden: false).order("updated_at DESC")
    make_pics.each { |image| image.image_url = ApplicationRecord.get_signed_url(image.image_url) }
    make_pic_chef_ids = make_pics.map { |pic| pic.chef_id }
    make_pic_chefs_data = Chef.where(id: make_pic_chef_ids)
    make_pic_chefs_data = make_pic_chefs_data.map { |chef| { id: chef.id, profile_text: chef.profile_text, username: chef.username, image_url: ApplicationRecord.get_signed_url(chef.image_url) } }
    recipe_images = RecipeImage.where(recipe_id: self.id, hidden: false).order(:index)
    recipe_images.each { |image| image.image_url = ApplicationRecord.get_signed_url(image.image_url) }
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
