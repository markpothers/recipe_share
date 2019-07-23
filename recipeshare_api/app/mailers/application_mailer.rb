class ApplicationMailer < ActionMailer::Base
  default from: "admin@recipe-share.com"
  layout 'mailer'
end
