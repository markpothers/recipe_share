import { StyleSheet } from 'react-native';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

export const styles = StyleSheet.create({
  mainPageContainer:{
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: responsiveWidth(100),
    height: responsiveHeight(9),
    marginTop: -responsiveHeight(3.5),
    // borderWidth: 1,
    // borderColor: 'red',
    // backgroundColor: '#104e01',
  },
  headerEnd: {
	width: responsiveWidth(15),
	height: '100%',
	justifyContent: 'center',
	alignItems: 'center',
	// borderWidth: 1,
  },
  headerMiddle:{
    // minWidth: responsiveWidth(70),
    height: '100%',
	justifyContent: 'center',
	// borderWidth: 1
  },
  headerDrawerButton: {
	// borderWidth: 1,
	height: '100%',
	width: '100%',
	alignItems: 'center',
	justifyContent: 'center'
  },
  headerIcon:{
    color: '#fff59b'
  },
  headerText:{
    fontSize: responsiveFontSize(3.5),
    color: '#fff59b',
    marginLeft: responsiveWidth(2)
  },
  background: {
    width: '100%',
    height: '100%',
  },
});
