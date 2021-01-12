import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator, Image } from 'react-native';

import firebase from 'firebase'

import User from '../Model/User'

export default class LoginScreen extends Component {

  static navigationOptions = {
    header: null,
  }

  state = {
    email: '',
    phoneNumber: '',
    password: '',
    isLoading: false,
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  /* updateInputVal = key => val => {
     this.setState({ [key]: val })
   }*/

  userLogin = async () => {
    if (this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to signin!')
    } else {
      this.setState({
        isLoading: true,
      })
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          console.log(res)
          console.log('User logged-in successfully!')
          this.setState({
            isLoading: false,
            email: '',
            password: ''
          })
          this.props.navigation.navigate('PhoneAuth')
        })
        .catch(error => this.setState({ errorMessage: error.message }))
    }
  };

  render() {
    console.log('User logged-in successfully!' + this.state.email + this.state.password);
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      )
    }

    return (

      <View style={styles.container}>
<View style={{alignItems:'center'}}>
        <Image source={require('../../Images/logo.jpeg')} style={{ height: 100, width: 100,marginTop:20, }}  />
       </View>
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <TextInput
            style={styles.inputStyle}
            placeholder="Email"
            value={this.state.email}
            onChangeText={(val) => this.updateInputVal(val, 'email')}
          />

          <TextInput
            style={styles.inputStyle}
            placeholder="Password"
            value={this.state.password}
            onChangeText={(val) => this.updateInputVal(val, 'password')}
            maxLength={15}
            secureTextEntry={true}
          />

          <Button
            color="#458B00"
            title="Signin"
            onPress={() => this.userLogin()}
          />

          <Text
            style={styles.loginText}
            onPress={() => this.props.navigation.navigate('SignUp')}>
            Don't have account? Click here to signup
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    padding: 35,
    backgroundColor: '#fff'
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1
  },
  loginText: {
    color: '#458B00',
    marginTop: 25,
    textAlign: 'center'
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});