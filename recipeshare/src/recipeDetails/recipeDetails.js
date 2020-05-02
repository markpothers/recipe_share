import React from 'react';
import { Image, ScrollView, View, ImageBackground, Text, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Platform } from 'react-native';
import { connect } from 'react-redux'
import { styles } from './recipeDetailsStyleSheet'
import { centralStyles } from '../centralStyleSheet'
import { postRecipeLike } from '../fetches/postRecipeLike'
import { postMakePic } from '../fetches/postMakePic'
import { getRecipeDetails } from '../fetches/getRecipeDetails'
import { postReShare } from '../fetches/postReShare'
import { postRecipeMake } from '../fetches/postRecipeMake'
import { postComment } from '../fetches/postComment'
import { destroyRecipeLike } from '../fetches/destroyRecipeLike'
import { destroyMakePic } from '../fetches/destroyMakePic'
import { destroyComment } from '../fetches/destroyComment'
import { destroyRecipe } from '../fetches/destroyRecipe'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RecipeComment from './recipeComment'
import RecipeNewComment from './recipeNewComment';
import AppHeader from '../../navigation/appHeader'
import PicSourceChooser from '../functionalComponents/picSourceChooser'
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'

const mapStateToProps = (state) => ({
  recipe_details: state.recipe_details,
  loggedInChef: state.loggedInChef,
  filter_settings: state.filter_settings,
})

