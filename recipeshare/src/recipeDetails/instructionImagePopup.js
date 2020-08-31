import React from 'react'
import { Modal, View, Image, TouchableOpacity, Text } from 'react-native'
import { styles } from './recipeDetailsStyleSheet'

export function InstructionImagePopup(props) {

	var createdDate = new Date(props.makePic.created_at)
	var dateParts = createdDate.toString().split(' ')
	var dateToDisplay = `${dateParts[1]} ${dateParts[2]}, ${dateParts[3]}`
	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={true}
			style={{ backgroundColor: 'red' }}
		>
			<TouchableOpacity
				style={styles.instructionImagePopupModalCover}
				onPress={props.close}
			>
				<View style={styles.instructionImagePopupContainer}>
					<View style={styles.chefContainer}>
						<View style={styles.chefLeftContainer}>
							<TouchableOpacity style={styles.recipeCardTopLeftUpperContainer} activeOpacity={0.7} onPress={() => props.navigateToChefDetails(props.chef.id)}>
								<Text maxFontSizeMultiplier={2} style={styles.chefUsername}>{props.chef.username}</Text>
							</TouchableOpacity>
							<Text maxFontSizeMultiplier={2} style={styles.recipeCardHighlighted}>{dateToDisplay}</Text>
						</View>
						<TouchableOpacity style={styles.recipeCardTopRightContainer} onPress={() => props.navigateToChefDetails(props.chef.id)}>
							<AvatarImage chefimage_url={props.chef.image_url} />
						</TouchableOpacity>
					</View>
					<View style={styles.popupSeparator}></View>
					<Image
						style={styles.instructionPopupImage}
						source={{ uri: props.makePic.image_url }}
						resizeMode="cover"
					/>
				</View>
			</TouchableOpacity>
		</Modal>
	)
}

function AvatarImage(chefimage_url) {
	const URL = chefimage_url.chefimage_url
	if (!URL) {
		return (
			<Image style={styles.thumbnail} source={require("../dataComponents/peas.jpg")} />
		)
	} else {
		return (
			<Image style={styles.thumbnail} source={{ uri: URL }} />
		)
	}
}
