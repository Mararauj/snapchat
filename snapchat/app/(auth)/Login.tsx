import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import GestureRecognizer from "react-native-swipe-gestures";

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const data = {
            email,
            password
        };

        axios.put('https://snapchat.epidoc.eu/user/', data, {headers: {'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmNvLmFyYXVqby1maWd1ZWlyZWRvQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjI0NDZ9.YvOb5Fuv0XtP4v5J6-MYvmfaK8CNAeAaCimxZLQEP78'}})
            .then(response => {
                saveToken(response.data.data.token)
                saveID(response.data.data._id)
                router.replace('/explore');
            })
            .catch(error => {
                setPassword('');
                Alert.alert('Error', 'Login failed');
            });
    };

    async function saveToken(arg :string) {
        await SecureStore.setItemAsync('token', arg)
    }

    async function saveID(arg :string) {
        await SecureStore.setItemAsync('id', arg)
    }

    return (
        <GestureRecognizer style={styles.container}
        
        onSwipeRight={() => router.replace("/Register")}>
            <Image source={require('../../assets/images/logo.png')} style={styles.img}/>
            <Text></Text>
            <Text style={styles.title}>Login</Text>
            <Text></Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="black"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="black"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />
            <Text></Text>
            <Button title="Login" onPress={handleLogin} />
        </GestureRecognizer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgb(255,0,206)',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    img: {
        width: 127, 
        height: 120,
        alignSelf: 'center',
    
      },
    input: {
        height: 40,
        color: 'black',
        borderColor: '#fff',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default LoginScreen;