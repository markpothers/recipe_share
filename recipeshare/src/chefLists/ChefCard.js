import React from 'react'
import { Image, View, TouchableOpacity, Text, ScrollView, Animated } from 'react-native'
import { styles } from './chefListStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { databaseURL } from '../dataComponents/databaseURL'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import OfflineMessage from '../offlineMessage/offlineMessage'

export default class ChefCard extends React.PureComponent {

	render() {
		// console.log(this.props)
		return (
			<View style={styles.chefCard}>
				{this.props.renderOfflineMessage.includes(this.props.id) && (
					<OfflineMessage
						message={`Sorry, can't see chef right now.${"\n"}You appear to be offline.`}
						topOffset={'25%'}
						clearOfflineMessage={() => { this.props.clearOfflineMessage(this.props.id) }}
					/>)}
				<TouchableOpacity style={styles.chefCardTopContainer} onPress={() => this.props.navigateToChefDetails(this.props.id)}>
					<View style={styles.chefCardTopLeftContainer}>
						<View style={styles.chefCardTopLeftUpperContainer}>
							<View activeOpacity={0.7}>
								<Text maxFontSizeMultiplier={2} style={styles.chefCardHighlighted}>{this.props.username}</Text>
							</View>
						</View>
						<View style={styles.chefCardTopLeftMiddleContainer}>
							<View>
								<Text maxFontSizeMultiplier={2.5} style={styles.chefCardTopItalic}>{this.props.country}</Text>
							</View>
						</View>
						<ScrollView nestedScrollEnabled={true} style={styles.chefCardTopLeftLowerContainer}>
							<Text maxFontSizeMultiplier={2.5} style={styles.chefCardTopOther} >{this.props.profile_text}</Text>
						</ScrollView>
					</View>
					<View style={styles.chefCardTopRightContainer}>
						<AvatarImage chefimage_url={this.props.image_url} />
					</View>
				</TouchableOpacity>
				<View style={styles.chefCardBottomContainer}>
					<TouchableOpacity style={styles.chefCardBottomSubContainers} onPress={(parseInt(this.props.user_chef_following) > 0 ? (e => this.props.unFollowChef(this.props.id)) : (e => this.props.followChef(this.props.id)))}>
						{parseInt(this.props.user_chef_following) > 0 ? <Icon name='account-multiple-minus' size={responsiveHeight(3.5)} style={styles.icon} /> : <Icon name='account-multiple-plus-outline' size={responsiveHeight(3.5)} style={styles.icon} />}
						<Text maxFontSizeMultiplier={2.5} style={styles.chefCardBottomOther} >{this.props.followers === null ? 0 : this.props.followers}</Text>
					</TouchableOpacity>
					<View style={styles.chefCardBottomSubContainers} >
						<Icon name='heart' size={responsiveHeight(3.5)} style={styles.icon} />
						<Text maxFontSizeMultiplier={2.5} style={styles.chefCardBottomOther} >{this.props.recipe_likes_received === null ? 0 : this.props.recipe_likes_received}</Text>
					</View>
					{/* <View style={styles.chefCardBottomSubContainers} >
                        <Icon name='food' size={responsiveHeight(3.5)} style={styles.icon}/>
                        <Text style={styles.chefCardBottomOther} >{this.props.recipe_makes_received === null ? 0 : this.props.recipe_makes_received}</Text>
                    </View> */}
					<View style={styles.chefCardBottomSubContainers}>
						<Icon name='comment' size={responsiveHeight(3.5)} style={styles.icon} />
						<Text maxFontSizeMultiplier={2.5} style={styles.chefCardBottomOther} >{this.props.comments_received === null ? 0 : this.props.comments_received}</Text>
					</View>
				</View>
			</View>
		)
	}
}

function AvatarImage(chefimage_url) {
	const URL = chefimage_url.chefimage_url
	if (URL === null || URL === undefined) {
		return (
			<Image style={styles.avatarThumbnail} source={require("../dataComponents/peas.jpg")} resizeMode={"contain"} />
		)
	} else if (typeof URL === 'object') {
		return (
			<Image style={styles.avatarThumbnail} source={URL.uri.startsWith("http") ? { uri: URL.uri } : { uri: `${databaseURL}${URL.uri}` }} resizeMode={"contain"} />
		)
	} else {
		return <Image style={styles.avatarThumbnail} source={URL.startsWith("http") ? { uri: URL } : { uri: `${databaseURL}${URL}` }} resizeMode={"contain"} />
	}
}
