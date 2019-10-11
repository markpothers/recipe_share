require "google/cloud/storage"

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def self.db
    sqldb = SQLite3::Database.new('./db/development.sqlite3')
    sqldb.results_as_hash = true
    return sqldb
  end


  def self.storage_bucket(bucket)
    @storage_bucket ||= begin
    storage = Google::Cloud::Storage.new project_id: "handy-coil-240820",
                                        credentials: Rails.application.credentials.Google[:credentials]
    storage.bucket bucket
    end
  end

  def self.save_image(bucket, hex, base64)
    file_path = "public/temp_image_file/#{hex}.jpg"
    File.open(file_path, 'wb') do |f|
        f.write(Base64.decode64(base64))
    end
    save_record = ApplicationRecord.storage_bucket(bucket).create_file(file_path, "#{hex}.jpg")
    File.delete(file_path) if File.exist?(file_path)
    puts save_record.media_url
    return save_record.media_url
  end

end
