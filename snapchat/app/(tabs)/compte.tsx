import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import GestureRecognizer from "react-native-swipe-gestures";



const Compte = () => {

    const token = SecureStore.getItem('token')
    const id = SecureStore.getItem('id')

    const [username, setUsername] = useState('');
    const [friends, setFriends] = useState<Array<Object>>([]);

    useEffect(() => {
        getFriends()
    }, [])

    async function saveToken(arg: string) {
        await SecureStore.setItemAsync('token', arg)
    }

    async function saveID(arg: string) {
        await SecureStore.setItemAsync('id', arg)
    }

    axios.get('https://snapchat.epidoc.eu/user/' + id, { headers: { "Authorization": 'Bearer ' + token, 'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmNvLmFyYXVqby1maWd1ZWlyZWRvQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjI0NDZ9.YvOb5Fuv0XtP4v5J6-MYvmfaK8CNAeAaCimxZLQEP78' } })
        .then(response => {
            setUsername(response.data.data.username);

        })
        .catch(error => {
            Alert.alert('Error')
            saveToken('')
            saveID('')
            router.replace('/Login')
        });

    const logout = () => {

        saveToken('')
        saveID('')
        router.replace('/Login')

    };



    async function getFriends() {
        fetch('https://snapchat.epidoc.eu/user/friends', {
            headers: {
                Authorization: 'Bearer ' + token,
                'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmNvLmFyYXVqby1maWd1ZWlyZWRvQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjI0NDZ9.YvOb5Fuv0XtP4v5J6-MYvmfaK8CNAeAaCimxZLQEP78'
            },
            method: 'GET',
        }).then(e => e.json()).then(e => {
            setFriends(e.data)
        })
    }
    return (
            <GestureRecognizer
             style={styles.container}
            onSwipeLeft={() => router.replace("/map")}
            onSwipeRight={() => router.replace("/explore")}>
            <Text style={styles.username}>Username : {username}</Text>
            <Text></Text>
            <Button title='logout' onPress={logout} />

            <Text></Text>
            <Text></Text>
            <View>
                <Text style={{fontSize: 20, textDecorationStyle: 'solid', textDecorationColor: 'black', textDecorationLine: 'underline', color: '#3ABEF9'}}>Friends List</Text>
                {friends.map((e, key) => (<Text style={{color: '#3ABEF9'}} key={key}>{e.username}</Text>))}
            </View>
        </GestureRecognizer>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,

    },
    username: {
        color: '#3ABEF9',
    }
})


export default Compte;
