import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	mainPageContainer: {
		flex: 1,
	},
	background: {
		flex: 1
	},
	backgroundImageStyle: {
	},
	logoutButton: {
		position: 'absolute',
		left: '81%',
		bottom: '3%',
		borderRadius: 100,
		height: 50,
		width: 50,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#d14c4c'
	},
	icon: {
		color: "#505050",
		marginLeft: '5%'
	},
	dbManualBackupButton: {
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
		left: '20%',
		borderRadius: 100,
		zIndex: 1
	},
	dbAutoBackupButton: {
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
		left: '35%',
		borderRadius: 100,
		zIndex: 1
	},
	// dbAutoBackupStopButton: {
	//   position: 'absolute',
	//   backgroundColor: '#fff59b',
	//   borderStyle: 'solid',
	//   borderWidth: 1,
	//   borderColor: '#104e01',
	//   width: 50,
	//   height: 50,
	//   justifyContent: 'center',
	//   alignItems: 'center',
	//   top: '86%',
	//   left: '50%',
	//   borderRadius: 100,
	//   zIndex: 1
	// },
	dbPrimaryRestoreButton: {
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
		left: '65%',
		borderRadius: 100,
		zIndex: 1
	},
	dbSecondaryRestoreButton: {
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
	filterIcon: {
		color: '#104e01',
	}
});
