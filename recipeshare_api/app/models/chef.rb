class Chef < ApplicationRecord

    has_secure_password

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

    # validates :e_mail, uniqueness: true, message: "This e-mall address has an existing account.  Please log in or reset your password"
    # validates :e_mail, inclusion: {in: "@"}, message: "Please provide a valid e-mail address."
    # validates :password, length: {minimum: 6}

    def password=(value)
        self.password_digest = Bcrypt.hash(value)
    end

    def auth_token
        JWT.encode({id: self.id}, 'my_secret_phrase')
    end

    def as_json(*)
        super.except('password_digest')
    end

end
