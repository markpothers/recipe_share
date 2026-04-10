import { Linking, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

import Constants from "expo-constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SoftwareLicenses } from "./softwareLicenses";
import { SpinachAppContainer } from "../components";
import { centralStyles } from "../centralStyleSheet";
import { privacyPolicy } from "../constants/privacyPolicy";
import { styles } from "./aboutStyleSheet";
import { termsAndConditions } from "../constants/termsAndConditions";

export const About = () => {
	const scrollView = useRef<ScrollView>(null);
	const [awaitingServer] = useState(false);
	const [activeTab, setActiveTab] = useState<"terms" | "privacy" | "licenses">("terms");

	const switchTab = useCallback((tab: "terms" | "privacy" | "licenses") => {
		setActiveTab(tab);
		scrollView.current?.scrollTo({ y: 0, animated: false });
	}, []);

	const tabs = [
		{ key: "terms", title: "Terms", icon: "information" },
		{ key: "privacy", title: "Privacy", icon: "information-outline" },
		{ key: "licenses", title: "Licenses", icon: "cellphone-information" },
	];

	return (
		<SpinachAppContainer awaitingServer={awaitingServer} scrollingEnabled={false}>
			<View style={centralStyles.formSection}>
				<View style={centralStyles.formInputContainer}>
					<View style={[centralStyles.formInputWhiteBackground, { justifyContent: "space-between" }]}>
						<Text maxFontSizeMultiplier={2} style={styles.text}>
							App Version:
						</Text>
						{Platform.OS == "ios" ? (
							<Text maxFontSizeMultiplier={2} style={styles.text}>{`${
								Constants.expoConfig?.version ?? "00"
							}.${Constants.expoConfig?.ios?.buildNumber ?? "00"}`}</Text>
						) : (
							<Text maxFontSizeMultiplier={2} style={styles.text}>{`${
								Constants.expoConfig?.version ?? "00"
							}.${Constants.expoConfig?.android?.versionCode ?? "00"}`}</Text>
						)}
					</View>
				</View>
			</View>

			{/* Segmented Control Style Tabs */}
			<View style={centralStyles.formSection}>
				<View style={centralStyles.formInputContainer}>
					<View style={styles.segmentedControl}>
						{tabs.map((tab, index) => (
							<TouchableOpacity
								key={tab.key}
								style={[
									styles.segment,
									activeTab === tab.key && styles.activeSegment,
									index === 0 && styles.firstSegment,
									index === tabs.length - 1 && styles.lastSegment,
								]}
								onPress={() => switchTab(tab.key as "terms" | "privacy" | "licenses")}
								activeOpacity={0.7}
							>
								<Icon
									name={tab.icon}
									size={responsiveHeight(2.5)}
									color={activeTab === tab.key ? "#fff59b" : "#104e01"}
									style={{ marginBottom: 2 }}
								/>
								<Text style={[styles.segmentText, activeTab === tab.key && styles.activeSegmentText]}>
									{tab.title}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>
			</View>

			<View style={[centralStyles.formSection, { flex: 1 }]}>
				<View style={[centralStyles.formInputContainer, { flex: 1 }]}>
					<ScrollView ref={scrollView} style={styles.tabContent}>
						{activeTab === "terms" && (
							<View>
								<Text maxFontSizeMultiplier={2} style={styles.text}>
									{termsAndConditions}
								</Text>
								<TouchableOpacity
									onPress={() =>
										Linking.openURL(
											"mailto:admin@recipe-share.com?subject=Terms%20And%20Conditions%20Question"
										)
									}
								>
									<Text
										style={{
											color: "blue",
											fontSize: responsiveFontSize(2.2),
											marginBottom: responsiveWidth(4),
										}}
									>
										admin@recipe-share.com
									</Text>
								</TouchableOpacity>
							</View>
						)}
						{activeTab === "privacy" && (
							<View>
								<Text maxFontSizeMultiplier={2} style={styles.text}>
									{privacyPolicy}
								</Text>
								<View style={{ flexDirection: "row", marginLeft: responsiveWidth(2) }}>
									<Text style={{ fontSize: responsiveFontSize(2.2) }}>* By email: </Text>
									<TouchableOpacity
										onPress={() =>
											Linking.openURL(
												"mailto:admin@recipe-share.com?subject=Privacy%20Policy%20Question"
											)
										}
									>
										<Text
											style={{
												color: "blue",
												fontSize: responsiveFontSize(2.2),
												marginBottom: responsiveWidth(4),
											}}
										>
											admin@recipe-share.com
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						)}
						{activeTab === "licenses" && <SoftwareLicenses />}
					</ScrollView>
				</View>
			</View>
		</SpinachAppContainer>
	);
};
