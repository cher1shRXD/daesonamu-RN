import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import axios from "axios";
import DateTimePickerModal from "react-native-modal-datetime-picker";



export default function HomeScreen() {

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [meal, setMeal] = useState([]);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  function formatDate(date:any) {
    let dateFormat =
      date.getFullYear().toString() +
      
      (date.getMonth() + 1 < 9
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1).toString() +
      (date.getDate() < 9 ? "0" + date.getDate() : date.getDate()).toString();
    return dateFormat;
  }

  const getMeal = async (date:any) => {
    await axios
      .get(
        `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=D10&SD_SCHUL_CODE=7240454&KEY=6cffaffd21244a9e93f6ae5430070ad0&MLSV_YMD=${date}&TYPE=JSON`
      )
      .then((response) => {
        setMeal(response.data.mealServiceDietInfo[1].row);
      })
      .catch(() => {
        setMeal([]);
      });
  };

  useEffect(() =>{
    const today = formatDate(new Date());
    getMeal(today);
  },[]);

  useEffect(()=>{
    if(date) {
      const selected = formatDate(date);
      getMeal(selected);
    }
  },[date])

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>대소나무숲</ThemedText>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("board");
        }}
        style={{ width: "100%" }}
      >
        <ThemedView
          style={styles.navBox}
          darkColor="black"
          lightColor="#F9F9F9"
        >
          <ThemedText>자유게시판</ThemedText>
        </ThemedView>
      </TouchableOpacity>
      <ThemedText style={styles.title}>식단표</ThemedText>
      <TouchableOpacity
        onPress={() => {
          setOpen(true);
        }}
        style={{ width: 200, height: 30 }}
      >
        <ThemedView
          style={styles.dateBtn}
          darkColor="black"
          lightColor="#F9F9F9"
        >
          <ThemedText>{date.toString().split(":")[0]}</ThemedText>
        </ThemedView>
      </TouchableOpacity>
      <ScrollView style={{ width: "100%", marginTop: 20 }}>
        <ThemedView style={{ width: "100%" }}>
          {meal.length > 0 ? (
            meal.map((item: any, idx: number) => (
              <ThemedView
                style={styles.mealBox}
                darkColor="black"
                lightColor="#F9F9F9"
                key={idx}
              >
                <ThemedText>
                  {item.DDISH_NM.replaceAll("<br/>", "\n")}
                </ThemedText>
              </ThemedView>
            ))
          ) : (
            <ThemedView
              style={styles.mealBox}
              darkColor="black"
              lightColor="#F9F9F9"
            >
              <ThemedText>급식이 없습니다!</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ScrollView>
      <DateTimePickerModal
        isVisible={open}
        mode="date"
        onConfirm={(date: any) => {
          setDate(date);
          setOpen(false);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
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
  navBox: {
    width: "93%",
    height: 60,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    alignSelf: "flex-start",
    marginLeft: 15,
    marginBottom: 20,
    paddingVertical: 5,
  },
  mealBox: {
    width: "93%",
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: "center",
    padding: 10,
    paddingHorizontal: 15,
  },
  dateBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    borderRadius:20 
  },
});