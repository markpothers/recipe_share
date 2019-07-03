import React from 'react'
import { Modal, Text, View, TouchableOpacity } from 'react-native'
import {Camera, Permissions, DangerZone } from 'expo'
import { ImagePicker } from 'expo'
import { styles } from './functionalComponentsStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class PicSourceChooser extends React.PureComponent{

    pickImage = async() => {
        let image = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.3,
          base64: true
        })
        this.props.saveImage(image)
    }

    openCamera = async () => {
    let image = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.3,
        base64: true
    })
    this.props.saveImage(image)
    }

    render() {
        return (
            <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={this.props.sourceChosen}
            >
                <View style={styles.modalFullScreenContainer}>
                    <View style={styles.picChooserModalContainer}>
                            <TouchableOpacity style={styles.picSourceChooserButton} activeOpacity={0.7} title="Choose Photo" onPress={this.pickImage}>
                                <Icon style={styles.standardIcon} size={50} name='camera-burst' />
                                <Text style={styles.picSourceChooserButtonText}>Choose{"\n"}photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.picSourceChooserButton} activeOpacity={0.7} title="Take Photo" onPress={this.openCamera}>
                                <Icon style={styles.standardIcon} size={50} name='camera' />
                                <Text style={styles.picSourceChooserButtonText}>Take{"\n"}photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.picSourceChooserCancelButton} activeOpacity={0.7} title="Take Photo" onPress={this.props.sourceChosen}>
                                <Icon style={styles.cancelIcon} size={35} name='cancel' />
                                <Text style={styles.picSourceChooserCancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
}