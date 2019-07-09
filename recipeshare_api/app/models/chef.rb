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
    has_many :re_shares
    has_many :shared_recipes, :through => :re_shares, :source => :recipe

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

    def self.choose_list(type = "all_chefs", queryChefID = 1, limit = 50, offset = 0, userChefID = 1)
        #types = "all_chefs", "chef_followees", "chef_followers", "chef_made", "most_liked_chefs", "most_made_chefs"
        if type == "all_chefs"
            # Chef.order(created_at: :desc) # all chefs ordered newest first
            #     .limit(limit)
            #     .offset(offset)

                ApplicationRecord.db.execute("SELECT chefs.id, chefs.username, chefs.country, chefs.imageURL, chefs.created_at,
                                                (SELECT COUNT(*) FROM follows WHERE follows.followee_id = chefs.id) AS followers,
                                                (SELECT COUNT(*) FROM follows WHERE follows.followee_id = chefs.id AND follows.follower_id = (?)) AS user_chef_following,
                                                (SELECT COUNT(*) FROM recipes WHERE recipes.chef_id = chefs.id) AS recipe_count,
                                                (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.chef_id = chefs.id) as recipe_likes_given,
                                                liked_recipes.liked_count AS recipe_likes_received,
                                                (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.chef_id = chefs.id) as recipe_makes_given,
                                                made_recipes.made_count AS recipe_makes_received,
                                                (SELECT COUNT(*) FROM comments WHERE comments.chef_id = chefs.id) as comments_given,
                                                commented_recipes.comments_count AS comments_received
                                            FROM CHEFS
                                            LEFT OUTER JOIN (
                                                SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS liked_count FROM recipe_likes
                                                LEFT OUTER JOIN recipes ON recipes.id = recipe_likes.recipe_id
                                                WHERE recipes.hidden = 0
                                                GROUP BY recipes.chef_id) AS liked_recipes ON liked_recipes.counter_chef_id = chefs.id
                                            LEFT OUTER JOIN (
                                                SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS made_count FROM recipe_makes
                                                LEFT OUTER JOIN recipes ON recipes.id = recipe_makes.recipe_id
                                                WHERE recipes.hidden = 0
                                                GROUP BY recipes.chef_id) AS made_recipes ON made_recipes.counter_chef_id = chefs.id
                                            LEFT OUTER JOIN (
                                                SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS comments_count FROM comments
                                                LEFT OUTER JOIN recipes ON recipes.id = comments.recipe_id
                                                WHERE recipes.hidden = 0
                                                GROUP BY recipes.chef_id) AS commented_recipes ON commented_recipes.counter_chef_id = chefs.id
                                            GROUP BY chefs.id
                                            ORDER BY chefs.created_at DESC
                                            LIMIT (?)
                                            OFFSET (?)", [userChefID, limit, offset])

        elsif type == "chef_followees" # chefs followed by user (chef_id)
            # Chef.joins(:followers_as_followee)
            #     .where({ follows: { follower_id: chef_id }})
            #     .order("follows.created_at desc")
            #     .limit(limit)
            #     .offset(offset).uniq

                ApplicationRecord.db.execute("SELECT chefs.id, chefs.username, chefs.country, chefs.imageURL, chefs.created_at,
                                                (SELECT COUNT(*) FROM follows WHERE follows.followee_id = chefs.id) AS followers,
                                                (SELECT COUNT(*) FROM follows WHERE follows.followee_id = chefs.id AND follows.follower_id = (?)) AS user_chef_following,
                                                (SELECT COUNT(*) FROM recipes WHERE recipes.chef_id = chefs.id) AS recipe_count,
                                                (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.chef_id = chefs.id) as recipe_likes_given,
                                                liked_recipes.liked_count AS recipe_likes_received,
                                                (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.chef_id = chefs.id) as recipe_makes_given,
                                                made_recipes.made_count AS recipe_makes_received,
                                                (SELECT COUNT(*) FROM comments WHERE comments.chef_id = chefs.id) as comments_given,
                                                commented_recipes.comments_count AS comments_received
                                            FROM CHEFS
                                            LEFT OUTER JOIN (
                                                SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS liked_count FROM recipe_likes
                                                LEFT OUTER JOIN recipes ON recipes.id = recipe_likes.recipe_id
                                                WHERE recipes.hidden = 0
                                                GROUP BY recipes.chef_id) AS liked_recipes ON liked_recipes.counter_chef_id = chefs.id
                                            LEFT OUTER JOIN (
                                                SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS made_count FROM recipe_makes
                                                LEFT OUTER JOIN recipes ON recipes.id = recipe_makes.recipe_id
                                                WHERE recipes.hidden = 0
                                                GROUP BY recipes.chef_id) AS made_recipes ON made_recipes.counter_chef_id = chefs.id
                                            LEFT OUTER JOIN (
                                                SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS comments_count FROM comments
                                                LEFT OUTER JOIN recipes ON recipes.id = comments.recipe_id
                                                WHERE recipes.hidden = 0
                                                GROUP BY recipes.chef_id) AS commented_recipes ON commented_recipes.counter_chef_id = chefs.id
                                            LEFT OUTER JOIN follows ON follows.followee_id = chefs.id
                                            WHERE follows.follower_id = (?)
                                            GROUP BY chefs.id
                                            ORDER BY chefs.created_at DESC
                                            LIMIT (?)
                                            OFFSET (?)", [userChefID, queryChefID, limit, offset])

        elsif type == "chef_followers" # chefs followed by user (chef_id)

            # Chef.joins(:followees_as_follower)
            #     .where({ follows: { followee_id: chef_id }})
            #     .order("follows.created_at desc")
            #     .limit(limit)
            #     .offset(offset).uniq

            ApplicationRecord.db.execute("SELECT chefs.id, chefs.username, chefs.country, chefs.imageURL, chefs.created_at,
                                            (SELECT COUNT(*) FROM follows WHERE follows.followee_id = chefs.id) AS followers,
                                            (SELECT COUNT(*) FROM follows WHERE follows.followee_id = chefs.id AND follows.follower_id = (?)) AS user_chef_following,
                                            (SELECT COUNT(*) FROM recipes WHERE recipes.chef_id = chefs.id) AS recipe_count,
                                            (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.chef_id = chefs.id) as recipe_likes_given,
                                            liked_recipes.liked_count AS recipe_likes_received,
                                            (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.chef_id = chefs.id) as recipe_makes_given,
                                            made_recipes.made_count AS recipe_makes_received,
                                            (SELECT COUNT(*) FROM comments WHERE comments.chef_id = chefs.id) as comments_given,
                                            commented_recipes.comments_count AS comments_received
                                        FROM CHEFS
                                        LEFT OUTER JOIN (
                                            SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS liked_count FROM recipe_likes
                                            LEFT OUTER JOIN recipes ON recipes.id = recipe_likes.recipe_id
                                            WHERE recipes.hidden = 0
                                            GROUP BY recipes.chef_id) AS liked_recipes ON liked_recipes.counter_chef_id = chefs.id
                                        LEFT OUTER JOIN (
                                            SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS made_count FROM recipe_makes
                                            LEFT OUTER JOIN recipes ON recipes.id = recipe_makes.recipe_id
                                            WHERE recipes.hidden = 0
                                            GROUP BY recipes.chef_id) AS made_recipes ON made_recipes.counter_chef_id = chefs.id
                                        LEFT OUTER JOIN (
                                            SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS comments_count FROM comments
                                            LEFT OUTER JOIN recipes ON recipes.id = comments.recipe_id
                                            WHERE recipes.hidden = 0
                                            GROUP BY recipes.chef_id) AS commented_recipes ON commented_recipes.counter_chef_id = chefs.id
                                        LEFT OUTER JOIN follows ON follows.follower_id = chefs.id
                                        WHERE follows.followee_id = (?)
                                        GROUP BY chefs.id
                                        ORDER BY chefs.created_at DESC
                                        LIMIT (?)
                                        OFFSET (?)", [userChefID, queryChefID, limit, offset])

        elsif type === "most_liked_chefs"  || type === "most_made_chefs" # chefs according to their global rankings most recipes liked, and most recipes made

            if type === "most_made_chefs"
                order = "made_recipes.made_count"
            else # if ranking == "liked"
                order = "liked_recipes.liked_count"
            end
            ApplicationRecord.db.execute("SELECT chefs.id, chefs.username, chefs.country, chefs.imageURL, chefs.created_at,
                                                        (SELECT COUNT(*) FROM follows WHERE follows.followee_id = chefs.id) AS followers,
                                                        (SELECT COUNT(*) FROM follows WHERE follows.followee_id = chefs.id AND follows.follower_id = (?)) AS user_chef_following,
                                                        (SELECT COUNT(*) FROM recipes WHERE recipes.chef_id = chefs.id) AS recipe_count,
                                                        (SELECT COUNT(*) FROM recipe_likes WHERE recipe_likes.chef_id = chefs.id) as recipe_likes_given,
                                                        liked_recipes.liked_count AS recipe_likes_received,
                                                        (SELECT COUNT(*) FROM recipe_makes WHERE recipe_makes.chef_id = chefs.id) as recipe_makes_given,
                                                        made_recipes.made_count AS recipe_makes_received,
                                                        (SELECT COUNT(*) FROM comments WHERE comments.chef_id = chefs.id) as comments_given,
                                                        commented_recipes.comments_count AS comments_received
                                                    FROM CHEFS
                                                    LEFT OUTER JOIN (
                                                        SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS liked_count FROM recipe_likes
                                                        LEFT OUTER JOIN recipes ON recipes.id = recipe_likes.recipe_id
                                                        WHERE recipes.hidden = 0
                                                        GROUP BY recipes.chef_id) AS liked_recipes ON liked_recipes.counter_chef_id = chefs.id
                                                    LEFT OUTER JOIN (
                                                        SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS made_count FROM recipe_makes
                                                        LEFT OUTER JOIN recipes ON recipes.id = recipe_makes.recipe_id
                                                        WHERE recipes.hidden = 0
                                                        GROUP BY recipes.chef_id) AS made_recipes ON made_recipes.counter_chef_id = chefs.id
                                                    LEFT OUTER JOIN (
                                                        SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS comments_count FROM comments
                                                        LEFT OUTER JOIN recipes ON recipes.id = comments.recipe_id
                                                        WHERE recipes.hidden = 0
                                                        GROUP BY recipes.chef_id) AS commented_recipes ON commented_recipes.counter_chef_id = chefs.id
                                                    GROUP BY chefs.id
                                                    ORDER BY #{order} DESC
                                                    LIMIT (?)
                                                    OFFSET (?)", [userChefID, limit, offset])
        end
    end

    def get_details(userChef)
        # byebug
        recipes = Recipe.where(chef_id: self.id).order('updated_at DESC')
        recipe_ids = recipes.map{|recipe| recipe.id}
        return chef_details = {
            chef: {id: self.id,
                    username: self.username,
                    country: self.country,
                    imageURL: self.imageURL,
                    created_at: self.created_at,
                    profile_text: self.profile_text},
            # comments: Comment.where(chef_id: self.id).order('updated_at DESC'),
            recipe_likes: RecipeLike.where(chef_id: self.id),
            recipe_makes: RecipeMake.where(chef_id: self.id),
            re_shares: ReShare.where(chef_id: self.id),
            # make_pics: MakePic.where(chef_id: self.id).order('updated_at DESC'),
            recipes: recipes,
            recipe_likes_received: RecipeLike.where(recipe_id: recipe_ids),
            recipe_makes_received: RecipeMake.where(recipe_id: recipe_ids),
            comments_received: Comment.where(recipe_id: recipe_ids),
            re_shares_received: ReShare.where(recipe_id: recipe_ids),
            # make_pics_received: MakePic.where(recipe_id: recipe_ids),
            followers: Follow.where(followee_id: self.id),
            following: Follow.where(follower_id: self.id),
            chef_followed: Follow.where(followee_id: self.id, follower_id: userChef.id).length>0,
            chef_commented: Comment.where(recipe_id: recipe_ids, chef_id: userChef.id).length>0
        }

    end





end
