import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    recipeCard: {
      marginTop: '2%',
      width: '98%',
      marginLeft: '1%',
      marginRight: '1%',
      borderStyle: 'solid',
      borderRadius: 5,
      borderWidth: 1,
      backgroundColor: 'white'
    },
    recipeCardTopPostedByContainer: {
      // borderBottomStyle: 'solid 0.5',
      borderBottomWidth: 0.5,
      width: '96%',
      marginLeft: '2%',
      marginRight: '2%'
    },
    recipeCardTopContainer: {
      flexDirection: 'row',
      // borderStyle: 'solid',
      // borderWidth: 2,
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
      overflow: 'hidden'
    },
    avatarThumbnail: {
      position: 'absolute',
      height: 75,
      width: '96%',
      marginRight: '4%'
    },
    recipeCardTopLeftUpperContainer:{
      // borderStyle: 'solid',
      // borderWidth: 2,
      width: '96%',
      marginTop: '1%',
      marginBottom: '1%',
      marginLeft: '2%',
      marginRight: '2%'
    },
    recipeCardTopLeftLowerContainer:{
      flexDirection: 'row',
      // borderStyle: 'solid',
      // borderWidth: 2,
      width: '96%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '1%',
      marginBottom: '1%',
      marginLeft: '2%',
      marginRight: '2%'
    },
    recipeCardImageContainer: {
      // borderStyle: 'solid',
      // borderWidth: 2,
      height: 275,
      width: '100%'
    },
    thumbnail: {
      position: 'absolute',
      height: '100%',
      width: '100%',
    },
    recipeCardBottomContainer: {
      flexDirection: 'row',
      marginTop: '1%',
      marginBottom: '1%',
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
      fontSize: 16,
      color: "#505050",
      flex: 1
    },
    recipeCardBottomOther: {
      marginLeft: '10%',
      fontSize: 16,
      color: "#505050",
      flex: 1,
      textAlign: 'center'
    },
});