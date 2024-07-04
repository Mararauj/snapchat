import React, { useEffect, useRef, useState } from 'react';
import { Button, SafeAreaView, View, Text, StyleSheet, Image, Platform } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from 'expo-secure-store';
import { supabase } from '@/utils/supabase.ts';
import * as ImageManipulator from "expo-image-manipulator";
import { CameraView } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
// import { mediaDevices, RTCView } from 'react-native-webrtc';


export default function App() {
    const [streaming, setStreaming] = useState('Start')
    const [camera, setCamera] = useState(null);
    const [img, setImg] = useState(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const id = SecureStore.getItemAsync('id')



    useFocusEffect(
        React.useCallback(() => {
            // setFocus(true)
            return () => {
                // setFocus(false)
                notFocused()
                streamOn.current = false
                setStreaming('Start')
                // if(camera)camera.session.startRunning()

            };
        }, [])
    );
    function notFocused() {
        return (
            <View><Text>Unfocused</Text></View>
        )
    }

    const streamOn = useRef(false)

    function changeStatus() {
        if (!streamOn.current) {
            setTimeout(() => { getImg() }, 3000)
            setStreaming('Stop')
        } else {
            setStreaming('Start')
            setTimeout(() => { getImg() }, 3000)
        }
        streamOn.current = !streamOn.current
        // console.log(streamOn.current)
    }
    if (camera) {
        // console.log('there is a camera in this instance')
        takeImageHandler()
    }

    async function takeImageHandler() {
        try {
            const data = await camera.takePictureAsync(null);
            const manipResult = await ImageManipulator.manipulateAsync(
                data.uri,
                [{ resize: { width: 400, height: 900 } }],
                { base64: true }
                // { format: 'png' }
            )
            // console.log(Object.keys(manipResult))


            const { dt, error } = await supabase
                .from('Streaming')
                .update({ img: manipResult.base64 })
                .eq('id', '1')
                .select()

            if (error) console.log(error)
            takeImageHandler()
        } catch (e) {
            if (!camera) {
                // console.log('No cam')
                return
            } else {
                // console.log(e)
                setTimeout(() => { takeImageHandler() }, 2000)
            }
        }
    };

    useEffect(() => {
        getImg()
        // let image = useRef('')
    }, [])
    async function getImg() {
        if (!streamOn.current) {

            let { data: Streaming, error } = await supabase
                .from('Streaming')
                .select("img")

                // Filters
                .eq('id', '1')

            if (error) {
                console.log(error)
            } else {
                // console.log(Object.keys(Streaming[0].img))
                // console.log(Streaming[0].img)
                const base64Code = Streaming[0].img.replace("data:image/png;base64,", "").replace("data:image/jpeg;base64,", "");
                const filename = FileSystem.documentDirectory + "tmp.png";
                await FileSystem.writeAsStringAsync(filename, base64Code, {
                    encoding: FileSystem.EncodingType.Base64,
                }).then(() => {
                    // console.log(filename)
                    if (Platform === 'ios') {
                        setImg(Streaming[0].img)
                        // image = useRef(Streaming[0].img)
                    } else {
                        setImg("data:image/png;base64," + base64Code)
                        // image = useRef("data:image/png;base64," + base64Code)
                    }
                });
                getImg()
            }
        }
    }

    return (
        <View style={styles.container}>
            <Text /><Text /><Text /><Text />
            <Button title={streaming} onPress={() => { changeStatus(); }} />



            {streaming == 'Stop' ?
                <CameraView
                    style={styles.camera}
                    ref={(ref) => setCamera(ref)}
                    // ref={camera}
                    onCameraReady={() => setIsCameraReady(true)}
                />
                : <Image src={img} style={{ height: 900, width: 400, resizeMode: 'cover' }} />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
        // display: 'none'
    },
});