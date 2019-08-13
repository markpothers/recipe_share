class Database < ApplicationRecord

  def self.dbPrimaryBackup
    sourcedb = ApplicationRecord.db()
    destdb = SQLite3::Database.new('./db/primaryBackup.sqlite3')
    backupdb = SQLite3::Backup.new(destdb, 'main', sourcedb, 'main')
    backupdb.step(1)
    count = [backupdb.remaining, backupdb.pagecount][1]
    (count-1).times do
      backupdb.step(1)
    end
    backupdb.finish
  end

  def self.dbSecondaryBackup
    sourcedb = ApplicationRecord.db()
    destdb = SQLite3::Database.new('./db/secondaryBackup.sqlite3')
    backupdb = SQLite3::Backup.new(destdb, 'main', sourcedb, 'main')
    backupdb.step(1)
    count = [backupdb.remaining, backupdb.pagecount][1]
    (count-1).times do
      backupdb.step(1)
    end
    backupdb.finish
  end

  def self.dbPrimaryRestore
    sourcedb = SQLite3::Database.new('./db/primaryBackup.sqlite3')
    destdb = SQLite3::Database.new('./db/development.sqlite3')
    restoredb = SQLite3::Backup.new(destdb, 'main', sourcedb, 'main')
    restoredb.step(1)
    count = [restoredb.remaining, restoredb.pagecount][1]
    (count-1).times do
      restoredb.step(1)
    end
    restoredb.finish
  end

  def self.dbSecondaryRestore
    sourcedb = SQLite3::Database.new('./db/secondaryBackup.sqlite3')
    destdb = SQLite3::Database.new('./db/development.sqlite3')
    restoredb = SQLite3::Backup.new(destdb, 'main', sourcedb, 'main')
    restoredb.step(1)
    count = [restoredb.remaining, restoredb.pagecount][1]
    (count-1).times do
      restoredb.step(1)
    end
    restoredb.finish
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
