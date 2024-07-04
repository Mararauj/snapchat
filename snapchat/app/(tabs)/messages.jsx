import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Image, RefreshControl, ThemedView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default function TabTwoScreen() {
    const [unseenSnaps, setUnseenSnaps] = useState([]);
    const [displaysnap, setDisplaysnap] = useState('');
    const [snapOn, setSnapOn] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [displayTime, setDisplayTime] = useState(null);

    useEffect(() => {
        fetchUnseenSnaps();
    }, []);

    async function fetchUnseenSnaps() {

        setRefreshing(true);
        setUnseenSnaps(snaps);
        setRefreshing(false);
    }

    async function fetchUnseenSnaps() {
        const token = await SecureStore.getItemAsync('token');
        fetch('https://snapchat.epidoc.eu/user/friends', {
            headers: {
                Authorization: 'Bearer ' + token,
                'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmNvLmFyYXVqby1maWd1ZWlyZWRvQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjI0NDZ9.YvOb5Fuv0XtP4v5J6-MYvmfaK8CNAeAaCimxZLQEP78'
            },
            method: 'GET',
        }).then(rep => rep.json())
            .then(friends => {
                let idFriendsList = []
                friends.data.forEach(f => {
                    idFriendsList.push(f._id)
                });
                fetch('https://snapchat.epidoc.eu/snap/', {
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmNvLmFyYXVqby1maWd1ZWlyZWRvQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjI0NDZ9.YvOb5Fuv0XtP4v5J6-MYvmfaK8CNAeAaCimxZLQEP78'
                    },
                    method: 'GET',
                })
                    .then(resp => resp.json())
                    .then(e => {
                        const snapPromises = e.data.map(elem => {
                            return fetch('https://snapchat.epidoc.eu/user/' + elem.from, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmNvLmFyYXVqby1maWd1ZWlyZWRvQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjI0NDZ9.YvOb5Fuv0XtP4v5J6-MYvmfaK8CNAeAaCimxZLQEP78'
                                },
                                method: 'GET',
                            })
                                .then(resp => resp.json())
                                .then(u => {
                                    u = u.data;
                                    return {
                                        id: elem._id,
                                        date: elem.date,
                                        username: u.username,
                                        profilePicture: u.profilePicture,
                                        userId: u._id,
                                        friend: idFriendsList.includes(u._id)
                                    };
                                });
                        });

                        Promise.all(snapPromises).then(snaps => {
                            setUnseenSnaps(snaps);
                        });
                    })
                    .catch(console.log);
            })
    }

    async function openSnap(arg) {
        const token = await SecureStore.getItemAsync('token');
        fetch('https://snapchat.epidoc.eu/snap/' + arg.id, {
            headers: {
                Authorization: 'Bearer ' + token,
                'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmNvLmFyYXVqby1maWd1ZWlyZWRvQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjI0NDZ9.YvOb5Fuv0XtP4v5J6-MYvmfaK8CNAeAaCimxZLQEP78'
            },
            method: 'GET',
        })
            .then(resp => resp.json())
            .then(u => {
                createTmpDisplaySnap(u.data.image, u.data.duration);
                fetch('https://snapchat.epidoc.eu/snap/seen/' + arg.id, {
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmNvLmFyYXVqby1maWd1ZWlyZWRvQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjI0NDZ9.YvOb5Fuv0XtP4v5J6-MYvmfaK8CNAeAaCimxZLQEP78'
                    },
                    method: 'PUT',
                }).then(() => {
                    fetchUnseenSnaps();
                });
            })
            .catch(console.log);
    }

    async function createTmpDisplaySnap(arg, t) {
        const base64Code = arg.replace("data:image/png;base64,", "").replace("data:image/jpeg;base64,", "");
        const filename = FileSystem.documentDirectory + "tmp.png";
        await FileSystem.writeAsStringAsync(filename, base64Code, {
            encoding: FileSystem.EncodingType.Base64,
        }).then(() => {
            setDisplaysnap(arg);
            setSnapOn(true);
            downTime(t)
            setTimeout(() => {
                setSnapOn(false);
            }, t * 1000);
        });
    }
    function downTime(arg) {
        if (arg == -1) return
        setDisplayTime(arg)
        setTimeout(() => {
            downTime(arg - 1)
        }, 1000);
    }

    async function setAllAsSeen() {
        setSeenRec(0);
    }

    async function setSeenRec(i) {
        const token = await SecureStore.getItemAsync('token');
        if (unseenSnaps[i] == undefined) return;
        fetch('https://snapchat.epidoc.eu/snap/seen/' + unseenSnaps[i].id, {
            headers: {
                Authorization: 'Bearer ' + token,
                'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmNvLmFyYXVqby1maWd1ZWlyZWRvQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjI0NDZ9.YvOb5Fuv0XtP4v5J6-MYvmfaK8CNAeAaCimxZLQEP78'
            },
            method: 'PUT',
        }).then(() => {
            fetchUnseenSnaps();
            setTimeout(() => {
                setSeenRec(i + 1);
            }, 500);
        }).catch(async (e) => {
            let json = await e.json();
            console.log(json);
        });
    }

    function swipeDown() {
        if (snapOn) {
            setSnapOn(false);
        }
    }
    async function addFriend(arg) {
        const token = await SecureStore.getItemAsync('token');
        // console.log('addFriend : ')
        // console.log(arg)

        fetch('https://snapchat.epidoc.eu/user/friends', {
            headers: {
                Authorization: 'Bearer ' + token,
                'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmNvLmFyYXVqby1maWd1ZWlyZWRvQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjI0NDZ9.YvOb5Fuv0XtP4v5J6-MYvmfaK8CNAeAaCimxZLQEP78',
                "Content-Type": "application/json",
                accept: "application/json",
            },
            method: arg.friend ? 'DELETE' : 'POST',
            body: JSON.stringify({
                friendId: arg.userId
            })
        }).then(e => e.json())
            .then(e => {
                console.log(e)
                fetchUnseenSnaps()
            })
            .catch(e => console.log(e))
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={fetchUnseenSnaps}
                />
            }
        >
            <View onTouchStart={e => this.touchY = e.nativeEvent.pageY}
                onTouchEnd={e => {
                    if (this.touchY - e.nativeEvent.pageY < 20) swipeDown();
                }}>
                <Text></Text><Text></Text><Text></Text>
                {snapOn ?
                    <>
                        <Image source={{ uri: displaysnap }} style={{ width: 420, height: 780 }} />
                        <Text style={{ position: 'absolute', right: 5, top: '5%', fontSize: 30, backgroundColor: 'white', padding: 5 }}>{displayTime}</Text>
                    </>
                    :
                    <>
                        <Text></Text>
                        <Button
                            title='Set all as Seen'
                            onPress={setAllAsSeen}
                        />
                        <Text></Text><Text></Text>
                        {unseenSnaps.map((e, key) =>
                            <View key={key} style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Button
                                    title={e.username}
                                    onPress={() => { openSnap(e) }}
                                />
                                <Button
                                    title={e.friend ? 'Remove Friend' : 'Add Friend !'}
                                    onPress={() => { addFriend(e) }}
                                />
                                {/* // <ThemedView key={e.id} style={{flex:1}}>
                            //     <Button
                            //         title='Add Friend'
                            //         onPress={() => { addFriend(e) }}
                            //     />

                            // </ThemedView> */}
                            </View>
                        )}
                    </>
                }
            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({});
