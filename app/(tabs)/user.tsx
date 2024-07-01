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
import userStore from "@/store/userStore";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function HomeScreen() {
  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  

  const themeColor = useColorScheme();

  const setUserId = userStore((state) => state.setUserId);
  const storedStId = userStore((state) => state.stId);
  const setStId = userStore((state) => state.setStId);
  const clearUserId = userStore((state) => state.clearUserId);

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
      await axios
        .post("https://daesonamu.kro.kr/api/login", {
          stId: id,
          password,
        })
        .then((response) => {
          if (response.status == 200) {
            Alert.alert("로그인 성공");
            setUserId(response.data.data.id);
            setStId(response.data.data.stId);
            setId('');
            setPw('');
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status == 401) {
            Alert.alert("비밀번호가 틀립니다.");
          }
          if (err.response.status == 404) {
            Alert.alert("존재하지 않는 회원입니다.");
          }
        });
    } else {
      Alert.alert("모든 입력창을 모두 입력해주세요.");
    }
    setLoading(false);
  };

  return (
    <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
      {storedStId == null ? (
        <ThemedView style={styles.container}>
          <ThemedText style={styles.title}>로그인하기</ThemedText>
          <KeyboardAwareScrollView style={{width:'100%'}}>
            <TextInput
              onChangeText={changeId}
              value={id}
              placeholder="아이디"
              placeholderTextColor="gray"
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
              placeholderTextColor="gray"
              style={[
                styles.input,
                themeColor == "dark" ? styles.darkText : styles.brightText,
              ]}
              secureTextEntry
              textContentType="password"
            />
          </KeyboardAwareScrollView>
          <TouchableOpacity
            onPress={submit}
            style={loading ? styles.disabledBtn : styles.button}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "로그인중..." : "로그인"}
            </Text>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <ThemedView style={styles.container}>
          <ThemedText style={styles.title}>마이페이지</ThemedText>
          <ThemedText style={styles.userIdText}>
            나의 학번: {storedStId}
          </ThemedText>
          <TouchableOpacity onPress={clearUserId} style={styles.button}>
            <Text style={styles.buttonText}>로그아웃</Text>
          </TouchableOpacity>
        </ThemedView>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
    position: "relative",
  },
  input: {
    height: 50,
    width: '93%',
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf:'center'
  },
  button: {
    width: '93%',
    height: 50,
    backgroundColor: "rgb(10,200,400)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
  },
  disabledBtn: {
    width: '93%',
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
    paddingVertical: 5,
  },
  userIdText: {
    fontSize: 20,
    marginTop: 20,
  },
  darkText: {
    color: "white",
  },
  brightText: {
    color: "black",
  },
});
