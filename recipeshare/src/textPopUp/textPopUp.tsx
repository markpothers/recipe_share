import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import { styles } from "./textPopUpStyleSheet";

type OwnProps = {
	title: string,
	text: string,
	children?: React.ReactElement
	close: () => void
};

export function TextPopUp({title, text, children, close}: OwnProps) {
	return (
		<Modal animationType="fade" transparent={true} visible={true}>
			<View style={styles.modalFullScreenContainer}>
				<View style={styles.contentsContainer}>
					<View style={styles.titleContainer}>
						<Text maxFontSizeMultiplier={1.5} style={styles.title}>
							{title}
						</Text>
					</View>
					<View style={[styles.editChefInputAreaBox, { maxHeight: responsiveHeight(70) }]}>
						<ScrollView>
							<Text maxFontSizeMultiplier={2} style={styles.tAndCText}>
								{text}
							</Text>
							{children && children}
						</ScrollView>
					</View>
					<View style={styles.formRow}>
						<TouchableOpacity
							style={styles.closeButton}
							activeOpacity={0.7}
							onPress={close}
						>
							<Icon style={styles.closeIcon} size={responsiveHeight(4)} name="check" />
							<Text maxFontSizeMultiplier={2} style={styles.closeButtonText}>
								Close
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
