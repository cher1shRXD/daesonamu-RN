import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import React, { useState } from 'react'
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
  TouchableOpacity,
  Text,
  Alert
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from 'axios';
import useUserStore from '@/store/userStore';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

const HomeScreen = () => {

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const userId = useUserStore(state=>state.userId);

  const [loading, setLoading] = useState<boolean>(false);

  const [postTile, setPostTitle] = useState<string>("");
  const [postAuthor, setPostAuthor] = useState<string>("");
  const [postContent, setPostContent] = useState<string>("");

  const updateTitle = (e:string) => {
    setPostTitle(e);
  }
  const updateAuthor = (e:string) => {
    setPostAuthor(e);
  };
  const updateContent = (e:string) => {
    setPostContent(e);
  };

  const submit = async () => {
    if (postTile && postAuthor && postContent) {
      setLoading(true);
      const formattedContent = postContent.replace(
        /\n/g,
        "<br>"
      );
      await axios
        .post(
          "https://daesonamu.kro.kr/api/board",
          {
            title: postTile,
            content: formattedContent,
            author: postAuthor,
          },
          {
            headers: {
              userId: +userId!,
            },
          }
        )
        .then((response) => {
          if (response.status == 200) {
            setPostTitle('');
            setPostAuthor('');
            setPostContent('');
            navigation.navigate("board");
          }
        })
        .catch((err) => {
          console.log(err);
          Alert.alert('에러',err.message)
        });
    } else {
      Alert.alert("모든 입력창을 모두 입력해주세요.");
    }
    setLoading(false);
  };

  const themeColor = useColorScheme();

  return (
    <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>글작성 페이지</ThemedText>
        <KeyboardAwareScrollView style={{ minHeight: "100%" }}>
          <TextInput
            style={[
              styles.input,
              themeColor == "dark" ? styles.darkText : styles.brightText,
            ]}
            placeholder="제목"
            placeholderTextColor="gray"
            onChangeText={updateTitle}
            value={postTile}
          ></TextInput>
          <TextInput
            style={[
              styles.input,
              themeColor == "dark" ? styles.darkText : styles.brightText,
            ]}
            placeholder="작성자"
            placeholderTextColor="gray"
            onChangeText={updateAuthor}
            value={postAuthor}
          ></TextInput>
          <TextInput
            style={[
              styles.input,
              themeColor == "dark" ? styles.darkText : styles.brightText,
              { height: 150, padding: 10, textAlignVertical: "top" },
            ]}
            numberOfLines={4}
            multiline
            placeholder="내용"
            placeholderTextColor="gray"
            onChangeText={updateContent}
            value={postContent}
          ></TextInput>
        </KeyboardAwareScrollView>
        <TouchableOpacity
          onPress={submit}
          style={loading ? styles.disabledBtn : styles.button}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "게시중..." : "게시"}
          </Text>
        </TouchableOpacity>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
    position:'relative'
  },
  title: {
    fontSize: 25,
    alignSelf: "flex-start",
    marginLeft: 15,
    marginBottom: 20,
    paddingVertical: 5,
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
  darkText: {
    color: "white",
  },
  brightText: {
    color: "black",
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
  disabledBtn: {
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
});

export default HomeScreen