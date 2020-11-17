import React from 'react'
import { Modal, View, TouchableOpacity, Text, Dimensions } from 'react-native'
import { styles } from './chefEditorStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions' //eslint-disable-line no-unused-vars

export default class DeleteChefOption extends React.PureComponent {

	render() {
		return (
			<Modal
				animationType="fade"
				transparent={true}
				visible={true}
			>
				<View style={[styles.modalFullScreenContainer, {
					height: Dimensions.get('window').height,
					width: Dimensions.get('window').width,
				}]}>
					<View style={styles.deleteChefOptionContentsContainer}>
						<View style={styles.deleteChefOptionTitleContainer}>
							<Text style={[styles.title, { textAlign: 'center' }]}>Are you sure?</Text>
							<Text style={styles.paragraph}>We&apos;re sorry to see you go but we hope you enjoyed the app.</Text>
							<Text style={styles.paragraph}>Can we leave your recipes available for other users, or do you want us to just delete everything?</Text>
							<Text style={styles.paragraph}>If you leave your recipes we&apos;ll deactivate your account and you can activate it by resetting your password later. Your recipes will still be here but will be Anonymous while your account is deactivated.</Text>
							<Text style={styles.paragraph}>If you prefer to delete everything we&apos;ll do that. You can re-register at any time but everything you put in previously will be gone.</Text>
						</View>

						<View style={styles.formRow}>
							<TouchableOpacity style={[styles.clearFiltersButton, {width: '45%'}]} activeOpacity={0.7} title="deleteEverything" onPress={this.props.deleteEverything}>
								<Icon style={styles.clearFiltersIcon} size={responsiveHeight(4)} name='cancel' />
								<Text style={styles.clearFiltersButtonText}>Delete {"\n"} everything</Text>
							</TouchableOpacity>
							<TouchableOpacity style={[styles.clearFiltersButton, {width: '45%'}]} activeOpacity={0.7} title="leaveRecipes" onPress={this.props.leaveRecipes}>
								<Icon style={styles.clearFiltersIcon} size={responsiveHeight(4)} name='check' />
								<Text style={styles.clearFiltersButtonText}>Leave {"\n"} recipes</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.formRow}>
							<View style={{width: '45%'}}>
							</View>
							<TouchableOpacity style={[styles.applyFiltersButton, {width: '45%'}]} activeOpacity={0.7} title="closeDeleteChefOption" onPress={this.props.closeDeleteChefOption}>
								<Icon style={styles.applyFiltersIcon} size={responsiveHeight(4)} name='cancel' />
								<Text style={styles.applyFiltersButtonText}>Cancel</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.bottomSpacer}>
						</View>
					</View>
				</View>
			</Modal>
		)
	}
}
