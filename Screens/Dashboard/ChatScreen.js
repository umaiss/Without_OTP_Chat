import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    Dimensions,
    Animated,
    Platform,
    Keyboard,
    Image   
} from 'react-native';
import firebase from 'firebase'

import styles from '../Constants/Styles'
import User from '../Model/User'
import { FlatList } from 'react-native-gesture-handler';

console.disableYellowBox = true;
const isIOS = Platform.OS === 'ios'

export default class ChatScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            person: {
                name: props.navigation.getParam('name'),
                phone: props.navigation.getParam('phone'),
            },
            textmessage: '',
            messageList: [],
            dbRef: firebase.database().ref('messages')
        }
        this.keyboardHeight = new Animated.Value(0)
        this.bottomPadding = new Animated.Value(60)
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('name', null)
        }
    }

    componentDidMount() {
        this.KeyboardShowListener = Keyboard.addListener(isIOS ? 'keyboardWillShow' : 'keyboardDidShow', (e) => this.keyboardEvent(e, true))
        this.KeyboardHideListener = Keyboard.addListener(isIOS ? 'keyboardWillHide' : 'keyboardDidHide', (e) => this.keyboardEvent(e, false))
        this.state.dbRef.child(User.phone).child(this.state.person.phone).on('child_added', (value) => {
            this.setState((prevState) => {
                return {
                    messageList: [...prevState.messageList, value.val()]
                }
            })
        })
    }

    componentWillUnmount() {
        this.state.dbRef.off()
        this.KeyboardShowListener.remove()
        this.KeyboardHideListener.remove()
    }

    keyboardEvent = (event, isShow) => {
        let heightOS = isIOS ? 60 : 80
        let bottomOS = isIOS ? 120 : 140
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: event.duration,
                toValue: isShow ? heightOS : 0
            }),
            Animated.timing(this.bottomPadding, {
                duration: event.duration,
                toValue: isShow ? bottomOS : 60
            })
        ]).start()
    }


    handelChange = key => val => {
        this.setState({ [key]: val })
    }

    convertTime = (time) => {
        let d = new Date(time)
        let c = new Date()
        let result = (d.getHours() < 10 ? '0' : ' ') + d.getHours() + ':'
        result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes()
        if (c.getDay !== d.getDay) {
            result = d.getDay() + ' ' + d.getMonth + ' ' + result
        }
        return result
    }

    sendMessage = async () => {
        if (this.state.textmessage.length > 0) {
            let msgId = this.state.dbRef.child(User.phone).child(this.state.person.phone).push().key
            let updates = {}
            let message = {
                message: this.state.textmessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: User.phone
            }
            updates[User.phone + '/' + this.state.person.phone + '/' + msgId] = message
            updates[this.state.person.phone + '/' + User.phone + '/' + msgId] = message
            this.state.dbRef.update(updates)
            this.setState({ textmessage: '' })
        }
    }

    renderRow = ({ item }) => {
        return (
            <View style={{
                flexDirection: 'row',
                maxWidth: '60%',
                alignSelf: item.from === User.phone ? "flex-end" : "flex-start",
                backgroundColor: item.from === User.phone ? "#00897b" : "#7cb342",
                borderRadius: 5,
                marginBottom: 10,
            }}>
                <Text style={{ color: '#fff', padding: 7, fontSize: 16 }}>
                    {item.message}
                </Text>
                <Text style={{ color: '#eee', padding: 3, fontSize: 12 }}>{this.convertTime(item.time)}</Text>
            </View>
        )
    }

    render() {
        let { height } = Dimensions.get('window')
        return (
            <KeyboardAvoidingView behavior='height' style={{ flex: 1 }}>
                <Animated.View style={[styles.bottomBar, { bottom: this.keyboardHeight }]}>
                    <TextInput
                        style={styles.inputMessage}
                        value={this.state.textmessage}
                        placeholder="Type Message ..... "
                        onChangeText={this.handelChange('textmessage')}
                    />
                    <TouchableOpacity onPress={this.sendMessage} style={styles.sendBtn}>
                        <Image source={require('../../Images/send.png')} style={{tintColor:'white',resizeMode:'contain',height:20}}/>
                    </TouchableOpacity>
                </Animated.View>
                <FlatList
                ref = {ref => this.flaList = ref}
                onContentSizeChange={()=>this.flaList.scrollToEnd({animated: true})}
                onLayout={()=>this.flaList.scrollToEnd({animated: true})}
                    style={{ paddingTop: 5,paddingHorizontal:5, height }}
                    data={this.state.messageList}
                    renderItem={this.renderRow}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={<Animated.View style={{height: this.bottomPadding}}/>}
                />
            </KeyboardAvoidingView>
        )
    }
}
