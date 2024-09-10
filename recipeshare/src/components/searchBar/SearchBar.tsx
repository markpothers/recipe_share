import { TextInput, View } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import React from "react";
import SearchBarClearButton from "./searchBarClearButton";
import { centralStyles } from "../../centralStyleSheet"; //eslint-disable-line no-unused-vars

type OwnProps = {
	searchTerm: string;
	text: string;
	setSearchTerm: (searchTerm: string) => void;
	onBlur: () => void;
	searchBar: React.RefObject<typeof SearchBar>;
};

export default function SearchBar(props: OwnProps) {
	const { searchTerm, text, setSearchTerm, searchBar, onBlur } = props;

	// console.log(props)
	return (
		<View
			style={{
				justifyContent: "center",
				alignItems: "center",
				marginLeft: 0,
				marginBottom: responsiveHeight(0.5),
			}}
		>
			<View style={centralStyles.formSection}>
				<View
					style={{
						flexDirection: "row",
						marginTop: responsiveHeight(0.5),
						width: responsiveWidth(100),
						justifyContent: "space-between",
						alignItems: "center",
						backgroundColor: "white",
						borderRadius: responsiveWidth(1.5),
						borderWidth: 1,
						borderColor: "#104e01",
						overflow: "hidden",
					}}
				>
					<TextInput
						maxFontSizeMultiplier={2}
						style={{
							minHeight: responsiveHeight(6),
							backgroundColor: "white",
							textAlign: "left",
							textAlignVertical: "center",
							paddingLeft: responsiveWidth(2),
							width: responsiveWidth(90),
							fontSize: responsiveFontSize(2),
						}}
						value={searchTerm}
						placeholder={text}
						keyboardType="default"
						autoCapitalize="none"
						onChangeText={(text) => setSearchTerm(text)}
						ref={searchBar}
						// onFocus={props.onFocus}
						onBlur={onBlur}
						testID={"searchTermInput"}
					/>
					{searchTerm.length > 0 && <SearchBarClearButton displayIcon={true} setSearchTerm={setSearchTerm} />}
				</View>
			</View>
		</View>
	);
}
