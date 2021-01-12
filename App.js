import React, { Component } from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Image } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import HomeScreen from './Screens/Dashboard/HomeScreen';
import LoginScreen from './Screens/Login/LoginScreen';
import AuthLodingScreen from './Screens/Auth/Auth';
import ChatScreen from './Screens/Dashboard/ChatScreen';
import SignUpScreen from './Screens/SignUp/SignUpScreen';
import ProfileScreen from './Screens/Dashboard/ProfileScreen';

console.disableYellowBox = true;

const AppStack = createStackNavigator({
  Home: HomeScreen,
  Chat: ChatScreen,
})

AppStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = navigation.state.index === 0
  return {
    tabBarVisible
  }
}

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  SignUp: SignUpScreen,
})

const TabNavigator = createBottomTabNavigator({
  Chats: AppStack,
  ProFile: ProfileScreen
}, {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focuesd, horizontal, tintColor }) => {
      const { routeName } = navigation.state
      let imageName = require('./Images/Chats.png')
      if (routeName === 'ProFile') {
        imageName = require('./Images/settings.png')
      }
      return <Image source={imageName} style={{ width: 25, resizeMode: 'contain', tintColor }} />
    }
  }),
  tabBarOptions: {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray'
  }
})


export default createAppContainer(createSwitchNavigator({
  AuthLoading: AuthLodingScreen,
  App: TabNavigator,
  Auth: AuthStack
},
  {
    initialRouteName: 'AuthLoading'
  }))