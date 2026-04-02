import { ScrollView, View } from "react-native";
import { OfflineMessage, SpinachAppContainer } from "../components";
import ChefDetailsCard from "./ChefDetailsCard";
import { ChefRecipeBookTabs } from "./ChefDetailsNavigators";
import DynamicMenu from "../dynamicMenu/DynamicMenu";
import React from "react";
import { ChefDetailsProps } from "../navigation";
import { styles } from "./chefDetailsStyleSheet";
import { useChefDetailsModel } from "./hooks/useChefDetailsModel";

export default function ChefDetails({ navigation, route }: ChefDetailsProps) {
	const model = useChefDetailsModel(navigation, route);

	if (model.chefDetails !== undefined) {
		const chef_details = model.chefDetails;
		return (
			<SpinachAppContainer awaitingServer={model.awaitingServer}>
				{model.renderOfflineMessage && (
					<OfflineMessage
						message={`Sorry, can't do that right now.${"\n"}You appear to be offline.`}
						topOffset={"10%"}
						clearOfflineMessage={model.clearOfflineMessage}
					/>
				)}
				{model.dynamicMenuShowing && (
					<DynamicMenu buttons={model.headerButtons} closeDynamicMenu={model.closeDynamicMenu} />
				)}
				<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
					<ChefDetailsCard
						{...chef_details}
						followChef={model.followChef}
						unFollowChef={model.unFollowChef}
						notProfile={true}
					/>
					<View style={styles.recipeBookContainer}>
						<ChefRecipeBookTabs queryChefID={chef_details.chef.id} fetchChefDetails={model.fetchChefDetails} />
					</View>
				</ScrollView>
			</SpinachAppContainer>
		);
	}

	return <SpinachAppContainer awaitingServer={model.awaitingServer}></SpinachAppContainer>;
}
