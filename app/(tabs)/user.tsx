import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import React, { useState } from "react";
import {
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Pressable,
  Alert,
  useColorScheme,
} from "react-native";
import * as Crypto from "expo-crypto";
import { ThemedText } from "@/components/ThemedText";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export default function HomeScreen() {
  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [loading,setLoading] = useState<boolean>(false);

  const themeColor = useColorScheme();

  const changeId = (text: string) => {
    setId(text);
  };

  const changePw = (text: string) => {
    setPw(text);
  };

  const submit = async () => {
    if (id && pw) {
      setLoading(true);
      const password = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        String(pw)
      );
      await axios.post('https://daesonamu.kro.kr/api/login',{
        stId:id,
        password
      }).then(
        response=>{
          if(response.status==200) {
            Alert.alert('로그인 성공');
          }
        }
      ).catch(
        err=>{
          if(err.response.status == 401) {
            Alert.alert('비밀번호가 틀립니다.');
          }
          if(err.response.status == 404) {
            Alert.alert('존재하지 않는 회원입니다.');
          }
        }
      )
    } else {
      Alert.alert("모든 입력창을 모두 입력해주세요.");
    }
    setLoading(false);
  };

  return (
    <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>로그인하기</ThemedText>
        <TextInput
          onChangeText={changeId}
          value={id}
          placeholder="아이디"
          style={[
            styles.input,
            themeColor == "dark" ? styles.darkText : styles.brightText,
          ]}
          textContentType="username"
        />
        <TextInput
          onChangeText={changePw}
          value={pw}
          placeholder="비밀번호"
          style={
            [styles.input,
            themeColor == "dark" ? styles.darkText : styles.brightText]
          }
          secureTextEntry
          textContentType="password"
        />
        <TouchableOpacity
          onPress={submit}
          style={loading ? styles.disalbedBtn : styles.button}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "로그인중..." : "로그인"}
          </Text>
        </TouchableOpacity>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 70,
    position: "relative",
  },
  input: {
    height: 50,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    width: 300,
    height: 50,
    backgroundColor: "rgb(10,200,400)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
  },
  disalbedBtn: {
    width: 300,
    height: 50,
    backgroundColor: "rgb(10,150,255)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
  title: {
    fontSize: 25,
    alignSelf: "flex-start",
    marginLeft: 15,
    marginBottom: 20,
  },
  darkText : {
    color:'white'
  },
  brightText : {
    color:'black'
  }
});
