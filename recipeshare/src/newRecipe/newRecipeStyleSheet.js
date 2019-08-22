import React from 'react'
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mainPageContainer:{
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%',
    flex: 1
  },
  formRow: {
    flex: 1,
    marginTop: 4,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#104e01',
    width: '100%',
    backgroundColor: 'white',
  },
  transparentFormRow: {
    flex: 1,
    marginTop: 4,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    width: '100%',
  },
  createRecipeInputBox: {
     height: 44,
     justifyContent: 'center',
     width: '96%',
     marginLeft: '2%',
     marginRight: '2%',
   },
   createRecipeTextAreaBox: {
     marginLeft: '2%',
     marginRight: '2%',
     backgroundColor: 'white',
     height: 140,
     width: '96%',
     justifyContent: 'center'
   },
   newRecipeTextCentering: {
    // position: 'absolute',
   },
   createRecipeTextAreaInput: {
     height: 130,
     marginTop: 4,
   },
   timeAndDifficultyWrapper: {
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#104e01',
    width: '100%',
    marginTop: 4,
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center',
   },
   timeAndDifficultyTitleItem: {
       marginLeft: '5%',
       marginRight: '5%',
       backgroundColor: 'white',
       borderRadius: 5,
       height: 44,
       width: '35%',
       justifyContent: 'center',
       alignItems: 'center',
       borderStyle: 'solid',
       borderWidth: 1,
       borderColor: '#104e01',
     },
   timeAndDifficultyTitle: {
    marginLeft: '5%',
    marginRight: '5%',
    fontSize: 16,
    color: "#505050",
    },
  timeAndDifficulty: {
    marginLeft: '5%',
    marginRight: '5%',
    backgroundColor: 'white',
    height: 44,
    width: '35%',
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01',
    justifyContent: 'center'
  },
  picker: {
    height: 44,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  pickerText: {
    // textAlign: 'center'
  },
  createRecipeFormButton:{
    marginLeft: '5%',
    marginRight: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '35%',
    height: 44,
    flexDirection:'row',
    borderRadius: 5,
    backgroundColor: '#fff59b',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01',
  },
  unitPicker: {
    bottom: '2%',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  createRecipeFormButtonText: {
    marginLeft: '5%',
    marginRight: '5%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#104e01',
  },
  standardIcon: {
    color: '#104e01',
  },
  addIngredientQuantityInputBox: {
     marginRight: '2%',
     backgroundColor: 'white',
     height: 42,
     width: '30%',
     borderStyle: 'solid',
     justifyContent: 'center',
     borderWidth: 1,
     borderColor: '#104e01',
     borderRadius: 5,
  },
  addIngredientUnitInputBox: {
     backgroundColor: 'white',
     justifyContent: 'center',
     height: 42,
     width: '68%',
     borderStyle: 'solid',
     borderWidth: 1,
     borderColor: '#104e01',
     borderRadius: 5,
     overflow: 'hidden'
  },
  ingredientTextAdjustment: {
    marginLeft: 7,
  },
  autoCompleteRowContainer: {
    flex: 1,
    marginTop: 4,
    flexDirection:'row',
    width: '100%',
  },
  autoCompleteContainer: {
    position: 'absolute',
    width: '49%',
    borderRadius: 5,
    // justifyContent: 'center'
  },
  quantityAndUnitContainer: {
    marginLeft: '1%',
    width: '40%',
    left: '49%',
    flexDirection: 'row',
  },
  deleteIngredientContainer: {
    position: 'absolute',
    marginLeft: '1%',
    width: '8%',
    height: 42,
    left: '90%',
    flexDirection: 'row',
    borderRadius: 5,
    borderStyle: 'solid',
    borderColor: '#104e01',
    borderWidth: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  autoCompleteOuterContainerStyle: {
    borderRadius: 5,
  },
  autoCompleteInputContainerStyle: {
    borderRadius: 5,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: 5,
    borderWidth: 0,
  },
  autoCompleteInput: {
    borderRadius: 5,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01',
    height: 42,
    paddingLeft: '4%',
  },
  autoCompleteList: {
    borderRadius: 5,
    height: 150,
    width: '90%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01',
    marginLeft: '5%',
    marginRight: '5%',
  },
  ingredientDeleteTrashCanButton: {
    // zIndex: 1,
    // position: 'absolute',
    // top: 85,
    // left: 85,
  },
  ingredientTrashCan: {
    color: '#505050'
  },
  iOSdropDownIcon: {
    position: 'absolute',
    // height: 25,
    // width: 25,
    left: '80%',
    top: '36%',
    zIndex: 2,
    // borderStyle: 'solid',
    // borderWidth: 1,
    // borderColor: '#104e01',
    color: '#104e01',
  },
  activityIndicator:{
    position: 'absolute',
    width: 45,
    height: 45,
    zIndex: 1,
    left: '45%',
    top: '7%',
    borderRadius: 100,
    backgroundColor: '#fff59b',
    borderColor: '#104e01',
    borderWidth: 1
  },
  IOSPickerText: {
    marginLeft: '10%'
  }
})
