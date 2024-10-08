import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import { TouchableOpacity } from "react-native";

type Props = {
	setSearchTerm: (searchTerm: string) => void;
	displayIcon?: boolean;
};

export default function SearchBarClearButton(props: Props) {
	const { setSearchTerm, displayIcon } = props;

	return (
		<TouchableOpacity
			style={{
				width: responsiveWidth(10),
				height: "100%",
				justifyContent: "center",
				alignItems: "center",
				// backgroundColor: 'red',
				alignSelf: "flex-end",
			}}
			onPress={() => setSearchTerm("")}
			testID={"deleteSearchTermButton"}
			accessibilityLabel={"clear search text"}
		>
			{displayIcon ? <Icon name="close" size={responsiveHeight(3.5)} style={{ color: "#505050" }} /> : null}
		</TouchableOpacity>
	);
}
