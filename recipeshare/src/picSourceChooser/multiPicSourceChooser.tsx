import React, { useState, useEffect, useRef } from "react";
import { Modal, Text, View, TouchableOpacity, Dimensions, Image, FlatList, Platform, ListRenderItemInfo } from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { styles } from "./functionalComponentsStyleSheet";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { responsiveWidth, responsiveHeight, responsiveFontSize } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars
import { ImageEditor } from "expo-image-editor";
import { RecipeImage } from "../centralTypes";

export type ImageSource = RecipeImage | ImagePicker.ImagePickerResult

type OwnProps = {
	imageSources: ImageSource[];
	saveImages: (images: ImageSource[]) => void;
	sourceChosen: () => void;
};

export default function MultiPicSourceChooser(props: OwnProps) {
	const [hasCameraRollPermission, setHasCameraRollPermission] = useState<boolean>(false);
	const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);
	const [originalImages, setOriginalImages] = useState<ImageSource[]>(null);
	const [imageEditorShowing, setImageEditorShowing] = useState<boolean>(false);
	const [tempImageUri, setTempImageUri] = useState<string>(null);
	const [imageIndex, setImageIndex] = useState<number>(0);
	const [primaryImageFlatListWidth, setPrimaryImageFlatListWidth] = useState<number>(300);
	const primaryImageFlatList = useRef(null);

	useEffect(() => {
		async function checkPermissions() {
			const cameraRollPermission = await MediaLibrary.requestPermissionsAsync();
			const cameraPermission = await Camera.requestCameraPermissionsAsync();
			setHasCameraRollPermission(cameraRollPermission.granted);
			setHasCameraPermission(cameraPermission.granted);
		}
		checkPermissions();
		setOriginalImages([...props.imageSources]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // don't put a value in here, you don't want original image to be overwritten

	const addPhoto = async () => {
		const newImageIndex = imageIndex + 1;
		const newImages = [
			...props.imageSources.slice(0, newImageIndex),
			{ uri: "" },
			...props.imageSources.slice(newImageIndex),
		] as ImageSource[];
		setImageIndex(newImageIndex);
		await props.saveImages(newImages);
	};

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
				primaryImageFlatList.current.scrollToIndex({ index: imageIndex });
			}
		}, 0);
	}, [props.imageSources.length, imageIndex]);

	const pickImage = async () => {
		try {
			if (hasCameraRollPermission) {
				const image = await ImagePicker.launchImageLibraryAsync({
					allowsEditing: Platform.OS == "android",
					aspect: [4, 3],
					base64: false,
				});
				handleChosenImage(image);
			}
		} catch (e) {
			// console.log('fail')
			console.log(e);
		}
	};

	const openCamera = async () => {
		try {
			if (hasCameraPermission) {
				const image = await ImagePicker.launchCameraAsync({
					allowsEditing: Platform.OS == "android",
					aspect: [4, 3],
					base64: false,
				});
				handleChosenImage(image);
			}
		} catch (e) {
			console.log(e);
		}
	};

	const handleChosenImage = (image) => {
		if (image.error) {
			console.log(image.error);
		} else {
			if (Platform.OS == "ios" && image.cancelled == false) {
				setTempImageUri(image.uri);
				setImageEditorShowing(true);
			} else {
				const newImages = [...props.imageSources];
				if (!image.cancelled) {
					newImages[imageIndex] = image;
				}
				props.saveImages(newImages);
			}
		}
	};

	const deleteImage = () => {
		if (props.imageSources.length == 1) {
			//go back to completely empty list of images
			setImageIndex(0);
			props.saveImages([{ uri: "" }] as ImageSource[]);
			primaryImageFlatList.current.scrollToIndex({ index: 0 });
		} else {
			const newImages = [...props.imageSources];
			newImages.splice(imageIndex, 1);
			const newImageIndex = imageIndex > newImages.length - 1 ? newImages.length - 1 : imageIndex;
			setImageIndex(newImageIndex);
			props.saveImages(newImages);
			primaryImageFlatList.current.scrollToIndex({ index: newImageIndex });
		}
	};

	const moveLeft = async () => {
		const thisImage = props.imageSources[imageIndex];
		const newImages = [...props.imageSources.slice(0, imageIndex), ...props.imageSources.slice(imageIndex + 1)];
		const newImageIndex = imageIndex > 0 ? imageIndex - 1 : 0;
		newImages.splice(newImageIndex, 0, thisImage);
		setImageIndex(newImageIndex);
		await props.saveImages(newImages);
		primaryImageFlatList.current.scrollToIndex({ index: newImageIndex });
	};

	const moveRight = async () => {
		const thisImage = props.imageSources[imageIndex];
		const newImages = [...props.imageSources.slice(0, imageIndex), ...props.imageSources.slice(imageIndex + 1)];
		const newImageIndex = imageIndex < props.imageSources.length - 1 ? imageIndex + 1 : imageIndex;
		newImages.splice(newImageIndex, 0, thisImage);
		setImageIndex(newImageIndex);
		await props.saveImages(newImages);
		primaryImageFlatList.current.scrollToIndex({ index: newImageIndex });
	};

	const renderPrimaryImageBlobs = () => {
		return props.imageSources.map((image, index) => {
			if (imageIndex == index) {
				return (
					<Icon
						key={index.toString()}
						name={"checkbox-blank-circle"}
						size={responsiveHeight(3)}
						style={styles.primaryImageBlob}
					/>
				);
			} else {
				return (
					<Icon
						key={index.toString()}
						name={"checkbox-blank-circle-outline"}
						size={responsiveHeight(3)}
						style={styles.primaryImageBlob}
					/>
				);
			}
		});
	};

	const cancel = () => {
		props.saveImages(originalImages);
		props.sourceChosen();
	};

	const renderPrimaryImage = (image: ListRenderItemInfo<ImageSource>) => {
		if (("uri" in image.item && image.item.uri !== "") || "image_url" in image.item) {
			return (
				<Image
					style={{ height: "100%", width: responsiveWidth(80) - 2 }}
					source={{ uri: "image_url" in image.item ? image.item.image_url : image.item.uri }}
					resizeMode={"cover"}
				/>
			);
		} else {
			return (
				<View
					style={{
						height: "100%",
						width: responsiveWidth(80) - 2,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Icon style={styles.standardIcon} size={responsiveHeight(4)} name="image" />
					<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>
						No image{"\n"}selected
					</Text>
				</View>
			);
		}
	};

	const photoCropped = () => {
		setImageEditorShowing(false);
	};

	const saveCroppedImage = (image: ImagePicker.ImagePickerResult) => {
		const newImage = {
			...image,
			cancelled: false,
		};
		const newImages = props.imageSources;
		newImages[imageIndex] = newImage as ImageSource;
		props.saveImages(newImages);
	};

	const { imageSources } = props;
	return (
		<Modal animationType="fade" transparent={true} visible={true} onRequestClose={props.sourceChosen}>
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
			<View
				style={[
					styles.modalFullScreenContainer,
					{ height: Dimensions.get("window").height, width: Dimensions.get("window").width },
				]}
			>
				<View style={styles.picChooserModalContainer}>
					<View style={[styles.picSourceChooserImage, { height: responsiveWidth(60) }]}>
						{imageSources.length > 0 ? (
							<FlatList
								testID="multiPicFlatList"
								ref={primaryImageFlatList}
								style={{ flex: 1 }}
								horizontal={true}
								data={imageSources}
								renderItem={(image) => {
									if (imageSources.length > 0) {
										return renderPrimaryImage(image);
									} else {
										return (
											<View
												style={{
													height: responsiveHeight(60),
													width: responsiveWidth(80) - 2,
													justifyContent: "center",
													alignItems: "center",
												}}
											>
												<Icon
													style={styles.standardIcon}
													size={responsiveHeight(4)}
													name="image"
												/>
												<Text
													maxFontSizeMultiplier={1.5}
													style={styles.picSourceChooserButtonText}
												>
													No image{"\n"}selected
												</Text>
											</View>
										);
									}
								}}
								keyExtractor={(item, index) => index.toString()}
								pagingEnabled={true}
								onLayout={(event) => {
									const { x, y, width, height } = event.nativeEvent.layout; //eslint-disable-line no-unused-vars
									setPrimaryImageFlatListWidth(width);
								}}
								onScroll={(e) => {
									const nearestIndex = Math.round(
										e.nativeEvent.contentOffset.x / primaryImageFlatListWidth
									);
									//if (nearestIndex != primaryImageDisplayedIndex) {
									setImageIndex(nearestIndex);
									//}
								}}
								getItemLayout={(data, index) => ({
									length: responsiveWidth(80) - 2,
									offset: (responsiveWidth(80) - 2) * index,
									index,
								})}
								onScrollToIndexFailed={() => {
									// console.log('the error')
									// console.log(error)
								}}
							/>
						) : (
							<View
								style={{
									height: "100%",
									width: responsiveWidth(80) - 2,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Icon style={styles.standardIcon} size={responsiveHeight(4)} name="image" />
								<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>
									No image{"\n"}selected
								</Text>
							</View>
						)}
						<View style={styles.primaryImageBlobsContainer}>
							{imageSources.length > 1 && renderPrimaryImageBlobs()}
						</View>
					</View>
					<View style={styles.picSourceChooserArrowButtonContainer}>
						<TouchableOpacity
							style={styles.picSourceChooserArrowButton}
							activeOpacity={0.7}
							onPress={moveLeft}
						>
							<Icon
								style={[
									styles.standardIcon,
									{
										transform: [{ rotateZ: "270deg" }],
									},
								]}
								size={responsiveHeight(4)}
								name="shuffle"
							/>
							<Text
								maxFontSizeMultiplier={1.5}
								style={[styles.picSourceChooserButtonText, { maxWidth: responsiveWidth(25) }]}
							>
								Sort left
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.picSourceChooserArrowButton}
							activeOpacity={0.7}
							onPress={moveRight}
						>
							<Text
								maxFontSizeMultiplier={1.5}
								style={[styles.picSourceChooserButtonText, { maxWidth: responsiveWidth(25) }]}
							>
								Sort right
							</Text>
							<Icon
								style={[
									styles.standardIcon,
									{
										transform: [{ rotateZ: "270deg" }, { rotateX: "180deg" }],
									},
								]}
								size={responsiveHeight(4)}
								name="shuffle"
							/>
						</TouchableOpacity>
					</View>
					<View style={styles.picSourceChooserArrowButtonContainer}>
						<TouchableOpacity
							style={styles.picSourceChooserArrowButton}
							activeOpacity={0.7}
							onPress={addPhoto}
						>
							<Icon style={styles.standardIcon} size={responsiveHeight(4)} name="image-plus" />
							<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>
								Add slot
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.picSourceChooserArrowButton}
							activeOpacity={0.7}
							onPress={deleteImage}
						>
							<Icon style={styles.standardIcon} size={responsiveHeight(4)} name="image-off" />
							<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>
								Delete
							</Text>
						</TouchableOpacity>
					</View>
					{hasCameraPermission && (
						<TouchableOpacity
							style={styles.picSourceChooserButton}
							activeOpacity={0.7}
							onPress={openCamera}
						>
							<Icon style={styles.standardIcon} size={responsiveHeight(4)} name="camera" />
							<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>
								Take photo
							</Text>
						</TouchableOpacity>
					)}
					{hasCameraRollPermission && (
						<TouchableOpacity style={styles.picSourceChooserButton} activeOpacity={0.7} onPress={pickImage}>
							<Icon style={styles.standardIcon} size={responsiveHeight(4)} name="camera-image" />
							<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>
								Choose photo
							</Text>
						</TouchableOpacity>
					)}
					<View style={[styles.picSourceChooserArrowButtonContainer, { marginBottom: responsiveHeight(2) }]}>
						<TouchableOpacity
							style={[styles.picSourceChooserCancelButton, { backgroundColor: "#720000" }]}
							activeOpacity={0.7}
							onPress={cancel}
						>
							<Icon style={styles.cancelIcon} size={responsiveHeight(4)} name="cancel" />
							<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserCancelButtonText}>
								Cancel
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.picSourceChooserCancelButton}
							activeOpacity={0.7}
							onPress={props.sourceChosen}
						>
							<Icon style={styles.cancelIcon} size={responsiveHeight(4)} name="check" />
							<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserCancelButtonText}>
								Save &amp;{"\n"}Close
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
