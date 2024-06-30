import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";


export default function HomeScreen() {

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>대소나무숲</ThemedText>
      <TouchableOpacity onPress={()=>{navigation.navigate('board')}}>
        <ThemedView
          style={styles.navBox}
          darkColor="black"
          lightColor="#F9F9F9"
        >
          <ThemedText>자유게시판</ThemedText>
        </ThemedView>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop:50
  },
  navBox: {
    width: 300,
    height: 60,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 25,
    alignSelf: "flex-start",
    marginLeft: 15,
    marginBottom: 20,
    paddingVertical: 5,
  },
});