import React from "react";
import { Modal, View, Image, TouchableOpacity, Text } from "react-native";
import { styles } from "./recipeDetailsStyleSheet";

export function ImagePopup(props) {
	if (props.chef && props.imageDetails.created_at) {
		var createdDate = new Date(props.imageDetails.created_at);
		var dateParts = createdDate.toString().split(" ");
		var dateToDisplay = `${dateParts[1]} ${dateParts[2]}, ${dateParts[3]}`;
	}

	return (
		<Modal animationType="fade" transparent={true} visible={true} style={{ backgroundColor: "red" }}>
			<TouchableOpacity style={styles.instructionImagePopupModalCover} onPress={props.close} activeOpacity={1}>
				<View style={styles.instructionImagePopupContainer}>
					{props.chef && (
						<React.Fragment>
							<View style={styles.chefContainer}>
								<View style={styles.chefLeftContainer}>
									<TouchableOpacity
										style={styles.recipeCardTopLeftUpperContainer}
										activeOpacity={0.7}
										onPress={() => props.navigateToChefDetails(props.chef.id)}
									>
										<Text maxFontSizeMultiplier={2} style={styles.chefUsername}>
											{props.chef.username}
										</Text>
									</TouchableOpacity>
									<Text maxFontSizeMultiplier={2} style={styles.recipeCardHighlighted}>
										{dateToDisplay}
									</Text>
								</View>
								<TouchableOpacity
									style={styles.recipeCardTopRightContainer}
									onPress={() => props.navigateToChefDetails(props.chef.id)}
								>
									<AvatarImage chefimage_url={props.chef.image_url} />
								</TouchableOpacity>
							</View>
							<View style={styles.popupSeparator}></View>
						</React.Fragment>
					)}
					<Image
						style={styles.instructionPopupImage}
						source={{ uri: props.imageDetails.image_url }}
						resizeMode="cover"
					/>
				</View>
			</TouchableOpacity>
		</Modal>
	);
}

function AvatarImage(chefimage_url) {
	const URL = chefimage_url.chefimage_url;
	if (!URL) {
		return <Image style={styles.thumbnail} source={require("../dataComponents/default-chef.jpg")} />;
	} else {
		return <Image style={styles.thumbnail} source={{ uri: URL }} />;
	}
}
