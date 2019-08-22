import React from 'react'
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalFullScreenContainer:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentsContainer:{
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01',
    backgroundColor: '#fff59b',
    width: '95%',
    borderRadius: 5,
    alignItems: 'center',
  },
  titleContainer: {
    justifyContent: 'center',
    marginTop: '2%',
    height: 27 ,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: '#104e01',
    fontSize: 16,
    fontWeight: 'bold'
  },
  filterButton: {
    position: 'absolute',
    backgroundColor: '#104e01',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#fff59b',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    top: '85.3%',
    left: '80.2%',
    borderRadius: 100,
    zIndex: 1
  },
  filterIcon:{
    color: '#fff59b',
  },
  columnsContainer: {
    flexDirection: 'row',
  }, 
  column: {
    flex: 1,
    marginLeft: '2%'
  },
  columnRow: {
    flexDirection: 'row',
  },
  switchContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '7%',
    marginRight: '4%',
  },
  categoryContainer: {
    marginLeft: '4%',
    width: '80%',
    justifyContent: 'center',
  },
  categoryText:{
    color: '#104e01'
  },
  bottomContainer: {
    alignItems: 'center',
  },
  bottomTopContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '5%',
    marginTop: '2%',
  },
  picker: {
    height: 44,
    marginLeft: '3%',
    backgroundColor: 'white',
    width: '60%',
    borderRadius: 5,
    justifyContent: 'center',
    borderStyle: 'solid',
    borderColor: '#104e01',
    borderWidth: 1,
    // marginTop: '2%'
  },
  clearFiltersButtonContainer: {
    height: 53,
    flexDirection: 'row',
    marginTop: '2%',
  },
  clearFiltersButton:{
    marginLeft: '5%',
    marginRight: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: 44,
    flexDirection:'row',
    borderRadius: 5,
    backgroundColor: '#fff59b',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01'
  },
  clearFiltersButtonText: {
    marginLeft: '5%',
    marginRight: '5%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#104e01',
  },
  clearFiltersIcon: {
    color: '#104e01',
  },
  applyFiltersButton:{
    marginLeft: '5%',
    marginRight: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: 44,
    flexDirection:'row',
    borderRadius: 5,
    backgroundColor: '#104e01',
  },
  applyFiltersButtonText: {
    marginLeft: '5%',
    marginRight: '5%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#fff59b',
  },
  applyFiltersIcon: {
    color: '#fff59b',
  },
  IOSPickerText: {
    marginLeft: '5%',
    fontSize: 18,
    bottom: 3,
  },
});