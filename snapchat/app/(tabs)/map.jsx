import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { supabase } from '@/utils/supabase.ts';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';

export default function App() {
    const [userLocation, setUserLocation] = useState(null);
    const [friendsCoords, setFriendsCoords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log("Permission to access location was denied");
                return;
            }

            const location = await Location.getCurrentPositionAsync();
            setUserLocation(location);
            await setPos(location.coords);
            setLoading(false);
        })();
    }, []);

    const setPos = async (arg) => {
        const token = await SecureStore.getItemAsync('token');
        const id = await SecureStore.getItemAsync('id');

        let { data: GPS, error } = await supabase
            .from('GPS')
            .select("*")
            .eq('id', id);

        if (GPS.length === 0) {
            const { data, error } = await supabase
                .from('GPS')
                .insert([{ longitude: arg.longitude, latitude: arg.latitude, id: id }])
                .select();
            if (error) console.log(error);
            getFriendsPos(token);
        } else {
            const { data, error } = await supabase
                .from('GPS')
                .update({ longitude: arg.longitude, latitude: arg.latitude })
                .eq('id', id)
                .select();
            if (error) console.log(error);
            getFriendsPos(token);
        }
    };

    const getFriendsPos = async (token) => {
        setFriendsCoords([]);
        fetch('https://snapchat.epidoc.eu/user/friends', {
            headers: {
                Authorization: 'Bearer ' + token,
                'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmNvLmFyYXVqby1maWd1ZWlyZWRvQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjI0NDZ9.YvOb5Fuv0XtP4v5J6-MYvmfaK8CNAeAaCimxZLQEP78',
            },
            method: 'GET',
        }).then(rep => rep.json())
            .then(async (friends) => {
                friends = friends.data;

                let ids = [];
                friends.forEach(friend => {
                    ids.push(friend._id);
                });

                let { data: COORDS, error } = await supabase
                    .from('GPS')
                    .select("*")
                    .in('id', ids);

                COORDS.forEach(e => {
                    let u = '';
                    friends.forEach(f => {
                        if (f._id == e.id) u = f.username;
                    });
                    setFriendsCoords(friendsCoords => [...friendsCoords, { longitude: e.longitude, latitude: e.latitude, username: u }]);
                });
            })
            .catch(e => console.log(e));
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView style={{ width: '100%', height: '100%' }}
            initialRegion={{
                latitude: userLocation ? userLocation.coords.latitude : 37.78825,
                longitude: userLocation ? userLocation.coords.longitude : -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}>
                {userLocation && <Marker coordinate={userLocation.coords} title='YOU' />}
                {friendsCoords.map((e, key) => <Marker key={key} coordinate={{ latitude: e.latitude, longitude: e.longitude }} title={e.username} />)}
            </MapView>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    paragraph: {
        fontSize: 18,
        textAlign: 'center',
    },
});