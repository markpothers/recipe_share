import React from 'react'
import { Modal, Text, View, TouchableOpacity, Dimensions, ScrollView, Platform } from 'react-native'
import { styles } from './textPopUpStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function TextPopUp(props) {

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={true}
		>
			<View style={[styles.modalFullScreenContainer, {
				height: Dimensions.get('window').height,
				width: Dimensions.get('window').width,
			}]}>
				<View style={styles.contentsContainer}>
					<View style={styles.titleContainer}>
						<Text maxFontSizeMultiplier={1.5} style={styles.title}>{props.title}</Text>
					</View>
					<View style={[styles.editChefInputAreaBox, (Platform.OS === 'ios' ? { height: '87%' } : { height: '89%' })]} >
						<ScrollView>
							<Text maxFontSizeMultiplier={2} style={styles.tAndCText}>{props.text}</Text>
						</ScrollView>
					</View>
					<View style={styles.formRow}>
						<TouchableOpacity style={styles.closeButton} activeOpacity={0.7} title="close" onPress={props.close}>
							<Icon style={styles.closeIcon} size={25} name='check' />
							<Text maxFontSizeMultiplier={2} style={styles.closeButtonText}>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	)
}
