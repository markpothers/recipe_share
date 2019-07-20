class ChefMailer < ApplicationMailer

  def account_activation
    @chef = params[:chef]
    @greeting = "Hi #{@chef.username},"
    mail(to: @chef.e_mail, subject: "Recipe-Share account activation")
  end

  def password_reset
    @chef = params[:chef]
    @password = params[:password]
    @greeting = "Hi #{@chef.username},"
    mail(to: @chef.e_mail, subject: "Recipe-Share password reset")
  end

  # def new_password(chef, password)
  #   @chef = chef
  #   @password = password
  #   @greeting = "Hi #{@chef.username},"
  #   mail(to: @chef.e_mail, subject: "Recipe-Share password reset")
  # end
end
