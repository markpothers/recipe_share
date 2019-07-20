# Preview all emails at http://localhost:3000/rails/mailers/chef_mailer
class ChefMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/chef_mailer/account_activation
  def account_activation
    ChefMailer.account_activation
  end

  # Preview this email at http://localhost:3000/rails/mailers/chef_mailer/password_reset
  def password_reset
    ChefMailer.password_reset
  end

end
