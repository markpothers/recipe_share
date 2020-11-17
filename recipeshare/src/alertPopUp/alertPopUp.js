import React from 'react'
import { Modal, Text, View, TouchableOpacity } from 'react-native'
import { styles } from './alertPopUpStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import { centralStyles } from '../centralStyleSheet' //eslint-disable-line no-unused-vars

export function AlertPopUp(props) {
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
					<View style={[centralStyles.formSection, { width: responsiveWidth(80), marginTop: responsiveHeight(2), marginBottom: responsiveHeight(2) }]}>
						<View style={[centralStyles.formInputContainer, { justifyContent: 'space-around' }]}>
							{props.close && (
								<TouchableOpacity style={centralStyles.greenRectangleButton} activeOpacity={0.7} onPress={props.close}>
									<Icon style={centralStyles.yellowButtonIcon} size={responsiveHeight(4)} name='cancel'></Icon>
									<Text maxFontSizeMultiplier={2} style={centralStyles.yellowButtonText}>{props.closeText ? props.closeText : "Cancel"}</Text>
								</TouchableOpacity>
							)}
							{!props.close && (
								<View style={[centralStyles.greenRectangleButton, {opacity: 0}]} >
								</View>
							)}
							<TouchableOpacity style={centralStyles.greenRectangleButton} activeOpacity={0.7} onPress={props.onYes}>
								<Icon style={centralStyles.yellowButtonIcon} size={responsiveHeight(4)} name='check'></Icon>
								<Text maxFontSizeMultiplier={2} style={centralStyles.yellowButtonText}>{props.yesText ? props.yesText : "Yes"}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	)
}
