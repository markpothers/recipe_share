require 'rails_helper'

RSpec.describe DatabasesController, type: :controller do
  describe "GET index" do
    # it "returns a 200" do
    #   request.headers["Authorization"] = "foo"
    #   get :show
    #   expect(response).to have_http_status(:ok)
    # end
    it "thinks 1 + 1 = 2" do
      expect(1 + 1).to equal(2)
    end
  end
end