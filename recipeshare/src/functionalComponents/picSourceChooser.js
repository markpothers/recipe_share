import React from 'react'
import { Modal, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import { styles } from './functionalComponentsStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class PicSourceChooser extends React.PureComponent {

	state = {
		hasCameraRollPermission: false,
		hasCameraPermission: false
	}

	componentDidMount = () => {
		Permissions.askAsync(Permissions.CAMERA_ROLL)
			.then(permission => {
				this.setState({ hasCameraRollPermission: permission.status == 'granted' })
			})
		Permissions.askAsync(Permissions.CAMERA)
			.then(permission => {
				this.setState({ hasCameraPermission: permission.status == 'granted' })
			})
	}

	pickImage = async () => {
		if (this.state.hasCameraRollPermission == 'granted') {
			let image = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [4, 3],
				quality: 0.3,
				base64: true
			})
			this.props.index !== undefined ? this.props.saveImage(image, this.props.index) : this.props.saveImage(image)
		}
	}

	openCamera = async () => {
		if (this.state.hasCameraPermission == 'granted') {
			let image = await ImagePicker.launchCameraAsync({
				allowsEditing: true,
				aspect: [4, 3],
				quality: 0.3,
				base64: true
			})
			this.props.index !== undefined ? this.props.saveImage(image, this.props.index) : this.props.saveImage(image)
		}
	}

	deleteImage = () => {
		let image = {
			cancelled: false,
			base64: ''
		}
		this.props.index !== undefined ? this.props.saveImage(image, this.props.index) : this.props.saveImage(image)
	}

	render() {
		// console.log('pic chooser rendering')
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
							{this.props.imageSource !== 'data:image/jpeg;base64,' && (
								<Image style={{ height: '100%', width: '100%' }} source={{ uri: this.props.imageSource }} resizeMode={"cover"} />
							)}
							{this.props.imageSource === 'data:image/jpeg;base64,' && (
								<React.Fragment>
									<Icon style={styles.standardIcon} size={30} name='camera' />
									<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>No photo{"\n"}chosen</Text>
								</React.Fragment>
							)}
						</View>
						<TouchableOpacity style={styles.picSourceChooserButton} activeOpacity={0.7} title="Take Photo" onPress={this.openCamera}>
							<Icon style={styles.standardIcon} size={30} name='camera' />
							<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Take photo</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.picSourceChooserButton} activeOpacity={0.7} title="Choose Photo" onPress={this.pickImage}>
							<Icon style={styles.standardIcon} size={30} name='camera-burst' />
							<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Choose photo</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.picSourceChooserButton} activeOpacity={0.7} title="Delete photo" onPress={this.deleteImage}>
							<Icon style={styles.standardIcon} size={30} name='camera-burst' />
							<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Delete photo</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.picSourceChooserCancelButton} activeOpacity={0.7} title="Take Photo" onPress={this.props.sourceChosen}>
							<Icon style={styles.cancelIcon} size={30} name='check-box-outline' />
							<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserCancelButtonText}>Save & Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		)
	}
}
