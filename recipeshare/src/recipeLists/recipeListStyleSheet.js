import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    recipeCard: {
      // height: 319,
      marginTop: 2,
      marginBottom: 2,
      width: '100%',
      borderStyle: 'solid',
      borderColor: '#104e01',
      borderRadius: 5,
      borderWidth: 1,
      backgroundColor: 'white'
    },
    recipeCardTopPostedByContainer: {
      // borderBottomStyle: 'solid 0.5',
      borderBottomWidth: 0.5,
      borderBottomColor: '#104e01',
      height: 25,
      width: '96.4%',
      marginLeft: '1.6%',
      marginRight: '2%',
      paddingBottom: '1%',
      paddingTop: '1%',
      flexDirection: 'row'
    },
    recipeCardTopContainer: {
      flexDirection: 'row',
      // borderStyle: 'solid',
      // borderWidth: 2,
      height: 61,
      width: '100%',
      marginTop: '1%',
      marginBottom: '1%'
    },
    recipeCardTopLeftContainer: {
      flex: 8,
      // borderStyle: 'solid',
      // borderWidth: 2,
    },
    recipeCardTopRightContainer: {
      flex: 2,
      // borderStyle: 'solid',
      // borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    avatarThumbnail: {
      // position: 'absolute',
      height: 60,
      width: '96%',
      marginRight: '4%',
      borderRadius: 5,
    },
    recipeCardTopLeftUpperContainer:{
      // borderStyle: 'solid',
      // borderWidth: 2,
      width: '96%',
      // marginTop: '1%',
      // marginBottom: '1%',
      marginLeft: '2%',
      marginRight: '2%'
    },
    recipeCardTopLeftMiddleContainer:{
      // borderStyle: 'solid',
      // borderWidth: 2,
      width: '96%',
      // marginTop: '1%',
      // marginBottom: '1%',
      marginLeft: '2%',
      marginRight: '2%',
      flexDirection: 'row'
    },
    recipeCardTopLeftLowerContainer:{
      flexDirection: 'row',
      // borderStyle: 'solid',
      // borderWidth: 2,
      width: '96%',
      justifyContent: 'center',
      alignItems: 'center',
      // marginTop: '1%',
      // marginBottom: '1%',
      marginLeft: '2%',
      marginRight: '2%'
    },
    recipeCardImageContainer: {
      // borderStyle: 'solid',
      // borderWidth: 2,
      height: 250,
      width: '100%'
    },
    thumbnail: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      borderRadius: 5
    },
    recipeCardBottomContainer: {
      flexDirection: 'row',
      marginTop: '1%',
      marginBottom: '1%',
      height: 25,
      // borderStyle: 'solid',
      // borderWidth: 2,
    },
    recipeCardBottomSubContainers: {
      flexDirection: 'row',
      flex: 1,
      // borderStyle: 'solid',
      // borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center'
    },
    icon: {
      color: '#505050',
      alignSelf: 'center',
      marginRight: '10%'
    },
    recipeCardHighlighted: {
      fontWeight: 'bold',
      fontSize: 16,
      color: "#505050",
      textAlign: 'left'
    },
    recipeCardTopOther: {
      fontSize: 13,
      color: "#505050",
      flex: 1
    },
    recipeCardTopItalic:{
      fontSize: 13,
      color: "#505050",
      fontStyle: 'italic'
    },
    recipeCardBottomOther: {
      marginLeft: '5%',
      fontSize: 16,
      fontWeight: 'bold',
      color: "#505050",
      textAlign: 'center'
    },
    filterButton: {
      position: 'absolute',
      backgroundColor: '#fff59b',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#104e01',
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      top: '86%',
      left: '80%',
      borderRadius: 100,
      zIndex: 1
    },
    filterIcon:{
      color: '#104e01',
      // alignSelf: 'center',
      // marginLeft: '10%'
    }
});