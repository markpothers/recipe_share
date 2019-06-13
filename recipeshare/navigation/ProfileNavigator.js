import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileScreen from '../src/profile/ProfileScreen';

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <Icon  size={25} color="#8d8d8d"
    focused={focused}
    name={
      Platform.OS === 'ios'
        ? `ios-information-circle${focused ? '' : '-outline'}`
        : 'account'
    }
    />
  ),
};

export default ProfileStack