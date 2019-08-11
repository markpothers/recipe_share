class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def self.db
    sqldb = SQLite3::Database.new('./db/development.sqlite3')
    sqldb.results_as_hash = true
    return sqldb
  end

  def self.setInterval(delay)
    Thread.new do
      loop do
        sleep delay
          yield
      end
    end
  end

end
