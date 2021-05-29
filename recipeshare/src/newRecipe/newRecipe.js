import React from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View, Keyboard, AsyncStorage, Platform, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import { styles } from './newRecipeStyleSheet'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { times, doubleTimes } from '../dataComponents/times'
import helpTexts from '../dataComponents/helpTexts'
import { difficulties } from '../dataComponents/difficulties'
import { postRecipe } from '../fetches/postRecipe'
import { postRecipeImage } from '../fetches/postRecipeImage'
import { postInstructionImage } from '../fetches/postInstructionImage'
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
import SwitchSized from '../switchSized/switchSized'
import { TextPopUp } from '../textPopUp/textPopUp'
import { emptyRecipe } from './recipeTemplates/emptyRecipe'
import { longTestRecipe } from './recipeTemplates/longTestRecipe' //eslint-disable-line no-unused-vars
import { shortTestRecipe } from './recipeTemplates/shortTestRecipe' //eslint-disable-line no-unused-vars

const testing = false
const testRecipe = longTestRecipe

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
			helpShowing: false,
			helpText: "",
			ingredientsList: [],
			autoCompleteFocused: null,
			choosingPrimaryPicture: false,
			choosingInstructionPicture: false,
			instructionImageIndex: 0,
			filterDisplayed: false,
			awaitingServer: false,
			scrollingEnabled: true,
			errors: [],
			...(testing ? testRecipe : emptyRecipe)
		}

		componentDidMount = async () => {
			this.setState({ awaitingServer: true }, async () => {
				await this.fetchIngredientsForAutoComplete()
				this.setState({ awaitingServer: false })
				//if we're editing a recipe
				if (this.props.route.params?.recipe_details !== undefined) {
					let savedEditingRecipe = JSON.parse(await AsyncStorage.getItem('localEditRecipeDetails'))
					if (savedEditingRecipe && savedEditingRecipe.newRecipeDetails.recipeId == this.props.route.params?.recipe_details.recipe.id) {
						this.setState({
							...savedEditingRecipe,
							awaitingServer: false
						})
					} else {
						this.setRecipeParamsForEditing(this.props.route.params.recipe_details)
						this.setState({ awaitingServer: false })
					}
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
			})
		}

		componentDidUpdate = async () => {
			// await this.addNewIngredient()
			// await this.addNewInstruction()
			// if (this.state.newRecipeDetails.recipeId && !prevState.state.newRecipeDetails.recipeId) {
			if (this.state.newRecipeDetails.recipeId) {
				if (this.props.route.params?.recipe_details?.recipe?.id) {
					this.props.navigation.setOptions({
						headerTitle: props => <AppHeader {...props} text={"Update Recipe"} route={this.props.route} />
					})
				} else {
					this.props.navigation.setOptions({
						headerTitle: props => <AppHeader {...props} text={"Finish Recipe"} route={this.props.route} />
					})
				}
			} else {
				this.props.navigation.setOptions({
					headerTitle: props => <AppHeader {...props} text={"Create a New Recipe"} route={this.props.route} />
				})
			}
			// }
			// console.log(this.state.newRecipeDetails.recipeId)
		}

		componentWillUnmount = () => {

		}

		saveNewRecipeDetailsLocally = (forceNew) => {
			let dataToSave = {
				newRecipeDetails: this.state.newRecipeDetails,
				instructionHeights: this.state.instructionHeights,
				averageInstructionHeight: this.state.averageInstructionHeight
			}
			if (!forceNew && this.state.newRecipeDetails.recipeId) {
				AsyncStorage.setItem('localEditRecipeDetails', JSON.stringify(dataToSave), () => {
					// console.log('localEditRecipeDetails saved')
				})
			} else {
				AsyncStorage.setItem('localNewRecipeDetails', JSON.stringify(dataToSave), () => {
					// console.log('localNewRecipeDetails saved')
				})
			}
		}

		activateScrollView = () => { this.setState({ scrollingEnabled: true }) }

		deactivateScrollView = () => { this.setState({ scrollingEnabled: false }) }

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
			this.setState({
				instructionHeights: recipeDetails.instructions.map(() => responsiveHeight(6.5)),
				averageInstructionHeight: responsiveHeight(6.5),
				errors: [],
				newRecipeDetails: {
					recipeId: recipe.id,
					name: recipe.name,
					instructions: recipeDetails.instructions.length > 0 ? recipeDetails.instructions.map(i => i.instruction) : [],
					instructionImages: newInstructionImages.length > 0 ? newInstructionImages : [],
					ingredients: newIngredients.length > 0 ? newIngredients : [],
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
					description: recipe.description,
					showBlogPreview: recipe.show_blog_preview,
				}
			}, this.saveNewRecipeDetailsLocally)
		}

		askToReset = () => { this.setState({ alertPopUpShowing: true }) }

		renderAlertPopUp = () => {
			return (
				<AlertPopUp
					close={() => this.setState({ alertPopUpShowing: false })}
					title={(this.props.route.params?.recipe_details !== undefined ?
						"Are you sure you want to clear your changes and revert to the original recipe" :
						"Are you sure you want to clear this form and start a new recipe?"
					)}
					onYes={this.clearNewRecipeDetails}
				/>
			)
		}

		clearNewRecipeDetails = async (resetToNewRecipe = false) => {
			AsyncStorage.multiRemove(['localNewRecipeDetails', 'localEditRecipeDetails'])
			if (resetToNewRecipe !== true && this.props.route.params?.recipe_details !== undefined) {
				await this.setRecipeParamsForEditing(this.props.route.params.recipe_details)
				this.setState({ alertPopUpShowing: false })
			} else {
				this.setState(() => (testing ? testRecipe : emptyRecipe))
				this.props.navigation.setOptions({
					headerTitle: props => <AppHeader {...props} text={"Create a New Recipe"} route={this.props.route} />
				})
			}
		}

		choosePrimaryPicture = () => { this.setState({ choosingPrimaryPicture: true }) }

		primarySourceChosen = async () => { this.setState({ choosingPrimaryPicture: false }) }

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

		savePrimaryImage = (newImages) => {
			this.setState((state) => {
				return ({
					newRecipeDetails: { ...state.newRecipeDetails, primaryImages: newImages },
				})
			}, this.saveNewRecipeDetailsLocally)
		}

		thisAutocompleteIsFocused = (index) => { this.setState({ autoCompleteFocused: index }) }

		fetchIngredientsForAutoComplete = async () => {
			try {
				const ingredients = await fetchIngredients(this.props.loggedInChef.auth_token)
				if (ingredients) {
					this.setState({ ingredientsList: ingredients })
				}
			} catch {
				this.setState({ awaitingServer: false })
			}
		}

		updateIngredientEntry = (index, name, quantity, unit) => {
			this.setState((state) => {
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
			}, this.saveNewRecipeDetailsLocally)
		}

		handleIngredientSort = async (newIngredients) => {
			this.setState((state) => {
				return ({
					newRecipeDetails: {
						...state.newRecipeDetails,
						ingredients: newIngredients,
					},
				})
			}, this.saveNewRecipeDetailsLocally)
		}

		addNewIngredient = () => {
			let ingredients = this.state.newRecipeDetails.ingredients
			let newIngredients = [...ingredients, { name: "", quantity: "", unit: "Oz" }]
			this.setState((state) => {
				return ({
					newRecipeDetails: { ...state.newRecipeDetails, ingredients: newIngredients }
				})
			}, this.saveNewRecipeDetailsLocally)
		}

		removeIngredient = (index) => {
			this.setState((state) => {
				let newIngredients = [...state.newRecipeDetails.ingredients]
				newIngredients.splice(index, 1)
				return ({
					newRecipeDetails: { ...state.newRecipeDetails, ingredients: newIngredients },
				})
			}, this.saveNewRecipeDetailsLocally)
		}

		handleInput = (text, parameter) => {
			this.setState((state) => {
				return ({
					newRecipeDetails: { ...state.newRecipeDetails, [parameter]: text },
					errors: []
				})
			}, this.saveNewRecipeDetailsLocally)
		}

		submitRecipe = async () => {
			// console.log('submitting')
			Keyboard.dismiss()
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				this.setState({ awaitingServer: true }, async () => {
					let newRecipeDetails = this.state.newRecipeDetails
					// console.log(newRecipeDetails)
					if (newRecipeDetails.recipeId) { // it's an existing recipe we're updating
						try {
							// console.log('editing recipe')
							const recipe = await patchRecipe(
								this.props.loggedInChef.id,
								this.props.loggedInChef.auth_token,
								newRecipeDetails.name,
								newRecipeDetails.ingredients,
								newRecipeDetails.instructions,
								// newRecipeDetails.instructionImages,
								newRecipeDetails.times.prepTime,
								newRecipeDetails.times.cookTime,
								newRecipeDetails.times.totalTime,
								newRecipeDetails.difficulty,
								// newRecipeDetails.primaryImages,
								newRecipeDetails.filter_settings,
								newRecipeDetails.cuisine,
								newRecipeDetails.serves,
								newRecipeDetails.recipeId,
								newRecipeDetails.acknowledgement,
								newRecipeDetails.acknowledgementLink,
								newRecipeDetails.description,
								newRecipeDetails.showBlogPreview,
							)
							if (recipe) {
								if (recipe.error) {
									this.setState({ errors: recipe.message })
								} else {
									let success = await this.postImages(newRecipeDetails, recipe)
									if (success) {
										this.clearNewRecipeDetails()
										this.props.navigation.popToTop() //clears Recipe Details and newRecipe screens from the view stack so that switching back to BrowseRecipes will go to the List and not another screen
										this.props.navigation.navigate('MyRecipeBook', { screen: 'My Recipes' })
									}
								}
							}
						} catch (e) {
							if (e.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
							// console.log(e)
							this.setState({
								renderOfflineMessage: true,
								awaitingServer: false
							})
						}
					} else { // it's a new recipe
						try {
							// console.log('new recipe')
							const recipe = await postRecipe(
								this.props.loggedInChef.id,
								this.props.loggedInChef.auth_token,
								newRecipeDetails.name,
								newRecipeDetails.ingredients,
								newRecipeDetails.instructions,
								// newRecipeDetails.instructionImages,
								newRecipeDetails.times.prepTime,
								newRecipeDetails.times.cookTime,
								newRecipeDetails.times.totalTime,
								newRecipeDetails.difficulty,
								// newRecipeDetails.primaryImages,
								newRecipeDetails.filter_settings,
								newRecipeDetails.cuisine,
								newRecipeDetails.serves,
								newRecipeDetails.acknowledgement,
								newRecipeDetails.acknowledgementLink,
								newRecipeDetails.description,
								newRecipeDetails.showBlogPreview,
							)
							if (recipe) {
								// console.log('recipe succeeded')
								if (recipe.error) {
									this.setState({ errors: recipe.message })
								} else {
									this.setState({
										newRecipeDetails: {
											...newRecipeDetails,
											recipeId: recipe.recipe.id
										}
									}, async () => {
										// save the recipe locally with its new id to make sure resubmissions don't submit duplicates (as often as possible)
										this.saveNewRecipeDetailsLocally(true)
										this.props.navigation.setParams({ recipeDetails: { recipe: { id: recipe.recipe.id } } })
										let success = await this.postImages(newRecipeDetails, recipe)
										if (success) {
											this.clearNewRecipeDetails()
											this.props.navigation.popToTop() //clears Recipe Details and newRecipe screens from the view stack so that switching back to BrowseRecipes will go to the List and not another screen
											this.props.navigation.navigate('MyRecipeBook', { screen: 'My Recipes' })
										}
									})
								}
							}
						} catch (e) {
							if (e.name === 'Logout') { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
							// console.log(e)
							this.setState({
								renderOfflineMessage: true,
								awaitingServer: false
							})
						}
					}
					// this.setState({ awaitingServer: false })
				})
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		postImages = async (newRecipeDetails, recipe) => {
			try {
				await Promise.all(newRecipeDetails.primaryImages.map((image, index) => {
					return postRecipeImage(
						this.props.loggedInChef.id,
						this.props.loggedInChef.auth_token,
						recipe.recipe.id,
						image.id || 0,
						index,
						image.uri
					)
				}))
				await Promise.all(newRecipeDetails.instructionImages.map((image, index) => {
					if (image) {
						return postInstructionImage(
							this.props.loggedInChef.id,
							this.props.loggedInChef.auth_token,
							recipe.instructions.sort((a, b) => (a.step > b.step) ? 1 : -1)[index].id,
							image.id || 0,
							image
						)
					}
				}))
				return true
			} catch {
				this.setState({
					errors: "The recipe saved successfully but not all the images could be saved. Please finish submission now or later to try again. Your recipe will be visible without those images that failed already.",
					awaitingServer: false
				})
			}
			return false
		}

		handleCategoriesButton = () => {
			this.setState(() => ({ filterDisplayed: !this.state.filterDisplayed }),
				this.saveNewRecipeDetailsLocally
			)
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
			}, this.saveNewRecipeDetailsLocally)
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
			this.setState((state) => {
				let newInstructionHeights = []
				let newInstructionImages = []
				newInstructions.forEach(instruction => {
					let index = this.state.newRecipeDetails.instructions.indexOf(instruction)
					newInstructionHeights.push(state.instructionHeights[index])
					newInstructionImages.push(state.newRecipeDetails.instructionImages[index])
				})
				return ({
					newRecipeDetails: {
						...state.newRecipeDetails,
						instructions: newInstructions,
						instructionImages: newInstructionImages
					},
					instructionHeights: newInstructionHeights,
				})
			}, this.saveNewRecipeDetailsLocally)
		}

		addNewInstruction = () => {
			// if (this.state.newRecipeDetails.instructions[this.state.newRecipeDetails.instructions.length - 1] !== ''
			// 	|| this.state.newRecipeDetails.instructions[this.state.newRecipeDetails.instructions.length - 2] !== ''
			// ) {
			this.setState((state) => {
				let newInstructions = [...state.newRecipeDetails.instructions]
				newInstructions.push('')
				let newInstructionImages = [...state.newRecipeDetails.instructionImages, '']
				let newInstructionHeights = [...state.instructionHeights, responsiveHeight(6.5)]
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
			}, this.saveNewRecipeDetailsLocally)
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
				let newAverageInstructionHeight = newInstructionHeights.length > 0 ? newInstructionHeights.reduce((acc, h) => acc + h, 0) / newInstructionHeights.length : 0
				return ({
					newRecipeDetails: {
						...state.newRecipeDetails,
						instructions: newInstructions,
						instructionImages: newInstructionImages
					},
					instructionHeights: newInstructionHeights,
					averageInstructionHeight: newAverageInstructionHeight
				})
			}, this.saveNewRecipeDetailsLocally)
		}

		chooseInstructionPicture = (index) => {
			this.setState({
				choosingInstructionPicture: true,
				instructionImageIndex: index
			})
		}

		instructionSourceChosen = async () => {
			this.setState({ choosingInstructionPicture: false }, this.saveNewRecipeDetailsLocally)
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

		saveInstructionImage = (image, index) => {
			this.setState({ awaitingServer: true }, async () => {
				if (image.cancelled === false) {
					this.setState((state) => {
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
					}, this.saveNewRecipeDetailsLocally)
				}
				else {
					this.setState({ awaitingServer: false })
				}
			})
		}

		cancelChooseInstructionImage = (image, index) => {
			this.setState((state) => {
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
			}, this.saveNewRecipeDetailsLocally)
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
			}, this.saveNewRecipeDetailsLocally)
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
			}, this.saveNewRecipeDetailsLocally)
		}

		renderErrors = () => {
			if (typeof this.state.errors == 'string') {
				return (
					<View style={centralStyles.formErrorView}>
						<Text
							testID={'invalidErrorMessage'}
							maxFontSizeMultiplier={2}
							style={centralStyles.formErrorText}
						>
							{this.state.errors}
						</Text>
					</View>
				)
			} else {
				return (
					this.state.errors.map(errorMessage => (
						<View style={centralStyles.formErrorView} key={errorMessage}>
							<Text
								testID={'invalidErrorMessage'}
								maxFontSizeMultiplier={2}
								style={centralStyles.formErrorText}
							>
								{errorMessage}
							</Text>
						</View>
					))
				)
			}
		}

		renderHelp = () => {
			return (
				<TextPopUp
					close={() => this.setState({ helpShowing: false })}
					title={`Help - ${this.state.helpText.title}`}
					text={this.state.helpText.text}
				/>
			)
		}

		render() {
			// console.log(this.state.newRecipeDetails.recipeId)
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
					{this.state.helpShowing && this.renderHelp()}
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
									<View style={[centralStyles.formInputContainer, { justifyContent: 'center', marginTop: responsiveHeight(1) }]}>
										<View style={[styles.timeAndDifficultyTitleItem, styles.sectionTitle]}>
											<Text maxFontSizeMultiplier={1.7} style={[styles.timeAndDifficultyTitle, { fontWeight: 'bold' }]}>Recipe Name</Text>
										</View>
										<TouchableOpacity
											style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
											activeOpacity={0.7}
											onPress={() => this.setState({ helpShowing: true, helpText: helpTexts.recipeName })}
										>
											<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(3)} name='help'></Icon>
										</TouchableOpacity>
									</View>
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
								{/* description */}
								<View style={[centralStyles.formInputContainer, { justifyContent: 'center' }]}>
									<View style={[styles.timeAndDifficultyTitleItem, styles.sectionTitle]}>
										<Text maxFontSizeMultiplier={1.7} style={[styles.timeAndDifficultyTitle, { fontWeight: 'bold' }]}>About</Text>
									</View>
									<TouchableOpacity
										style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
										activeOpacity={0.7}
										onPress={() => this.setState({ helpShowing: true, helpText: helpTexts.about })}
									>
										<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(3)} name='help'></Icon>
									</TouchableOpacity>
								</View>
								<View style={centralStyles.formSection}>
									<View style={centralStyles.formInputContainer}>
										<View style={centralStyles.formInputWhiteBackground}>
											<TextInput
												multiline={true}
												numberOfLines={3}
												maxFontSizeMultiplier={2}
												style={[centralStyles.formInput, { padding: responsiveHeight(0.5) }]}
												value={this.state.newRecipeDetails.description}
												placeholder="Tell us about this recipe (optional; if you leave this section blank, it won't be displayed)"
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
								<View style={centralStyles.formSection}>
									<View style={[centralStyles.formInputContainer, { justifyContent: 'center' }]}>
										<TouchableOpacity style={[centralStyles.yellowRectangleButton, styles.addButton]} activeOpacity={0.7} onPress={this.choosePrimaryPicture}>
											<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='camera'></Icon>
											<Text maxFontSizeMultiplier={2} style={[centralStyles.greenButtonText, { marginLeft: responsiveWidth(3), fontSize: responsiveFontSize(2.3) }]}>Cover Pictures</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
											activeOpacity={0.7}
											onPress={() => this.setState({ helpShowing: true, helpText: helpTexts.coverPictures })}
										>
											<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(3)} name='help'></Icon>
										</TouchableOpacity>
									</View>
								</View>
								{/* separator */}
								<View style={centralStyles.formSectionSeparatorContainer}>
									<View style={centralStyles.formSectionSeparator}>
									</View>
								</View>
								{/* times */}
								<View style={centralStyles.formSection}>
									<View style={[centralStyles.formInputContainer, { justifyContent: 'center' }]}>
										<View style={[styles.timeAndDifficultyTitleItem, styles.sectionTitle]}>
											<Text maxFontSizeMultiplier={1.7} style={[styles.timeAndDifficultyTitle, { fontWeight: 'bold' }]}>Timings</Text>
										</View>
										<TouchableOpacity
											style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
											activeOpacity={0.7}
											onPress={() => this.setState({ helpShowing: true, helpText: helpTexts.timings })}
										>
											<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(3)} name='help'></Icon>
										</TouchableOpacity>
									</View>
									<View style={centralStyles.formInputContainer}>
										<View style={styles.timeAndDifficultyTitleItem}>
											<Text maxFontSizeMultiplier={1.7} style={styles.timeAndDifficultyTitle}>Prep Time (optional):</Text>
										</View>
										<View picker style={styles.timeAndDifficulty} >
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
									<View style={centralStyles.formInputContainer}>
										<View style={styles.timeAndDifficultyTitleItem}>
											<Text maxFontSizeMultiplier={1.7} style={styles.timeAndDifficultyTitle}>Cook Time (optional):</Text>
										</View>
										<View picker style={styles.timeAndDifficulty} >
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
									<View style={centralStyles.formInputContainer}>
										<View style={styles.timeAndDifficultyTitleItem}>
											<Text maxFontSizeMultiplier={1.7} style={styles.timeAndDifficultyTitle}>Total Time:</Text>
										</View>
										<View picker style={styles.timeAndDifficulty} >
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
									<View style={[centralStyles.formInputContainer, { justifyContent: 'center' }]}>
										<View style={[styles.timeAndDifficultyTitleItem, styles.sectionTitle]}>
											<Text maxFontSizeMultiplier={1.7} style={[styles.timeAndDifficultyTitle, { fontWeight: 'bold' }]}>Difficulty</Text>
										</View>
										<TouchableOpacity
											style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
											activeOpacity={0.7}
											onPress={() => this.setState({ helpShowing: true, helpText: helpTexts.difficulty })}
										>
											<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(3)} name='help'></Icon>
										</TouchableOpacity>
									</View>
									<View style={centralStyles.formInputContainer}>
										<View style={styles.timeAndDifficultyTitleItem}>
											<Text maxFontSizeMultiplier={1.7} style={styles.timeAndDifficultyTitle}>Difficulty (optional):</Text>
										</View>
										<View style={styles.timeAndDifficulty}>
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
								{/* filter categories*/}
								<View style={centralStyles.formSection}>
									<View style={[centralStyles.formInputContainer, { justifyContent: 'center' }]}>
										<TouchableOpacity style={[centralStyles.yellowRectangleButton, styles.addButton]} activeOpacity={0.7} onPress={this.handleCategoriesButton}>
											<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='filter'></Icon>
											<Text maxFontSizeMultiplier={2} style={[centralStyles.greenButtonText, { marginLeft: responsiveWidth(3), fontSize: responsiveFontSize(2.3) }]}>Filter categories</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
											activeOpacity={0.7}
											onPress={() => this.setState({ helpShowing: true, helpText: helpTexts.filterCategories })}
										>
											<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(3)} name='help'></Icon>
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
									<View style={[centralStyles.formInputContainer, { justifyContent: 'center' }]}>
										<View style={[styles.timeAndDifficultyTitleItem, styles.sectionTitle]}>
											<Text maxFontSizeMultiplier={1.7} style={[styles.timeAndDifficultyTitle, { fontWeight: 'bold' }]}>Acknowledgement</Text>
										</View>
										<TouchableOpacity
											style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
											activeOpacity={0.7}
											onPress={() => this.setState({ helpShowing: true, helpText: helpTexts.acknowledgement })}
										>
											<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(3)} name='help'></Icon>
										</TouchableOpacity>
									</View>
									<View style={centralStyles.formInputContainer}>
										<View style={centralStyles.formInputWhiteBackground}>
											<TextInput
												maxFontSizeMultiplier={2}
												style={centralStyles.formInput}
												value={this.state.newRecipeDetails.acknowledgement}
												placeholder={`Acknowledge your recipe's source${(this.state.newRecipeDetails.showBlogPreview ? "" : " (optional)")}`}
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
												placeholder={`Link to the original book or blog${(this.state.newRecipeDetails.showBlogPreview ? "" : " (optional)")}`}
												onChangeText={(t) => this.handleInput(t, "acknowledgementLink")}
												autoCapitalize={"none"}
											/>
										</View>
									</View>
								</View>
								{/* separator */}
								<View style={centralStyles.formSectionSeparatorContainer}>
									<View style={centralStyles.formSectionSeparator}>
									</View>
								</View>
								{/* display toggle */}
								<View style={centralStyles.formSection}>
									<View style={[centralStyles.formInputContainer, { justifyContent: 'center' }]}>
										<View style={[styles.timeAndDifficultyTitleItem, styles.sectionTitle]}>
											<Text maxFontSizeMultiplier={1.7} style={[styles.timeAndDifficultyTitle, { fontWeight: 'bold' }]}>Display as...</Text>
										</View>
										<TouchableOpacity
											style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
											activeOpacity={0.7}
											onPress={() => this.setState({ helpShowing: true, helpText: helpTexts.acknowledgementLink })}
										>
											<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(3)} name='help'></Icon>
										</TouchableOpacity>
									</View>
									<View style={centralStyles.formInputContainer}>
										<View style={[styles.timeAndDifficultyTitleItem, { width: responsiveWidth(39) }]}>
											<Text maxFontSizeMultiplier={1.7} style={[styles.timeAndDifficultyTitle, { textAlign: 'center', fontWeight: 'bold', paddingVertical: responsiveHeight(0.5) }]}>Full recipe</Text>
										</View>
										<View style={styles.switchContainer}>
											<SwitchSized
												value={this.state.newRecipeDetails.showBlogPreview}
												onValueChange={(value) => this.handleInput(value, "showBlogPreview")}
												trackColor={({ true: '#5c8a5199', false: '#5c8a5199' })}
												thumbColor={"#4b7142"}
											/>
										</View>
										<View style={[styles.timeAndDifficultyTitleItem, { width: responsiveWidth(39) }]}>
											<Text maxFontSizeMultiplier={1.7} style={[styles.timeAndDifficultyTitle, { textAlign: 'center', fontWeight: 'bold', paddingVertical: responsiveHeight(0.5) }]}>Blog view</Text>
										</View>
									</View>
								</View>

								{!this.state.newRecipeDetails.showBlogPreview && (
									<>
										{/* separator */}
										<View style={centralStyles.formSectionSeparatorContainer}>
											<View style={centralStyles.formSectionSeparator}>
											</View>
										</View>
										{/* ingredients */}
										<View style={[centralStyles.formInputContainer, { justifyContent: 'center' }]}>
											<View style={[styles.timeAndDifficultyTitleItem, styles.sectionTitle]}>
												<Text maxFontSizeMultiplier={1.7} style={[styles.timeAndDifficultyTitle, { fontWeight: 'bold' }]}>Ingredients</Text>
											</View>
											<TouchableOpacity
												style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
												activeOpacity={0.7}
												onPress={() => this.setState({ helpShowing: true, helpText: helpTexts.ingredients })}
											>
												<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(3)} name='help'></Icon>
											</TouchableOpacity>
										</View>
										<View
											style={[
												centralStyles.formSection,
												this.state.autoCompleteFocused !== null && { zIndex: 1 },
												{ paddingBottom: responsiveHeight(10) }
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
												<TouchableOpacity style={[centralStyles.yellowRectangleButton, styles.addButton]} activeOpacity={0.7} onPress={this.addNewIngredient}>
													<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(5)} name='plus'></Icon>
													<Text maxFontSizeMultiplier={2} style={[centralStyles.greenButtonText, { marginLeft: responsiveWidth(3), fontSize: responsiveFontSize(2.3) }]}>Add ingredient</Text>
												</TouchableOpacity>
											</View>
										</View>
										{/* separator */}
										<View style={[centralStyles.formSectionSeparatorContainer
											, { marginTop: -responsiveHeight(9.2) }
										]}>
											<View style={centralStyles.formSectionSeparator}>
											</View>
										</View>
										{/* instructions */}
										<View style={[centralStyles.formInputContainer, { justifyContent: 'center' }]}>
											<View style={[styles.timeAndDifficultyTitleItem, styles.sectionTitle]}>
												<Text maxFontSizeMultiplier={1.7} style={[styles.timeAndDifficultyTitle, { fontWeight: 'bold' }]}>Instructions</Text>
											</View>
											<TouchableOpacity
												style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
												activeOpacity={0.7}
												onPress={() => this.setState({ helpShowing: true, helpText: helpTexts.instructions })}
											>
												<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(3)} name='help'></Icon>
											</TouchableOpacity>
										</View>
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

										</View>
										<View style={styles.plusButtonContainer}>
											<TouchableOpacity style={[centralStyles.yellowRectangleButton, styles.addButton]} activeOpacity={0.7} onPress={this.addNewInstruction}>
												<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(5)} name='plus'></Icon>
												<Text maxFontSizeMultiplier={2} style={[centralStyles.greenButtonText, { marginLeft: responsiveWidth(3), fontSize: responsiveFontSize(2.3) }]}>Add instruction</Text>
											</TouchableOpacity>
										</View>
									</>
								)}
								{/* separator */}
								<View style={centralStyles.formSectionSeparatorContainer}>
									<View style={centralStyles.formSectionSeparator}>
									</View>
								</View>
								{/* errors */}
								{this.state.errors.length > 0 && this.renderErrors()}
								{/* submit */}
								<View style={[centralStyles.formSection, { width: responsiveWidth(80) }]}>
									<View style={centralStyles.formInputContainer}>
										<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={this.askToReset} disabled={this.state.awaitingServer}>
											<Icon style={centralStyles.greenButtonIcon} size={responsiveHeight(4)} name='alert-circle-outline'></Icon>
											<Text maxFontSizeMultiplier={2} style={[centralStyles.greenButtonText, { fontSize: responsiveFontSize(2.2) }]}>{(this.props.route.params?.recipe_details !== undefined ? 'Reset' : 'Clear')}</Text>
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
