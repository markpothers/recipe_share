import React from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View, Keyboard, AsyncStorage, Platform, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import { styles } from './newRecipeStyleSheet'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { times, doubleTimes } from '../dataComponents/times'
import { difficulties } from '../dataComponents/difficulties'
import { postRecipe } from '../fetches/postRecipe'
import { patchRecipe } from '../fetches/patchRecipe'
import { fetchIngredients } from '../fetches/fetchIngredients'
import IngredientAutoComplete from './ingredientAutoComplete'
import PicSourceChooser from '../picSourceChooser/picSourceChooser'
import MultiPicSourceChooser from '../picSourceChooser/multiPicSourceChooser'
import FilterMenu from '../filterMenu/filterMenu'
import DualOSPicker from '../dualOSPicker/DualOSPicker'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions' //eslint-disable-line no-unused-vars
import InstructionRow from './instructionRow'
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
import { DragSortableView } from 'react-native-drag-sort/lib'
import { clearedFilters } from '../dataComponents/clearedFilters'
import OfflineMessage from '../offlineMessage/offlineMessage'
import NetInfo from '@react-native-community/netinfo';
import { AlertPopUp } from '../alertPopUp/alertPopUp';
import AppHeader from '../../navigation/appHeader'
import { getTimeStringFromMinutes, getMinutesFromTimeString } from '../auxFunctions/getTimeStringFromMinutes'

