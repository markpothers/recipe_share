require "google/cloud/storage"

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def self.storage()
    storage = Google::Cloud::Storage.new project_id: Rails.application.credentials.Google[:project_id],
                                        credentials: Rails.application.credentials.Google[:image_storage_handler_credentials]
  end

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

  def self.get_signed_url(url)
    begin
      if url.blank?
        return ""
      elsif url.include?("robohash") # for testing
        return url
      else
        puts url
        split_url = url.split('/')
        file_name = split_url.last.partition("?").first
        bucket = split_url[-2]
        storage = ApplicationRecord.storage_bucket(bucket)
        signed_url = storage.signed_url file_name, expires: 300
        puts signed_url
        return signed_url
      end
    rescue
      return ""
    end
  end

end
