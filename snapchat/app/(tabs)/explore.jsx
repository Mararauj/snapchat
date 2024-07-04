import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useEffect } from "react";
import React from "react";
import * as MediaLibrary from 'expo-media-library';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import {
    Button,
    StyleSheet,
    Text,
    Alert,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    TextInput,
    Platform,
    LogBox,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { ThemedView } from "@/components/ThemedView";
import * as ImageManipulator from "expo-image-manipulator";
import { useFocusEffect } from '@react-navigation/native';


LogBox.ignoreLogs(['source.uri should not be an empty string']);

export default function App() {
    const [facing, setFacing] = useState("back");
    const [permission, requestPermission] = useCameraPermissions();
    const [image, setImage] = useState(null);
    const [time, setTime] = useState(10);
    const [camera, setCamera] = useState(null);
    const [cameraOn, setCameraOn] = useState(true);
    const [sendOn, setSendOn] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [searchArr, setSearchArr] = useState([]);
    const [percent, setPercent] = useState(0);
    const [focus, setFocus] = useState(false);
    const token = SecureStore.getItem("token");
    let resized = false



    useFocusEffect(
        React.useCallback(() => {
            // setFocus(true)
            return () => {
                // setFocus(false)
                notFocused()
                // if(camera)camera.session.startRunning()

            };
        }, [])
    );
    function notFocused() {
        return (
            <View><Text>Unfocused</Text></View>
        )
    }




    useEffect(() => {
        getUsers();
    }, []);

    async function getUsers() {
        fetch("https://snapchat.epidoc.eu/user", {
            headers: {
                Authorization: "Bearer " + token,
                'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmNvLmFyYXVqby1maWd1ZWlyZWRvQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjI0NDZ9.YvOb5Fuv0XtP4v5J6-MYvmfaK8CNAeAaCimxZLQEP78'
            },
            method: "GET",
        })
            .then((resp) => resp.json())
            .then((json) => {
                let tmp = [];
                for (let i = 0; i < json.data.length; i++) {
                    tmp.push(json.data[i]);
                }
                setUsers(tmp);
            });
    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setCameraOn(false);
            setImage(result.assets[0].uri);
        }
    }
    // async function resizeImg() {
    //     console.log(image)

    //     }
    // useEffect(() => { resizeImg() }, [image])

    async function resizeImg() {
        if (image != null && image != undefined && !resized) {
            // console.log(image)
            const manipResult = await ImageManipulator.manipulateAsync(
                image,
                [{ resize: { width: 640, height: 480 } }],
                // { format: 'png' }
            )
            // console.log(manipResult.uri)
            return manipResult.uri
            setImage(manipResult.uri)
        }

    }

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: "center" }}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    const toggleCameraFacing = () => {
        // console.log(facing)
        setFacing(facing => (facing === 'back' ? 'front' : 'back'));
    };


    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: "center" }}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    const sendTo = async (user) => {
        const imgUri = await resizeImg()
        const manipulatorResult = await ImageManipulator.manipulateAsync(imgUri, [], { base64: true, })
        const base64 = manipulatorResult.base64

        fetch("https://snapchat.epidoc.eu/snap", {
            headers: {
                Authorization: "Bearer " + token,
                'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmNvLmFyYXVqby1maWd1ZWlyZWRvQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjI0NDZ9.YvOb5Fuv0XtP4v5J6-MYvmfaK8CNAeAaCimxZLQEP78',
                "Content-Type": "application/json",
                accept: "application/json",
            },
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
                to: user._id,
                image: "data:image/png;base64," + base64,
                duration: time,
            }),
        }).then(function (response) {
            responseClone = response.clone();
            return response.json();
        })
            .then(function (data) {
                // console.log('success');
                setImage("");
                setCameraOn(true);
                setSendOn(false);
            }, function (rejectionReason) {
                console.log('Error parsing JSON from response:', rejectionReason, responseClone);
                responseClone.text()
                    .then(function (bodyText) {
                        console.log('Received the following instead of valid JSON:', bodyText);
                    });
            });
    };

    const changeTime = (arg) => {
        let tmp = time + arg;
        if (tmp < 1) tmp = 1;
        if (tmp > 20) tmp = 20;
        setTime(tmp);
    };

    const sendAll = async () => {
        const manipulatorResult = await ImageManipulator.manipulateAsync(
            image,
            [],
            { base64: true }
        );
        const base64 = manipulatorResult.base64;
        sendAllRec(0, base64);
    };

    const sendAllRec = (i, base64) => {
        if (users[i] === undefined) return;

        console.log(
            `${Math.ceil((i / users.length) * 100)}% : ${users[i].username}`
        );
        setPercent(Math.ceil((i / users.length) * 100));

        fetch("https://snapchat.epidoc.eu/snap", {
            headers: {
                Authorization: "Bearer " + token,
                'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmNvLmFyYXVqby1maWd1ZWlyZWRvQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjI0NDZ9.YvOb5Fuv0XtP4v5J6-MYvmfaK8CNAeAaCimxZLQEP78',
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
                to: users[i]._id,
                image: "data:image/png;base64," + base64,
                duration: time,
            }),
        })
            .then((e) => e.json())
            .then((json) => {
                console.log("success");
                console.log(json);
            })
            .catch((e) => {
                console.log(e);
            });

        setTimeout(() => sendAllRec(i + 1, base64), 1000);
    };

    const takePicture = async () => {
        if (camera) {
            const data = await camera.takePictureAsync(null);
            setImage(data.uri);
            setCameraOn(false);
        }
    };
    const save = async (data) => {
        MediaLibrary.saveToLibraryAsync(data);
        Alert.alert('Success', 'Photo saved');
    };
    const search = (s) => {
        setSearchValue(s);

        if (s === "") {
            setSearchArr([]);
            return;
        }

        let tmp = users.filter((e) =>
            e.username.toLowerCase().includes(s.toLowerCase())
        );
        setSearchArr(tmp);
    };


    const UserDisplay = ({ arr }) =>
        arr.map((e) => (
            <Button
                key={e._id}
                style={styles2.Button}
                title={e.username}
                onPress={() => sendTo(e)}
            />
        ));

    return (
        <View style={styles.container}>
            {cameraOn ? (
                <CameraView
                    style={styles.camera}
                    facing={facing}
                    ref={(ref) => setCamera(ref)}
                >
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={toggleCameraFacing}
                        >
                            <TabBarIcon name={'camera-reverse'} color={'white'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.galery} onPress={pickImage}>
                            <TabBarIcon name={'image'} color={'white'} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={takePicture}>
                            <Text style={styles.takePicture}>◯</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            ) : (

                <View style={styles2.container}>
                    {/* <ThemedView> */}
                    {sendOn ? (
                        <ScrollView style={styles2.sendTo}>
                            <Text></Text>
                            <Text></Text>
                            <Text></Text>
                            <Button
                                title={`Send to All Users ${percent === 0 ? "" : percent + "%"
                                    }`}
                                onPress={sendAll}
                            />
                            <Text></Text>
                            <Text></Text>
                            <Text></Text>
                            <Button
                                style={styles2.resetButton}
                                title="Reset Image"
                                onPress={() => {
                                    setImage("");
                                    setCameraOn(true);
                                    setSendOn(false);
                                }}
                            />
                            <Text></Text>
                            <Text></Text>
                            <TextInput
                                value={searchValue}
                                onChangeText={search}
                                style={styles2.input}
                            />
                            <Text></Text>
                            <Text></Text>
                            {searchArr.length > 0 ? (
                                <UserDisplay arr={searchArr} />
                            ) : (
                                <UserDisplay arr={users} />
                            )}
                            <Text></Text>
                            <Text></Text>
                            <Text></Text>
                        </ScrollView>
                    ) : (
                        <ThemedView style={styles2.container2}>
                            {image ? <Image source={{ uri: image }} style={styles2.image} /> : null}

                            <ThemedView style={styles2.buttons}>
                                <Button title="Reset Image" onPress={() => { setImage(""); setCameraOn(true); setSendOn(false); }} />
                                <Button onPress={() => { save(image); }} title="Save Image" />

                                <ThemedView style={styles2.bAndroid}>
                                    <TouchableOpacity style={styles2.plusMoins} onPress={() => changeTime(-1)}>
                                        <Text style={styles2.textR}>–</Text>
                                    </TouchableOpacity>

                                    <Text style={styles2.time}>{time}</Text>
                                    <TouchableOpacity style={styles2.plusMoins} onPress={() => changeTime(1)}>
                                        <Text style={styles2.textR}>+</Text>
                                    </TouchableOpacity>

                                </ThemedView>

                                <Button title="Send !" onPress={() => setSendOn(true)} />
                            </ThemedView>


                        </ThemedView>
                    )}</View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    galery: {
        // alignSelf: "center",
        // alignItems: "center",
    },
    camera: {
        flex: 1,
        display: "block",
        justifyContent: "center",
    },
    takePicture: {
        fontSize: 100,
        color: "white",
    },
    buttonContainer: {
        flex: 1,
        // flexDirection: 'row',
        backgroundColor: "transparent",
        alignSelf: "center",
        alignItems: "center",
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: "flex-end",
        marginLeft: 200,
        // alignItems: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",

    },
    image: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
});

const styles2 = StyleSheet.create({
    container: {
        position: "relative",
        flex: 1,
        justifyContent: "center",
    },
    container2: {
        // flex: 1,
        // justifyContent: "center",
        height: "100%",
        width: "100%",
    },
    sendTo: {
        overflow: "scroll",
    },
    resetButton: {
        position: "fixed",
        top: "50px",
    },
    Button: {
        backgroundColor: "white",
        color: "black",
        width: "100px",
    },
    buttons: {
        flex: 0,
        justifyContent: "space-evenly",
        flexDirection: "row",
    },
    image: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    txt: {
        fontSize: 100,
    },
    plusMoins: {
        alignItems: 'center',
        // backgroundColor: '#686D76',
        padding: 10,
    },
    textR: {
        color: "red",
        fontSize: 15,
    },
    time: {
        color: "red",
        fontSize: 30,
    },
    bAndroid: {
        display: "flex",
        flexDirection: "row",
    },
    input: {
        backgroundColor: "white",
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        // width: '50%',
    },
});
