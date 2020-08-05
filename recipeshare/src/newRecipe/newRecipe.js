import React from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View, Keyboard, AsyncStorage, AppState } from 'react-native'
import { connect } from 'react-redux'
import { styles } from './newRecipeStyleSheet'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { times } from '../dataComponents/times'
import { difficulties } from '../dataComponents/difficulties'
import { postRecipe } from '../fetches/postRecipe'
import { patchRecipe } from '../fetches/patchRecipe'
import { fetchIngredients } from '../fetches/fetchIngredients'
import IngredientAutoComplete from './ingredientAutoComplete'
import PicSourceChooser from '../functionalComponents/picSourceChooser'
import MultiPicSourceChooser from '../functionalComponents/multiPicSourceChooser'
import FilterMenu from '../functionalComponents/filterMenu'
import DualOSPicker from '../functionalComponents/DualOSPicker'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions' //eslint-disable-line no-unused-vars
import InstructionRow from './instructionRow'
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
import { DragSortableView } from 'react-native-drag-sort/lib'
import { clearedFilters } from '../dataComponents/clearedFilters'
import OfflineMessage from '../offlineMessage/offlineMessage'
import NetInfo from '@react-native-community/netinfo';
import { AlertPopUp } from '../alertPopUp/alertPopUp'

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
				name: "",
				instructions: [
					'',
					// 'Pre heat oven to 450F...',
					// 'Chop everything up so that it is small enough to fit into a small place',
					// 'mix everything together with a liberal helping of mustard',
					// 'drink all the beer you can to help you get through this pigswill',
					// ''
				],
				instructionImages: ['', '', '', ''],
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
				time: "00:15",
				primaryImages: [{ base64: 'data:image/jpeg;base64,' }],
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
				description: ""
			}
		}

		componentDidMount = async () => {
			await this.setState({ awaitingServer: true })

			this.fetchIngredientsForAutoComplete()

			this._unsubscribeFocus = this.props.navigation.addListener('focus', () => {
				this.respondToFocus()
			})
			this._unsubscribeBlur = this.props.navigation.addListener('blur', () => {
				this.respondToBlur()
			})
			AppState.addEventListener('change', this.handleAppStateChange)

			if (this.props.route.params?.recipe_details !== undefined) {
				this.setRecipeParamsForEditing(this.props.route.params.recipe_details)
				await this.setState({ awaitingServer: false })
			} else {
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
			await this.addNewIngredient()
			await this.addNewInstruction()
		}

		componentWillUnmount = () => {
			this._unsubscribeFocus()
			this._unsubscribeFocus()
			AppState.removeEventListener('change', this.handleAppStateChange)
		}

		handleAppStateChange = (nextAppState) => {
			if (nextAppState === 'active') {
				// console.log('app coming into foreground')
			} else if (this.state.isFocused && (nextAppState === 'inactive' || nextAppState === 'background')) {
				this.saveNewRecipeDetailsLocally()
			}
		}

		respondToBlur = () => {
			this.setState({ isFocused: false })
			this.saveNewRecipeDetailsLocally()
		}

		respondToFocus = () => {
			this.setState({ isFocused: true })
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

		setRecipeParamsForEditing = (recipeDetails) => {
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
				instructionHeights: recipeDetails.instructions.map(() => responsiveHeight(7.2)),
				newRecipeDetails: {
					name: recipe.name,
					instructions: recipeDetails.instructions.length > 0 ? recipeDetails.instructions.map(i => i.instruction) : [""],
					instructionImages: newInstructionImages.length > 0 ? newInstructionImages : [""],
					ingredients: newIngredients.length > 0 ? newIngredients : [{ name: "", quantity: "", unit: "Oz" }],
					difficulty: recipe.difficulty.toString(),
					time: recipe.time,
					primaryImages: recipeDetails.recipe_images?.length > 0 ? recipeDetails.recipe_images : [{ base64: 'data:image/jpeg;base64,' }],
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
					description: recipe.description
				}
			})
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

		clearNewRecipeDetails = () => {
			this.setState({
				alertPopUpShowing: false,
				newRecipeDetails: {
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
					time: "00:15",
					primaryImages: [{ base64: 'data:image/jpeg;base64,' }],
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
					description: ""
				},
				instructionHeights: [responsiveHeight(7.2)],
				averageInstructionHeight: responsiveHeight(7.2),
			})
		}

		choosePrimaryPicture = () => {
			this.setState({ choosingPrimaryPicture: true })
		}

		primarySourceChosen = () => {
			this.setState({ choosingPrimaryPicture: false })
		}

		renderPrimaryPictureChooser = () => {
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
			this.setState((state) => {
				return ({
					newRecipeDetails: { ...state.newRecipeDetails, primaryImages: newImages },
					// awaitingServer: false,
				})
			})
			// } else {
			// await this.setState({ awaitingServer: false })
			// }
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
			})
		}

		handleIngredientSort = (newIngredients) => {
			this.setState((state) => {
				return ({
					newRecipeDetails: {
						...state.newRecipeDetails,
						ingredients: newIngredients,
					},
				})
			})
		}

		addNewIngredient = () => {
			let ingredients = this.state.newRecipeDetails.ingredients
			if (ingredients[ingredients.length - 1].name != "" || ingredients[ingredients.length - 1].quantity != "" || ingredients[ingredients.length - 1].unit != "Oz") {
				let newIngredients = [...ingredients, { name: "", quantity: "", unit: "Oz" }]
				this.setState((state) => {
					return ({
						newRecipeDetails: { ...state.newRecipeDetails, ingredients: newIngredients }
					})
				})
			}
		}

		removeIngredient = (index) => {
			this.setState((state) => {
				let newIngredients = [...state.newRecipeDetails.ingredients]
				newIngredients.splice(index, 1)
				return ({
					newRecipeDetails: { ...state.newRecipeDetails, ingredients: newIngredients },
				})
			})
		}

		handleInput = (text, parameter) => {
			this.setState((state) => {
				return ({
					newRecipeDetails: { ...state.newRecipeDetails, [parameter]: text },
				})
			})
		}

		submitRecipe = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
				let newRecipeDetails = this.state.newRecipeDetails
				if (this.props.route.params?.recipe_details !== undefined) {
					const recipe = await patchRecipe(
						this.props.loggedInChef.id,
						this.props.loggedInChef.auth_token,
						newRecipeDetails.name,
						newRecipeDetails.ingredients,
						newRecipeDetails.instructions,
						newRecipeDetails.instructionImages,
						newRecipeDetails.time,
						newRecipeDetails.difficulty,
						newRecipeDetails.primaryImages,
						newRecipeDetails.filter_settings,
						newRecipeDetails.cuisine,
						newRecipeDetails.serves,
						this.props.route.params?.recipe_details.recipe.id,
						newRecipeDetails.acknowledgement,
						newRecipeDetails.description
					)
					if (recipe) {
						this.clearNewRecipeDetails()
						AsyncStorage.removeItem('localNewRecipeDetails')
						this.props.navigation.popToTop() //clears Recipe Details and newRecipe screens from the view stack so that switching back to BrowseRecipes will go to the List and not another screen
						this.props.navigation.navigate('MyRecipeBook', { screen: 'My Recipes' })
					} else {
						this.setState({ renderOfflineMessage: true })
					}
				} else {
					const recipe = await postRecipe(
						this.props.loggedInChef.id,
						this.props.loggedInChef.auth_token,
						newRecipeDetails.name,
						newRecipeDetails.ingredients,
						newRecipeDetails.instructions,
						newRecipeDetails.instructionImages,
						newRecipeDetails.time,
						newRecipeDetails.difficulty,
						newRecipeDetails.primaryImages,
						newRecipeDetails.filter_settings,
						newRecipeDetails.cuisine,
						newRecipeDetails.serves,
						newRecipeDetails.acknowledgement,
						newRecipeDetails.description
					)
					if (recipe) {
						this.clearNewRecipeDetails()
						AsyncStorage.removeItem('localNewRecipeDetails')
						this.props.navigation.popToTop() //clears Recipe Details and newRecipe screens from the view stack so that switching back to BrowseRecipes will go to the List and not another screen
						this.props.navigation.navigate('MyRecipeBook', { screen: 'My Recipes' })
					} else {
						this.setState({ renderOfflineMessage: true })
					}
				}
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		handleCategoriesButton = () => {
			this.setState({ filterDisplayed: !this.state.filterDisplayed })
		}

		handleInstructionChange = async (text, index) => {
			this.setState((state) => {
				let newInstructions = [...state.newRecipeDetails.instructions]
				newInstructions[index] = text
				let newInstructionHeights = [...this.state.instructionHeights]
				return ({
					newRecipeDetails: { ...state.newRecipeDetails, instructions: newInstructions },
					instructionHeights: newInstructionHeights
				})
			})
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
		}

		addNewInstruction = () => {
			if (this.state.newRecipeDetails.instructions[this.state.newRecipeDetails.instructions.length - 1] !== ''
				|| this.state.newRecipeDetails.instructions[this.state.newRecipeDetails.instructions.length - 2] !== ''
			) {
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
			}
		}

		removeInstruction = (index) => {
			let newInstructions = [...this.state.newRecipeDetails.instructions]
			newInstructions.splice(index, 1)
			let newInstructionHeights = [...this.state.instructionHeights]
			newInstructionHeights.splice(index, 1)
			let newAverageInstructionHeight = newInstructionHeights.reduce((acc, h) => acc + h, 0) / newInstructionHeights.length
			this.setState((state) => {
				return ({
					newRecipeDetails: { ...state.newRecipeDetails, instructions: newInstructions },
					instructionHeights: newInstructionHeights,
					averageInstructionHeight: newAverageInstructionHeight
				})
			})
		}

		chooseInstructionPicture = (index) => {
			this.setState({
				choosingInstructionPicture: true,
				instructionImageIndex: index
			})
		}

		instructionSourceChosen = () => {
			this.setState({ choosingInstructionPicture: false })
		}

		renderInstructionPictureChooser = () => {
			let imageSource = typeof this.state.newRecipeDetails.instructionImages[this.state.instructionImageIndex] == 'object' ? this.state.newRecipeDetails.instructionImages[this.state.instructionImageIndex].image_url : `data:image/jpeg;base64,${this.state.newRecipeDetails.instructionImages[this.state.instructionImageIndex]}`
			return (
				<PicSourceChooser
					saveImage={this.saveInstructionImage}
					index={this.state.instructionImageIndex}
					sourceChosen={this.instructionSourceChosen}
					key={"instruction-pic-chooser"}
					imageSource={imageSource}
				/>
			)
		}

		saveInstructionImage = async (image, index) => {
			await this.setState({ awaitingServer: true })
			if (image.cancelled === false) {
				this.setState((state) => {
					let newInstructionImages = [...state.newRecipeDetails.instructionImages]
					newInstructionImages[index] = image.base64
					return ({
						choosingPicture: false,
						newRecipeDetails: {
							...state.newRecipeDetails,
							instructionImages: newInstructionImages
						},
						awaitingServer: false,
					})
				})
			}
			else {
				await this.setState({
					awaitingServer: false,
					choosingInstructionPicture: false
				})
			}
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
			// console.log(typeof "Mark")
			return (
				<SpinachAppContainer awaitingServer={this.state.awaitingServer} scrollingEnabled={false}>
					{this.state.renderOfflineMessage && (
						<OfflineMessage
							message={`Sorry, can't save your recipe right now.${"\n"}You appear to be offline.${"\n"}Don't worry though, details will be saved until you can reconnect and try again.`}
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
					)}
					{this.state.choosingPrimaryPicture && this.renderPrimaryPictureChooser()}
					{this.state.choosingInstructionPicture && this.renderInstructionPictureChooser()}
					{this.state.alertPopUpShowing && this.renderAlertPopUp()}
					<ScrollView style={centralStyles.fullPageScrollView}
						nestedScrollEnabled={true}
						scrollEnabled={this.state.scrollingEnabled}
						keyboardShouldPersistTaps={'always'}
					>
						<View style={[centralStyles.formContainer, { width: responsiveWidth(100), marginLeft: 0, marginRight: 0 }]}>
							{/* recipe name */}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<TextInput
										multiline={true}
										maxFontSizeMultiplier={2.5}
										style={centralStyles.formInput}
										value={this.state.newRecipeDetails.name}
										placeholder="Recipe name"
										onChangeText={(t) => this.handleInput(t, "name")} />
								</View>
							</View>
							{/* separator */}
							<View style={centralStyles.formSectionSeparatorContainer}>
								<View style={centralStyles.formSectionSeparator}>
								</View>
							</View>
							{/* time and difficulty titles */}
							<View style={[centralStyles.formSection, { width: responsiveWidth(80) }]}>
								<View style={centralStyles.formInputContainer}>
									<View style={styles.timeAndDifficultyTitleItem}>
										<Text maxFontSizeMultiplier={1.7} style={styles.timeAndDifficultyTitle}>Time:</Text>
									</View>
									<View style={styles.timeAndDifficultyTitleItem}>
										<Text maxFontSizeMultiplier={1.7} style={styles.timeAndDifficultyTitle}>Difficulty:</Text>
									</View>
								</View>
							</View>
							{/* time and difficulty dropdowns */}
							<View style={[centralStyles.formSection, { width: responsiveWidth(80) }]}>
								<View style={centralStyles.formInputContainer}>
									<View picker style={[styles.timeAndDifficulty, { paddingLeft: responsiveWidth(8) }]} >
										<DualOSPicker
											onChoiceChange={(choice) => this.handleInput(choice, "time")}
											options={times}
											selectedChoice={this.state.newRecipeDetails.time} />
									</View>
									<View style={[styles.timeAndDifficulty, { paddingLeft: responsiveWidth(12) }]}>
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
							{/* recipe name */}
							<View style={centralStyles.formSection}>
								<View style={centralStyles.formInputContainer}>
									<TextInput
										multiline={true}
										numberOfLines={3}
										maxFontSizeMultiplier={2.5}
										style={[centralStyles.formInput, { padding: responsiveHeight(0.5) }]}
										value={this.state.newRecipeDetails.description}
										placeholder="Tell us about this recipe"
										onChangeText={(t) => this.handleInput(t, "description")} />
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
										<Icon style={centralStyles.greenButtonIcon} size={25} name='camera'></Icon>
										<Text maxFontSizeMultiplier={2} style={[centralStyles.greenButtonText, { marginLeft: responsiveWidth(3), fontSize: responsiveFontSize(2.3) }]}>Pictures</Text>
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
									{ paddingBottom: responsiveHeight(4) }
								]}
							>
								<DragSortableView
									dataSource={this.state.newRecipeDetails.ingredients}
									parentWidth={responsiveWidth(100)}
									parentMarginBottom={125}
									childrenWidth={responsiveWidth(100)}
									childrenHeight={responsiveHeight(12.5)}
									reverseChildZIndexing={true}
									marginChildrenTop={responsiveHeight(0.5)}
									onDataChange={(newIngredients) => this.handleIngredientSort(newIngredients)}
									onClickItem={() => {
										if (this.state.autoCompleteFocused !== null) {
											Keyboard.dismiss()
											this.setState({ autoCompleteFocused: null })
										}
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
									onDragStart={this.deactivateScrollView}
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
											/>
										)
									}}
								/>
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
										<Icon style={centralStyles.greenButtonIcon} size={25} name='filter'></Icon>
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
									<TextInput maxFontSizeMultiplier={2} style={centralStyles.formInput} value={this.state.newRecipeDetails.acknowledgement} placeholder="Acknowledge your recipe's source if it's not yourself" onChangeText={(t) => this.handleInput(t, "acknowledgement")} />
								</View>
							</View>
							{/* time and difficulty titles */}
							{/* <View style={[centralStyles.formSection, { width: responsiveWidth(80) }]}>
								<View style={centralStyles.formInputContainer}>
									<View style={styles.timeAndDifficultyTitleItem}>
										<Text maxFontSizeMultiplier={1.7} style={styles.timeAndDifficultyTitle}>Time:</Text>
									</View>
									<View style={styles.timeAndDifficultyTitleItem}>
										<Text maxFontSizeMultiplier={1.7} style={styles.timeAndDifficultyTitle}>Difficulty:</Text>
									</View>
								</View>
							</View> */}
							{/* time and difficulty dropdowns */}
							{/* <View style={[centralStyles.formSection, { width: responsiveWidth(80) }]}>
								<View style={centralStyles.formInputContainer}>
									<View picker style={[styles.timeAndDifficulty, { paddingLeft: responsiveWidth(8) }]} >
										<DualOSPicker
											onChoiceChange={(choice) => this.handleInput(choice, "time")}
											options={times}
											selectedChoice={this.state.newRecipeDetails.time} />
									</View>
									<View style={[styles.timeAndDifficulty, { paddingLeft: responsiveWidth(12) }]}>
										<DualOSPicker
											onChoiceChange={(choice) => this.handleInput(choice, "difficulty")}
											options={difficulties}
											selectedChoice={this.state.newRecipeDetails.difficulty} />
									</View>
								</View>
							</View> */}
							{/* add picture and select categories*/}
							{/* <View style={[centralStyles.formSection, { width: responsiveWidth(80) }]}>
								<View style={centralStyles.formInputContainer}>
									<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={this.choosePrimaryPicture}>
										<Icon style={centralStyles.greenButtonIcon} size={25} name='camera'></Icon>
										<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>Main{"\n"}pictures</Text>
									</TouchableOpacity>
									<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={this.handleCategoriesButton}>
										<Icon style={centralStyles.greenButtonIcon} size={25} name='filter'></Icon>
										<Text maxFontSizeMultiplier={2} style={centralStyles.greenButtonText}>Select{"\n"}categories</Text>
									</TouchableOpacity>
								</View>
							</View> */}
							{/* separator */}
							<View style={centralStyles.formSectionSeparatorContainer}>
								<View style={centralStyles.formSectionSeparator}>
								</View>
							</View>
							{/* submit */}
							<View style={[centralStyles.formSection, { width: responsiveWidth(80) }]}>
								<View style={centralStyles.formInputContainer}>
									<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={this.askToReset}>
										<Icon style={centralStyles.greenButtonIcon} size={25} name='alert-circle-outline'></Icon>
										<Text maxFontSizeMultiplier={2} style={[centralStyles.greenButtonText, { fontSize: responsiveFontSize(2.2) }]}>Clear</Text>
									</TouchableOpacity>
									<TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={e => this.submitRecipe(e)}>
										<Icon style={centralStyles.greenButtonIcon} size={25} name='login'></Icon>
										<Text maxFontSizeMultiplier={2} style={[centralStyles.greenButtonText, { fontSize: responsiveFontSize(2.2) }]}>Submit</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</ScrollView>
				</SpinachAppContainer>
			)
		}
	}
)
