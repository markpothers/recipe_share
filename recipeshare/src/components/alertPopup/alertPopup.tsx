import { Modal, Text, TouchableOpacity, View } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import { centralStyles } from "../../centralStyleSheet"; //eslint-disable-line no-unused-vars
import { styles } from "./alertPopupStyleSheet";

type Props = {
	title: string;
	close?: () => void;
	closeText?: string;
	onYes: () => void;
	yesText?: string;
};

export function AlertPopup(props: Props) {
	return (
		<Modal animationType="fade" transparent={true} visible={true}>
			<View
				style={[
					styles.modalFullScreenContainer,
					{
						height: responsiveHeight(100),
						width: responsiveWidth(100),
					},
				]}
				accessibilityRole="alert"
			>
				<View style={styles.contentsContainer}>
					<View style={styles.titleContainer}>
						<Text maxFontSizeMultiplier={1.5} style={styles.title}>
							{props.title}
						</Text>
					</View>
					<View
						style={[
							centralStyles.formSection,
							{
								width: responsiveWidth(80),
								marginTop: responsiveHeight(2),
								marginBottom: responsiveHeight(2),
							},
						]}
					>
						<View style={[centralStyles.formInputContainer, { justifyContent: "space-around" }]}>
							{props.close && (
								<TouchableOpacity
									style={centralStyles.greenRectangleButton}
									activeOpacity={0.7}
									onPress={props.close}
									testID={"closeButton"}
									accessibilityRole="button"
								>
									<Icon
										style={centralStyles.yellowButtonIcon}
										size={responsiveHeight(4)}
										name="cancel"
									></Icon>
									<Text maxFontSizeMultiplier={2} style={centralStyles.yellowButtonText}>
										{props.closeText ? props.closeText : "Cancel"}
									</Text>
								</TouchableOpacity>
							)}
							{!props.close && <View style={[centralStyles.greenRectangleButton, { opacity: 0 }]}></View>}
							<TouchableOpacity
								style={centralStyles.greenRectangleButton}
								activeOpacity={0.7}
								onPress={props.onYes}
								testID={"yesButton"}
								accessibilityRole="button"
							>
								<Icon
									style={centralStyles.yellowButtonIcon}
									size={responsiveHeight(4)}
									name="check"
								></Icon>
								<Text maxFontSizeMultiplier={2} style={centralStyles.yellowButtonText}>
									{props.yesText ? props.yesText : "Yes"}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	);
}
