class DatabasesController < ApplicationController

    # skip_before_action :verify_authenticity_token

    def manualBackup
        if @chef.is_admin === true
            Database.dbPrimaryBackup()
            Database.dbSecondaryBackup()
            render json: true
        else
            render json: false
        end
    end

    def autoBackup
        if @chef.is_admin === true
           Database.setInterval(60) do
                Database.dbPrimaryBackup()
                puts "Primary backing up"
            end
            Database.setInterval(300) do
                Database.dbSecondaryBackup()
                puts "Secondary backing up"
            end
            render json: true
        else
            render json: false
        end
    end

    def primaryRestore
        if @chef.is_admin === true
            Database.dbPrimaryRestore()
            render json: true
        else
            render json: false
        end
    end

    def secondaryRestore
        if @chef.is_admin === true
            Database.dbSecondaryRestore()
            render json: true
        else
            render json: false
        end
    end

    private

end
