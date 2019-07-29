import React from 'react'
import { Modal, Text, View, TouchableOpacity, Dimensions, ScrollView, Platform } from 'react-native'
import { styles } from './tAndCStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { termsAndConditions } from '../dataComponents/termsAndConditions'
export function TAndC(props) {
    // console.log(this.props)
    return (
        <Modal
        animationType="fade"
        transparent={true}
        visible={true}
        >
            <View style={[styles.modalFullScreenContainer, {height: Dimensions.get('window').height,
                    width: Dimensions.get('window').width,
                    }]}>
                <View style={styles.contentsContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Terms & Conditions</Text>
                    </View>
                    <View style={[styles.editChefInputAreaBox, (Platform.OS === 'ios' ? {height: '84%'} : {height: '86%'})]} >
                        <ScrollView>
                            <Text style={styles.tAndCText}>{termsAndConditions}</Text>
                        </ScrollView>
                    </View>
                    <View style={styles.formRow}>
                        <View style={styles.buttonPlaceholder}>
                        </View>
                        <TouchableOpacity style={styles.closeButton} activeOpacity={0.7} title="close" onPress={props.handleViewTandC}>
                            <Icon style={styles.closeIcon} size={25} name='check' />
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}