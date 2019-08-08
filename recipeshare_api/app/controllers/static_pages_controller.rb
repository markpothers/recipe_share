# require 'rails/application_controller'

class StaticPagesController < ActionController::Base

   def self.activated
    render :activated
   end

end
