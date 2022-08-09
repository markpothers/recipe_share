import React from "react";
import { Switch, Platform } from "react-native";
import { responsiveWidth, responsiveHeight, responsiveFontSize } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars
import { useAppSelector } from "../../redux";

type Props = {
	disabled?: boolean;
	value: boolean;
	onValueChange: (value: boolean) => void;
	trackColor?: { true: string; false: string };
	thumbColor?: string;
	testID?: string;
};

export default function SwitchSized(props: Props) {
	const { disabled, value, onValueChange, trackColor, thumbColor, testID } = props;
	// const [deviceType, setDeviceType] = useState(0)
	const deviceType = useAppSelector((state) => state.root.deviceType);

	// useEffect(() => {
	// 	const getDeviceType = async () => {
	// 		const deviceType = await Device.getDeviceTypeAsync();
	// 		setDeviceType(deviceType);
	// 	};
	// 	getDeviceType();
	// }, []);

	return (
		<Switch
			//reduce size on iPhones (deviceType == 1 ) but not on anything else
			style={[
				Platform.OS === "ios" && deviceType == 1 ? { transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] } : null,
				disabled && Platform.OS == "android" ? { opacity: 0.5 } : null,
				Platform.OS == "android"
					? { height: responsiveHeight(3.5), marginVertical: responsiveHeight(0.5) }
					: null,
			]}
			value={value}
			onValueChange={onValueChange}
			trackColor={
				trackColor ? trackColor : { true: "#5c8a5199", false: Platform.OS == "ios" ? null : "#64715599" }
			}
			thumbColor={thumbColor ? thumbColor : Platform.OS === "ios" ? null : value ? "#4b7142" : "#eaeaea"}
			disabled={disabled}
			accessibilityRole="switch"
			testID={testID}
		/>
	);
}
