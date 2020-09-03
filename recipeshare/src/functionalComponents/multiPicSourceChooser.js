import React from 'react'
import { Modal, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import { styles } from './functionalComponentsStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

export default class MultiPicSourceChooser extends React.Component {

	state = {
		hasCameraRollPermission: false,
		hasCameraPermission: false,
		imageIndex: 0,
		originalImages: null,
	}

	componentDidMount = () => {
		Permissions.askAsync(Permissions.CAMERA_ROLL)
			.then(permission => {
				this.setState({ hasCameraRollPermission: permission.permissions.cameraRoll.granted })
			})
		Permissions.askAsync(Permissions.CAMERA)
			.then(permission => {
				this.setState({ hasCameraPermission: permission.permissions.camera.granted })
			})
		this.setState({ originalImages: this.props.imageSources })
	}

	addPhoto = async () => {
		let newImages = [...this.props.imageSources.slice(0, this.state.imageIndex), { uri: '' }, ...this.props.imageSources.slice(this.state.imageIndex)]
		await this.props.saveImage(newImages)
	}

	pickImage = async () => {
		if (this.state.hasCameraRollPermission) {
			let image = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [4, 3],
				base64: false
			})
			let newImages = this.props.imageSources
			if (image.cancelled) {
				newImages[this.state.imageIndex] = { uri: '' }
			} else {
				newImages[this.state.imageIndex] = image
			}
			this.props.saveImage(newImages)
		}
	}

	openCamera = async () => {
		if (this.state.hasCameraPermission) {
			let image = await ImagePicker.launchCameraAsync({
				allowsEditing: true,
				aspect: [4, 3],
				base64: false
			})
			let newImages = this.props.imageSources
			if (image.cancelled) {
				newImages[this.state.imageIndex] = { uri: '' }
			} else {
				newImages[this.state.imageIndex] = image
			}
			this.props.saveImage(newImages)
		}
	}

	deleteImage = async () => {
		if (this.props.imageSources.length == 1) { //go back to completely empty list of images
			await this.setState({ imageIndex: 0 })
			await this.props.saveImage([{ uri: '' }])
		} else {
			let newImages = this.props.imageSources
			newImages.splice(this.state.imageIndex, 1)
			await this.setState({ imageIndex: this.state.imageIndex > newImages.length - 1 ? newImages.length - 1 : this.state.imageIndex })
			await this.props.saveImage(newImages)
		}
	}

	moveLeft = async () => {
		let thisImage = this.props.imageSources[this.state.imageIndex]
		let newImages = [...this.props.imageSources.slice(0, this.state.imageIndex), ...this.props.imageSources.slice(this.state.imageIndex + 1)]
		let newImageIndex = this.state.imageIndex > 0 ? this.state.imageIndex - 1 : 0
		newImages.splice(newImageIndex, 0, thisImage)
		await this.setState({ imageIndex: newImageIndex })
		await this.props.saveImage(newImages)
	}

	moveRight = async () => {
		let thisImage = this.props.imageSources[this.state.imageIndex]
		let newImages = [...this.props.imageSources.slice(0, this.state.imageIndex), ...this.props.imageSources.slice(this.state.imageIndex + 1)]
		let newImageIndex = this.state.imageIndex < this.props.imageSources.length - 1 ? this.state.imageIndex + 1 : this.state.imageIndex
		newImages.splice(newImageIndex, 0, thisImage)
		await this.setState({ imageIndex: newImageIndex })
		await this.props.saveImage(newImages)
	}

	renderPrimaryImageBlobs = () => {
		return this.props.imageSources.map((image, index) => {
			if (this.state.imageIndex == index) {
				return <Icon key={index.toString()} name={'checkbox-blank-circle'} size={responsiveHeight(3)} style={styles.primaryImageBlob} />
			} else {
				return <Icon key={index.toString()} name={'checkbox-blank-circle-outline'} size={responsiveHeight(3)} style={styles.primaryImageBlob} />
			}
		})
	}

	cancel = async () => {
		await this.props.saveImage(this.state.originalImages)
		await this.props.sourceChosen()
	}

	render() {
		let imageSources = this.props.imageSources
		// console.log(this.props.imageSources)
		return (
			<Modal
				animationType="fade"
				transparent={true}
				visible={true}
				onRequestClose={this.props.sourceChosen}
			>
				<View style={[styles.modalFullScreenContainer, { height: Dimensions.get('window').height, width: Dimensions.get('window').width }]}>
					<View style={styles.picChooserModalContainer}>
						<View style={styles.picSourceChooserImage}>
							{(imageSources[this.state.imageIndex].uri || imageSources[this.state.imageIndex].image_url) ? (
								<Image
									style={{ height: '100%', width: '100%' }}
									source={{ uri: this.props.imageSources[this.state.imageIndex]?.image_url ? this.props.imageSources[this.state.imageIndex].image_url : this.props.imageSources[this.state.imageIndex].uri }}
									resizeMode={"cover"}
								/>
							) : (
									<React.Fragment>
										<Icon style={styles.standardIcon} size={30} name='image' />
										<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>No image{"\n"}selected</Text>
									</React.Fragment>
								)}
							<View style={styles.primaryImageBlobsContainer}>
								{imageSources.length > 1 && this.renderPrimaryImageBlobs()}
							</View>
						</View>
						<View style={styles.picSourceChooserArrowButtonContainer}>
							<TouchableOpacity style={styles.picSourceChooserArrowButton} activeOpacity={0.7} title="Previous" onPress={() => this.state.imageIndex > 0 ? this.setState({ imageIndex: this.state.imageIndex - 1 }) : null}>
								<Icon style={styles.standardIcon} size={30} name='arrow-left' />
								<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Previous</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.picSourceChooserArrowButton} activeOpacity={0.7} title="Next" onPress={() => this.state.imageIndex < this.props.imageSources.length - 1 ? this.setState({ imageIndex: this.state.imageIndex + 1 }) : null}>
								<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Next</Text>
								<Icon style={styles.standardIcon} size={30} name='arrow-right' />
							</TouchableOpacity>
						</View>
						<View style={styles.picSourceChooserArrowButtonContainer}>
							<TouchableOpacity style={styles.picSourceChooserArrowButton} activeOpacity={0.7} title="Move left" onPress={this.moveLeft}>
								<Icon style={styles.standardIcon} size={30} name='arrow-collapse-left' />
								{/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1, maxWidth: '70%'}}> */}
								<Text maxFontSizeMultiplier={1.5} style={[styles.picSourceChooserButtonText, { maxWidth: responsiveWidth(25) }]}>Move left</Text>
								{/* </View> */}
							</TouchableOpacity>
							<TouchableOpacity style={styles.picSourceChooserArrowButton} activeOpacity={0.7} title="Move right" onPress={this.moveRight}>
								<Text maxFontSizeMultiplier={1.5} style={[styles.picSourceChooserButtonText, { maxWidth: responsiveWidth(25) }]}>Move right</Text>
								<Icon style={styles.standardIcon} size={30} name='arrow-collapse-right' />
							</TouchableOpacity>
						</View>
						<View style={styles.picSourceChooserArrowButtonContainer}>
							<TouchableOpacity style={styles.picSourceChooserArrowButton} activeOpacity={0.7} title="Add" onPress={this.addPhoto}>
								<Icon style={styles.standardIcon} size={30} name='image-plus' />
								<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Add</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.picSourceChooserArrowButton} activeOpacity={0.7} title="Delete" onPress={this.deleteImage}>
								<Icon style={styles.standardIcon} size={30} name='image-off' />
								<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Delete</Text>
							</TouchableOpacity>
						</View>
						<TouchableOpacity style={styles.picSourceChooserButton} activeOpacity={0.7} title="Take Photo" onPress={this.openCamera}>
							<Icon style={styles.standardIcon} size={30} name='camera' />
							<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Take photo</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.picSourceChooserButton} activeOpacity={0.7} title="Choose Photo" onPress={this.pickImage}>
							<Icon style={styles.standardIcon} size={30} name='camera-image' />
							<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Choose photo</Text>
						</TouchableOpacity>
						<View style={[styles.picSourceChooserArrowButtonContainer, { marginBottom: responsiveHeight(2) }]}>
							<TouchableOpacity style={[styles.picSourceChooserCancelButton, { backgroundColor: '#720000' }]} activeOpacity={0.7} title="Cancel" onPress={this.cancel}>
								<Icon style={styles.cancelIcon} size={30} name='cancel' />
								<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserCancelButtonText}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.picSourceChooserCancelButton} activeOpacity={0.7} title="SaveAndClose" onPress={this.props.sourceChosen}>
								<Icon style={styles.cancelIcon} size={30} name='check-box-outline' />
								<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserCancelButtonText}>Save &{"\n"}Close</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		)
	}
}
