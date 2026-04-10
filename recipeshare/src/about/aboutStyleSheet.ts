import { StyleSheet } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

export const styles = StyleSheet.create({
	text: {
		fontSize: responsiveFontSize(2.2),
		padding: responsiveWidth(2),
	},
	tabContent: {
		flex: 1,
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "#104e01",
		borderRadius: responsiveWidth(1.5),
		padding: responsiveWidth(3),
	},
	// Segmented Control Styles
	segmentedControl: {
		flexDirection: "row",
		backgroundColor: "#fff59b",
		borderRadius: responsiveWidth(1.5),
		borderWidth: 1,
		borderColor: "#104e01",
		overflow: "hidden",
	},
	segment: {
		flex: 1,
		paddingVertical: responsiveHeight(1.5),
		paddingHorizontal: responsiveWidth(2),
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "transparent",
		borderRightWidth: 1,
		borderRightColor: "#104e01",
	},
	firstSegment: {
		borderTopLeftRadius: responsiveWidth(1.5),
		borderBottomLeftRadius: responsiveWidth(1.5),
	},
	lastSegment: {
		borderTopRightRadius: responsiveWidth(1.5),
		borderBottomRightRadius: responsiveWidth(1.5),
		borderRightWidth: 0,
	},
	activeSegment: {
		backgroundColor: "#104e01",
	},
	segmentText: {
		fontSize: responsiveFontSize(1.8),
		fontWeight: "600",
		color: "#104e01",
		textAlign: "center",
	},
	activeSegmentText: {
		color: "#fff59b",
	},
});
