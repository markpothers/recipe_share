# require 'bcrypt'

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
    has_many :re_shares
    has_many :shared_recipes, :through => :re_shares, :source => :recipe
    has_many :recipe_images
    has_many :make_pics

    validates :e_mail, presence: { message: 'must be included.' }
    validates :username, presence: { message: 'must be included.' }
    validates :username, length: { minimum: 3, message: 'must be at least 3 characters.' }
    validates :username, uniqueness: { message: 'must be unique' }, unless: :anonymous?
	validates :e_mail, uniqueness: { message: 'must be unique' }
	validates :e_mail, email: true
    validates :password, length: { minimum: 6, message: 'must be at least 6 characters.' }

    def anonymous?
        username == 'Anonymous'
    end

    def self.valid_attribute?(attr, value)
        mock = self.new(attr => value)
        if mock.valid?
            true
        else
            !mock.errors.has_key?(attr)
        end
    end

    def auth_token
        JWT.encode({id: self.id}, Rails.application.credentials.JWT[:secret_key])
    end

    def as_json(*)
        super.except('password', 'password_confirmation', 'password_digest', 'updated_at', 'hidden', 'activated', 'activation_digest', 'password_created_at', 'password_is_auto"')
    end

    def self.choose_list(type = "all_chefs", queryChefID = 1, limit = 50, offset = 0, search_term = "", userChefID = 1)
        #types = "all_chefs", "chef_followees", "chef_followers", "chef_made", "most_liked_chefs", "most_made_chefs"
        if type == "all_chefs"
            # byebug
            # Chef.find_by_sql(["SELECT * from chefs ORDER BY created_at DESC")
                Chef.find_by_sql(["SELECT DISTINCT chefs.id,
                                                MAX(chefs.username) AS username,
                                                MAX(chefs.country) AS country,
                                                MAX(chefs.image_url) AS image_url,
                                                MAX(chefs.created_at) AS created_at,
                                                MAX(chefs.profile_text) AS profile_text,
												COALESCE((SELECT COUNT(*) FROM follows WHERE follows.followee_id = chefs.id AND follows.hidden = false), 0) AS followers,
												COALESCE((SELECT COUNT(*) FROM follows WHERE follows.followee_id = chefs.id AND follows.hidden = false AND follows.follower_id = ?), 0) AS user_chef_following,
												COALESCE((SELECT COUNT(*) FROM recipes WHERE recipes.chef_id = chefs.id AND recipes.hidden = false), 0) AS recipe_count,
												COALESCE((SELECT COUNT(*) FROM recipe_likes JOIN recipes ON recipe_likes.recipe_id = recipes.id WHERE recipe_likes.chef_id = chefs.id AND recipe_likes.hidden = false AND recipes.hidden = false), 0) AS recipe_likes_given,
												COALESCE(MAX(liked_recipes.liked_count), 0) AS recipe_likes_received,
												COALESCE((SELECT COUNT(*) FROM recipe_makes JOIN recipes ON recipe_makes.recipe_id = recipes.id  WHERE recipe_makes.chef_id = chefs.id AND recipe_makes.hidden = false AND recipes.hidden = false AND recipes.hidden = false), 0) AS recipe_makes_given,
												COALESCE(MAX(made_recipes.made_count), 0) AS recipe_makes_received,
												COALESCE((SELECT COUNT(*) FROM comments JOIN recipes ON comments.recipe_id = recipes.id  WHERE comments.chef_id = chefs.id AND comments.hidden = false), 0) AS comments_given,
												COALESCE(MAX(commented_recipes.comments_count), 0) AS comments_received
                                            FROM CHEFS
                                            LEFT OUTER JOIN (
                                                SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS liked_count FROM recipe_likes
                                                LEFT OUTER JOIN recipes ON recipes.id = recipe_likes.recipe_id
                                                WHERE recipes.hidden = false
                                                AND recipe_likes.hidden = false
                                                GROUP BY recipes.chef_id) AS liked_recipes ON liked_recipes.counter_chef_id = chefs.id
                                            LEFT OUTER JOIN (
                                                SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS made_count FROM recipe_makes
                                                LEFT OUTER JOIN recipes ON recipes.id = recipe_makes.recipe_id
                                                WHERE recipes.hidden = false
                                                AND recipe_makes.hidden = false
                                                GROUP BY recipes.chef_id) AS made_recipes ON made_recipes.counter_chef_id = chefs.id
                                            LEFT OUTER JOIN (
                                                SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS comments_count FROM comments
                                                LEFT OUTER JOIN recipes ON recipes.id = comments.recipe_id
                                                WHERE recipes.hidden = false
                                                AND comments.hidden = false
                                                GROUP BY recipes.chef_id) AS commented_recipes ON commented_recipes.counter_chef_id = chefs.id
											WHERE chefs.hidden = false
											AND LOWER(chefs.username) LIKE CONCAT('%', ?, '%')
                                            GROUP By chefs.id
                                            ORDER BY created_at DESC
                                            LIMIT ?
                                            OFFSET ?", userChefID, search_term.downcase(), limit, offset])

        elsif type == "chef_followees" # chefs followed by user (chef_id)

                Chef.find_by_sql(["SELECT DISTINCT chefs.id,
                                                MAX(chefs.username) AS username,
                                                MAX(chefs.country) AS country,
                                                MAX(chefs.image_url) AS image_url,
                                                MAX(chefs.created_at) AS created_at,
                                                MAX(chefs.profile_text) AS profile_text,
                                                MAX(follows.created_at) AS follow_created,
												COALESCE((SELECT COUNT(*) FROM follows WHERE follows.followee_id = chefs.id AND follows.hidden = false), 0) AS followers,
												COALESCE((SELECT COUNT(*) FROM follows WHERE follows.followee_id = chefs.id AND follows.hidden = false AND follows.follower_id = ?), 0) AS user_chef_following,
												COALESCE((SELECT COUNT(*) FROM recipes WHERE recipes.chef_id = chefs.id AND recipes.hidden = false), 0) AS recipe_count,
												COALESCE((SELECT COUNT(*) FROM recipe_likes JOIN recipes ON recipe_likes.recipe_id = recipes.id WHERE recipe_likes.chef_id = chefs.id AND recipe_likes.hidden = false AND recipes.hidden = false), 0) AS recipe_likes_given,
												COALESCE(MAX(liked_recipes.liked_count), 0) AS recipe_likes_received,
												COALESCE((SELECT COUNT(*) FROM recipe_makes JOIN recipes ON recipe_makes.recipe_id = recipes.id  WHERE recipe_makes.chef_id = chefs.id AND recipe_makes.hidden = false AND recipes.hidden = false AND recipes.hidden = false), 0) AS recipe_makes_given,
												COALESCE(MAX(made_recipes.made_count), 0) AS recipe_makes_received,
												COALESCE((SELECT COUNT(*) FROM comments JOIN recipes ON comments.recipe_id = recipes.id  WHERE comments.chef_id = chefs.id AND comments.hidden = false), 0) AS comments_given,
												COALESCE(MAX(commented_recipes.comments_count), 0) AS comments_received
                                            FROM CHEFS
                                            LEFT OUTER JOIN (
                                                SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS liked_count FROM recipe_likes
                                                LEFT OUTER JOIN recipes ON recipes.id = recipe_likes.recipe_id
                                                WHERE recipes.hidden = false
                                                AND recipe_likes.hidden = false
                                                GROUP BY recipes.chef_id) AS liked_recipes ON liked_recipes.counter_chef_id = chefs.id
                                            LEFT OUTER JOIN (
                                                SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS made_count FROM recipe_makes
                                                LEFT OUTER JOIN recipes ON recipes.id = recipe_makes.recipe_id
                                                WHERE recipes.hidden = false
                                                AND recipe_makes.hidden = false
                                                GROUP BY recipes.chef_id) AS made_recipes ON made_recipes.counter_chef_id = chefs.id
                                            LEFT OUTER JOIN (
                                                SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS comments_count FROM comments
                                                LEFT OUTER JOIN recipes ON recipes.id = comments.recipe_id
                                                WHERE recipes.hidden = false
                                                AND comments.hidden = false
                                                GROUP BY recipes.chef_id) AS commented_recipes ON commented_recipes.counter_chef_id = chefs.id
                                            LEFT OUTER JOIN follows ON follows.followee_id = chefs.id
                                            WHERE follows.follower_id = ? AND chefs.hidden = false
											AND follows.hidden = false
											AND LOWER(chefs.username) LIKE CONCAT('%', ?, '%')
                                            GROUP BY chefs.id
                                            ORDER BY follow_created DESC
                                            LIMIT ?
                                            OFFSET ?", userChefID, queryChefID, search_term.downcase(), limit, offset])

        elsif type == "chef_followers" # chefs followed by user (chef_id)

            Chef.find_by_sql(["SELECT DISTINCT chefs.id, 
                                            MAX(chefs.username) AS username,
                                            MAX(chefs.country) AS country,
                                            MAX(chefs.image_url) AS image_url,
                                            MAX(chefs.created_at) AS created_at,
                                            MAX(chefs.profile_text) AS profile_text,
                                            MAX(follows.created_at) AS follow_created,
                                            COALESCE((SELECT COUNT(*) FROM follows WHERE follows.followee_id = chefs.id AND follows.hidden = false), 0) AS followers,
                                            COALESCE((SELECT COUNT(*) FROM follows WHERE follows.followee_id = chefs.id AND follows.hidden = false AND follows.follower_id = ?), 0) AS user_chef_following,
                                            COALESCE((SELECT COUNT(*) FROM recipes WHERE recipes.chef_id = chefs.id AND recipes.hidden = false), 0) AS recipe_count,
                                            COALESCE((SELECT COUNT(*) FROM recipe_likes JOIN recipes ON recipe_likes.recipe_id = recipes.id WHERE recipe_likes.chef_id = chefs.id AND recipe_likes.hidden = false AND recipes.hidden = false), 0) AS recipe_likes_given,
                                            COALESCE(MAX(liked_recipes.liked_count), 0) AS recipe_likes_received,
                                            COALESCE((SELECT COUNT(*) FROM recipe_makes JOIN recipes ON recipe_makes.recipe_id = recipes.id  WHERE recipe_makes.chef_id = chefs.id AND recipe_makes.hidden = false AND recipes.hidden = false AND recipes.hidden = false), 0) AS recipe_makes_given,
                                            COALESCE(MAX(made_recipes.made_count), 0) AS recipe_makes_received,
                                            COALESCE((SELECT COUNT(*) FROM comments JOIN recipes ON comments.recipe_id = recipes.id  WHERE comments.chef_id = chefs.id AND comments.hidden = false), 0) AS comments_given,
                                            COALESCE(MAX(commented_recipes.comments_count), 0) AS comments_received
                                        FROM CHEFS
                                        LEFT OUTER JOIN (
                                            SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS liked_count FROM recipe_likes
                                            LEFT OUTER JOIN recipes ON recipes.id = recipe_likes.recipe_id
                                            WHERE recipes.hidden = false
                                            AND recipe_likes.hidden = false
                                            GROUP BY recipes.chef_id) AS liked_recipes ON liked_recipes.counter_chef_id = chefs.id
                                        LEFT OUTER JOIN (
                                            SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS made_count FROM recipe_makes
                                            LEFT OUTER JOIN recipes ON recipes.id = recipe_makes.recipe_id
                                            WHERE recipes.hidden = false
                                            AND recipe_makes.hidden = false
                                            GROUP BY recipes.chef_id) AS made_recipes ON made_recipes.counter_chef_id = chefs.id
                                        LEFT OUTER JOIN (
                                            SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS comments_count FROM comments
                                            LEFT OUTER JOIN recipes ON recipes.id = comments.recipe_id
                                            WHERE recipes.hidden = false
                                            AND comments.hidden = false
                                            GROUP BY recipes.chef_id) AS commented_recipes ON commented_recipes.counter_chef_id = chefs.id
                                        LEFT OUTER JOIN follows ON follows.follower_id = chefs.id
                                        WHERE follows.followee_id = ? AND chefs.hidden = false
										AND follows.hidden = false
										AND LOWER(chefs.username) LIKE CONCAT('%', ?, '%')
                                        GROUP BY chefs.id
                                        ORDER BY follow_created DESC
                                        LIMIT ?
                                        OFFSET ?", userChefID, queryChefID, search_term.downcase(), limit, offset])

        elsif type === "most_liked_chefs"  || type === "most_made_chefs" # chefs according to their global rankings most recipes liked, and most recipes made

            if type === "most_made_chefs"
                order = "recipe_makes_received"
            else # if ranking == "liked"
                order = "recipe_likes_received"
            end
            Chef.find_by_sql(["SELECT DISTINCT chefs.id, 
                                            MAX(chefs.username) AS username,
                                            MAX(chefs.country) AS country,
                                            MAX(chefs.image_url) AS image_url,
                                            MAX(chefs.created_at) AS created_at,
                                            MAX(chefs.profile_text) AS profile_text,
                                            COALESCE((SELECT COUNT(*) FROM follows WHERE follows.followee_id = chefs.id AND follows.hidden = false), 0) AS followers,
                                            COALESCE((SELECT COUNT(*) FROM follows WHERE follows.followee_id = chefs.id AND follows.hidden = false AND follows.follower_id = ?), 0) AS user_chef_following,
                                            COALESCE((SELECT COUNT(*) FROM recipes WHERE recipes.chef_id = chefs.id AND recipes.hidden = false), 0) AS recipe_count,
                                            COALESCE((SELECT COUNT(*) FROM recipe_likes JOIN recipes ON recipe_likes.recipe_id = recipes.id WHERE recipe_likes.chef_id = chefs.id AND recipe_likes.hidden = false AND recipes.hidden = false), 0) AS recipe_likes_given,
                                            COALESCE(MAX(liked_recipes.liked_count), 0) AS recipe_likes_received,
                                            COALESCE((SELECT COUNT(*) FROM recipe_makes JOIN recipes ON recipe_makes.recipe_id = recipes.id  WHERE recipe_makes.chef_id = chefs.id AND recipe_makes.hidden = false AND recipes.hidden = false AND recipes.hidden = false), 0) AS recipe_makes_given,
                                            COALESCE(MAX(made_recipes.made_count), 0) AS recipe_makes_received,
                                            COALESCE((SELECT COUNT(*) FROM comments JOIN recipes ON comments.recipe_id = recipes.id  WHERE comments.chef_id = chefs.id AND comments.hidden = false), 0) AS comments_given,
                                            COALESCE(MAX(commented_recipes.comments_count), 0) AS comments_received
                                        FROM CHEFS
                                        LEFT OUTER JOIN (
                                            SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS liked_count FROM recipe_likes
                                            LEFT OUTER JOIN recipes ON recipes.id = recipe_likes.recipe_id
                                            WHERE recipes.hidden = false
                                            AND recipe_likes.hidden = false
                                            GROUP BY recipes.chef_id) AS liked_recipes ON liked_recipes.counter_chef_id = chefs.id
                                        LEFT OUTER JOIN (
                                            SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS made_count FROM recipe_makes
                                            LEFT OUTER JOIN recipes ON recipes.id = recipe_makes.recipe_id
                                            WHERE recipes.hidden = false
                                            AND recipe_makes.hidden = false
                                            GROUP BY recipes.chef_id) AS made_recipes ON made_recipes.counter_chef_id = chefs.id
                                        LEFT OUTER JOIN (
                                            SELECT recipes.chef_id AS counter_chef_id, COUNT(*) AS comments_count FROM comments
                                            LEFT OUTER JOIN recipes ON recipes.id = comments.recipe_id
                                            WHERE recipes.hidden = false
                                            AND comments.hidden = false
                                            GROUP BY recipes.chef_id) AS commented_recipes ON commented_recipes.counter_chef_id = chefs.id
										WHERE chefs.hidden = false
										AND LOWER(chefs.username) LIKE CONCAT('%', ?, '%')
                                        GROUP BY chefs.id
                                        ORDER BY #{order} DESC
                                        LIMIT ?
                                        OFFSET ?", userChefID, search_term.downcase(), limit, offset])
        end
    end

    def self.get_signed_urls(chefs_list)
        chefs_list.each { |chef| chef.image_url = ApplicationRecord.get_signed_url(chef.image_url) }
        return chefs_list
    end

    def get_details(userChef)
        # byebug
        recipes = Recipe.where(chef_id: self.id, hidden: false).order('updated_at DESC')
		recipe_ids = recipes.map{|recipe| recipe.id}
        # byebug
        make_pics = MakePic.joins(:recipe).where(chef_id: self.id, hidden: false, recipes: {hidden: false}).order('updated_at DESC').length
        make_pics_received = MakePic.where(recipe_id: recipe_ids, hidden: false).length
        return chef_details = {
            chef: {id: self.id,
                    username: self.username,
                    country: self.country,
                    image_url: ApplicationRecord.get_signed_url(self.image_url),
                    created_at: self.created_at,
                    profile_text: self.profile_text},
            comments: Comment.where(chef_id: self.id, hidden: false).order('updated_at DESC').length,
            recipe_likes: RecipeLike.joins(:recipe).where(chef_id: self.id, hidden: false, recipes: {hidden: false}).length,
            # recipe_makes: RecipeMake.joins(:recipe).where(chef_id: self.id, hidden: false, recipes: {hidden: false}),
            re_shares: ReShare.joins(:recipe).where(chef_id: self.id, hidden: false, recipes: {hidden: false}).length,
            make_pics: make_pics,
            recipes: recipes.length,
            recipe_likes_received: RecipeLike.where(recipe_id: recipe_ids, hidden: false).length,
            # recipe_makes_received: RecipeMake.where(recipe_id: recipe_ids, hidden: false),
            comments_received: Comment.where(recipe_id: recipe_ids, hidden: false).length,
            re_shares_received: ReShare.where(recipe_id: recipe_ids, hidden: false).length,
            make_pics_received: make_pics_received,
            followers: Follow.where(followee_id: self.id, hidden: false).length,
            following: Follow.where(follower_id: self.id, hidden: false).length,
            chef_followed: Follow.where(followee_id: self.id, follower_id: userChef.id, hidden: false).length>0,
            chef_commented: Comment.where(recipe_id: recipe_ids, chef_id: userChef.id, hidden: false).length>0,
            chef_liked: RecipeLike.where(recipe_id: recipe_ids, chef_id: userChef.id, hidden: false).length>0,
            chef_made: RecipeMake.where(recipe_id: recipe_ids, chef_id: userChef.id, hidden: false).length>0,
            chef_shared: ReShare.where(recipe_id: recipe_ids, chef_id: userChef.id, hidden: false).length>0,
            chef_make_piced: MakePic.where(recipe_id: recipe_ids, chef_id: userChef.id, hidden: false).length>0
        }
    end

    def hide_everything
        self.re_shares.each {|c| c.update_attribute(:hidden, true)}
        self.comments.each {|c| c.update_attribute(:hidden, true) }
        self.recipe_likes.each {|c| c.update_attribute(:hidden, true) }
        self.follows_as_follower.each {|c| c.update_attribute(:hidden, true) }
        self.follows_as_followee.each {|c| c.update_attribute(:hidden, true) }
        self.recipe_makes.each {|c| c.update_attribute(:hidden, true) }
        self.make_pics.each {|c| c.update_attribute(:hidden, true) }
        self.recipes.each {|c| c.update_attribute(:hidden, true) }
        self.update_attribute(:hidden, true)
        self.update_attribute(:e_mail, "e-mail address erased on account closure")
    end

    def deactivate
        self.update_attribute(:deactivated, true)
        self.update_attribute(:username, "Anonymous")
        self.update_attribute(:profile_text, "This chef has deactivated their profile but allowed us to keep displaying their recipes.")
        self.update_attribute(:image_url, "")
        self.update_attribute(:hex, "")
    end

end
