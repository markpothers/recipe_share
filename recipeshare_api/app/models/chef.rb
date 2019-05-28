# require 'bcrypt'

class Chef < ApplicationRecord

    has_secure_password

    has_one_attached :avatar

    has_many :recipes
    has_many :recipe_likes
    has_many :liked_recipes, :through => :recipe_likes, :source => :recipe
    has_many :friendships_as_requestor, :class_name => "Friendship", :foreign_key => "requestor_id"
    has_many :friendships_as_acceptor, :class_name => "Friendship", :foreign_key => "acceptor_id"
    has_many :friends_as_requestor, :through => :friendships_as_requestor, :source => :requestor
    has_many :friends_as_acceptor, :through => :friendships_as_acceptor, :source => :acceptor
    has_many :follows_as_follower, :class_name => "Follow", :foreign_key => "follower_id"
    has_many :follows_as_followee, :class_name => "Follow", :foreign_key => "followee_id"
    has_many :followers_as_followee, :through => :follows_as_followee, :source => :follower
    has_many :followees_as_follower, :through => :follows_as_follower, :source => :followee
    has_many :comments
    has_many :commented_recipes, :through => :comments, :source => :recipe
    has_many :recipe_makes
    has_many :made_recipes, :through => :recipe_makes, :source => :recipe

    validates :e_mail, presence: {message: "must be included."}
    validates :username, presence: {message: "must be included."}
    validates :username, length: {minimum: 3, message: "must be at least 3 characters."}
    validates :e_mail, uniqueness: {message: "exists. Please register a different e-mail address."}
    # validates :e_mail, inclusion: {in: %w(@), message: "must be a valid e-mail address."}
    validates :password, length: {minimum: 6, message: "must be at least 6 characters."}

    # def password=(value)
    #     byebug
    #     self.password_digest = Bcrypt.hash(value)

    # end

    def auth_token
        JWT.encode({id: self.id}, 'my_secret_phrase')
    end

    def as_json(*)
        super.except('password', 'password_confirmation', 'password_digest', 'updated_at')
    end

    def self.choose_list(type = "global_ranks", chef_id = 17, limit = 50, offset = 0, ranking = "liked")
        #types = "all_chefs", "chef_followees", "chef_followers", "chef_made", "global_ranks" // "liked", "made"
        if type == "all_chefs"
            Chef.order(created_at: :desc) # all chefs ordered newest first
                .limit(limit)
                .offset(offset)

        elsif type == "chef_followees" # chefs followed by user (chef_id)

            Chef.joins(:followees_as_follower)
                .where({ follows: { followee_id: chef_id }})
                .order("follows.created_at desc")
                .limit(limit)
                .offset(offset)

        elsif type == "chef_followers" # chefs followed by user (chef_id)

            Chef.joins(:followers_as_followee)
                .where({ follows: { follower_id: chef_id }})
                .order("follows.created_at desc")
                .limit(limit)
                .offset(offset)

        elsif type =="global_ranks" # chefs according to their global rankings most recipes liked, and most recipes made

            if ranking == "made"
                table = "recipe_makes"
            else # if ranking == "liked"
                table = "recipe_likes"
            end

            ApplicationRecord.db.execute("SELECT #{table}.*, chefs.*, COUNT(#{table}.chef_id) AS count
                                            FROM #{table}
                                            JOIN chefs ON chefs.id = #{table}.chef_id
                                            GROUP BY #{table}.chef_id
                                            ORDER BY COUNT(#{table}.chef_id) DESC
                                            LIMIT #{table}
                                            OFFSET #{table}")

        else # if all else fails, just show all chefs ordered most recent first
            Chef.order(created_at: :desc)
                .limit(limit)
                .offset(offset)
        end

    end

end
