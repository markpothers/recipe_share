import React from 'react'
import { Modal, View, Image } from 'react-native'
import { styles } from './recipeDetailsStyleSheet'

export function InstructionImagePopup(props) {

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={true}
			style={{ backgroundColor: 'red' }}
		>
			<View style={styles.instructionImagePopupModalCover}>
				<View style={[styles.instructionImagePopupContainer]}>
					<Image
						style={[styles.instructionPopupImage]}
						source={{ uri: props.imageURL }}
						resizeMode="cover"
					/>
				</View>
			</View>
		</Modal>
	)
}
