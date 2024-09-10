import { Animated, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { NetInfoState } from "@react-native-community/netinfo";
import { styles } from "./offlineMessageStyleSheet";

// eslint-disable-next-line @typescript-eslint/no-unused-vars

const diagnosingConnectivityIssues = true;

type Props = {
	delay?: number;
	clearOfflineMessage: () => void;
	diagnostics?: string | Error | NetInfoState;
	topOffset: string;
	message: string;
	action?: () => void;
};

const OfflineMessage = ({ delay, clearOfflineMessage, diagnostics, topOffset, message, action }: Props) => {
	const [fadeOpacity] = useState(new Animated.Value(0));

	useEffect(() => {
		const renderDuration = delay ? delay : 5000;
		Animated.timing(fadeOpacity, {
			toValue: 1,
			duration: 250,
			useNativeDriver: true,
		}).start(() => {
			setTimeout(() => {
				Animated.timing(fadeOpacity, {
					toValue: 0,
					duration: 250,
					useNativeDriver: true,
				}).start(() => {
					clearOfflineMessage();
				});
			}, renderDuration);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const displayDiagnostics =
		diagnosingConnectivityIssues &&
		diagnostics &&
		(typeof diagnostics == "object" || typeof diagnostics == "string")
			? true
			: false;
	return (
		<Animated.View
			style={[styles.messageContainer, { opacity: fadeOpacity }, { top: topOffset }]}
			testID="offlineMessage"
		>
			{action ? (
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={action}
					style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}
					accessibilityRole={"button"}
				>
					<Text maxFontSizeMultiplier={2.5} style={styles.messageText}>
						{message}
					</Text>
					<Icon
						name="forwardburger"
						size={responsiveHeight(5)}
						style={{ color: "#fff59b", marginRight: responsiveWidth(2) }}
					/>
				</TouchableOpacity>
			) : (
				<>
					<Text maxFontSizeMultiplier={2.5} style={styles.messageText}>
						{message}
					</Text>
					{displayDiagnostics && <Text style={styles.messageText}>{JSON.stringify(diagnostics)}</Text>}
				</>
			)}
		</Animated.View>
	);
};

export default OfflineMessage;
