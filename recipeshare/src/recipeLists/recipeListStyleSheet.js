import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    recipeCard: {
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
      width: '100%',
      marginTop: '1%',
      marginBottom: '1%'
    },
    recipeCardTopLeftContainer: {
      flex: 8,
      justifyContent: 'center'
    },
    recipeCardTopRightContainer: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    avatarThumbnail: {
      height: 60,
      width: '96%',
      marginRight: '4%',
      borderRadius: 5,
    },
    recipeCardTopLeftUpperContainer:{
      width: '96%',
      marginLeft: '2%',
      marginRight: '2%'
    },
    recipeCardTopLeftMiddleContainer:{
      width: '96%',
      marginLeft: '2%',
      marginRight: '2%',
      flexDirection: 'row'
    },
    recipeCardTopLeftLowerContainer:{
      flexDirection: 'row',
      width: '96%',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: '2%',
      marginRight: '2%'
    },
    recipeCardImageContainer: {
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
    },
    recipeCardBottomSubContainers: {
      flexDirection: 'row',
      flex: 1,
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
    }
});