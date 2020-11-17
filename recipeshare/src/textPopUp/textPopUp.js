import React from 'react'
import { Modal, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import { styles } from './textPopUpStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

export function TextPopUp(props) {

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={true}
		>
			<View style={[styles.modalFullScreenContainer, {
				height: responsiveHeight(100),
				width: responsiveWidth(100),
			}]}>
				<View style={styles.contentsContainer}>
					<View style={styles.titleContainer}>
						<Text maxFontSizeMultiplier={1.5} style={styles.title}>{props.title}</Text>
					</View>
					<View style={[styles.editChefInputAreaBox, {height: responsiveHeight(70)}]} >
						<ScrollView>
							<Text maxFontSizeMultiplier={2} style={styles.tAndCText}>{props.text}</Text>
							{props.children}
						</ScrollView>
					</View>
					<View style={styles.formRow}>
						<TouchableOpacity style={styles.closeButton} activeOpacity={0.7} title="close" onPress={props.close}>
							<Icon style={styles.closeIcon} size={responsiveHeight(4)} name='check' />
							<Text maxFontSizeMultiplier={2} style={styles.closeButtonText}>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	)
}
