require "google/cloud/storage"

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def self.storage_bucket(bucket)
    storage = Google::Cloud::Storage.new project_id: Rails.application.credentials.Google[:project_id],
                                        credentials: Rails.application.credentials.Google[:image_storage_handler_credentials]
	storage.bucket bucket
  end

  def self.save_image(bucket, hex, base64)
    file_path = "public/temp_image_file/#{hex}.jpg"
    File.open(file_path, 'wb') do |f|
        f.write(Base64.decode64(base64))
    end
	save_record = ApplicationRecord.storage_bucket(bucket).create_file(file_path, "#{hex}.jpg")
	File.delete(file_path) if File.exist?(file_path)
    # puts save_record.media_url
    return save_record.media_url
  end

end
