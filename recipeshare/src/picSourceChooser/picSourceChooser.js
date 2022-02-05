import React, { useState, useEffect } from 'react'
import { Modal, Text, View, TouchableOpacity, Platform, Image } from 'react-native'
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker'
import { styles } from './functionalComponentsStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import { ImageEditor } from "expo-image-editor";

export default function PicSourceChooser(props) {
	const [hasCameraRollPermission, setHasCameraRollPermission] = useState(false)
	const [hasCameraPermission, setHasCameraPermission] = useState(false)
	const [originalImage, setOriginalImage] = useState(null)
	const [imageEditorShowing, setImageEditorShowing] = useState(false)
	const [tempImageUri, setTempImageUri] = useState(null)

	useEffect(() => {
		async function checkPermissions () {
		let cameraRollPermission = await MediaLibrary.requestPermissionsAsync()
		let cameraPermission = await Camera.requestCameraPermissionsAsync()
		setHasCameraRollPermission(cameraRollPermission.granted)
		setHasCameraPermission(cameraPermission.granted)
		setOriginalImage(props.originalImage)
		}
		checkPermissions()
	},[])

	const pickImage = async () => {
		try {
			if (hasCameraRollPermission) {
				let image = await ImagePicker.launchImageLibraryAsync({
					presentationStyle: 0,
					allowsEditing: Platform.OS == 'android',
					aspect: [1, 1],
					base64: false
				})
				handleChosenImage(image)
			}
		} catch (e) {
			console.log(e)
		}
	}

	const openCamera = async () => {
		try {
			if (hasCameraPermission) {
				let image = await ImagePicker.launchCameraAsync({
					presentationStyle: 0,
					allowsEditing: Platform.OS == 'android',
					aspect: [1, 1],
					base64: false
				})
				handleChosenImage(image)
			}
		} catch (e) {
			console.log(e)
		}
	}

	const handleChosenImage = (image) => {
		if (image.error) {
			console.log(image.error)
		}
		if (Platform.OS == 'ios' && image.cancelled == false) {
			setTempImageUri(image.uri)
			setImageEditorShowing(true)
		} else {
			saveImage(image)
		}
	}

	const deleteImage = () => {
		let image = {
			cancelled: false,
			uri: ''
		}
		saveImage(image)
	}

	const cancel = async () => {
		await props.index !== undefined ? props.cancelChooseImage(originalImage, props.index) : props.cancelChooseImage(originalImage)
		await props.sourceChosen()
	}

	const photoCropped = () => {
		setImageEditorShowing(false)
	}

	const saveCroppedImage = (image) => {
		image = {
			...image,
			cancelled: false
		}
		saveImage(image)
	}

	const saveImage = (image) => {
		props.index !== undefined ? props.saveImage(image, props.index) : props.saveImage(image)
	}

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={true}
			onRequestClose={props.sourceChosen}
		>
			{imageEditorShowing && (
				<ImageEditor
					visible={true}
					onCloseEditor={() => photoCropped()}
					imageUri={tempImageUri}
					fixedCropAspectRatio={1 / 1}
					lockAspectRatio={true}
					minimumCropDimensions={{
						width: 100,
						height: 100,
					}}
					onEditingComplete={(result) => saveCroppedImage(result)}
					//allowedTransformOperations={['crop', 'rotate', 'flip']}
					//allowedAdjustmentOperations={[]}
					mode={"full"}
					//mode={'crop-only'}
				/>
			)}
			<View style={[styles.modalFullScreenContainer, { height: responsiveHeight(100), width: responsiveWidth(100) }]}>
				<View style={styles.picChooserModalContainer}>
					<View style={styles.picSourceChooserImage}>
						{props.imageSource !== '' ? (
							<Image style={{ height: '100%', width: '100%' }} source={{ uri: props.imageSource }} resizeMode={"cover"} />
						) : (
							<React.Fragment>
								<Icon style={styles.standardIcon} size={responsiveHeight(4)} name='camera' />
								<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>No photo{"\n"}chosen</Text>
							</React.Fragment>
						)}
					</View>
					<TouchableOpacity style={styles.picSourceChooserButton} activeOpacity={0.7} title="Take Photo" onPress={openCamera}>
						<Icon style={styles.standardIcon} size={responsiveHeight(4)} name='camera' />
						<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Take photo</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.picSourceChooserButton} activeOpacity={0.7} title="Choose Photo" onPress={pickImage}>
						<Icon style={styles.standardIcon} size={responsiveHeight(4)} name='camera-burst' />
						<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Choose photo</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.picSourceChooserButton} activeOpacity={0.7} title="Delete photo" onPress={deleteImage}>
						<Icon style={styles.standardIcon} size={responsiveHeight(4)} name='camera-burst' />
						<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Delete photo</Text>
					</TouchableOpacity>
					<View style={[styles.picSourceChooserArrowButtonContainer, { marginBottom: responsiveHeight(2) }]}>
						<TouchableOpacity style={[styles.picSourceChooserCancelButton, { backgroundColor: '#720000' }]} activeOpacity={0.7} title="Cancel" onPress={cancel}>
							<Icon style={styles.cancelIcon} size={responsiveHeight(4)} name='cancel' />
							<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserCancelButtonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.picSourceChooserCancelButton} activeOpacity={0.7} title="SaveAndClose" onPress={props.sourceChosen}>
							<Icon style={styles.cancelIcon} size={responsiveHeight(4)} name='check-box-outline' />
							<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserCancelButtonText}>Save &{"\n"}Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	)
}
