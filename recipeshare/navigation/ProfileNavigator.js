import React from 'react';
// import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator } from 'react-navigation';
import Profile from '../src/profile/profile'
import AppHeader from './appHeader'
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createStackNavigator } from '@react-navigation/stack';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions'

const Stack = createStackNavigator()

ProfileStack = () => {
  return (
    <Stack.Navigator
    initialRouteName="MyRecipeBook"
    headerMode="screen"
    screenOptions={{
      headerStyle: {
        backgroundColor: '#104e01',
        height: responsiveHeight(9),
      },
      headerTitleStyle: {
        marginHorizontal: 0
      },
      headerTitleContainerStyle: {
        position: 'relative',
        left: 0,
        right: 0,
      }
    }}
  >
    <Stack.Screen
      name="Profile"
      options={
        {headerTitle: props => <AppHeader {...props} text={"Profile"}/>}
      }
      component={Profile}
    />
  </Stack.Navigator>
  )
}

// const ProfileStack = createStackNavigator({
//   Profile: Profile,
// },{
//   defaultNavigationOptions: {
//     headerTitle: <AppHeader text={"My Recipe Book"}/>,
//     headerStyle: {    //styles possibly needed if app-wide styling doesn't work
//       backgroundColor: '#104e01',
//       // borderStyle: 'solid',
//       // borderWidth: 2,
//       height: 50,  // cannot be less than 24 as includes space for the notification bar
//     },
//     headerTintColor: '#fff59b',
//     // headerTitleStyle: {
//     //   fontWeight: 'bold',
//     // },
//   }
// });

// ProfileStack.navigationOptions = {
//   tabBarLabel: 'Profile',
//   tabBarIcon: ({ focused }) => (
//     <Icon  size={25} color="#8d8d8d"
//     focused={focused}
//     name={
//       Platform.OS === 'ios'
//         ? `ios-information-circle${focused ? '' : '-outline'}`
//         : 'account'
//     }
//     />
//   ),
// };

export default ProfileStack