module RecipeMixins::CreateRecipe
  def primary_images() #newRecipe_primary_images_params)
    recipe_images = RecipeImage.where(recipe_id: self.id)
    recipe_images.each { |use| use.hidden = true }
    recipe_images.each { |use| use.save }
    # newRecipe_primary_images_params["primary_images"].each_with_index do |image, index|
    #   # byebug
    #   if image["base64"] != nil && image["base64"] != ""
    #     recipe_image = RecipeImage.new(recipe_id: self.id)
    #     hex = ApplicationRecord.get_file_name()
    #     mediaURL = ApplicationRecord.save_image(Rails.application.credentials.buckets[Rails.env.to_sym][:recipe_images], hex, image["base64"])
    #     recipe_image.image_url = mediaURL
    #     recipe_image.hex = hex
    #   elsif image["id"] != 0 && image["recipe_id"] == self.id
    #     recipe_image = RecipeImage.find(image["id"])
    #   end
    #   recipe_image.index = index
    #   recipe_image.hidden = false
    #   recipe_image.save
    # end
  end

  def ingredients=(ingredient_params)
    ingredient_uses.each { |use| use.hidden = true }
    ingredient_uses.each { |use| use.save }
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
    # byebug
    pre_existing_instructions = Instruction.where(recipe: self)
    pre_existing_instructions.each { |use| use.hidden = true }
    # Instruction.transaction do
      pre_existing_instructions.each { |use| use.save }
    # end
    # pre_existing_instructions.each { |use| use.save }
    pre_existing_instructions_ids = pre_existing_instructions.map { |ins| ins.id }
    pre_existing_instruction_image = InstructionImage.where(instruction_id: pre_existing_instructions_ids)
    pre_existing_instruction_image.each { |image| image.hidden = true }
    # Instruction.transaction do
      pre_existing_instruction_image.each { |image| image.save }
    # end
    # byebug
    instructions_params["instructions"].each_with_index do |instruction, index|
      if instruction != ""
        instruction = Instruction.find_or_initialize_by(instruction: instruction, recipe: self)
        instruction.step = index
        instruction.hidden = false
        instruction.save
        # if the respective image is an object, then re-assign the google image to a new InstructionImage
        # if instructions_params["instruction_images"][index]["id"] != nil
        #   instruction_image = InstructionImage.find(instructions_params["instruction_images"][index]["id"])
        #   instruction_image.hidden = false
        #   instruction_image.instruction_id = instruction.id
        #   instruction_image.save
        #   # otherwise if you have base64 string create and save new instruction image
        # elsif instructions_params["instruction_images"][index]["base64"] != nil && instructions_params["instruction_images"][index]["base64"] != ""
        #   instruction_image = InstructionImage.new(instruction_id: instruction.id)
        #   hex = ApplicationRecord.get_file_name()
        #   mediaURL = ApplicationRecord.save_image(Rails.application.credentials.buckets[Rails.env.to_sym][:instruction_images], hex, instructions_params["instruction_images"][index]["base64"])
        #   instruction_image.image_url = mediaURL
        #   instruction_image.hex = hex
        #   instruction_image.hidden = false
        #   instruction_image.instruction_id = instruction.id
        #   instruction_image.save
        # end
      end
    end
  end
end