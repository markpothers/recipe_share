import React from 'react'
import { Modal, Text, View, TouchableOpacity, Dimensions, ScrollView, Platform } from 'react-native'
import { styles } from './alertPopUpStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions'
import { centralStyles } from '../centralStyleSheet'

export function AlertPopUp(props) {
    return (
        <Modal
        animationType="fade"
        transparent={true}
        visible={true}
        >
            <View style={[styles.modalFullScreenContainer, {height: responsiveHeight(100),
                    width: responsiveWidth(100),
                    }]}>
                <View style={styles.contentsContainer}>
                    <View style={styles.titleContainer}>
                        <Text maxFontSizeMultiplier={1.5} style={styles.title}>{props.title}</Text>
                    </View>
                    <View style={[centralStyles.formSection, {width: responsiveWidth(80), marginTop: responsiveHeight(2), marginBottom: responsiveHeight(2)}]}>
                        <View style={[centralStyles.formInputContainer, {justifyContent: 'space-around'}]}>
                            <TouchableOpacity style={[centralStyles.greenRectangleButton]} activeOpacity={0.7} onPress={props.close}>
                                <Icon style={centralStyles.yellowButtonIcon} size={25} name='cancel'></Icon>
                                <Text maxFontSizeMultiplier={2} style={centralStyles.yellowButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[centralStyles.greenRectangleButton]} activeOpacity={0.7} onPress={props.onYes}>
                                <Icon style={centralStyles.yellowButtonIcon} size={25} name='check'></Icon>
                                <Text maxFontSizeMultiplier={2} style={centralStyles.yellowButtonText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}