const mapDispatchToProps = {
  addRecipeLike: () => {
    return dispatch => {
      dispatch({ type: 'ADD_RECIPE_LIKE'})
    }
  },
  removeRecipeLike: () => {
    return dispatch => {
      dispatch({ type: 'REMOVE_RECIPE_LIKE'})
    }
  },
  addRecipeMake: () => {
    return dispatch => {
      dispatch({ type: 'ADD_RECIPE_MAKE'})
    }
  },
  updateComments: (comments) => {
    return dispatch => {
      dispatch({ type: 'UPDATE_COMMENTS', comments: comments})
    }
  },
  addReShare: () => {
    return dispatch => {
      dispatch({ type: 'ADD_RECIPE_SHARE'})
    }
  },
  addMakePic: (makePic) => {
    return dispatch => {
      dispatch({ type: 'ADD_MAKE_PIC', makePic: makePic})
    }
  },
  saveRemainingMakePics: (makePics) => {
    return dispatch => {
      dispatch({ type: 'SAVE_REMAINING_MAKE_PICS', makePics: makePics})
    }
  },
  removeRecipeLikes: (remaining_likes, listType) => {
    return dispatch => {
      dispatch({ type: 'REMOVE_RECIPE_LIKES', recipe_likes: remaining_likes, listType: listType})
    }
  },
  storeRecipeDetails: (recipe_details) => {
    return dispatch => {
      dispatch({ type: 'STORE_RECIPE_DETAILS', recipe_details: recipe_details})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class RecipeDetails extends React.Component {
    static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: <AppHeader text={"Recipe Details"} />,
        // headerRight: null
        headerLeft: null,
      };
    }

    state = {
      commenting: false,
      commentText: "",
      choosingPicSource: false,
      awaitingServer: false
    }

    componentDidMount = async() => {
      await this.setState({awaitingServer: true})
      this.props.storeRecipeDetails(null)
      const recipe_details = await getRecipeDetails(this.props.navigation.getParam('recipeID'), this.props.loggedInChef.auth_token)
      if (recipe_details) {
        // console.log(recipe_details)
        this.props.storeRecipeDetails(recipe_details)
      }
      if (this.props.navigation.getParam('commenting') === true ){
        await this.setState({commenting: true})
        setTimeout( () => {
          this.myScroll.scrollTo({x: 0, y: 1400, animated: true})
        }, 300)
      }
      await this.setState({awaitingServer: false})
    }

    scrolled =(e) => {
      // console.log(e.nativeEvent)
    }

    editRecipe = async() => {
      await this.setState({awaitingServer: true})
      this.props.navigation.navigate('NewRecipe', {recipe_details: this.props.recipe_details})
      await this.setState({awaitingServer: false})
    }

    deleteRecipe = async() => {
      await this.setState({awaitingServer: true})
      const deleted = await destroyRecipe(this.props.recipe_details.recipe.id, this.props.loggedInChef.auth_token)
      if (deleted) {
        this.props.navigation.goBack()
      }
    }

    renderEditDeleteButtons = () => {
      if (this.props.recipe_details.recipe.chef_id === this.props.loggedInChef.id || this.props.loggedInChef.is_admin){
        return (
          <View style={styles.detailsHeaderButtonsContainer}>
            <TouchableOpacity style={styles.headerButton} onPress={this.editRecipe}>
              <Icon name='playlist-edit' size={24} style={styles.headerIcon}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={this.deleteRecipe}>
              <Icon name='trash-can-outline' size={24} style={styles.headerIcon}/>
            </TouchableOpacity>
          </View>
        )
      }
    }

    renderRecipeImages = () => {
      if (this.props.recipe_details.recipe_images.length !== 0){
          return <Image style={[{width: '100%', height: 250}, styles.detailsImage]} source={{uri: this.props.recipe_details.recipe_images[this.props.recipe_details.recipe_images.length-1].image_url}}></Image>
      }
    }

    renderRecipeIngredients = () => {
      const ingredient_uses = this.props.recipe_details.ingredient_uses
      const list_values = ingredient_uses.map(ingredient_use => [ingredient_use.ingredient_id, ingredient_use.quantity, ingredient_use.unit])
      const ingredients = list_values.map(list_value => [...list_value, (this.props.recipe_details.ingredients.find(ingredient => ingredient.id == list_value[0]).name)])
      return ingredients.map(ingredient => (
            <View style={styles.ingredientsTable} key={`${ingredient[0]}${ingredient[3]}${ingredient[1]}${ingredient[2]}`}>
              <Text style={[styles.detailsContents, styles.ingredientName]}>{ingredient[3]}</Text>
              <Text style={[styles.detailsContents, styles.ingredientQuantity]}>{ingredient[1]}</Text>
              <Text style={[styles.detailsContents, styles.ingredientUnit]}>{ingredient[2]}</Text>
            </View>
      ))
    }

    renderMakePicScrollView = () => {
      return (
        <ScrollView horizontal="true" style={styles.makePicScrollView}>
          {this.renderRecipeMakePics()}
        </ScrollView>
      )
    }

    renderRecipeMakePics = () => {
        return this.props.recipe_details.make_pics.map(make_pic => {
          if (make_pic.chef_id === this.props.loggedInChef.id || this.props.loggedInChef.is_admin){
          return (
            <View key={`${make_pic.id}${make_pic.image_url}`} style={styles.makePicContainer}>
              <Image style={[{width: '100%', height: '100%'}, styles.makePic]} source={{uri: make_pic.image_url}}></Image>
              <TouchableOpacity style={styles.makePicTrashCanButton} onPress={() => this.deleteMakePic(make_pic.id)}>
                <Icon name='trash-can-outline' size={24} style={[styles.icon, styles.makePicTrashCan]}/>
              </TouchableOpacity>
            </View>
          )
          } else {
            return(
              <View key={`${make_pic.id}${make_pic.image_url}`} style={styles.makePicContainer}>
                <Image style={[{width: '100%', height: '100%'}, styles.makePic]} source={{uri: make_pic.image_url}}></Image>
              </View>
            )
          }
        })
    }

    renderRecipeComments = () => {
      if (this.props.recipe_details.comments.length > 0 || this.state.commenting){
        return (
          this.props.recipe_details.comments.map( comment => {
            return <RecipeComment newCommentView={this.newCommentView} key={`${comment.id} ${comment.comment}`} {...comment} loggedInChefID={this.props.loggedInChef.id} is_admin={this.props.loggedInChef.is_admin} deleteComment={this.deleteComment}/>
          })
        )
      } else {
        return <Text style={[styles.detailsContents]}>No comments yet.  Be the first!</Text>
      }
    }

    renderLikeButton = () => {
      if (this.props.recipe_details.likeable){
        return (
          <TouchableOpacity onPress={this.likeRecipe}>
            <Icon name='heart-outline' size={24} style={styles.icon}/>
          </TouchableOpacity>
        )
      } else {
        return (
          <TouchableOpacity onPress={this.unlikeRecipe}>
            <Icon name='heart' size={24} style={styles.icon}/>
          </TouchableOpacity>
        )
      }
    }

    renderMakeButton = () => {
      if (this.props.recipe_details.makeable){
        return (
          <TouchableOpacity onPress={this.makeRecipe}>
            <Icon name='food' size={24} style={styles.icon}/>
          </TouchableOpacity>
        )
      } else {
        return (
          <TouchableOpacity>
            <Icon name='food-off' size={24} style={styles.icon}/>
          </TouchableOpacity>
        )
      }
    }

    likeRecipe = async() => {
      await this.setState({awaitingServer: true})
      const likePosted = await postRecipeLike(this.props.recipe_details.recipe.id, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
      if (likePosted) {
          this.props.addRecipeLike()
      }
      await this.setState({awaitingServer: false})
    }

    unlikeRecipe = async() => {
      await this.setState({awaitingServer: true})
      const unlikePosted = await destroyRecipeLike(this.props.recipe_details.recipe.id, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
      if (unlikePosted) {
        this.props.removeRecipeLike()
      }
      await this.setState({awaitingServer: false})
    }

    makeRecipe = async() => {
      await this.setState({awaitingServer: true})
      const makePosted = await postRecipeMake(this.props.recipe_details.recipe.id, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
      if (makePosted) {
        this.props.addRecipeMake()
      }
      await this.setState({awaitingServer: false})
    }

    reShareRecipe = async() => {
      await this.setState({awaitingServer: true})
      const reSharePosted = await postReShare(this.props.recipe_details.recipe.id, this.props.loggedInChef.id, this.props.loggedInChef.auth_token)
      if (reSharePosted) {
          this.props.addReShare()
      }
      await this.setState({awaitingServer: false})
    }

    newMakePic = () => {
      this.setState({choosingPicSource: true})
    }

    sourceChosen = () =>{
      this.setState({choosingPicSource: false})
    }

    saveImage = async(image) => {
      await this.setState({awaitingServer: true})
      if (image.cancelled === false){
        const makePic = await postMakePic(this.props.recipe_details.recipe.id, this.props.loggedInChef.id, this.props.loggedInChef.auth_token, image)
        if (makePic) {
            this.props.addMakePic(makePic)
            this.setState({choosingPicSource: false})
        }
      }
      await this.setState({awaitingServer: false})
    }

    renderPictureChooser = () => {
      return <PicSourceChooser saveImage={this.saveImage} sourceChosen={this.sourceChosen} key={"pic-chooser"}/>
    }

    deleteMakePic = async(makePicID) => {
      await this.setState({awaitingServer: true})
      const destroyed = await destroyMakePic(this.props.loggedInChef.id, this.props.loggedInChef.auth_token, makePicID)
      if (destroyed){
        this.props.saveRemainingMakePics(this.props.recipe_details.make_pics.filter( pic => pic.id !== makePicID))
      }
      await this.setState({awaitingServer: false})
    }

    newComment = () => {
        this.setState({commenting: true})
    }

    cancelComment = () => {
      this.setState({
        commenting: false,
        commentText: ""
      })
    }

    saveComment = async() => {
      await this.setState({awaitingServer: true})
      const comments = await postComment(this.props.recipe_details.recipe.id, this.props.loggedInChef.id, this.props.loggedInChef.auth_token, this.state.commentText)
      if (comments) {
        this.props.updateComments(comments)
        this.setState({
          commenting: false,
          commentText: ""
        })
      }
      await this.setState({awaitingServer: false})
    }

    handleCommentTextInput = (commentText) => {
      console.log("mark")
      this.setState({commentText: commentText})
    }

    deleteComment = async(commentID) => {
      const comments = await destroyComment(this.props.loggedInChef.auth_token, commentID)
      if (comments) {
        this.props.updateComments(comments)
      }
    }

    renderFilterCategories = () => {
      const categories = Object.keys(this.props.filter_settings).sort().filter( category => this.props.recipe_details.recipe[category.split(" ").join("_").toLowerCase()])
      if (categories.length > 0){
        return (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsSubHeadings}>Categories:</Text>
            <Text style={[styles.detailsContents]}>{categories.join(",  ")}</Text>
          </View>
        )
      } else {
        return null
      }
    }

    renderAcknowledgement = () => {
      return (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsSubHeadings}>Acknowledgement:</Text>
          <Text style={[styles.detailsContents]}>{this.props.recipe_details.recipe.acknowledgement}</Text>
        </View>
      )
    }

    renderCuisine = () => {
      return (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsSubHeadings}>Cuisine:</Text>
          <Text style={[styles.detailsContents]}>{this.props.recipe_details.recipe.cuisine}</Text>
        </View>
      )
    }

    renderRecipeInstructions = () => {
      // console.log(this.props.recipe_details.instructions)
      return this.props.recipe_details.instructions.map(instruction => {
        return (
          <View style={styles.detailsInstructions} key={instruction.step}>
            <Text style={[styles.detailsContents]}>{instruction.instruction}</Text>
          </View>
        )
      })
    }

    render() {
      if (this.props.recipe_details != (undefined && null)){
        // console.log(this.props.recipe_details.recipe)
        // console.log(this.props.recipe_details.recipe.acknowledgement === "")
        return (
          <SpinachAppContainer awaitingServer={this.state.awaitingServer}>
              {this.state.choosingPicSource ? this.renderPictureChooser() : null}
              <View style={styles.detailsHeader}>
                <View style={styles.detailsHeaderTopRow}>
                  <View style={styles.headerTextView}>
                    <Text style={[styles.detailsHeaderTextBox]}>{this.props.recipe_details.recipe.name}</Text>
                  </View>
                    {this.renderEditDeleteButtons()}
                </View>
              </View>
              <ScrollView contentContainerStyle={{flexGrow:1}} ref={(ref) =>this.myScroll = ref} >
                <View style={styles.detailsLikesAndMakes}>
                  <View style={styles.detailsLikes}>
                    <View style={styles.buttonAndText}>
                      {this.renderLikeButton()}
                      <Text style={[styles.detailsLikesAndMakesUpperContents]}>Likes: {this.props.recipe_details.recipe_likes}</Text>
                    </View>
                    <View style={styles.buttonAndText}>
                      <Text style={[styles.detailsLikesAndMakesLowerContents]}>Serves: {this.props.recipe_details.recipe.serves}</Text>
                    </View>
                  </View>
                  <View style={styles.detailsLikes}>
                    <Text style={[styles.detailsLikesAndMakesLowerContents]}>Time: {this.props.recipe_details.recipe.time}</Text>
                    <Text style={[styles.detailsLikesAndMakesLowerContents]}>Difficulty: {this.props.recipe_details.recipe.difficulty}</Text>
                  </View>
                </View>
                <View style={styles.detailsImageWrapper}>
                  {this.renderRecipeImages()}
                </View>
                <View style={styles.detailsIngredients}>
                  <Text style={styles.detailsSubHeadings}>Ingredients:</Text>
                  {this.renderRecipeIngredients()}
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailsSubHeadings}>Instructions:</Text>
                    {this.renderRecipeInstructions()}
                  {/* <Text style={[styles.detailsContents]}>{this.props.recipe_details.recipe.instructions}</Text> */}
                </View>
                {this.props.recipe_details.recipe.cuisine != "Any" ? this.renderCuisine() : null}
                {this.renderFilterCategories()}
                {(this.props.recipe_details.recipe.acknowledgement != "" && this.props.recipe_details.recipe.acknowledgement != null) && this.renderAcknowledgement()}
                <View style={styles.detailsMakePicsContainer}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.detailsSubHeadings}>Images from other users:</Text>
                    <TouchableOpacity onPress={this.newMakePic}>
                      <Icon name='image-plus' size={24} style={styles.addIcon}/>
                    </TouchableOpacity>
                  </View>
                  {this.props.recipe_details.make_pics.length === 0 && <Text style={[styles.detailsContents]}>No other images yet.  Be the first!</Text>}
                  {this.props.recipe_details.make_pics.length !== 0 && this.renderMakePicScrollView()}
                </View>
                <View style={styles.detailsComments}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.detailsSubHeadings}>Comments:</Text>
                    <TouchableOpacity onPress={this.state.commenting ? (this.state.commentText === "" ? this.cancelComment : this.saveComment ) : this.newComment}>
                      <Icon name={this.state.commenting ? (this.state.commentText === "" ? 'comment-remove' : 'comment-check' ) : 'comment-plus'} size={24} style={styles.addIcon}/>
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

