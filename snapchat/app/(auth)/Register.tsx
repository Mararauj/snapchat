import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import GestureRecognizer from "react-native-swipe-gestures";


const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const profilePicture = '';

  const handleRegister = () => {
    const data = {
      email,
      username,
      profilePicture,
      password
    };

    axios.post('https://snapchat.epidoc.eu/user/', data, {headers: {'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmNvLmFyYXVqby1maWd1ZWlyZWRvQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjI0NDZ9.YvOb5Fuv0XtP4v5J6-MYvmfaK8CNAeAaCimxZLQEP78'}})
      .then(response => {
        Alert.alert('Success', 'Registration successful');
        router.replace('/Login');
      })
      .catch(error => {
        Alert.alert('Error', 'Registration failed');
      });
  };

  return (
    <GestureRecognizer style={styles.container}
    onSwipeLeft={() => router.replace("/Login")}>
      <Image source={require('../../assets/images/logo.png')} style={styles.img}/>
      <Text></Text>
      <Text style={styles.title}>Register</Text>
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
        placeholder="Username"
        placeholderTextColor="black"
        value={username}
        onChangeText={setUsername}
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
      <Button title="Register" onPress={handleRegister} />
    </GestureRecognizer>

    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    // alignItems: 'center',
    backgroundColor: 'rgb(255,0,206)',
  },
  img: {
    width: 127, 
    height: 120,
    alignSelf: 'center',

  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
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

export default RegisterScreen;