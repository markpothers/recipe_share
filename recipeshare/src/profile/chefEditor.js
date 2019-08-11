import React from 'react'
import { Modal, Text, View, TouchableOpacity, Dimensions, Picker, TextInput, Platform } from 'react-native'
import { styles } from './chefEditorStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux'
import { countries } from '../dataComponents/countries'
import PicSourceChooser from '../functionalComponents/picSourceChooser'
import { patchChef } from '../fetches/patchChef'

const mapStateToProps = (state) => ({
    username: state.newUserDetails.username,
    password: state.newUserDetails.password,
    password_confirmation: state.newUserDetails.password_confirmation,
    country: state.newUserDetails.country,
    imageBase64: state.newUserDetails.imageURL,
    profile_text: state.newUserDetails.profile_text,
    loggedInChef: state.loggedInChef,
    stayingLoggedIn: state.stayLoggedIn,
})

const mapDispatchToProps = {
    saveChefDetails: (parameter, content) => {
        return dispatch => {
          dispatch({ type: 'UPDATE_NEW_USER_DETAILS', parameter: parameter, content: content})
        }
      },
      clearNewUserDetails: () => {
        return dispatch => {
          dispatch({ type: 'CLEAR_NEW_USER_DETAILS'})
        }
      },
      updateLoggedInChefInState: (id, username, auth_token, imageURL, is_admin) => {
        return dispatch => {
          dispatch({ type: 'UPDATE_LOGGED_IN_CHEF', id: id, username: username, auth_token: auth_token, imageURL: imageURL, is_admin: is_admin})
        }
      }
  }

