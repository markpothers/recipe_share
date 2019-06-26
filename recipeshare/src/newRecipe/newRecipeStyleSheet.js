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
  createRecipeForm: {
    flex: 1,
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
    // overflow: 'hidden',
    width: '100%',
    backgroundColor: 'white',
  },
  transparentFormRow: {
    flex: 1,
    marginTop: 4,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    // borderStyle: 'solid',
    // borderWidth: 1,
    borderRadius: 5,
    // overflow: 'hidden',
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
    // position: 'relative',
     // bottom: '0%',
    //  marginTop: '0%',
     marginLeft: '2%',
     marginRight: '2%',
     backgroundColor: 'white',
    //  opacity: 0.9,
     height: 140,
     width: '96%',
    //  borderStyle: 'solid',
    //  borderWidth: 1,
   },
   newRecipeTextCentering: {
    // position: 'absolute',
   },
   createRecipeTextAreaInput: {
     height: 130,
     marginTop: 4,
    //  marginBottom: 5,
    //  borderStyle: 'solid',
    //  borderWidth: 1,
   },
   timeAndDifficultyWrapper: {
    borderStyle: 'solid',
    borderWidth: 2,
    // borderColor: 'white',
    width: '100%',
    marginTop: 4,
    // height: 50,
    flex: 1,
    // flexWrap: 'wrap', 
    // alignItems: 'flex-start',
    flexDirection:'row',
    justifyContent: 'center',
    // alignItems: 'center',
   },
   timeAndDifficultyTitleItem: {
       marginLeft: '5%',
       marginRight: '5%',
       backgroundColor: 'white',
       borderRadius: 5,
      //  opacity: 0.9,
       height: 44,
       width: '35%',
       justifyContent: 'center',
       alignItems: 'center',
       borderStyle: 'solid',
       borderWidth: 1,
     },
   timeAndDifficultyTitle: {
    marginLeft: '5%',
    marginRight: '5%',
    // fontWeight: 'bold',
    fontSize: 16,
    color: "#505050",
    },
  timeAndDifficulty: {
    //  position: 'absolute',
        // bottom: '0%',
      //  marginTop: '1%',
        marginLeft: '5%',
        marginRight: '5%',
        backgroundColor: 'white',
      //  opacity: 0.9,
        // height: 50,
        width: '35%',
        borderRadius: 5,
        borderStyle: 'solid',
        borderWidth: 1,
      },
  picker: {
    color: "#505050",
    height: 44,
    borderStyle: 'solid',
    borderWidth: 1,
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
    // backgroundColor: '#104e01',
    backgroundColor: '#fff59b',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  unitPicker: {
    margin: '5%',
    bottom: '2%',
  },
  createRecipeFormSubmitButton:{
    // marginTop: '0%',
    // marginBottom: '1%',
    marginLeft: '5%',
    marginRight: '5%',
    // position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'flex-start',
    width: '35%',
    // height: 150,
    // flexDirection:'row',
    backgroundColor: '#104e01',
    // color: 'white'
    opacity: 0.9
  },
  createRecipeFormButtonText: {
    marginLeft: '5%',
    marginRight: '5%',
    // backgroundColor: 'white',
    // opacity: 0.75,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#104e01',
    // color: '#fff59b'
  },
  standardIcon: {
    color: '#104e01',
    // color: '#fff59b'
  },
  addIngredientNameInputBox: {
    // position: 'absolute',
    // flex: 1,
    // left: '2%',
    zIndex: 1,
     // bottom: '0%',
    //  marginTop: '0%',
    //  marginLeft: '1%',
    //  marginRight: '1%',
     backgroundColor: 'white',
    //  opacity: 0.9,
     height: 44,
     width: '51%',
     borderStyle: 'solid',
     justifyContent: 'center',
     borderWidth: 1,
     borderRadius: 5,
    //  overflow: 'hidden'
  },
  addIngredientQuantityInputBox: {
    // position: 'relative',
     // bottom: '0%',
    //  marginTop: '0%',
     marginLeft: '1%',
     marginRight: '1%',
     backgroundColor: 'white',
    //  opacity: 0.9,
     height: 44,
     width: '19%',
     borderStyle: 'solid',
     justifyContent: 'center',
     borderWidth: 1,
     borderRadius: 5,
  },
  addIngredientUnitInputBox: {
    // position: 'relative',
     // bottom: '0%',
    //  marginTop: '0%',
    //  marginLeft: '1%',
    //  marginRight: '1%',
     backgroundColor: 'white',
     justifyContent: 'center',
    //  opacity: 0.9,
     height: 44,
     width: '28%',
     borderStyle: 'solid',
     borderWidth: 1,
     borderRadius: 5,
  },
  ingredientTextAdjustment: {
    marginLeft: 7,
    // backgroundColor: 'transparent'
  },
  autocompleteList: {
    // borderRadius: 5,
    // zIndex: 1,
    // position: 'absolute'
    height:150
  },





  // ingredientContainer: {
  //   // borderStyle: 'solid',
  //   // borderWidth: 2,
  //   width: '100%',
  //   flex: 1,
  //   // flexWrap: 'wrap', 
  //   // alignItems: 'flex-start',
  //   flexDirection:'row',
  //   // justifyContent: 'center',
  //   // alignItems: 'center',
  // },


  // QtyTextCentering: {
  //   position: 'absolute',
  //   left: '10%'
  // },
  

  // createChefFormButton:{
  //   marginTop: '0%',
  //   marginLeft: '5%',
  //   marginRight: '5%',
  //   // position: 'relative',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   // alignSelf: 'flex-start',
  //   width: '35%',
  //   height: 50,
  //   // flexDirection:'row',
  //   // backgroundColor: 'blue',
  //   // color: 'white'
  //   opacity: 0.9
  // },

})
