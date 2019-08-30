import React from 'react'
import { Modal, View, TouchableOpacity, Text, Dimensions } from 'react-native'
import { styles } from './chefEditorStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class DeleteChefOption extends React.PureComponent{

    render() {
        return (
            <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            >
                <View style={[styles.modalFullScreenContainer, {height: Dimensions.get('window').height,
                        width: Dimensions.get('window').width,
                        }]}>
                    <View style={styles.deleteChefOptionContentsContainer}>
                        <View style={styles.deleteChefOptionTitleContainer}>
                            <Text style={styles.title}>Oh, sorry to see you go.  We hope you enjoyed the app.</Text>
                            <Text style={styles.title}>Can we leave your recipes available for other users, or do you want us to just delete everything?</Text>
                        </View>
                        <View style={styles.formRow}>
                            <TouchableOpacity style={styles.clearFiltersButton} activeOpacity={0.7} title="deleteEverything" onPress={() => this.props.deleteChefAccount(true)}>
                                <Icon style={styles.clearFiltersIcon} size={25} name='cancel' />
                                <Text style={styles.clearFiltersButtonText}>Delete {"\n"} everything</Text>
                            </TouchableOpacity>
                            <View style={styles.buttonPlaceholder}>
                            </View>
                        </View>
                        <View style={styles.formRow}>
                            <TouchableOpacity style={styles.applyFiltersButton} activeOpacity={0.7} title="closeDeleteChefOption" onPress={this.props.closeDeleteChefOption}>
                                <Icon style={styles.applyFiltersIcon} size={25} name='cancel' />
                                <Text style={styles.applyFiltersButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.applyFiltersButton} activeOpacity={0.7} title="leaveRecipes" onPress={() => this.props.deleteChefAccount(false)}>
                                <Icon style={styles.applyFiltersIcon} size={25} name='check' />
                                <Text style={styles.applyFiltersButtonText}>Leave {"\n"} recipes</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bottomSpacer}>
                        </View>
                        <View style={styles.bottomSpacer}>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}