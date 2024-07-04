import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

import { Redirect } from 'expo-router';


export default function HomeScreen() {

  useEffect(() => {
    checkForToken();
  }, []);

  const checkForToken = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        router.replace('/explore');
      }
      else{
        router.replace('/Login');
      }
  };
  return (

        <View style={styles.container}>
        <Image style={styles.image}
          source={ require('../../assets/images/splash.png') }
        />
        </View>

    
    // <Redirect href="/Login" />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgb(255,0,206)',
},
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});