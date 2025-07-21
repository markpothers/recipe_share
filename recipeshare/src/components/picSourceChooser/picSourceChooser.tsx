import * as ImagePicker from "expo-image-picker";

import { Image, Modal, Platform, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ImageEditor } from "expo-image-editor";
import { styles } from "./functionalComponentsStyleSheet";

// Patch PicSourceChooser to accept string ids for index, and update all usages to treat index as string | undefined.
type OwnProps = {
	index?: string;
	imageSource: string;
	cancelChooseImage: (image: string, id?: string) => void;
	saveImage: (image: ImagePicker.ImagePickerAsset, id?: string) => void;
	sourceChosen: () => void;
};

export default function PicSourceChooser(props: OwnProps) {
	const [originalImage, setOriginalImage] = useState<string>(null);
	const [imageEditorShowing, setImageEditorShowing] = useState<boolean>(false);
	const [tempImageUri, setTempImageUri] = useState<string>(null);

	useEffect(() => {
		setOriginalImage(props.imageSource);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // don't fix this lint error. You don't want original image to get updated, which it would.

	const pickImage = async () => {
		try {
			const image = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: Platform.OS == "android",
				aspect: [1, 1],
				base64: false,
			});
			handleChosenImage(image);
		} catch (e) {
			console.log(e);
		}
	};

	const openCamera = async () => {
		try {
			// Request camera permissions first
			const { status } = await ImagePicker.requestCameraPermissionsAsync();
			if (status !== "granted") {
				alert("Sorry, we need camera permissions to take photos!");
				return;
			}

			const image = await ImagePicker.launchCameraAsync({
				allowsEditing: Platform.OS == "android",
				aspect: [1, 1],
				base64: false,
			});
			handleChosenImage(image);
		} catch (e) {
			console.log(e);
		}
	};

	const handleChosenImage = (image: ImagePicker.ImagePickerResult) => {
		// if ("error" in image) {
		// console.log(image.error);
		// }
		if (image.assets && image.assets.length > 0) {
			if (Platform.OS == "ios" && image.canceled == false) {
				setTempImageUri(image.assets[0].uri);
				setImageEditorShowing(true);
			} else {
				saveImage(image.assets[0]);
			}
		}
	};

	const deleteImage = () => {
		const image = { uri: "", width: 0, height: 0 };
		saveImage(image as ImagePicker.ImagePickerAsset);
	};

	const cancel = () => {
		if (props.index !== undefined) {
			props.cancelChooseImage(originalImage, props.index);
		} else {
			props.cancelChooseImage(originalImage);
		}
		props.sourceChosen();
	};

	const photoCropped = () => {
		setImageEditorShowing(false);
	};

	const saveCroppedImage = (image) => {
		image = {
			...image,
			canceled: false,
		};
		saveImage(image);
	};

	const saveImage = (image: ImagePicker.ImagePickerAsset) => {
		if (props.index !== undefined) {
			props.saveImage(image, props.index);
		} else {
			props.saveImage(image);
		}
	};

	return (
		<Modal animationType="fade" transparent={true} visible={true} onRequestClose={props.sourceChosen}>
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
			<View
				style={[
					styles.modalFullScreenContainer,
					{ height: responsiveHeight(100), width: responsiveWidth(100) },
				]}
			>
				<View style={styles.picChooserModalContainer}>
					<View style={styles.picSourceChooserImage}>
						{props.imageSource !== "" ? (
							<Image
								style={{ height: "100%", width: "100%" }}
								source={{ uri: props.imageSource }}
								resizeMode={"cover"}
							/>
						) : (
							<React.Fragment>
								<Icon style={styles.standardIcon} size={responsiveHeight(4)} name="camera" />
								<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>
									No photo{"\n"}chosen
								</Text>
							</React.Fragment>
						)}
					</View>
					<TouchableOpacity style={styles.picSourceChooserButton} activeOpacity={0.7} onPress={openCamera}>
						<Icon style={styles.standardIcon} size={responsiveHeight(4)} name="camera" />
						<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>
							Take photo
						</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.picSourceChooserButton} activeOpacity={0.7} onPress={pickImage}>
						<Icon style={styles.standardIcon} size={responsiveHeight(4)} name="camera-burst" />
						<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>
							Choose photo
						</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.picSourceChooserButton} activeOpacity={0.7} onPress={deleteImage}>
						<Icon style={styles.standardIcon} size={responsiveHeight(4)} name="camera-burst" />
						<Text maxFontSizeMultiplier={1.5} style={styles.picSourceChooserButtonText}>
							Delete photo
						</Text>
					</TouchableOpacity>
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