export default connect(mapStateToProps, mapDispatchToProps)(
    class chefEditor extends React.PureComponent{

        state = {
            errors: [],
            updatingPassword: false,
            choosingPicture: false,
            updateModalVisible: true,
        }

        componentDidMount = () => {
            this.populateBoxes()
        }

        populateBoxes = () => {
            this.updateChef(this.props.chef.username, "username")
            this.updateChef(this.props.chef.profile_text, "profile_text")
            this.updateChef(this.props.chef.country, "country")
        }

        choosePicture = () =>{
            this.setState({choosingPicture: true})
        }
      
        sourceChosen = () =>{
            this.setState({choosingPicture: false})
        }
    
        renderPictureChooser = () => {
            return <PicSourceChooser saveImage={this.saveImage} sourceChosen={this.sourceChosen} key={"pic-chooser"}/>
        }
    
        saveImage = async(image) => {
            if (image.cancelled === false){
                this.props.saveChefDetails("imageURL", image.base64)
                this.setState({choosingPicture: false})
            }
        }

        renderPasswordError = () => {
            const passwordErrors = this.state.errors.filter(message => message.startsWith("Password"))
            return passwordErrors.map(error => (
              <View style={styles.formRow} key={error}>
                <View style={styles.formError}>
                  <Text style={styles.formErrorText}>{error}</Text>
                </View>
              </View>
            ))
          }

        countriesPicker = () => {
            return countries.map( country => {
              return <Picker.Item key={country} label={country} value={country} />
            })
          }

        renderNewPasswordOptions = () => {
            return(
                <React.Fragment>
                    <View style={styles.formRow}>
                        <View style={styles.editChefInputBox} >
                            <TextInput style={styles.editChefTextBox} value={this.props.password} placeholder="password"  autoCapitalize="none" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password")}/>
                        </View>
                    </View>
                    <View style={styles.formRow}>
                        <View style={styles.editChefInputBox} >
                            <TextInput style={styles.editChefTextBox} value={this.props.password_confirmation} placeholder="confirm password"  autoCapitalize="none" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password_confirmation")}/>
                        </View>
                    </View>
                </React.Fragment>
            )
        }

        renderNewPasswordButton = () => {
            return(
                <View style={styles.formRow}>
                    <TouchableOpacity style={styles.clearFiltersButton} activeOpacity={0.7} title="clearFilters" onPress={this.handleChangePasswordButton}>
                        <Icon style={styles.clearFiltersIcon} size={25} name='lock-open' />
                        <Text style={styles.clearFiltersButtonText}>Update{"\n"}password</Text>
                    </TouchableOpacity>
                </View>
            )
        }

        handleChangePasswordButton = () =>{
            this.setState({updatingPassword: true})
        }

        handleTextInput = (e, parameter) => {
        this.props.saveChefDetails(parameter, e.nativeEvent.text)
        }

        updateChef = (value, parameter) => {
        this.props.saveChefDetails(parameter, value)
        }

        cancelUpdate = () => {
            this.props.clearNewUserDetails()
            this.props.editingChef()
        }

        saveUpdatedChef = async() => {
            const chef = this.props.loggedInChef
            const updatedChef = await patchChef(chef.id, chef.auth_token, this.props.username, this.props.profile_text, this.props.country, this.state.updatingPassword, this.props.password, this.props.password_confirmation, this.props.imageBase64)
            if (updatedChef){
                // console.log(updatedChef)
                if (updatedChef.error){
                    this.setState({errors: updatedChef.message})
                } else {
                    if (this.state.stayingLoggedIn){
                        AsyncStorage.setItem('chef', JSON.stringify(updatedChef), () => {
                            AsyncStorage.getItem('chef', (err, res) => {
                            console.log(err)
                            this.props.updateLoggedInChefInState(updatedChef.id, updatedChef.username, updatedChef.auth_token, updatedChef.imageURL, updatedChef.is_admin, updatedChef.is_member)
                            this.props.clearNewUserDetails()
                            this.props.chefUpdated()
                            })
                        })
                    } else {
                        this.props.updateLoggedInChefInState(updatedChef.id, updatedChef.username, updatedChef.auth_token, updatedChef.imageURL, updatedChef.is_admin, updatedChef.is_member)
                        this.props.clearNewUserDetails()
                        this.props.chefUpdated()
                    }
                }
            }
        }

        render() {
            // console.log(this.props)
            return (
                <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.updateModalVisible}
                >
                    <View style={[styles.modalFullScreenContainer, {height: Dimensions.get('window').height,
                            width: Dimensions.get('window').width,
                            }]}>
                        {this.state.choosingPicture ? this.renderPictureChooser() : null}
                        <View style={[styles.contentsContainer, (Platform.OS === 'ios' ? {height: '75%'} : {height: '67%'})]}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>Update your profile & password</Text>
                            </View>
                            <View style={styles.formRow}>
                                <View style={styles.editChefInputBox}>
                                    <TextInput style={styles.editChefTextBox} value={this.props.username} placeholder="username"  autoCapitalize="none" onChange={(e) => this.handleTextInput(e, "username")}/>
                                </View>
                            </View>
                            <View style={styles.formRow}>
                                <View style={styles.editChefInputAreaBox} >
                                    <TextInput style={styles.editChefTextBox} value={this.props.profile_text} placeholder="about me" multiline={true} numberOfLines={3} onChange={(e) => this.handleTextInput(e, "profile_text")}/>
                                </View>
                            </View>
                            <View style={styles.formRow}>
                                <View picker style={styles.countryPicker} >
                                    {Platform.OS === 'ios' ? <Icon2 style={styles.iOSdropDownIcon} size={15} name='select-arrows' /> : null}
                                    <Picker style={styles.picker}
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    onValueChange={e => this.updateChef(e, "country")}
                                    selectedValue={this.props.country}
                                    >
                                    {/* <Picker.Item style={styles.pickerText} key={this.props.country} label={this.props.country} value={this.props.country} /> */}
                                        {this.countriesPicker()}
                                    </Picker>
                                </View>
                            </View>
                            {this.state.updatingPassword ? this.renderNewPasswordOptions() : null}
                            {!this.state.updatingPassword ? this.renderNewPasswordButton() : null}
                            {this.renderPasswordError()}
                            <View style={styles.formRow}>
                                <TouchableOpacity style={styles.clearFiltersButton} activeOpacity={0.7} title="change_picture" onPress={this.choosePicture}>
                                    <Icon style={styles.clearFiltersIcon} size={25} name='camera' />
                                    <Text style={styles.clearFiltersButtonText}>Update{"\n"}picture</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.formRow}>
                                <TouchableOpacity style={styles.clearFiltersButton} activeOpacity={0.7} title="clearFilters" onPress={this.cancelUpdate}>
                                    <Icon style={styles.clearFiltersIcon} size={25} name='cancel' />
                                    <Text style={styles.clearFiltersButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.applyFiltersButton} activeOpacity={0.7} title="applyFilters" onPress={this.saveUpdatedChef}>
                                    <Icon style={styles.applyFiltersIcon} size={25} name='check' />
                                    <Text style={styles.applyFiltersButtonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )
        }
    }
)