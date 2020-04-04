require "google/cloud/storage"
require "pg"

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def self.db
    # byebug
    pgrsdb = PG::Connection.new(host: Rails.application.credentials.Google[:database_hosts][Rails.env.to_sym],
                                port: 5432,
                                dbname: Rails.application.credentials.Google[:database_names][Rails.env.to_sym],
                                user: Rails.application.credentials.Google[:postgres_username],
                                password: Rails.application.credentials.Google[:postgres_password])
    return pgrsdb
  end


  def self.storage_bucket(bucket)
    @storage_bucket ||= begin
    storage = Google::Cloud::Storage.new project_id: Rails.application.credentials.Google[:project_id],
                                        credentials: Rails.application.credentials.Google[:image_storage_handler_credentials]
    storage.bucket bucket
    end
  end

  def self.save_image(bucket, hex, base64)
    file_path = "public/temp_image_file/#{hex}.jpg"
    File.open(file_path, 'wb') do |f|
        f.write(Base64.decode64(base64))
    end
    # byebug
    save_record = ApplicationRecord.storage_bucket(bucket).create_file(file_path, "#{hex}.jpg")
    File.delete(file_path) if File.exist?(file_path)
    puts save_record.media_url
    return save_record.media_url
  end

end
