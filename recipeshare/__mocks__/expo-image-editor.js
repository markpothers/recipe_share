import React, { useEffect } from "react";
import { View } from "react-native";

export const ImageEditor = (props) => {
	useEffect(()=>{
		props.onEditingComplete({
			canceled: false,
			uri: props.imageUri,
		})
	}, [props])
	return <View testID={"mockImageEditor"}></View>;
};
