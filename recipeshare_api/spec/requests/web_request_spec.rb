require 'rails_helper'

RSpec.describe "Webs", type: :request do

  describe "GET /index" do
    it "returns http success" do
      get "/web/index"
      expect(response).to have_http_status(:success)
    end
  end

end
