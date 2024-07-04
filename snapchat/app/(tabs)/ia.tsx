import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import Response from "../../components/ia/response";
import Message from "../../components/ia/message";

export default function App() {
    const [inputText, setInputText] = useState("");
    const [listData, setListData] = useState([]);
    const flatListRef = useRef(null);

    const SearchInput = () => {
        setListData((prevList) => [...prevList, inputText]);
        setInputText("");
		setTimeout(() => Keyboard.dismiss(), 1000);
        Keyboard.dismiss();
    };

    useEffect(() => {
        if (listData.length > 0) {
            setTimeout(() => flatListRef.current.scrollToEnd({ animated: true }), 3000);
        }
    }, [listData]);

    return (
        <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <Image source={require("../../assets/images/robot.png")} style={styles.icon} />
                <Text style={{ fontSize: 24, fontWeight: "800", color: "#5A72A0" }}>MaBot</Text>
            </View>

            <FlatList
                style={{ paddingHorizontal: 16, marginBottom: 82 }}
                data={listData}
                renderItem={({ item }) => (
                    <View>
                        <Message message={item} />
                        <Response prompt={item} />
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                ref={flatListRef}
            />

            <View style={styles.searchBar}>
                <TextInput
                    placeholder="Demandez à MaBot"
                    style={styles.input}
                    value={inputText}
                    onChangeText={(text) => setInputText(text)}
                    selectionColor={"#323232"}
					onFocus={() => setTimeout(() => flatListRef.current.scrollToEnd({ animated: true }), 1000)}
                />
                <TouchableOpacity onPress={SearchInput}>
                    <Image source={require("../../assets/images/right-arrow.png")} style={styles.icon} />
                </TouchableOpacity>
            </View>
            
        </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        paddingTop: 36,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        margin: 8,
        gap: 8,
    },
    icon: {
        width: 30,
        height: 30,
    },
    searchBar: {
        backgroundColor: "#ffffff",
        width: "100%",
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
        paddingVertical: 16,
        gap: 8,
    },
    input: {
        backgroundColor: "#fff",
        width: "100%",
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 32,
        borderWidth: 0.1,
    },
});
