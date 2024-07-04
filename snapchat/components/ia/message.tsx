import React, {useState} from "react";
import { StyleSheet, View, Image, Text, Alert } from "react-native";
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';


export default function Message(props) {
	
	const token = SecureStore.getItem('token')
    const id = SecureStore.getItem('id')

    const [username, setUsername] = useState('');

	axios.get('https://snapchat.epidoc.eu/user/' + id, { headers: { "Authorization": 'Bearer ' + token, 'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmNvLmFyYXVqby1maWd1ZWlyZWRvQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjI0NDZ9.YvOb5Fuv0XtP4v5J6-MYvmfaK8CNAeAaCimxZLQEP78' } })
        .then(response => {
            setUsername(response.data.data.username);

        })
        .catch(error => {
            Alert.alert('Error')
        });

	return (
		<View style={styles.message}>
			<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
				<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
					<Image source={require("../../assets/images/user.png")} style={styles.icon} />
					<Text style={{ fontWeight: 500 }}>{username}</Text>
				</View>
			</View>
			<Text style={{ fontSize: 14, width: "100%", flex: 1, paddingLeft: 0 }}>{props.message}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	message: {
		flexDirection: "column",
		gap: 8,
		backgroundColor: "#F075AA",
		marginBottom: 8,
		padding: 16,
		borderRadius: 16,
	},
	icon: {
		width: 20,
		height: 20,
	},
});