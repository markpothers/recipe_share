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
      t.string :image_url
      t.boolean :hidden, default: false
      t.string :hex
      t.boolean :is_admin, default: false
      t.datetime :created_at
      t.string :profile_text
      t.boolean :is_member, default: false
      t.boolean :activated, default: false
      t.string :activation_digest
      t.boolean :password_is_auto
      t.datetime :password_created_at
      t.boolean :deactivated, :default => false


      t.timestamps
    end
  end
end
