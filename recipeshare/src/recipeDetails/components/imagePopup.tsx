import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { InstructionImage, MakePic, MakePicChef, RecipeImage, SimpleChef } from "../../centralTypes";

import React from "react";
import { styles } from "../recipeDetailsStyleSheet";

type OwnProps = {
	chef: SimpleChef | MakePicChef;
	imageDetails: RecipeImage | MakePic | InstructionImage;
	close: () => void;
	navigateToChefDetails: (chefId: number) => void;
};

export function ImagePopup({ chef, imageDetails, close, navigateToChefDetails }: OwnProps) {
	const renderDate = () => {
		if (chef && imageDetails.created_at) {
			const createdDate = new Date(imageDetails.created_at);
			const dateParts = createdDate.toString().split(" ");
			const dateToDisplay = `${dateParts[1]} ${dateParts[2]}, ${dateParts[3]}`;
			return <Text maxFontSizeMultiplier={2}>{dateToDisplay}</Text>;
		}
	};

	return (
		<Modal animationType="fade" transparent={true} visible={true} style={{ backgroundColor: "red" }}>
			<TouchableOpacity style={styles.instructionImagePopupModalCover} onPress={close} activeOpacity={1}>
				<View style={styles.instructionImagePopupContainer}>
					{chef && (
						<React.Fragment>
							<View style={styles.chefContainer}>
								<View style={styles.chefLeftContainer}>
									<TouchableOpacity
										activeOpacity={0.7}
										onPress={() => navigateToChefDetails(chef.id)}
									>
										<Text maxFontSizeMultiplier={2} style={styles.chefUsername}>
											{chef.username}
										</Text>
									</TouchableOpacity>
									{renderDate()}
								</View>
								<TouchableOpacity onPress={() => navigateToChefDetails(chef.id)}>
									<AvatarImage chefimage_url={chef.image_url} />
								</TouchableOpacity>
							</View>
							<View style={styles.popupSeparator}></View>
						</React.Fragment>
					)}
					<Image
						style={styles.instructionPopupImage}
						source={{ uri: imageDetails.image_url }}
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
		return <Image style={styles.thumbnail} source={require("../../../assets/images/default-chef.jpg")} />;
	} else {
		return <Image style={styles.thumbnail} source={{ uri: URL }} />;
	}
}
