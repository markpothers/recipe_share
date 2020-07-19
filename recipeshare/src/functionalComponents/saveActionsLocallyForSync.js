import React from 'react';
import { AsyncStorage } from 'react-native';
import { detailsTimeout } from '../dataComponents/timeouts';
import { postRecipeLike } from '../fetches/postRecipeLike'
import { postReShare } from '../fetches/postReShare'
import { postRecipeMake } from '../fetches/postRecipeMake'
import { destroyRecipeLike } from '../fetches/destroyRecipeLike'
import { destroyReShare } from '../fetches/destroyReShare'
import { postFollow } from '../fetches/postFollow'
import { destroyFollow } from '../fetches/destroyFollow'

export const saveActionsLocally = (action) => {
    // console.log(userId)
    console.log('saving action locally')

    AsyncStorage.getItem('locallySavedActions', (err, res) => {
        if (res != null) {
            let locallySavedActions = JSON.parse(res)
            let actionsToSave = [...locallySavedActions, action]
            AsyncStorage.setItem('locallySavedActions', JSON.stringify(actionsToSave), () => {

            })
        } else {
            let actionsToSave = [action]
            AsyncStorage.setItem('locallySavedActions', JSON.stringify(actionsToSave), () => {

            })
        }
    })
}

export const runSavedActions = () => {
    // console.log(destroyRecipeLike)
    // console.log(userId)
    console.log('running locally saved actions')
    // AsyncStorage.removeItem('locallySavedActions')

    AsyncStorage.getItem('locallySavedActions', (err, res) => {
        if (res != null) {
            let locallySavedActions = JSON.parse(res)
            locallySavedActions.forEach(action => {
                console.log(`running: ${action}`)
                console.log(action.split('(')[0])
                // console.log(eval(action.split('(')[0]))
                // eval(action)
                // .then (res => () => {
                //     console.log(res)
                // })
            });
        }
    })
}