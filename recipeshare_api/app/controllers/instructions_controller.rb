class InstructionsController < ApplicationController

    # before_action :define_current_instruction
    # skip_before_action :define_current_instruction, :only => [:index, :create]


    # def index
    #     render json: Instruction.all
    # end

    # def new
    #     @instruction = Instruction.new
    # end

    # def create
    #     @instruction = Instruction.create(instruction_params)
    #     if @instruction.save
    #         render json: @instruction
    #     else
    #         render json: {error: true, message: 'Ooops.  Something went wrong saving the instruction.'}
    #     end
    # end

    # def show
    #     render json: @instruction
    # end

    # def edit
    #     render json: @instruction
    # end

    # def update
    #     @instruction.update(instruction_params)
    #     if @instruction.save
    #         render json: @instruction
    #     else
    #         render json: {error: true, message: 'Ooops.  Something went wrong updating the instruction.'}
    #     end
    # end

    # def destroy
    #     if @instruction.destroy
    #         render json: {message: "Instruction deleted!"}
    #     else
    #         render json: {error: true, message: "Ooops.  That's embarassing.  We couldn't delete that ingredient use.  You shouldn't even be able to see this message!"}
    #     end
    # end

    private

    # def define_current_instruction
    #     @instruction = Instruction.find(params[:id])
    # end

    # def instruction_params
    #     params.require(:instruction).permit(:recipe_id, :ingredient_id, :quantity, :unit)
    # end

end
