import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import RenderHTML from "react-native-render-html";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Dimensions,
  useColorScheme,
} from "react-native";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

const lightTheme = {
  color: "#000000",
};

const darkTheme = {
  color: "#ffffff",
};

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [detailPost, setDetailPost] = useState<Post>();
  const [refreshing, setRefreshing] = useState(false);
  const [pageState, setPageState] = useState(false);

  const themeColor = useColorScheme();
  const contentWidth = Dimensions.get("window").width - 20;

  const tagsStyles = useMemo(
    () => ({
      body: {
        color: themeColor === "dark" ? darkTheme.color : lightTheme.color,
        font: 16
      },
    }),
    [themeColor]
  );

  const updateDetailPost = (postId: number = 0) => {
    axios
      .get(`https://daesonamu.kro.kr/api/board/${postId}`)
      .then((response) => {
        setDetailPost(response.data);
        setPageState(true);
      })
      .catch((err) => {
        Alert.alert("에러", err.message);
      });
  };

  const getPost = useCallback(() => {
    setRefreshing(true);
    axios
      .get("https://daesonamu.kro.kr/api/board")
      .then((response) => {
        setPosts(response.data.data);
        setRefreshing(false);
      })
      .catch(() => {
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    getPost();
  }, []);

  const onRefresh = useCallback(() => {
    getPost();
  }, []);

  return (
    <ThemedView style={styles.container}>
      {!pageState ? (
        <>
          <ThemedText style={styles.title}>글목록</ThemedText>
          <ScrollView
            style={styles.scroll}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {posts.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  updateDetailPost(item.id);
                }}
              >
                <ThemedView
                  style={styles.contentsBox}
                  darkColor="black"
                  lightColor="#F9F9F9"
                >
                  <ThemedText style={styles.contentTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={styles.contentText}>
                    작성자:{" "}
                    {item.author.length > 10
                      ? item.author.substring(0, 10) + "....."
                      : item.author}
                  </ThemedText>
                  <ThemedText
                    style={[styles.contentText, { textAlign: "right" }]}
                  >
                    {item.createdAt.split("T")[0]}
                  </ThemedText>
                </ThemedView>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      ) : (
        <>
          {detailPost && (
            <>
              <ThemedText
                onPress={() => {
                  setPageState(false);
                }}
                style={styles.backBtn}
              >
                {"<"} 뒤로가기
              </ThemedText>
              <ThemedText style={styles.postTitle}>
                {detailPost.title}
              </ThemedText>
              <ThemedText style={styles.postInfo}>
                작성자:{" "}
                {detailPost.author.length > 10
                  ? detailPost.author.substring(0, 10) + "..."
                  : detailPost.author}{" "}
                {detailPost.createdAt.split("T")[0]}
              </ThemedText>
              <ThemedText style={styles.postContent}>
                <RenderHTML
                  contentWidth={contentWidth}
                  source={{ html: detailPost?.content || "" }}
                  tagsStyles={tagsStyles}
                />
              </ThemedText>
            </>
          )}
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
  },
  contentsBox: {
    width: "93%",
    height: 90,
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: "center",
    padding: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 25,
    alignSelf: "flex-start",
    marginLeft: 15,
    marginBottom: 20,
    paddingVertical: 5,
  },
  scroll: {
    width: "100%",
  },
  contentTitle: {
    fontSize: 16,
  },
  contentText: {
    fontSize: 12,
  },
  backBtn: {
    width: "90%",
    fontSize: 16,
    textAlign: "left",
  },
  postTitle: {
    fontSize: 25,
    width: "60%",
    alignSelf: "flex-start",
    marginHorizontal: "5%",
    paddingVertical: 15,
  },
  postInfo: {
    fontSize: 15,
    width: "90%",
    marginBottom: 20,
    color: "gray",
  },
  postContent: {
    width: "90%",
  },
});
