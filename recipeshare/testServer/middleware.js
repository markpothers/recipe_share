// const { clearedFilters } = require("../src/dataComponents/clearedFilters")
const { recipeDetails } = require("../__mocks__/data/recipeDetails")
const { loggedInChef } = require("../__mocks__/data/loggedInChef")


const middleware = (req, res, next) => {
	console.log(req.method)
	console.log(req.originalUrl)
	// console.log(req.method)
	
	if (req.method === "GET" && req.originalUrl.includes("password_reset")) {
		res.json({error: true, message: "forgotPassword"})
	} else if (req.method === "POST" && req.originalUrl.includes("chefDetails/authenticate")) {
		res.json(loggedInChef)
	} else if (req.method === "PATCH" && req.originalUrl.includes("chefDetails")) {
		res.json(loggedInChef)
	} else if (["POST", "UPDATE"].includes(req.method) && req.originalUrl.includes("recipes")) {
		// console.log(req.body)

		const { recipe: { name, ingredients, instructions, prep_time, cook_time, total_time, difficulty, filter_settings, cuisines, serves, acknoledgement, acknowledgement_link, description, show_blog_preview } } = req.body

		const newRecipe = {
			"instructions": instructions.map((instruction, index) => ({
					"created_at": new Date(),
					"hidden": false,
					"id": 2345 + index,
					"instruction": "step 6",
					"recipe_id": 222,
					"step": index,
					"updated_at": new Date(),
				})
			),
			recipe: {
				acknoledgement,
				acknowledgement_link,
				chef_id: 22,
				cook_time,
				difficulty,
				name,
				prep_time,
				serves,
				show_blog_preview,
				total_time,
				"id": 718,
				"updated_at": "2022-04-09T19:49:31.376Z",
				"created_at": "2022-04-09T19:49:31.376Z",
				description,
				"bread": true,
				"breakfast": false,
				"chicken": true,
				"cuisine": "American",
				"dairy_free": false,
				"dessert": false,
				"dinner": false,
				"freezer_meal": false,
				"gluten_free": false,
				"hidden": false,
				"keto": false,
				"lunch": true,
				"paleo": true,
				"red_meat": false,
				"salad": false,
				"seafood": false,
				"side": true,
				"soup": true,
				"time": null,
				"vegan": false,
				"vegetarian": false,
				"weekend": true,
				"weeknight": false,
				"white_meat": false,
				"whole_30": false,
			},
		}
		res.json(newRecipe)
	} else if (req.method === "POST" && req.originalUrl.includes("comments")) {
		const { comment: { recipe_id, chef_id, comment } } = req.body
		const currentComments = recipeDetails.find(r => r.id === recipe_id).comments
		const newComment = {
			chef_id,
			comment,
			"created_at": "2022-10-02T19:38:05.030Z",
			"hidden": false,
			"id": 2342,
			"image_url": "https://robohash.org/quiamollitianon.png?size=300x300&set=set1",
			recipe_id,
			"updated_at": "2022-10-02T19:38:05.030Z",
			"username": "TestCommentWriter",
		}
		res.json([newComment, ...currentComments])
	} else if (["POST", "DELETE"].includes(req.method)) {
		res.json(true)
	} else {
		next()
	}
}

module.exports = middleware
