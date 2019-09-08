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

  def reactivate_account
    @chef = params[:chef]
    @greeting = "Hi Chef,"
    mail(to: @chef.e_mail, subject: "Recipe-Share account reactivation")
  end

end
