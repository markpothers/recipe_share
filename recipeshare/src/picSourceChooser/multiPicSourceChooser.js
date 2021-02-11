import React from 'react'
import { Modal, Text, View, TouchableOpacity, Dimensions, Image, FlatList } from 'react-native'
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
		primaryImageFlatListWidth: 0,
	}

	componentDidMount = async () => {
		let cameraRollPermission = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
		let cameraPermission = await Permissions.askAsync(Permissions.CAMERA)
		await this.setState({
			hasCameraRollPermission: cameraRollPermission.permissions.mediaLibrary.granted,
			hasCameraPermission: cameraPermission.permissions.camera.granted,
			originalImages: [...this.props.imageSources]
		})
	}

	addPhoto = async () => {
		let newImages = [...this.props.imageSources.slice(0, this.state.imageIndex), { uri: '' }, ...this.props.imageSources.slice(this.state.imageIndex)]
		await this.props.saveImage(newImages)
	}

	pickImage = async () => {
		try {
			if (this.state.hasCameraRollPermission) {
				let image = await ImagePicker.launchImageLibraryAsync({
					allowsEditing: true,
					aspect: [4, 3],
					base64: false
				})
				if (image.error) {
					console.log(image.error)
				}
				let newImages = this.props.imageSources
				if (!image.cancelled) {
					newImages[this.state.imageIndex] = image
				}
				this.props.saveImage(newImages)
			}
		} catch (e) {
			console.log(e)
		}
	}

	openCamera = async () => {
		try {
			if (this.state.hasCameraPermission) {
				let image = await ImagePicker.launchCameraAsync({
					allowsEditing: true,
					aspect: [4, 3],
					base64: false
				})
				if (image.error) {
					console.log(image.error)
				}
				let newImages = this.props.imageSources
				if (!image.cancelled) {
					newImages[this.state.imageIndex] = image
				}
				this.props.saveImage(newImages)
			}
		} catch (e) {
			console.log(e)
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
		this.flatList.scrollToIndex({ index: newImageIndex })
	}

	moveRight = async () => {
		let thisImage = this.props.imageSources[this.state.imageIndex]
		let newImages = [...this.props.imageSources.slice(0, this.state.imageIndex), ...this.props.imageSources.slice(this.state.imageIndex + 1)]
		let newImageIndex = this.state.imageIndex < this.props.imageSources.length - 1 ? this.state.imageIndex + 1 : this.state.imageIndex
		newImages.splice(newImageIndex, 0, thisImage)
		await this.setState({ imageIndex: newImageIndex })
		await this.props.saveImage(newImages)
		this.flatList.scrollToIndex({ index: newImageIndex })
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

	renderPrimaryImage = (image) => {
		if (image.item.uri || image.item.image_url) {
			return (
				<Image
					style={{ height: responsiveHeight(34), width: responsiveWidth(80) - 2 }}
					source={{ uri: image.item.image_url ? image.item.image_url : image.item.uri }}
					resizeMode={"cover"}
				/>
			)
		} else {
			return (
				<View style={{ height: responsiveHeight(34), width: responsiveWidth(80) - 2, justifyContent: 'center', alignItems: 'center' }}>
					<Icon style={styles.standardIcon} size={responsiveHeight(4)} name='image' />
					<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>No image{"\n"}selected</Text>
				</View>
			)
		}
	}

	render() {
		let imageSources = this.props.imageSources
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
							<FlatList
								ref={ref => this.flatList = ref}
								style={{ flex: 1 }}
								horizontal={true}
								data={imageSources}
								renderItem={this.renderPrimaryImage}
								keyExtractor={(item, index) => index.toString()}
								pagingEnabled={true}
								onLayout={(event) => {
									var { x, y, width, height } = event.nativeEvent.layout //eslint-disable-line no-unused-vars
									this.setState({ primaryImageFlatListWidth: width })
								}}
								onScroll={e => {
									let nearestIndex = Math.round(e.nativeEvent.contentOffset.x / this.state.primaryImageFlatListWidth)
									if (nearestIndex != this.state.primaryImageDisplayedIndex) {
										this.setState({ imageIndex: nearestIndex })
									}
								}}
							/>
							<View style={styles.primaryImageBlobsContainer}>
								{imageSources.length > 1 && this.renderPrimaryImageBlobs()}
							</View>
						</View>
						<View style={styles.picSourceChooserArrowButtonContainer}>
							<TouchableOpacity style={styles.picSourceChooserArrowButton} activeOpacity={0.7} title="Sort left" onPress={this.moveLeft}>
								<Icon
									style={[
										styles.standardIcon,
										{
											transform: [
												{ rotateZ: "270deg" },
											]
										}
									]}
									size={responsiveHeight(4)}
									name='shuffle'
								/>
								<Text maxFontSizeMultiplier={1.5} style={[styles.picSourceChooserButtonText, { maxWidth: responsiveWidth(25) }]}>Sort left</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.picSourceChooserArrowButton} activeOpacity={0.7} title="Sort right" onPress={this.moveRight}>
								<Text maxFontSizeMultiplier={1.5} style={[styles.picSourceChooserButtonText, { maxWidth: responsiveWidth(25) }]}>Sort right</Text>
								<Icon
									style={[
										styles.standardIcon,
										{
											transform: [
												{ rotateZ: "270deg" },
												{ rotateX: "180deg" },
											]
										}
									]}
									size={responsiveHeight(4)}
									name='shuffle'
								/>
							</TouchableOpacity>
						</View>
						<View style={styles.picSourceChooserArrowButtonContainer}>
							<TouchableOpacity style={styles.picSourceChooserArrowButton} activeOpacity={0.7} title="Add slot" onPress={this.addPhoto}>
								<Icon style={styles.standardIcon} size={responsiveHeight(4)} name='image-plus' />
								<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Add slot</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.picSourceChooserArrowButton} activeOpacity={0.7} title="Delete" onPress={this.deleteImage}>
								<Icon style={styles.standardIcon} size={responsiveHeight(4)} name='image-off' />
								<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Delete</Text>
							</TouchableOpacity>
						</View>
						<TouchableOpacity style={styles.picSourceChooserButton} activeOpacity={0.7} title="Take Photo" onPress={this.openCamera}>
							<Icon style={styles.standardIcon} size={responsiveHeight(4)} name='camera' />
							<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Take photo</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.picSourceChooserButton} activeOpacity={0.7} title="Choose Photo" onPress={this.pickImage}>
							<Icon style={styles.standardIcon} size={responsiveHeight(4)} name='camera-image' />
							<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Choose photo</Text>
						</TouchableOpacity>
						<View style={[styles.picSourceChooserArrowButtonContainer, { marginBottom: responsiveHeight(2) }]}>
							<TouchableOpacity style={[styles.picSourceChooserCancelButton, { backgroundColor: '#720000' }]} activeOpacity={0.7} title="Cancel" onPress={this.cancel}>
								<Icon style={styles.cancelIcon} size={responsiveHeight(4)} name='cancel' />
								<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserCancelButtonText}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.picSourceChooserCancelButton} activeOpacity={0.7} title="SaveAndClose" onPress={this.props.sourceChosen}>
								<Icon style={styles.cancelIcon} size={responsiveHeight(4)} name='check-box-outline' />
								<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserCancelButtonText}>Save &{"\n"}Close</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		)
	}
}
