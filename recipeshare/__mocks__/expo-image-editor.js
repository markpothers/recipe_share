import React, { useEffect } from "react";
import { View } from "react-native";

export const ImageEditor = (props) => {
	useEffect(()=>{
		props.onEditingComplete({
			cancelled: false,
			uri: "",
		})
	}, [props])
	return <View testID={"mockImageEditor"}></View>;
};
