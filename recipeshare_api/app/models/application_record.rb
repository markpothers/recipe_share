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
        # puts url
        split_url = url.split('/')
        file_name = split_url.last.partition("?").first
        chosen_bucket = ""
        all_buckets = Rails.application.credentials.buckets.keys
        split_url.each do |url_component|
          all_buckets.each do |bucket|
            if url_component == Rails.application.credentials.buckets[bucket]
              chosen_bucket =  Rails.application.credentials.buckets[bucket]
            end
          end
        end
        storage = ApplicationRecord.storage_bucket(chosen_bucket)

        # calculate a good expiration date at the beginning of next month to ensure that signed_urls are the same and images can be cached
        today = DateTime.now()
        next_reset_date = Date.today.at_beginning_of_month.next_month
        next_next_reset_date = Date.today.at_beginning_of_month.next_month.next_month
        days_until_reset = (next_reset_date - today).to_i

        signed_url = storage.signed_url file_name, expires: (days_until_reset < 5 ? next_next_reset_date.to_time.to_i - DateTime.now().to_time.to_i : next_reset_date.to_time.to_i - DateTime.now().to_time.to_i)
        puts signed_url
        return signed_url
      end
    rescue
      return ""
    end
  end

end
