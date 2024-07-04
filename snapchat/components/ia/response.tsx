import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-native-markdown-display";

const API_KEY = "AIzaSyCmjhjXDlvPSF9YjxhEP7C-ZvHTWW6AUcU";
const genAI = new GoogleGenerativeAI(API_KEY);

export default function Response(props) {

  const [generatedText, setGeneratedText] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = props.prompt;
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = await response.text();
        setGeneratedText(text);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [props.prompt]);

  return (
    <View style={styles.response}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Image source={require("../../assets/images/robot.png")} style={styles.icon} />
          <Text style={{ fontWeight: 600 }}>MaBot</Text>
        </View>
      </View>
      {error ? (
        <Text style={{ color: "red" }}>{error}</Text>
      ) : (
        <Markdown>{generatedText}</Markdown>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  response: {
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