const mapStateToProps = (state) => ({
	loggedInChef: state.loggedInChef
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(
	class NewRecipe extends React.Component {

		state = {
			hasPermission: false,
			renderOfflineMessage: false,
			isFocused: true,
			alertPopUpShowing: false,
			ingredientsList: [],
			autoCompleteFocused: null,
			choosingPrimaryPicture: false,
			choosingInstructionPicture: false,
			instructionImageIndex: 0,
			filterDisplayed: false,
			awaitingServer: false,
			instructionHeights: [responsiveHeight(7.2)
				// , responsiveHeight(7.2),
				// responsiveHeight(7.2),responsiveHeight(7.2),
			],
			averageInstructionHeight: responsiveHeight(7.2),
			scrollingEnabled: true,
			newRecipeDetails: {
				recipeId: null,
				name: "",
				instructions: [
					'',
					// 'Pre heat oven to 450F...',
					// 'Chop everything up so that it is small enough to fit into a small place',
					// 'mix everything together with a liberal helping of mustard',
					// 'drink all the beer you can to help you get through this pigswill',
					// ''
				],
				instructionImages: [''],
				ingredients: [
					{
						name: "",
						quantity: "",
						unit: "Oz"
					},
					// {
					//   name:"Flank steak",
					//   quantity: "500",
					//   unit: "g"
					// },
					// {
					//   name:"Filet of salmon",
					//   quantity: "17",
					//   unit: "fl oz"
					// },
					// {
					//   name:"peas",
					//   quantity: "501",
					//   unit: "each"
					// },
					// {
					//   name:"Boiled potatoes",
					//   quantity: "3",
					//   unit: "Oz"
					// },
					//   {
					//     name:"Chi",
					//     quantity: "2",
					//     unit: "each"
					//   },
					// {
					//   name: "",
					//   quantity: "",
					//   unit: "Oz",
					// }
				],
				difficulty: "0",
				times: {
					prepTime: 0,
					cookTime: 0,
					totalTime: 0,
				},
				primaryImages: [{ uri: '' }],
				filter_settings: {
					"Breakfast": false,
					"Lunch": false,
					"Dinner": false,
					"Chicken": false,
					"Red meat": false,
					"Seafood": false,
					"Vegetarian": false,
					"Salad": false,
					"Vegan": false,
					"Soup": false,
					"Dessert": false,
					"Side": false,
					"Whole 30": false,
					"Paleo": false,
					"Freezer meal": false,
					"Keto": false,
					"Weeknight": false,
					"Weekend": false,
					"Gluten free": false,
					"Bread": false,
					"Dairy free": false,
					"White meat": false,
				},
				cuisine: "Any",
				serves: "Any",
				acknowledgement: "",
				acknowledgementLink: "",
				description: ""
			},
		}

		componentDidMount = async () => {
			await this.setState({ awaitingServer: true })
			this.fetchIngredientsForAutoComplete()
			//if we're editing a recipe
			if (this.props.route.params?.recipe_details !== undefined) {
				this.setRecipeParamsForEditing(this.props.route.params.recipe_details)
				await this.setState({ awaitingServer: false })
			} else {
				//look to see if we're half way through creating a recipe
				// AsyncStorage.removeItem('localNewRecipeDetails')
				AsyncStorage.getItem('localNewRecipeDetails', (err, res) => {
					if (res != null) {
						let savedData = JSON.parse(res)
						this.setState({ ...savedData })
					}
					this.setState({ awaitingServer: false })
				})
			}
		}

		componentDidUpdate = async () => {
			// await this.addNewIngredient()
			// await this.addNewInstruction()
			if (this.state.newRecipeDetails.recipeId) {
				this.props.navigation.setOptions({
					headerTitle: props => <AppHeader {...props} text={"Update Recipe"} route={this.props.route} />
				});
			}
		}

		componentWillUnmount = () => {

		}

		saveNewRecipeDetailsLocally = () => {
			let dataToSave = {
				newRecipeDetails: this.state.newRecipeDetails,
				instructionHeights: this.state.instructionHeights,
				averageInstructionHeight: this.state.averageInstructionHeight
			}
			AsyncStorage.setItem('localNewRecipeDetails', JSON.stringify(dataToSave), () => {
				// console.log('localNewRecipeDetails saved')
			})
		}

		activateScrollView = () => {
			this.setState({ scrollingEnabled: true })
		}

		deactivateScrollView = () => {
			this.setState({ scrollingEnabled: false })
		}

		setRecipeParamsForEditing = async (recipeDetails) => {
			let recipe = recipeDetails.recipe
			let newIngredients
			let newInstructionImages
			newIngredients = recipeDetails.ingredient_uses.map(ingredient_use => {
				return {
					ingredientId: ingredient_use.ingredient_id,
					quantity: ingredient_use.quantity,
					unit: ingredient_use.unit
				}
			})
			newIngredients.forEach(use => use.name = recipeDetails.ingredients.find(ingredient => ingredient.id == use.ingredientId).name)
			newInstructionImages = recipeDetails.instructions.map(i => {
				let image = recipeDetails.instruction_images.find(j => j.instruction_id == i.id)
				if (image) {
					return image
				} else {
					return ''
				}
			})
			await this.setState({
				instructionHeights: recipeDetails.instructions.map(() => responsiveHeight(7.2)),
				newRecipeDetails: {
					recipeId: recipe.id,
					name: recipe.name,
					instructions: recipeDetails.instructions.length > 0 ? recipeDetails.instructions.map(i => i.instruction) : [""],
					instructionImages: newInstructionImages.length > 0 ? newInstructionImages : [""],
					ingredients: newIngredients.length > 0 ? newIngredients : [{ name: "", quantity: "", unit: "Oz" }],
					difficulty: recipe.difficulty.toString(),
					times: {
						prepTime: recipe.prep_time > 0 ? recipe.prep_time : 0,
						cookTime: recipe.cook_time > 0 ? recipe.cook_time : 0,
						totalTime: recipe.total_time > 0 ? recipe.total_time : (recipe.time ? getMinutesFromTimeString(recipe.time) : 0),
					},
					primaryImages: recipeDetails.recipe_images?.length > 0 ? recipeDetails.recipe_images : [{ uri: '' }],
					filter_settings: {
						"Breakfast": recipe["breakfast"],
						"Lunch": recipe["lunch"],
						"Dinner": recipe["dinner"],
						"Chicken": recipe["chicken"],
						"Red meat": recipe["red_meat"],
						"Seafood": recipe["seafood"],
						"Vegetarian": recipe["vegetarian"],
						"Salad": recipe["salad"],
						"Vegan": recipe["vegan"],
						"Soup": recipe["soup"],
						"Dessert": recipe["dessert"],
						"Side": recipe["side"],
						"Whole 30": recipe["whole_30"],
						"Paleo": recipe["paleo"],
						"Freezer meal": recipe["freezer_meal"],
						"Keto": recipe["keto"],
						"Weeknight": recipe["weeknight"],
						"Weekend": recipe["weekend"],
						"Gluten free": recipe["gluten_free"],
						"Bread": recipe["bread"],
						"Dairy free": recipe["dairy_free"],
						"White meat": recipe["white_meat"],
					},
					cuisine: recipe.cuisine,
					serves: recipe.serves,
					acknowledgement: recipe.acknowledgement,
					acknowledgementLink: recipe.acknowledgement_link,
					description: recipe.description
				}
			})
			!this.state.newRecipeDetails.recipeId && this.saveNewRecipeDetailsLocally()
		}

		askToReset = () => {
			this.setState({ alertPopUpShowing: true })
		}

		renderAlertPopUp = () => {
			return (
				<AlertPopUp
					close={() => this.setState({ alertPopUpShowing: false })}
					title={"Are you sure you want to clear this form and start a new recipe?"}
					onYes={this.clearNewRecipeDetails}
				/>
			)
		}

		clearNewRecipeDetails = async () => {
			await this.setState({
				alertPopUpShowing: false,
				newRecipeDetails: {
					recipeId: null,
					name: "",
					instructions: [''],
					instructionImages: [''],
					ingredients: [
						{
							name: "",
							quantity: "",
							unit: "Oz"
						},
					],
					difficulty: "0",
					times: {
						prepTime: 0,
						cookTime: 0,
						totalTime: 0,
					},
					primaryImages: [{ uri: '' }],
					filter_settings: {
						"Breakfast": false,
						"Lunch": false,
						"Dinner": false,
						"Chicken": false,
						"Red meat": false,
						"Seafood": false,
						"Vegetarian": false,
						"Salad": false,
						"Vegan": false,
						"Soup": false,
						"Dessert": false,
						"Side": false,
						"Whole 30": false,
						"Paleo": false,
						"Freezer meal": false,
						"Keto": false,
						"Weeknight": false,
						"Weekend": false,
						"Gluten free": false,
						"Bread": false,
						"Dairy free": false,
						"White meat": false,
					},
					cuisine: "Any",
					serves: "Any",
					acknowledgement: "",
					acknowledgementLink: "",
					description: ""
				},
				instructionHeights: [responsiveHeight(6.5)],
				averageInstructionHeight: responsiveHeight(6.5),
			})
			this.props.navigation.setOptions({
				headerTitle: props => <AppHeader {...props} text={"Create a New Recipe"} route={this.props.route} />
			});
			AsyncStorage.removeItem('localNewRecipeDetails')
		}

		choosePrimaryPicture = () => {
			this.setState({ choosingPrimaryPicture: true })
		}

		primarySourceChosen = async () => {
			await this.setState({ choosingPrimaryPicture: false })
		}

		renderPrimaryPictureChooser = () => {
			Keyboard.dismiss()
			return (
				<MultiPicSourceChooser
					saveImage={this.savePrimaryImage}
					sourceChosen={this.primarySourceChosen}
					key={"primary-pic-chooser"}
					imageSources={this.state.newRecipeDetails.primaryImages}
					isMultiple={true}
				/>
			)
		}

		savePrimaryImage = async (newImages) => {
			// await this.setState({ awaitingServer: true })
			// if (!newImages[index].cancelled) {
			await this.setState((state) => {
				return ({
					newRecipeDetails: { ...state.newRecipeDetails, primaryImages: newImages },
					// awaitingServer: false,
				})
			})
			// } else {
			// await this.setState({ awaitingServer: false })
			// }
			!this.state.newRecipeDetails.recipeId && this.saveNewRecipeDetailsLocally()
		}

		thisAutocompleteIsFocused = (index) => {
			this.setState({
				autoCompleteFocused: index,
			})
		}

		fetchIngredientsForAutoComplete = async () => {
			const ingredients = await fetchIngredients(this.props.loggedInChef.auth_token)
			if (ingredients) {
				this.setState({ ingredientsList: ingredients })
			}
		}

		updateIngredientEntry = async (index, name, quantity, unit) => {
			await this.setState((state) => {
				let newIngredients = state.newRecipeDetails.ingredients
				newIngredients[index].name = name
				newIngredients[index].quantity = quantity
				newIngredients[index].unit = unit
				return ({
					newRecipeDetails: {
						...state.newRecipeDetails,
						ingredients: newIngredients
					}
				})
			})
			!this.state.newRecipeDetails.recipeId && this.saveNewRecipeDetailsLocally()
		}

		handleIngredientSort = async (newIngredients) => {
			await this.setState((state) => {
				return ({
					newRecipeDetails: {
						...state.newRecipeDetails,
						ingredients: newIngredients,
					},
				})
			})
			!this.state.newRecipeDetails.recipeId && this.saveNewRecipeDetailsLocally()
		}

		addNewIngredient = () => {
			let ingredients = this.state.newRecipeDetails.ingredients
			// if (ingredients[ingredients.length - 1].name != "" || ingredients[ingredients.length - 1].quantity != "" || ingredients[ingredients.length - 1].unit != "Oz") {
			let newIngredients = [...ingredients, { name: "", quantity: "", unit: "Oz" }]
			this.setState((state) => {
				return ({
					newRecipeDetails: { ...state.newRecipeDetails, ingredients: newIngredients }
				})
			})
			// }
			!this.state.newRecipeDetails.recipeId && this.saveNewRecipeDetailsLocally()
		}

		removeIngredient = async (index) => {
			await this.setState((state) => {
				let newIngredients = [...state.newRecipeDetails.ingredients]
				newIngredients.splice(index, 1)
				return ({
					newRecipeDetails: { ...state.newRecipeDetails, ingredients: newIngredients },
				})
			})
			!this.state.newRecipeDetails.recipeId && this.saveNewRecipeDetailsLocally()
		}

		handleInput = async (text, parameter) => {
			await this.setState((state) => {
				return ({
					newRecipeDetails: { ...state.newRecipeDetails, [parameter]: text },
				})
			})
			!this.state.newRecipeDetails.recipeId && this.saveNewRecipeDetailsLocally()
		}

		submitRecipe = async () => {
			// console.log('submitting')
			Keyboard.dismiss()
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
				let newRecipeDetails = this.state.newRecipeDetails
				if (newRecipeDetails.recipeId) { // it's an existing recipe we're updating
					try {
						const recipe = await patchRecipe(
							this.props.loggedInChef.id,
							this.props.loggedInChef.auth_token,
							newRecipeDetails.name,
							newRecipeDetails.ingredients,
							newRecipeDetails.instructions,
							newRecipeDetails.instructionImages,
							newRecipeDetails.times.prepTime,
							newRecipeDetails.times.cookTime,
							newRecipeDetails.times.totalTime,
							newRecipeDetails.difficulty,
							newRecipeDetails.primaryImages,
							newRecipeDetails.filter_settings,
							newRecipeDetails.cuisine,
							newRecipeDetails.serves,
							newRecipeDetails.recipeId,
							newRecipeDetails.acknowledgement,
							newRecipeDetails.acknowledgementLink,
							newRecipeDetails.description
						)
						if (recipe) {
							// this.clearNewRecipeDetails()
							// AsyncStorage.removeItem('localNewRecipeDetails')
							this.props.navigation.popToTop() //clears Recipe Details and newRecipe screens from the view stack so that switching back to BrowseRecipes will go to the List and not another screen
							this.props.navigation.navigate('MyRecipeBook', { screen: 'My Recipes' })
						}
					} catch (e) {
						if (e.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
						this.setState({ renderOfflineMessage: true })
					}
				} else { // it's a new recipe
					try {
						const recipe = await postRecipe(
							this.props.loggedInChef.id,
							this.props.loggedInChef.auth_token,
							newRecipeDetails.name,
							newRecipeDetails.ingredients,
							newRecipeDetails.instructions,
							newRecipeDetails.instructionImages,
							newRecipeDetails.times.prepTime,
							newRecipeDetails.times.cookTime,
							newRecipeDetails.times.totalTime,
							newRecipeDetails.difficulty,
							newRecipeDetails.primaryImages,
							newRecipeDetails.filter_settings,
							newRecipeDetails.cuisine,
							newRecipeDetails.serves,
							newRecipeDetails.acknowledgement,
							newRecipeDetails.acknowledgementLink,
							newRecipeDetails.description
						)
						if (recipe) {
							this.clearNewRecipeDetails()
							this.props.navigation.popToTop() //clears Recipe Details and newRecipe screens from the view stack so that switching back to BrowseRecipes will go to the List and not another screen
							this.props.navigation.navigate('MyRecipeBook', { screen: 'My Recipes' })

						}
					} catch (e) {
						if (e.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
						this.setState({ renderOfflineMessage: true })
					}
				}
				await this.setState({ awaitingServer: false })
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		handleCategoriesButton = async () => {
			await this.setState({ filterDisplayed: !this.state.filterDisplayed })
			!this.state.newRecipeDetails.recipeId && this.saveNewRecipeDetailsLocally()
		}

		handleInstructionChange = (text, index) => {
			this.setState((state) => {
				let newInstructions = [...state.newRecipeDetails.instructions]
				newInstructions[index] = text
				let newInstructionHeights = [...this.state.instructionHeights]
				return ({
					newRecipeDetails: { ...state.newRecipeDetails, instructions: newInstructions },
					instructionHeights: newInstructionHeights
				})
			})
			!this.state.newRecipeDetails.recipeId && this.saveNewRecipeDetailsLocally()
		}

		handleInstructionSizeChange = (index, size) => {
			this.setState((state) => {
				let newInstructionHeights = [...state.instructionHeights]
				newInstructionHeights[index] = size + responsiveHeight(0.5)
				let newAverageInstructionHeight = parseFloat(newInstructionHeights.reduce((acc, height) => acc + height, 0) / newInstructionHeights.length)
				return ({
					instructionHeights: newInstructionHeights,
					averageInstructionHeight: newAverageInstructionHeight,
				})
			})
		}

		handleInstructionsSort = (newInstructions) => {
			let newInstructionHeights = []
			let newInstructionImages = []
			newInstructions.forEach(instruction => {
				let index = this.state.newRecipeDetails.instructions.indexOf(instruction)
				newInstructionHeights.push(this.state.instructionHeights[index])
				newInstructionImages.push(this.state.newRecipeDetails.instructionImages[index])
			})
			this.setState((state) => {
				return ({
					newRecipeDetails: {
						...state.newRecipeDetails,
						instructions: newInstructions,
						instructionImages: newInstructionImages
					},
					instructionHeights: newInstructionHeights,
				})
			})
			!this.state.newRecipeDetails.recipeId && this.saveNewRecipeDetailsLocally()
		}

		addNewInstruction = () => {
			// if (this.state.newRecipeDetails.instructions[this.state.newRecipeDetails.instructions.length - 1] !== ''
			// 	|| this.state.newRecipeDetails.instructions[this.state.newRecipeDetails.instructions.length - 2] !== ''
			// ) {
			this.setState((state) => {
				let newInstructions = [...state.newRecipeDetails.instructions]
				newInstructions.push('')
				let newInstructionImages = [...state.newRecipeDetails.instructionImages, '']
				let newInstructionHeights = [...state.instructionHeights, responsiveHeight(7.2)]
				let newAverageInstructionHeight = newInstructionHeights.reduce((acc, h) => acc + h, 0) / newInstructionHeights.length
				return ({
					newRecipeDetails: {
						...state.newRecipeDetails,
						instructions: newInstructions,
						instructionImages: newInstructionImages
					},
					averageInstructionHeight: newAverageInstructionHeight,
					instructionHeights: newInstructionHeights
				})
			})
			// }
		}

		removeInstruction = (index) => {
			this.setState((state) => {
				let newInstructions = [...state.newRecipeDetails.instructions]
				newInstructions.splice(index, 1)
				let newInstructionHeights = [...state.instructionHeights]
				newInstructionHeights.splice(index, 1)
				let newInstructionImages = [...state.newRecipeDetails.instructionImages]
				newInstructionImages.splice(index, 1)
				let newAverageInstructionHeight = newInstructionHeights.reduce((acc, h) => acc + h, 0) / newInstructionHeights.length
				return ({
					newRecipeDetails: {
						...state.newRecipeDetails,
						instructions: newInstructions,
						instructionImages: newInstructionImages
					},
					instructionHeights: newInstructionHeights,
					averageInstructionHeight: newAverageInstructionHeight
				})
			})
			!this.state.newRecipeDetails.recipeId && this.saveNewRecipeDetailsLocally()
		}

		chooseInstructionPicture = (index) => {
			this.setState({
				choosingInstructionPicture: true,
				instructionImageIndex: index
			})
		}

		instructionSourceChosen = async () => {
			await this.setState({ choosingInstructionPicture: false })
			!this.state.newRecipeDetails.recipeId && this.saveNewRecipeDetailsLocally()
		}

		renderInstructionPictureChooser = () => {
			Keyboard.dismiss()
			let imageSource = typeof this.state.newRecipeDetails.instructionImages[this.state.instructionImageIndex] == 'object' ? this.state.newRecipeDetails.instructionImages[this.state.instructionImageIndex].image_url : this.state.newRecipeDetails.instructionImages[this.state.instructionImageIndex]
			return (
				<PicSourceChooser
					saveImage={this.saveInstructionImage}
					index={this.state.instructionImageIndex}
					sourceChosen={this.instructionSourceChosen}
					key={"instruction-pic-chooser"}
					imageSource={imageSource}
					originalImage={this.state.newRecipeDetails.instructionImages[this.state.instructionImageIndex]}
					cancelChooseImage={this.cancelChooseInstructionImage}
				/>
			)
		}

		saveInstructionImage = async (image, index) => {
			await this.setState({ awaitingServer: true })
			if (image.cancelled === false) {
				await this.setState((state) => {
					let newInstructionImages = [...state.newRecipeDetails.instructionImages]
					newInstructionImages[index] = image.uri
					return ({
						choosingPicture: false,
						newRecipeDetails: {
							...state.newRecipeDetails,
							instructionImages: newInstructionImages
						},
						awaitingServer: false,
					})
				})
				!this.state.newRecipeDetails.recipeId && this.saveNewRecipeDetailsLocally()
			}
			else {
				await this.setState({ awaitingServer: false })
			}
		}

		cancelChooseInstructionImage = async (image, index) => {
			await this.setState((state) => {
				let newInstructionImages = [...state.newRecipeDetails.instructionImages]
				newInstructionImages[index] = image
				return ({
					choosingPicture: false,
					newRecipeDetails: {
						...state.newRecipeDetails,
						instructionImages: newInstructionImages
					},
					awaitingServer: false,
				})
			})
			!this.state.newRecipeDetails.recipeId && this.saveNewRecipeDetailsLocally()
		}

		toggleFilterCategory = (category) => {
			this.setState((state) => {
				return ({
					newRecipeDetails: {
						...state.newRecipeDetails,
						filter_settings: {
							...state.newRecipeDetails.filter_settings,
							[category]: !state.newRecipeDetails.filter_settings[category]
						}
					}
				})
			})
		}

		clearFilerCategories = () => {
			this.setState((state) => {
				return ({
					newRecipeDetails: {
						...state.newRecipeDetails,
						filter_settings: clearedFilters,
						cuisine: 'Any',
						serves: 'Any'
					}
				})
			})
		}

		render() {
			// console.log(getTimeStringFromMinutes(this.state.newRecipeDetails.times?.totalTime))
			return (
				<SpinachAppContainer awaitingServer={this.state.awaitingServer} scrollingEnabled={false} >
					{
						this.state.renderOfflineMessage && (
							<OfflineMessage
								message={`Sorry, can't save your recipe right now.${"\n"}You appear to be offline.${"\n"}Don't worry though, new recipes are saved until you can reconnect and try again.`}
								topOffset={'10%'}
								clearOfflineMessage={() => this.setState({ renderOfflineMessage: false })}
							/>)
					}
					{this.state.filterDisplayed && (
						<FilterMenu
							handleCategoriesButton={this.handleCategoriesButton}
							newRecipe={true}
							newRecipeFilterSettings={this.state.newRecipeDetails.filter_settings}
							switchNewRecipeFilterValue={this.toggleFilterCategory}
							newRecipeServes={this.state.newRecipeDetails.serves}
							setNewRecipeServes={this.handleInput}
							newRecipeCuisine={this.state.newRecipeDetails.cuisine}
							setNewRecipeCuisine={this.handleInput}
							clearNewRecipeFilters={this.clearFilerCategories}
							confirmButtonText={"Save"}
							title={"Select categories for your recipe"}
						/>
					)
					}
					{this.state.choosingPrimaryPicture && this.renderPrimaryPictureChooser()}
					{this.state.choosingInstructionPicture && this.renderInstructionPictureChooser()}
					{this.state.alertPopUpShowing && this.renderAlertPopUp()}
					< KeyboardAvoidingView
						style={centralStyles.fullPageKeyboardAvoidingView}
						behavior={(Platform.OS === "ios" ? "padding" : "")}
						keyboardVerticalOffset={Platform.OS === 'ios' ? responsiveHeight(9) + 20 : 0}
					>
						<ScrollView style={centralStyles.fullPageScrollView}
							nestedScrollEnabled={true}
							scrollEnabled={this.state.scrollingEnabled}
							keyboardShouldPersistTaps={'always'}
						>
							<TouchableOpacity
								style={[centralStyles.formContainer,
								{ width: responsiveWidth(100), marginLeft: 0, marginRight: 0 }
								]}
								onPress={Keyboard.dismiss}
								activeOpacity={1}
							>
								{/* recipe name */}
								<View style={centralStyles.formSection}>
									<View style={centralStyles.formInputContainer}>
										<View style={centralStyles.formInputWhiteBackground}>
											<TextInput
												multiline={true}
												maxFontSizeMultiplier={2}
												style={centralStyles.formInput}
												value={this.state.newRecipeDetails.name}
												placeholder="Recipe name"
												onChangeText={(t) => this.handleInput(t, "name")} />
										</View>
									</View>
								</View>
								{/* separator */}
								<View style={centralStyles.formSectionSeparatorContainer}>
									<View style={centralStyles.formSectionSeparator}>
									</View>
								</View>
								{/* times */}
								<View style={centralStyles.formSection}>
									<View style={[centralStyles.formInputContainer, { justifyContent: 'flex-start' }]}>
										<View style={styles.timeAndDifficultyTitleItem}>
											<Text maxFontSizeMultiplier={1.7} style={styles.timeAndDifficultyTitle}>Prep Time:</Text>
										</View>
										<View picker style={[styles.timeAndDifficulty, { paddingLeft: (Platform.OS === 'ios' ? 0 : responsiveWidth(2)) }]} >
											<DualOSPicker
												onChoiceChange={(choice) => {
													let newTimes = {
														prepTime: getMinutesFromTimeString(choice),
														cookTime: this.state.newRecipeDetails.times?.cookTime ?? 0,
														totalTime: getMinutesFromTimeString(choice) + (this.state.newRecipeDetails.times?.cookTime ?? 0)
													}
													this.handleInput(newTimes, "times")
												}}
												options={times}
												selectedChoice={getTimeStringFromMinutes(this.state.newRecipeDetails.times?.prepTime)}
											/>
										</View>
									</View>
									<View style={[centralStyles.formInputContainer, { justifyContent: 'flex-start' }]}>
										<View style={styles.timeAndDifficultyTitleItem}>
											<Text maxFontSizeMultiplier={1.7} style={styles.timeAndDifficultyTitle}>Cook Time:</Text>
										</View>
										<View picker style={[styles.timeAndDifficulty, { paddingLeft: (Platform.OS === 'ios' ? 0 : responsiveWidth(2)) }]} >
											<DualOSPicker
												onChoiceChange={(choice) => {
													let newTimes = {
														prepTime: this.state.newRecipeDetails.times?.prepTime ?? 0,
														cookTime: getMinutesFromTimeString(choice),
														totalTime: getMinutesFromTimeString(choice) + (this.state.newRecipeDetails.times?.prepTime ?? 0)
													}
													this.handleInput(newTimes, "times")
												}}
												options={times}
												selectedChoice={getTimeStringFromMinutes(this.state.newRecipeDetails.times?.cookTime)}
											/>
										</View>
									</View>
									<View style={[centralStyles.formInputContainer, { justifyContent: 'flex-start' }]}>
										<View style={styles.timeAndDifficultyTitleItem}>
											<Text maxFontSizeMultiplier={1.7} style={styles.timeAndDifficultyTitle}>Total Time:</Text>
										</View>
										<View picker style={[styles.timeAndDifficulty, { paddingLeft: (Platform.OS === 'ios' ? 0 : responsiveWidth(2)) }]} >
											<DualOSPicker
												onChoiceChange={(choice) => {
													let newTimes = {
														prepTime: this.state.newRecipeDetails.times?.prepTime ?? 0,
														cookTime: this.state.newRecipeDetails.times?.cookTime ?? 0,
														totalTime: getMinutesFromTimeString(choice)
													}
													this.handleInput(newTimes, "times")
												}}
												options={[...times, ...doubleTimes]}
												selectedChoice={getTimeStringFromMinutes(this.state.newRecipeDetails.times?.totalTime)}
											/>
										</View>
									</View>
								</View>
								{/* separator */}
								<View style={centralStyles.formSectionSeparatorContainer}>
									<View style={centralStyles.formSectionSeparator}>
									</View>
								</View>
								{/* difficulty */}
								<View style={centralStyles.formSection}>
									<View style={[centralStyles.formInputContainer, { justifyContent: 'flex-start' }]}>
										<View style={styles.timeAndDifficultyTitleItem}>
											<Text maxFontSizeMultiplier={1.7} style={styles.timeAndDifficultyTitle}>Difficulty:</Text>
										</View>
										<View style={[styles.timeAndDifficulty, { paddingLeft: (Platform.OS === 'ios' ? 0 : responsiveWidth(2)) }]}>
											<DualOSPicker
												onChoiceChange={(choice) => this.handleInput(choice, "difficulty")}
												options={difficulties}
												selectedChoice={this.state.newRecipeDetails.difficulty} />
										</View>
									</View>
								</View>
								{/* separator */}
								<View style={centralStyles.formSectionSeparatorContainer}>
									<View style={centralStyles.formSectionSeparator}>
									</View>
								</View>
								{/* description */}
								<View style={centralStyles.formSection}>
									<View style={centralStyles.formInputContainer}>
										<View style={centralStyles.formInputWhiteBackground}>
											<TextInput
												multiline={true}
												numberOfLines={3}
												maxFontSizeMultiplier={2}
												style={[centralStyles.formInput, { padding: responsiveHeight(0.5) }]}
												value={this.state.newRecipeDetails.description}
												placeholder="Tell us about this recipe"
												onChangeText={(t) => this.handleInput(t, "description")} />
										</View>
									</View>
								</View>
								{/* separator */}
								<View style={centralStyles.formSectionSeparatorContainer}>
									<View style={centralStyles.formSectionSeparator}>
									</View>
								</View>
								{/* main pictures*/}
								<View style={[centralStyles.formSection, { width: responsiveWidth(80) }]}>
									<View style={[centralStyles.formInputContainer, { justifyContent: 'center' }]}>
										<TouchableOpacity style={[centralStyles.yellowRectangleButton, { maxWidth: '75%', width: '75%', justifyContent: 'center' }]} activeOpacity={0.7} onPress={this.choosePrimaryPicture}>
											<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='camera'></Icon>
											<Text maxFontSizeMultiplier={2} style={[centralStyles.greenButtonText, { marginLeft: responsiveWidth(3), fontSize: responsiveFontSize(2.3) }]}>Cover Pictures</Text>
										</TouchableOpacity>
									</View>
								</View>
								{/* separator */}
								<View style={centralStyles.formSectionSeparatorContainer}>
									<View style={centralStyles.formSectionSeparator}>
									</View>
								</View>
								{/* ingredients */}
								<View
									style={[
										centralStyles.formSection,
										this.state.autoCompleteFocused !== null && { zIndex: 1 },
										{ paddingBottom: responsiveHeight(3.5) }
									]}
								>
									<DragSortableView
										dataSource={this.state.newRecipeDetails.ingredients}
										parentWidth={responsiveWidth(100)}
										childrenWidth={responsiveWidth(100)}
										childrenHeight={responsiveHeight(12.5)}
										reverseChildZIndexing={true}
										marginChildrenTop={responsiveHeight(0.5)}
										onDataChange={(newIngredients) => this.handleIngredientSort(newIngredients)}
										onClickItem={() => {
											if (this.state.autoCompleteFocused !== null) {
												this.setState({ autoCompleteFocused: null })
											}
											Keyboard.dismiss()
										}}
										onDragStart={this.deactivateScrollView}
										onDragEnd={this.activateScrollView}
										delayLongPress={200}
										keyExtractor={(item, index) => `${index}`}
										renderItem={(item, index) => {
											return (
												<IngredientAutoComplete
													removeIngredient={this.removeIngredient}
													// key={index}
													ingredientIndex={index}
													ingredient={item}
													ingredientsList={this.state.ingredientsList}
													focused={this.state.autoCompleteFocused}
													index={index}
													ingredientsLength={this.state.newRecipeDetails.ingredients.length}
													thisAutocompleteIsFocused={this.thisAutocompleteIsFocused}
													updateIngredientEntry={this.updateIngredientEntry}
												/>
											)
										}}
									/>
									<View style={styles.plusButtonContainer}>
										<TouchableOpacity style={styles.plusButton} onPress={this.addNewIngredient}>
											<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(5)} name='plus'></Icon>
										</TouchableOpacity>
									</View>
								</View>
								{/* separator */}
								<View style={[centralStyles.formSectionSeparatorContainer
									, { marginTop: -responsiveHeight(2.7) }
								]}>
									<View style={centralStyles.formSectionSeparator}>
									</View>
								</View>
								{/* instructions */}
								<View style={centralStyles.formSection}>
									<DragSortableView
										dataSource={this.state.newRecipeDetails.instructions}
										parentWidth={responsiveWidth(100)}
										childrenWidth={responsiveWidth(100)}
										childrenHeight={this.state.averageInstructionHeight}
										childrenHeights={this.state.instructionHeights}
										marginChildrenTop={0}
										onDataChange={(newInstructions) => this.handleInstructionsSort(newInstructions)}
										onDragStart={() => {
											this.deactivateScrollView()
											Keyboard.dismiss()
										}}
										onClickItem={Keyboard.dismiss}
										onDragEnd={this.activateScrollView}
										delayLongPress={100}
										keyExtractor={(item, index) => `${index}${item}`}
										renderItem={(item, index) => {
											return (
												<InstructionRow
													refreshSortableList={this.state.refreshSortableList}
													removeInstruction={this.removeInstruction}
													handleInstructionChange={this.handleInstructionChange}
													item={item}
													index={index}
													handleInstructionSizeChange={this.handleInstructionSizeChange}
													addNewInstruction={this.addNewInstruction}
													chooseInstructionPicture={this.chooseInstructionPicture}
													instructionImagePresent={this.state.newRecipeDetails.instructionImages[index] != ''}
													setFocusedInstructionInput={this.setFocusedInstructionInput}
												/>
											)
										}}
									/>
									<View style={styles.plusButtonContainer}>
										<TouchableOpacity style={styles.plusButton} onPress={this.addNewInstruction}>
											<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(5)} name='plus'></Icon>
										</TouchableOpacity>
									</View>
								</View>
								{/* separator */}
								<View style={centralStyles.formSectionSeparatorContainer}>
									<View style={centralStyles.formSectionSeparator}>
									</View>
								</View>
								{/* filter categories*/}
								<View style={[centralStyles.formSection, { width: responsiveWidth(80) }]}>
									<View style={[centralStyles.formInputContainer, { justifyContent: 'center' }]}>
										<TouchableOpacity style={[centralStyles.yellowRectangleButton, { maxWidth: '75%', width: '75%', justifyContent: 'center' }]} activeOpacity={0.7} onPress={this.handleCategoriesButton}>
											<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='filter'></Icon>
											<Text maxFontSizeMultiplier={2} style={[centralStyles.greenButtonText, { marginLeft: responsiveWidth(3), fontSize: responsiveFontSize(2.3) }]}>Filter categories</Text>
										</TouchableOpacity>
									</View>
								</View>
								{/* separator */}
								<View style={centralStyles.formSectionSeparatorContainer}>
									<View style={centralStyles.formSectionSeparator}>
									</View>
								</View>
								{/* acknowledgement */}
								<View style={centralStyles.formSection}>
									<View style={centralStyles.formInputContainer}>
										<View style={centralStyles.formInputWhiteBackground}>
											<TextInput
												maxFontSizeMultiplier={2}
												style={centralStyles.formInput}
												value={this.state.newRecipeDetails.acknowledgement}
												placeholder="Acknowledge your recipe's source if it's not yourself"
												onChangeText={(t) => this.handleInput(t, "acknowledgement")}
											/>
										</View>
									</View>
								</View>
								{/* acknowledgement link */}
								<View style={centralStyles.formSection}>
									<View style={centralStyles.formInputContainer}>
										<View style={centralStyles.formInputWhiteBackground}>
											<TextInput
												maxFontSizeMultiplier={2}
												style={centralStyles.formInput}
												value={this.state.newRecipeDetails.acknowledgementLink}
												placeholder="Include a link to the original book or blog"
												onChangeText={(t) => this.handleInput(t, "acknowledgementLink")} />
										</View>
									</View>
								</View>
								{/* separator */}
								<View style={centralStyles.formSectionSeparatorContainer}>
									<View style={centralStyles.formSectionSeparator}>
									</View>
								</View>
								{/* submit */}
								<View style={[centralStyles.formSection, { width: responsiveWidth(80) }]}>
									<View style={centralStyles.formInputContainer}>
										<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={this.askToReset} disabled={this.state.awaitingServer}>
											<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='alert-circle-outline'></Icon>
											<Text maxFontSizeMultiplier={2} style={[centralStyles.greenButtonText, { fontSize: responsiveFontSize(2.2) }]}>Clear</Text>
										</TouchableOpacity>
										<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={e => this.submitRecipe(e)} disabled={this.state.awaitingServer}>
											<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='login'></Icon>
											<Text maxFontSizeMultiplier={2} style={[centralStyles.greenButtonText, { fontSize: responsiveFontSize(2.2) }]}>Submit</Text>
										</TouchableOpacity>
									</View>
								</View>
								{/* separator */}
								<View style={[centralStyles.formSectionSeparatorContainer, { marginBottom: 0 }]}>
								</View>
							</TouchableOpacity>
						</ScrollView>
					</KeyboardAvoidingView >
				</SpinachAppContainer >
			)
		}
	}
)
