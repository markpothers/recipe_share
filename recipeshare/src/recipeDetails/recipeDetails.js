import React from 'react';
import { Image, ScrollView, View, Text, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';
import { connect } from 'react-redux'
import { styles } from './recipeDetailsStyleSheet'
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars
import { postRecipeLike } from '../fetches/postRecipeLike'
import { postMakePic } from '../fetches/postMakePic'
import { postReShare } from '../fetches/postReShare'
import { postRecipeMake } from '../fetches/postRecipeMake'
import { postComment } from '../fetches/postComment'
import { destroyRecipeLike } from '../fetches/destroyRecipeLike'
import { destroyMakePic } from '../fetches/destroyMakePic'
import { destroyComment } from '../fetches/destroyComment'
import { destroyRecipe } from '../fetches/destroyRecipe'
import { destroyReShare } from '../fetches/destroyReShare'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RecipeComment from './recipeComment'
import RecipeNewComment from './recipeNewComment';
import PicSourceChooser from '../functionalComponents/picSourceChooser'
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import { InstructionImagePopup } from './instructionImagePopup'
import OfflineMessage from '../offlineMessage/offlineMessage'
import NetInfo from '@react-native-community/netinfo';
import { AlertPopUp } from '../alertPopUp/alertPopUp'
import DynamicMenu from '../dynamicMenu/DynamicMenu.js'
import saveChefDetailsLocally from '../functionalComponents/saveChefDetailsLocally'
import { getChefDetails } from '../fetches/getChefDetails'

const mapStateToProps = (state) => ({
	recipe_details: state.recipe_details,
	loggedInChef: state.loggedInChef,
	filter_settings: state.filter_settings,
})

const mapDispatchToProps = {
	addRecipeLike: () => {
		return dispatch => {
			dispatch({ type: 'ADD_RECIPE_LIKE' })
		}
	},
	removeRecipeLike: () => {
		return dispatch => {
			dispatch({ type: 'REMOVE_RECIPE_LIKE' })
		}
	},
	addRecipeMake: () => {
		return dispatch => {
			dispatch({ type: 'ADD_RECIPE_MAKE' })
		}
	},
	updateComments: (comments) => {
		return dispatch => {
			dispatch({ type: 'UPDATE_COMMENTS', comments: comments })
		}
	},
	addReShare: () => {
		return dispatch => {
			dispatch({ type: 'ADD_RECIPE_SHARE' })
		}
	},
	removeReShare: () => {
		return dispatch => {
			dispatch({ type: 'REMOVE_RECIPE_SHARE' })
		}
	},
	addMakePic: (makePic) => {
		return dispatch => {
			dispatch({ type: 'ADD_MAKE_PIC', makePic: makePic })
		}
	},
	saveRemainingMakePics: (makePics) => {
		return dispatch => {
			dispatch({ type: 'SAVE_REMAINING_MAKE_PICS', makePics: makePics })
		}
	},
	removeRecipeLikes: (remaining_likes, listType) => {
		return dispatch => {
			dispatch({ type: 'REMOVE_RECIPE_LIKES', recipe_likes: remaining_likes, listType: listType })
		}
	},
	storeChefDetails: (chef_details) => {
		return dispatch => {
			dispatch({ type: 'STORE_CHEF_DETAILS', chefID: `chef${chef_details.chef.id}`, chef_details: chef_details })
		}
	},
	// storeRecipeDetails: (recipe_details) => {
	//   return dispatch => {
	//     dispatch({ type: 'STORE_RECIPE_DETAILS', recipe_details: recipe_details})
	//   }
	// }
}

export default connect(mapStateToProps, mapDispatchToProps)(
	class RecipeDetails extends React.Component {

		state = {
			commenting: false,
			commentText: "",
			commentsTopY: 0,
			choosingPicSource: false,
			awaitingServer: false,
			scrollEnabled: true,
			makePicBase64: "",
			renderOfflineMessage: false,
			primaryImageFlatListWidth: 0,
			primaryImageDisplayedIndex: 0,
			deleteMakePicPopUpShowing: false,
			deleteCommentPopUpShowing: false,
			editRecipePopUpShowing: false,
			deleteRecipePopUpShowing: false,
			makePicToDelete: 0,
			commentToDelete: 0,
			headerButtons: null,
			dynamicMenuShowing: false,
			chefNameTextColor: "#505050",
			instructionImagePopupDetails: {},
			instructionImagePopupShowing: false
		}

		generateHeaderButtonList = async () => {
			let headerButtons = [
				{
					icon: this.props.recipe_details.shareable ? "share-outline" : "share-off",
					text: this.props.recipe_details.shareable ? "Share with followers" : "Remove share",
					action: this.props.recipe_details.shareable ?
						(() => {
							this.setState({ dynamicMenuShowing: false });
							this.reShareRecipe()
						}) :
						(() => {
							this.setState({ dynamicMenuShowing: false });
							this.unReShareRecipe()
						})
				},
				{
					icon: this.props.recipe_details.likeable ? "heart-outline" : "heart-off",
					text: this.props.recipe_details.likeable ? "Like recipe" : "Unlike recipe",
					action: this.props.recipe_details.likeable ?
						(() => {
							this.setState({ dynamicMenuShowing: false });
							this.likeRecipe()
						}) :
						(() => {
							this.setState({ dynamicMenuShowing: false });
							this.unlikeRecipe()
						})
				},
				{
					icon: "image-plus",
					text: "Add picture",
					action: (() => {
						this.setState({ dynamicMenuShowing: false })
						this.newMakePic()
					})
				},
				{
					icon: "comment-plus",
					text: "Add a comment",
					action: (() => {
						this.setState({ dynamicMenuShowing: false })
						this.newComment()
					})
				}
			]
			if (this.props.recipe_details.recipe.chef_id === this.props.loggedInChef.id || this.props.loggedInChef.is_admin) {
				headerButtons.push(
					{
						icon: "playlist-edit",
						text: "Edit recipe",
						action: () => this.setState({
							editRecipePopUpShowing: true,
							dynamicMenuShowing: false
						})
					},
				)
				headerButtons.push(
					{
						icon: "trash-can-outline",
						text: "Delete recipe",
						action: () => this.setState({
							deleteRecipePopUpShowing: true,
							dynamicMenuShowing: false
						})
					}
				)
			}
			headerButtons.push(
				{
					icon: "food",
					text: "Create new recipe",
					action: (() => {
						this.setState({ dynamicMenuShowing: false })
						this.props.navigation.navigate('NewRecipe')
					})
				}
			)
			await this.setState({ headerButtons: headerButtons })
		}

		renderDynamicMenu = () => {
			return (
				<DynamicMenu
					buttons={this.state.headerButtons}
					closeDynamicMenu={() => this.setState({ dynamicMenuShowing: false })}
				/>
			)
		}

		addDynamicMenuButtonsToHeader = () => {
			this.props.navigation.setOptions({
				headerRight: () => (
					<View style={centralStyles.dynamicMenuButtonContainer}>
						<View style={centralStyles.headerButtonContainer}>
							<TouchableOpacity style={centralStyles.dynamicMenuButton} activeOpacity={0.7} onPress={() => this.setState({ dynamicMenuShowing: true })} >
								<Icon name='dots-vertical' style={centralStyles.dynamicMenuIcon} size={33} />
							</TouchableOpacity>
						</View>
					</View>
				),
			});
		}

		componentDidMount = async () => {
			await this.setState({ awaitingServer: true })
			await this.generateHeaderButtonList()
			this.addDynamicMenuButtonsToHeader()
			if (this.props.route.params.commenting === true) {
				let netInfoState = await NetInfo.fetch()
				if (netInfoState.isConnected) {
					await this.setState({ commenting: true })
					setTimeout(() => {
						this.myScroll.scrollTo({ x: 0, y: this.state.commentsTopY - 100, animated: true })
					}, 300)
				} else {
					this.setState({ renderOfflineMessage: true })
				}
			}
			await this.setState({ awaitingServer: false })
		}

		componentDidUpdate = async (prevProps) => {
			if (prevProps.recipe_details.likeable != this.props.recipe_details.likeable
				|| prevProps.recipe_details.shareable != this.props.recipe_details.shareable) {
				await this.generateHeaderButtonList()
			}
		}

		scrolled = () => {
			// console.log(e.nativeEvent)
		}

		navigateToChefDetails = async (chefID) => {
			await this.setState({
				awaitingServer: true,
				instructionImagePopupShowing: false
			})
			try {
				const chefDetails = await getChefDetails(chefID, this.props.loggedInChef.auth_token)
				if (chefDetails) {
					this.props.storeChefDetails(chefDetails)
					saveChefDetailsLocally(chefDetails, this.props.loggedInChef.id)
					await this.setState({ awaitingServer: false })
					this.props.navigation.navigate('ChefDetails', { chefID: chefID })
				}
			} catch (e) {
				if (e === "logout") { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
				// console.log('looking for local chefs')
				AsyncStorage.getItem('localChefDetails', (err, res) => {
					if (res != null) {
						// console.log('found some local chefs')
						let localChefDetails = JSON.parse(res)
						let thisChefDetails = localChefDetails.find(chefDetails => chefDetails.chef.id === chefID)
						if (thisChefDetails) {
							this.props.storeChefDetails(thisChefDetails)
							this.setState({ awaitingServer: false })
							this.props.navigation.navigate('ChefDetails', { chefID: chefID })
						} else {
							this.setState({ renderOfflineMessage: true })
						}
					} else {
						this.setState({ renderOfflineMessage: true })
					}
				})
			}
			await this.setState({ awaitingServer: false })
		}

		editRecipe = async () => {
			await this.setState({
				awaitingServer: true,
				editRecipePopUpShowing: false
			})
			this.props.navigation.navigate('NewRecipe', { recipe_details: this.props.recipe_details })
			await this.setState({ awaitingServer: false })
		}

		deleteRecipe = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
				const deleted = await destroyRecipe(this.props.recipe_details.recipe.id, this.props.loggedInChef.auth_token)
				if (deleted) {
					this.props.navigation.goBack()
				}
			} else {
				this.setState({
					renderOfflineMessage: true,
					deleteRecipePopUpShowing: false
				})
			}
		}

		renderRecipeIngredients = () => {
			const ingredient_uses = this.props.recipe_details.ingredient_uses
			const list_values = ingredient_uses.map(ingredient_use => [ingredient_use.ingredient_id, ingredient_use.quantity, ingredient_use.unit])
			const ingredients = list_values.map(list_value => [...list_value, (this.props.recipe_details.ingredients.find(ingredient => ingredient.id == list_value[0]).name)])
			return ingredients.map((ingredient, index) => (
				<React.Fragment key={`${ingredient[0]}${ingredient[3]}${ingredient[1]}${ingredient[2]}`}>
					<View style={styles.ingredientsTable}>
						<View style={styles.ingredientsTableLeft}>
							<Text maxFontSizeMultiplier={2} style={[styles.detailsContents, styles.ingredientName]}>{ingredient[3]}</Text>
						</View>
						<View style={styles.ingredientsTableRight}>
							<Text maxFontSizeMultiplier={2} style={[styles.detailsContents, styles.ingredientQuantity]}>{ingredient[1]}</Text>
							< Text maxFontSizeMultiplier={2} style={[styles.detailsContents, styles.ingredientUnit]}>{ingredient[2]}</Text>
						</View>
					</View>
					{index < ingredients.length - 1 && (
						<View style={styles.detailsIngredientsSeparator}>
						</View>
					)}
				</React.Fragment>
			))
		}

		renderMakePicScrollView = () => {
			return (
				<ScrollView
					horizontal={true}
					style={styles.makePicScrollView}
					scrollEnabled={this.state.scrollEnabled}
				>
					{this.renderRecipeMakePics()}
				</ScrollView>
			)
		}

		renderRecipeMakePics = () => {
			return this.props.recipe_details.make_pics.map(make_pic => {
				// console.log(this.props.recipe_details.make_pics_chefs)
				return (
					<TouchableOpacity
						// delayPressIn={100}
						activeOpacity={0.7}
						onPress={() => {
							this.setState({
								scrollEnabled: false,
								instructionImagePopupShowing: true,
								instructionImagePopupDetails: make_pic
							})
						}}
						// onPressOut={() => {
						// 	this.setState({
						// 		scrollEnabled: true,
						// 		instructionImagePopupShowing: false,
						// 	})
						// }}
						// pressRetentionOffset={{
						// 	top: responsiveHeight(100),
						// 	left: responsiveWidth(100),
						// 	bottom: responsiveHeight(100),
						// 	right: responsiveWidth(100)
						// }}
						key={`${make_pic.id}${make_pic.image_url}`}
						style={styles.makePicContainer}
					>
						<Image style={[{ width: '100%', height: '100%' }, styles.makePic]} source={{ uri: make_pic.image_url }}></Image>
						{(make_pic.chef_id === this.props.loggedInChef.id || this.props.loggedInChef.is_admin) && (
							<TouchableOpacity style={styles.makePicTrashCanButton} onPress={() => this.setState({ deleteMakePicPopUpShowing: true, makePicToDelete: make_pic.id })}>
								<Icon name='trash-can-outline' size={responsiveHeight(3.5)} style={[styles.icon, styles.makePicTrashCan]} />
							</TouchableOpacity>
						)}
					</TouchableOpacity>
				)
			})
		}

		renderRecipeComments = () => {
			if (this.props.recipe_details.comments.length > 0 || this.state.commenting) {
				return (
					this.props.recipe_details.comments.map(comment => {
						return (
							<RecipeComment
								newCommentView={this.newCommentView}
								key={`${comment.id} ${comment.comment}`}
								{...comment}
								loggedInChefID={this.props.loggedInChef.id}
								is_admin={this.props.loggedInChef.is_admin}
								askDeleteComment={this.askDeleteComment}
								navigation={this.props.navigation}
							/>
						)
					})
				)
			} else {
				return <Text maxFontSizeMultiplier={2} style={styles.detailsContents}>No comments yet. Be the first!</Text>
			}
		}

		renderLikeButton = () => {
			if (this.props.recipe_details.likeable) {
				return (
					<TouchableOpacity onPress={this.likeRecipe}>
						<Icon name='heart-outline' size={responsiveHeight(3.5)} style={styles.icon} />
					</TouchableOpacity>
				)
			} else {
				return (
					<TouchableOpacity onPress={this.unlikeRecipe}>
						<Icon name='heart' size={responsiveHeight(3.5)} style={styles.icon} />
					</TouchableOpacity>
				)
			}
		}

		renderMakeButton = () => {
			if (this.props.recipe_details.makeable) {
				return (
					<TouchableOpacity onPress={this.makeRecipe}>
						<Icon name='food' size={responsiveHeight(3.5)} style={styles.icon} />
					</TouchableOpacity>
				)
			} else {
				return (
					<TouchableOpacity>
						<Icon name='food-off' size={responsiveHeight(3.5)} style={styles.icon} />
					</TouchableOpacity>
				)
			}
		}

		likeRecipe = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
				try {
					const likePosted = await postRecipeLike(this.props.recipe_details.recipe.id, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
					if (likePosted) {
						this.props.addRecipeLike()
					}
				} catch (e) {
					if (e === "logout") { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
					await this.setState({ renderOfflineMessage: true })
				}
				await this.setState({ awaitingServer: false })
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		unlikeRecipe = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
				try {
					const unlikePosted = await destroyRecipeLike(this.props.recipe_details.recipe.id, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
					if (unlikePosted) {
						this.props.removeRecipeLike()
					}
				} catch (e) {
					if (e === "logout") { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
					await this.setState({ renderOfflineMessage: true })
				}
				await this.setState({ awaitingServer: false })
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		makeRecipe = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
				try {
					const makePosted = await postRecipeMake(this.props.recipe_details.recipe.id, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
					if (makePosted) {
						this.props.addRecipeMake()
					}
				} catch (e) {
					if (e === "logout") { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
					await this.setState({ renderOfflineMessage: true })
				}
				await this.setState({ awaitingServer: false })
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		reShareRecipe = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
				try {
					const reSharePosted = await postReShare(this.props.recipe_details.recipe.id, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
					if (reSharePosted) {
						this.props.addReShare()
					}
				} catch (e) {
					if (e === "logout") { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
					await this.setState({ renderOfflineMessage: true })
				}
				await this.setState({ awaitingServer: false })
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		unReShareRecipe = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
				try {
					const unReShared = await destroyReShare(this.props.recipe_details.recipe.id, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
					if (unReShared) {
						this.props.removeReShare()
					}
				} catch (e) {
					if (e === "logout") { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
					await this.setState({ renderOfflineMessage: true })
				}
				await this.setState({ awaitingServer: false })
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		newMakePic = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				this.setState({ choosingPicSource: true })
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		saveImage = (image) => {
			if (image.base64 != undefined) {
				this.setState({ makePicBase64: image.base64 })
			}
		}

		cancelChooseInstructionImage = (image) => {
			this.setState({ makePicBase64: image })
		}

		saveMakePic = async () => {
			await this.setState({
				awaitingServer: true,
				choosingPicSource: false
			})
			if (this.state.makePicBase64) {
				const makePic = await postMakePic(this.props.recipe_details.recipe.id, this.props.loggedInChef.id, this.props.loggedInChef.auth_token, this.state.makePicBase64)
				if (makePic) {
					await this.props.addMakePic(makePic)
				}
			}
			await this.setState({
				awaitingServer: false,
				makePicBase64: "",
			})
		}

		deleteMakePic = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
				try {
					const destroyed = await destroyMakePic(this.props.loggedInChef.id, this.props.loggedInChef.auth_token, this.state.makePicToDelete)
					if (destroyed) {
						this.props.saveRemainingMakePics(this.props.recipe_details.make_pics.filter(pic => pic.id !== this.state.makePicToDelete))
					}
					await this.setState({ deleteMakePicPopUpShowing: false })
				} catch (e) {
					if (e === "logout") { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
					await this.setState({ renderOfflineMessage: true })
				}
				await this.setState({
					awaitingServer: false,
					deleteMakePicPopUpShowing: false
				})
			} else {
				this.setState({
					renderOfflineMessage: true,
					deleteMakePicPopUpShowing: false
				})
			}
		}

		newComment = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				this.setState({ commenting: true })
			} else {
				this.setState({ renderOfflineMessage: true })
			}
		}

		cancelComment = () => {
			this.setState({
				commenting: false,
				commentText: ""
			})
		}

		saveComment = async () => {
			await this.setState({ awaitingServer: true })
			try {
				const comments = await postComment(this.props.recipe_details.recipe.id, this.props.loggedInChef.id, this.props.loggedInChef.auth_token, this.state.commentText)
				if (comments) {
					this.props.updateComments(comments)
					this.setState({
						commenting: false,
						commentText: ""
					})
				}
			} catch (e) {
				if (e === "logout") { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
				await this.setState({ renderOfflineMessage: true })
			}
			await this.setState({ awaitingServer: false })
		}

		handleCommentTextInput = (commentText) => {
			this.setState({ commentText: commentText })
		}

		askDeleteComment = (commentID) => {
			this.setState({
				deleteCommentPopUpShowing: true,
				commentToDelete: commentID
			})
		}

		deleteComment = async () => {
			let netInfoState = await NetInfo.fetch()
			if (netInfoState.isConnected) {
				await this.setState({ awaitingServer: true })
				try {
					const comments = await destroyComment(this.props.loggedInChef.auth_token, this.state.commentToDelete)
					if (comments) {
						this.props.updateComments(comments)
					}
					await this.setState({ deleteCommentPopUpShowing: false })
				} catch (e) {
					if (e === "logout") { this.props.navigation.navigate('Profile', { screen: 'Profile', params: { logout: true } }) }
					await this.setState({ renderOfflineMessage: true })
				}
				await this.setState({
					awaitingServer: false,
					deleteCommentPopUpShowing: false,
				})
			} else {
				this.setState({
					renderOfflineMessage: true,
					deleteCommentPopUpShowing: false
				})
			}
		}

		renderFilterCategories = () => {
			const categories = Object.keys(this.props.filter_settings).sort().filter(category => this.props.recipe_details.recipe[category.split(" ").join("_").toLowerCase()])
			if (categories.length > 0) {
				return (
					<View style={styles.detailsContainer}>
						<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>Categories:</Text>
						<Text maxFontSizeMultiplier={2} style={styles.detailsContents}>{categories.join(",  ")}</Text>
					</View>
				)
			} else {
				return null
			}
		}

		renderAcknowledgement = () => {
			return (
				<View style={styles.detailsContainer}>
					<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>Acknowledgement:</Text>
					<Text maxFontSizeMultiplier={2} style={styles.detailsContents}>{this.props.recipe_details.recipe.acknowledgement}</Text>
				</View>
			)
		}

		renderDescription = () => {
			return (
				<View style={styles.detailsContainer}>
					<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>Description:</Text>
					<Text maxFontSizeMultiplier={2} style={styles.detailsContents}>{this.props.recipe_details.recipe.description}</Text>
				</View>
			)
		}

		renderCuisine = () => {
			return (
				<View style={styles.detailsContainer}>
					<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>Cuisine:</Text>
					<Text maxFontSizeMultiplier={2} style={styles.detailsContents}>{this.props.recipe_details.recipe.cuisine}</Text>
				</View>
			)
		}

		renderRecipeInstructions = () => {
			// console.log(this.props.recipe_details.instructions)
			return this.props.recipe_details.instructions.map((instruction, index) => {
				let instructionImage = this.props.recipe_details.instruction_images.find(image => image.instruction_id === instruction.id)
				return (
					<React.Fragment key={instruction.step}>
						<View style={styles.detailsInstructionContainer}>
							<View style={[styles.detailsInstructions, { width: (instructionImage ? responsiveWidth(73) : responsiveWidth(98)) }]}>
								<Text maxFontSizeMultiplier={2} style={styles.detailsContents}>{instruction.instruction}</Text>
							</View>
							{instructionImage && (
								<TouchableOpacity
									style={styles.instructionImageContainer}
									delayPressIn={100}
									onPressIn={() => {
										this.setState({
											scrollEnabled: false,
											instructionImagePopupShowing: true,
											instructionImagePopupDetails: instructionImage
										})
									}}
									onPressOut={() => {
										this.setState({
											scrollEnabled: true,
											instructionImagePopupShowing: false,
										})
									}}
									pressRetentionOffset={{
										top: responsiveHeight(100),
										left: responsiveWidth(100),
										bottom: responsiveHeight(100),
										right: responsiveWidth(100)
									}}
								>
									<Image
										style={[{ width: responsiveWidth(25), height: responsiveWidth(25) }, styles.detailsImage]}
										source={{ uri: instructionImage.image_url }}
										resizeMode="cover"
									/>
								</TouchableOpacity>
							)}
						</View>
						{index < this.props.recipe_details.instructions.length - 1 && (
							<View style={styles.detailsInstructionsSeparator}>
							</View>
						)}
					</React.Fragment>
				)
			})
		}

		renderPictureChooser = () => {
			let imageSource = `data:image/jpeg;base64,${this.state.makePicBase64}`
			return (
				<PicSourceChooser
					saveImage={this.saveImage}
					sourceChosen={this.saveMakePic}
					// key={"primary-pic-chooser"}
					imageSource={imageSource}
					originalImage={this.state.makePicBase64}
					cancelChooseInstructionImage={this.cancelChooseInstructionImage}
				/>
			)
		}

		renderPrimaryImageBlobs = () => {
			return this.props.recipe_details.recipe_images.map((image, index) => {
				if (this.state.primaryImageDisplayedIndex == index) {
					return <Icon key={image.hex} name={'checkbox-blank-circle'} size={responsiveHeight(3)} style={styles.primaryImageBlob} />
				} else {
					return <Icon key={image.hex} name={'checkbox-blank-circle-outline'} size={responsiveHeight(3)} style={styles.primaryImageBlob} />
				}
			})
		}

		renderDeleteMakePicAlertPopUp = () => {
			return (
				<AlertPopUp
					close={() => this.setState({ deleteMakePicPopUpShowing: false })}
					title={"Are you sure you want to delete this picture?"}
					onYes={() => this.deleteMakePic(this.state.makePicToDelete)}
				/>
			)
		}

		renderDeleteCommentAlertPopUp = () => {
			return (
				<AlertPopUp
					close={() => this.setState({ deleteCommentPopUpShowing: false })}
					title={"Are you sure you want to delete this comment?"}
					onYes={() => this.deleteComment(this.state.commentToDelete)}
				/>
			)
		}

		renderEditRecipeAlertPopUp = () => {
			return (
				<AlertPopUp
					close={() => this.setState({ editRecipePopUpShowing: false })}
					title={"Are you sure you want to edit this recipe?"}
					onYes={this.editRecipe}
				/>
			)
		}

		renderDeleteRecipeAlertPopUp = () => {
			return (
				<AlertPopUp
					close={() => this.setState({ deleteRecipePopUpShowing: false })}
					title={"Are you sure you want to delete this recipe?"}
					onYes={this.deleteRecipe}
				/>
			)
		}

		render() {
			if (this.props.recipe_details != undefined && this.props.recipe_details != null) {
				// console.log(this.props.recipe_details)
				return (
					<SpinachAppContainer awaitingServer={this.state.awaitingServer}>
						{this.state.renderOfflineMessage && (
							<OfflineMessage
								message={`Sorry, can't do right now.${"\n"}You appear to be offline.`}
								topOffset={'10%'}
								clearOfflineMessage={() => this.setState({ renderOfflineMessage: false })}
							/>)
						}
						{this.state.deleteMakePicPopUpShowing && this.renderDeleteMakePicAlertPopUp()}
						{this.state.deleteCommentPopUpShowing && this.renderDeleteCommentAlertPopUp()}
						{this.state.editRecipePopUpShowing && this.renderEditRecipeAlertPopUp()}
						{this.state.deleteRecipePopUpShowing && this.renderDeleteRecipeAlertPopUp()}
						{this.state.choosingPicSource && this.renderPictureChooser()}
						{this.state.dynamicMenuShowing && this.renderDynamicMenu()}
						{this.state.instructionImagePopupShowing && (
							<InstructionImagePopup
								makePic={this.state.instructionImagePopupDetails}
								chef={this.props.recipe_details.make_pics_chefs.find(chef => chef.id == this.state.instructionImagePopupDetails.chef_id)}
								navigateToChefDetails={this.navigateToChefDetails}
								close={() => this.setState({
									instructionImagePopupShowing: false,
									scrollEnabled: true
								})}
							/>)
						}
						<ScrollView
							contentContainerStyle={{ flexGrow: 1 }}
							ref={(ref) => this.myScroll = ref}
							scrollEnabled={this.state.scrollEnabled}
							nestedScrollEnabled={true}
						>
							<View style={styles.detailsHeader}>
								<View style={styles.detailsHeaderTopRow}>
									<View style={styles.headerTextView}>
										<Text
											maxFontSizeMultiplier={2}
											style={styles.detailsHeaderTextBox}
										>
											{this.props.recipe_details.recipe.name}
											<Text
												maxFontSizeMultiplier={2}
												style={[styles.detailsChefTextBox, { color: this.state.chefNameTextColor }]}
												onPress={() => {
													this.setState({ chefNameTextColor: "#50505055" })
													this.navigateToChefDetails(this.props.recipe_details.recipe.chef_id)
													setTimeout(() => { this.setState({ chefNameTextColor: "#505050" }) }, 300)
												}}
											>
												&nbsp;by&nbsp;{this.props.recipe_details.chef_username}
											</Text>
										</Text>

									</View>
								</View>
							</View>
							<View style={styles.detailsLikesAndMakes}>
								<View style={styles.detailsLikes}>
									<View style={styles.buttonAndText}>
										{this.renderLikeButton()}
										<Text maxFontSizeMultiplier={2} style={styles.detailsLikesAndMakesUpperContents}>Likes: {this.props.recipe_details.recipe_likes}</Text>
									</View>
									<View style={styles.buttonAndText}>
										<Text maxFontSizeMultiplier={2} style={styles.detailsLikesAndMakesLowerContents}>Serves: {this.props.recipe_details.recipe.serves}</Text>
									</View>
								</View>
								<View style={styles.detailsLikes}>
									<Text maxFontSizeMultiplier={2} style={styles.detailsLikesAndMakesLowerContents}>Time: {this.props.recipe_details.recipe.time}</Text>
									<Text maxFontSizeMultiplier={2} style={styles.detailsLikesAndMakesLowerContents}>Difficulty: {this.props.recipe_details.recipe.difficulty}</Text>
								</View>
							</View>
							{(this.props.recipe_details.recipe.description != "" && this.props.recipe_details.recipe.description != null) && this.renderDescription()}
							{this.props.recipe_details.recipe_images?.length > 0 && (
								<View style={styles.detailsImageWrapper}>
									<FlatList
										data={this.props.recipe_details.recipe_images}
										renderItem={item => <Image style={{ width: responsiveWidth(100) - 4, height: responsiveWidth(75) - 2, borderRadius: 5, top: 1 }} source={{ uri: item.item.image_url }} resizeMode={"cover"}></Image>}
										keyExtractor={(item) => item.hex}
										horizontal={true}
										style={styles.primaryImageFlatList}
										// contentContainerStyle={styles.primaryImageFlatListContentContainer}
										pagingEnabled={true}
										onLayout={(event) => {
											var { x, y, width, height } = event.nativeEvent.layout //eslint-disable-line no-unused-vars
											this.setState({ primaryImageFlatListWidth: width })
										}}
										onScroll={e => {
											let nearestIndex = Math.round(e.nativeEvent.contentOffset.x / this.state.primaryImageFlatListWidth)
											if (nearestIndex != this.state.primaryImageDisplayedIndex) {
												this.setState({ primaryImageDisplayedIndex: nearestIndex })
											}
										}}
									/>
									<View style={styles.primaryImageBlobsContainer}>
										{this.props.recipe_details.recipe_images.length > 1 && this.renderPrimaryImageBlobs()}
									</View>
								</View>
							)}
							{this.props.recipe_details.ingredient_uses?.length > 0 && (
								<View style={styles.detailsIngredients}>
									<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>Ingredients:</Text>
									{this.renderRecipeIngredients()}
								</View>
							)}
							{this.props.recipe_details.instructions?.length > 0 && (
								<View style={styles.detailsContainer}>
									<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>Instructions:</Text>
									{this.renderRecipeInstructions()}
								</View>
							)}
							{this.props.recipe_details.recipe.cuisine != "Any" ? this.renderCuisine() : null}
							{this.renderFilterCategories()}
							{(this.props.recipe_details.recipe.acknowledgement != "" && this.props.recipe_details.recipe.acknowledgement != null) && this.renderAcknowledgement()}
							<View style={styles.detailsMakePicsContainer}>
								<View style={{ flexDirection: 'row' }}>
									<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>Images from other users:</Text>
									<TouchableOpacity onPress={this.newMakePic}>
										<Icon name='image-plus' size={responsiveHeight(3.5)} style={styles.addIcon} />
									</TouchableOpacity>
								</View>
								{this.props.recipe_details.make_pics.length === 0 && <Text maxFontSizeMultiplier={2} style={styles.detailsContents}>No other images yet.  Be the first!</Text>}
								{this.props.recipe_details.make_pics.length !== 0 && this.renderMakePicScrollView()}
							</View>
							<View style={styles.detailsComments}
								onLayout={(event) => this.setState({ commentsTopY: event.nativeEvent.layout.y })}>
								<View style={{ flexDirection: 'row' }}>
									<Text maxFontSizeMultiplier={2} style={styles.detailsSubHeadings}>Comments:</Text>
									<TouchableOpacity onPress={this.state.commenting ? (this.state.commentText === "" ? this.cancelComment : this.saveComment) : this.newComment}>
										<Icon name={this.state.commenting ? (this.state.commentText === "" ? 'comment-remove' : 'comment-check') : 'comment-plus'} size={responsiveHeight(3.5)} style={styles.addIcon} />
									</TouchableOpacity>
								</View>
								{this.state.commenting ? <RecipeNewComment scrollToLocation={this.scrollToLocation} {...this.props.loggedInChef} commentText={this.state.commentText} handleCommentTextInput={this.handleCommentTextInput} saveComment={this.saveComment} /> : null}
								{this.renderRecipeComments()}
							</View>
						</ScrollView>
					</SpinachAppContainer>
				);
			} else {
				return (
					<SpinachAppContainer awaitingServer={this.state.awaitingServer}>
					</SpinachAppContainer>
				)
			}
		}
	}
)

