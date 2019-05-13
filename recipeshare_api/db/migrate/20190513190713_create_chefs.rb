class CreateChefs < ActiveRecord::Migration[5.2]
  def change
    create_table :chefs do |t|
      t.string :first_name
      t.string :last_name
      t.string :username
      t.string :e_mail
      t.string :country
      t.string :password
      t.string :password_confirmation
      t.string :password_digest
      t.string :imageURL
      t.datetime :created_at

      t.timestamps
    end
  end
end
