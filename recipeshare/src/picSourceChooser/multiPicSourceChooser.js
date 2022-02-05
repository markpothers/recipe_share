import React, { useState, useEffect, useRef } from 'react'
import { Modal, Text, View, TouchableOpacity, Dimensions, Image, FlatList, Platform } from 'react-native'
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker'
import { styles } from './functionalComponentsStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import { ImageEditor } from "expo-image-editor";

export default function MultiPicSourceChooser(props) {
	const [hasCameraRollPermission, setHasCameraRollPermission] = useState(false)
	const [hasCameraPermission, setHasCameraPermission] = useState(false)
	const [originalImages, setOriginalImages] = useState(null)
	const [imageEditorShowing, setImageEditorShowing] = useState(false)
	const [tempImageUri, setTempImageUri] = useState(null)
	const [imageIndex, setImageIndex] = useState(0)
	const [primaryImageFlatListWidth, setPrimaryImageFlatListWidth] = useState(0)
	const primaryImageFlatList = useRef(null)

	useEffect(() => {
		async function checkPermissions() {
			let cameraRollPermission = await MediaLibrary.requestPermissionsAsync()
			let cameraPermission = await Camera.requestCameraPermissionsAsync()
			setHasCameraRollPermission(cameraRollPermission.granted)
			setHasCameraPermission(cameraPermission.granted)
		}
		checkPermissions()
		setOriginalImages([...props.imageSources])
	}, [])

	const addPhoto = async () => {
		let newImageIndex = imageIndex + 1
		let newImages = [...props.imageSources.slice(0, newImageIndex), { uri: '' }, ...props.imageSources.slice(newImageIndex)]
		setImageIndex(newImageIndex)
		await props.saveImages(newImages)
	}

	// after adding a new slot to the end, this function calls to scroll to it
	// it can only happen after a re-render and for some reason doesn't work without the timeout
	// i guess the ref.current isn't updated until it's re-rendered
	// by putting in a timeout of zero it goes to the back of the scheduling queue and happens after the ref is updated, I think
	// by monitoring length it only happens on add or delete image and since delete doesn't change image index,
	// it only does anything on add
	// the if statement prevents scrolling when repeated taps mean the timeout and what's rendered have got out of sync
	useEffect(() => {
		setTimeout(() => {
			if (primaryImageFlatList.current?.props.data.length == props.imageSources.length) {
				primaryImageFlatList.current.scrollToIndex({ index: imageIndex })
			}
		}, 0)
	}, [props.imageSources.length])

	const pickImage = async () => {
		try {
			if (hasCameraRollPermission) {
				let image = await ImagePicker.launchImageLibraryAsync({
					presentationStyle: 0,
					allowsEditing: Platform.OS == 'android',
					aspect: [4, 3],
					base64: false
				})
				handleChosenImage(image)
			}
		} catch (e) {
			// console.log('fail')
			console.log(e)
		}
	}

	const openCamera = async () => {
		try {
			if (hasCameraPermission) {
				let image = await ImagePicker.launchCameraAsync({
					presentationStyle: 0,
					allowsEditing: Platform.OS == 'android',
					aspect: [4, 3],
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
		} else {
			if (Platform.OS == 'ios' && image.cancelled == false) {
				setTempImageUri(image.uri)
				setImageEditorShowing(true)
			} else {
				let newImages = [...props.imageSources]
				if (!image.cancelled) {
					newImages[imageIndex] = image
				}
				props.saveImages(newImages)
			}
		}
	}

	const deleteImage = () => {
		if (props.imageSources.length == 1) { //go back to completely empty list of images
			setImageIndex(0)
			props.saveImages([{ uri: '' }])
			primaryImageFlatList.current.scrollToIndex({ index: 0 })
		} else {
			let newImages = [...props.imageSources]
			newImages.splice(imageIndex, 1)
			let newImageIndex = imageIndex > newImages.length - 1 ? newImages.length - 1 : imageIndex
			setImageIndex(newImageIndex)
			props.saveImages(newImages)
			primaryImageFlatList.current.scrollToIndex({ index: newImageIndex })
		}
	}

	const moveLeft = async () => {
		let thisImage = props.imageSources[imageIndex]
		let newImages = [...props.imageSources.slice(0, imageIndex), ...props.imageSources.slice(imageIndex + 1)]
		let newImageIndex = imageIndex > 0 ? imageIndex - 1 : 0
		newImages.splice(newImageIndex, 0, thisImage)
		setImageIndex(newImageIndex)
		await props.saveImages(newImages)
		primaryImageFlatList.current.scrollToIndex({ index: newImageIndex })
	}

	const moveRight = async () => {
		let thisImage = props.imageSources[imageIndex]
		let newImages = [...props.imageSources.slice(0, imageIndex), ...props.imageSources.slice(imageIndex + 1)]
		let newImageIndex = imageIndex < props.imageSources.length - 1 ? imageIndex + 1 : imageIndex
		newImages.splice(newImageIndex, 0, thisImage)
		setImageIndex(newImageIndex)
		await props.saveImages(newImages)
		primaryImageFlatList.current.scrollToIndex({ index: newImageIndex })
	}

	const renderPrimaryImageBlobs = () => {
		return props.imageSources.map((image, index) => {
			if (imageIndex == index) {
				return <Icon key={index.toString()} name={'checkbox-blank-circle'} size={responsiveHeight(3)} style={styles.primaryImageBlob} />
			} else {
				return <Icon key={index.toString()} name={'checkbox-blank-circle-outline'} size={responsiveHeight(3)} style={styles.primaryImageBlob} />
			}
		})
	}

	const cancel = async () => {
		await props.saveImages(originalImages)
		props.sourceChosen()
	}

	const renderPrimaryImage = (image) => {
		if (image.item.uri || image.item.image_url) {
			return (
				<Image
					style={{ height: '100%', width: responsiveWidth(80) - 2 }}
					source={{ uri: image.item.image_url ? image.item.image_url : image.item.uri }}
					resizeMode={"cover"}
				/>
			)
		} else {
			return (
				<View style={{ height: '100%', width: responsiveWidth(80) - 2, justifyContent: 'center', alignItems: 'center' }}>
					<Icon style={styles.standardIcon} size={responsiveHeight(4)} name='image' />
					<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>No image{"\n"}selected</Text>
				</View>
			)
		}
	}

	const photoCropped = () => {
		setImageEditorShowing(false)
	}

	const saveCroppedImage = (image) => {
		image = {
			...image,
			cancelled: false
		}
		let newImages = props.imageSources
		newImages[imageIndex] = image
		props.saveImages(newImages)
	}

	let imageSources = props.imageSources
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
					fixedCropAspectRatio={4 / 3}
					lockAspectRatio={true}
					minimumCropDimensions={{
						width: 100,
						height: 75,
					}}
					onEditingComplete={(result) => saveCroppedImage(result)}
					//allowedTransformOperations={['crop', 'rotate', 'flip']}
					//allowedAdjustmentOperations={[]}
					mode={"full"}
				//mode={'crop-only'}
				/>
			)}
			<View style={[styles.modalFullScreenContainer, { height: Dimensions.get('window').height, width: Dimensions.get('window').width }]}>
				<View style={styles.picChooserModalContainer}>
					<View style={[styles.picSourceChooserImage, { height: responsiveWidth(60) }]}>
						{imageSources.length > 0 ? (
							<FlatList
								ref={primaryImageFlatList}
								style={{ flex: 1 }}
								horizontal={true}
								data={imageSources}
								renderItem={(image) => {
									if (imageSources.length > 0) {
										return renderPrimaryImage(image)
									} else {
										return (
											<View style={{ height: responsiveHeight(60), width: responsiveWidth(80) - 2, justifyContent: 'center', alignItems: 'center' }}>
												<Icon style={styles.standardIcon} size={responsiveHeight(4)} name='image' />
												<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>No image{"\n"}selected</Text>
											</View>
										)
									}
								}}
								keyExtractor={(item, index) => index.toString()}
								pagingEnabled={true}
								onLayout={(event) => {
									var { x, y, width, height } = event.nativeEvent.layout //eslint-disable-line no-unused-vars
									setPrimaryImageFlatListWidth(width)
								}}
								onScroll={e => {
									let nearestIndex = Math.round(e.nativeEvent.contentOffset.x / primaryImageFlatListWidth)
									//if (nearestIndex != primaryImageDisplayedIndex) {
									setImageIndex(nearestIndex)
									//}
								}}
								getItemLayout={(data, index) => ({ length: responsiveWidth(80) - 2, offset: (responsiveWidth(80) - 2) * index, index })}
								onScrollToIndexFailed={() => {
									// console.log('the error')
									// console.log(error)
								}}
							/>) : (
							<View style={{ height: '100%', width: responsiveWidth(80) - 2, justifyContent: 'center', alignItems: 'center' }}>
								<Icon style={styles.standardIcon} size={responsiveHeight(4)} name='image' />
								<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>No image{"\n"}selected</Text>
							</View>
						)}
						<View style={styles.primaryImageBlobsContainer}>
							{imageSources.length > 1 && renderPrimaryImageBlobs()}
						</View>
					</View>
					<View style={styles.picSourceChooserArrowButtonContainer}>
						<TouchableOpacity style={styles.picSourceChooserArrowButton} activeOpacity={0.7} title="Sort left" onPress={moveLeft}>
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
						<TouchableOpacity style={styles.picSourceChooserArrowButton} activeOpacity={0.7} title="Sort right" onPress={moveRight}>
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
						<TouchableOpacity style={styles.picSourceChooserArrowButton} activeOpacity={0.7} title="Add slot" onPress={addPhoto}>
							<Icon style={styles.standardIcon} size={responsiveHeight(4)} name='image-plus' />
							<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Add slot</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.picSourceChooserArrowButton} activeOpacity={0.7} title="Delete" onPress={deleteImage}>
							<Icon style={styles.standardIcon} size={responsiveHeight(4)} name='image-off' />
							<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Delete</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity style={styles.picSourceChooserButton} activeOpacity={0.7} title="Take Photo" onPress={openCamera}>
						<Icon style={styles.standardIcon} size={responsiveHeight(4)} name='camera' />
						<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Take photo</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.picSourceChooserButton} activeOpacity={0.7} title="Choose Photo" onPress={pickImage}>
						<Icon style={styles.standardIcon} size={responsiveHeight(4)} name='camera-image' />
						<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>Choose photo</Text>
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
