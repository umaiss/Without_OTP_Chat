import React, { Component } from 'react';
import {
  View,
  StatusBar,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';

import firebase from 'firebase';
import User from '../Model/User'

console.disableYellowBox = true;

export default class AuthLodingScreen extends Component{
    constructor (props) {
        super(props)
        this._bootstrapAsync()

    }
    
    componentWillMount() {
        var firebaseConfig = {
           apiKey: "AIzaSyCHVnCmbWZsNA2v0ePm4olN070Ogaw8SkA",
            authDomain: "fir-de168.firebaseapp.com",
            projectId: "fir-de168",
            storageBucket: "fir-de168.appspot.com",
            messagingSenderId: "737008127293",
            appId: "1:737008127293:web:abf33b0031f4db499a0954",
            measurementId: "G-DZK7EJC3TC"
          };
          firebase.initializeApp(firebaseConfig);
    }

    _bootstrapAsync = async() => {
        User.phone = await AsyncStorage.getItem('UserPhone')
        this.props.navigation.navigate(User.phone ? 'App' : 'Auth')
    }

    render() {
        return(
            <View>
                <ActivityIndicator />
                <StatusBar barStyle= 'default' />
            </View>
        )
    }
}