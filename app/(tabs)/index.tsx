import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { View, Text, StyleSheet } from "react-native";


export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <Text style={styles.color}>안녕</Text>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  color: {
    color: "white",
  },
});