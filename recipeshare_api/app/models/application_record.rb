require "google/cloud/storage"
require "tempfile"

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  @@gcstorage = Google::Cloud::Storage.new project_id: Rails.application.credentials.Google[:project_id],
    credentials: Rails.application.credentials.Google[:image_storage_handler_credentials]

  # def initialize()
  #   self.gcstorage = Google::Cloud::Storage.new project_id: Rails.application.credentials.Google[:project_id],
  #                       credentials: Rails.application.credentials.Google[:image_storage_handler_credentials]
  # end

  # def self.storage()
  #   Google::Cloud::Storage.new project_id: Rails.application.credentials.Google[:project_id],
  #                              credentials: Rails.application.credentials.Google[:image_storage_handler_credentials]
  # end

  # def self.storage_bucket(bucket)
  #   storage = Google::Cloud::Storage.new project_id: Rails.application.credentials.Google[:project_id],
  #                                        credentials: Rails.application.credentials.Google[:image_storage_handler_credentials]
  #   storage.bucket bucket
  # end

  def self.get_file_name()
    return "#{SecureRandom.hex(20)}-#{Time.now.strftime("%Y%m%d_%0k%M%S")}"
  end

  def self.save_image(bucket, hex, base64)
    temp_file = Tempfile.new(["tempFile", ".jpg"], "/tmp")
    temp_file.binmode
    temp_file.write(Base64.decode64(base64))
    bucket = @@gcstorage.bucket bucket
    # gcstorage = ApplicationRecord.storage_bucket(bucket)
    save_record = bucket.create_file(temp_file, "#{hex}.jpg")
    temp_file.close
    temp_file.unlink
    # File.delete(file_path) if File.exist?(file_path)
    return save_record.media_url
  end

  def self.get_signed_url(url)
    # return url
    begin
      if url.blank?
        return ""
      elsif url.include?("robohash") # for testing
        # puts url
        return url
      else
        # puts url
        split_url = url.split("/")
        file_name = split_url.last.partition("?").first
        chosen_bucket = ""
        all_buckets = Rails.application.credentials.buckets[Rails.env.to_sym].keys
        split_url.each do |url_component|
          if !["https:", "", "storage.googleapis.com", "download", "storage", "v1", "b", "o"].include? url_component # exclude url_components which we don't want to look at
            all_buckets.each do |bucket|
              if url_component == Rails.application.credentials.buckets[Rails.env.to_sym][bucket]
                chosen_bucket = Rails.application.credentials.buckets[Rails.env.to_sym][bucket]
                break
              end
            end
          end
        end

        # for testing, some images were stored in different folders e.g. created in prod but stored in dev
        # if you haven't founda bucket yet, look for matching buckets in other environments
        if chosen_bucket == ""
          split_url.each do |url_component|
            if !["https:", "", "storage.googleapis.com", "download", "storage", "v1", "b", "o"].include? url_component # exclude url_components which we don't want to look at
              environments = ActiveRecord::Base.configurations.to_h.keys
              environments.each do |env|
                buckets = Rails.application.credentials.buckets[env.to_sym].keys
                buckets.each do |bucket|
                  if url_component == Rails.application.credentials.buckets[env.to_sym][bucket]
                    chosen_bucket = Rails.application.credentials.buckets[env.to_sym][bucket]
                    break
                  end
                end
              end
            end
          end
        end

        # calculate a good expiration date at the beginning of next month to ensure that signed_urls are the same and images can be cached
        today = DateTime.now()
        next_reset_date = Date.today.at_beginning_of_month.next_month
        next_next_reset_date = Date.today.at_beginning_of_month.next_month.next_month
        days_until_reset = (next_reset_date - today).to_i
        # byebug
        # return url
        # storage = ApplicationRecord.storage_bucket(chosen_bucket)
        bucket = @@gcstorage.bucket chosen_bucket
        # puts bucket
        # puts DateTime.now.next_year(100).to_time.to_i
        signed_url = bucket.signed_url file_name, expires: (days_until_reset < 5 ? next_next_reset_date.to_time.to_i - DateTime.now().to_time.to_i : next_reset_date.to_time.to_i - DateTime.now().to_time.to_i)
        # signed_url = storage.signed_url file_name, expires: (days_until_reset < 5 ? next_next_reset_date.to_time.to_i - DateTime.now().to_time.to_i : next_reset_date.to_time.to_i - DateTime.now().to_time.to_i)
        # puts signed_url
        return signed_url
      end
    rescue
      return ""
    end
  end
end
