import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, View, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Border, FontSize, Color, FontFamily } from "../GlobalStyles";
import axios from 'axios';
import ENV from '../env';

const RiskContainer = ({ phoneNumber }) => {
  const navigation = useNavigation();

  const [aiData, setAIData] = useState(null);
  const [loading, setLoading] = useState(true);
  const serverUrl = ENV.SERVER_URL;

  useEffect(() => {
    // aiTable 데이터를 주기적으로 가져오기 위한 함수
    const fetchAiData = () => {
      axios
        .get(`${serverUrl}/aiTable`, {
          params: { phoneNumber }
        })
        .then((response) => {
          const aiDataFromAPI = response.data.aiData;
          setAIData(aiDataFromAPI);
          setLoading(false); 
        })
        .catch((error) => {
          console.error("MySQL 데이터를 불러오는 중 오류 발생:", error);
          setLoading(false); // 에러 발생 시 로딩 상태를 false로 설정
        });
    };

    //  5분마다 데이터 업데이트
    fetchAiData();
    const intervalId = setInterval(fetchAiData, 5000); // 5분마다 실행

    // 컴포넌트 언마운트 시에 interval 정리
    return () => {
      clearInterval(intervalId);
    };
  }, []);


  const handleMenuPress = () => {
    navigation.navigate("Screen3", { phoneNumber });
  };

  const handleCalendarPress = () => {
    navigation.navigate("Screen10", { phoneNumber });
  };

  const today = new Date();
  const todayString = `${(today.getMonth() + 1).toString().padStart(2, '0')}월${today.getDate().toString().padStart(2, '0')}일`;

  return (
    <Pressable style={styles.pressable}>
      <View style={styles.barsstatusdefault}>
        <View style={[styles.background, styles.backgroundPosition]} />
      </View>

      <View style={styles.container}>
        {loading ? (
          <Text>Loading AI Data...</Text>
        ) : (
          <View style={[styles.scale, {width: 350}]}>
            
            <View style={[styles.scaleTick, { width: 100 }]} />
            <View style={[styles.scaleTick2, { width: 120 }]} />
            <View style={[styles.scaleTick3, { width: 130 }]} />
            <View
              style={[
                styles.triangle,
                {
                  left: `${aiData}%`, // 위험도 수치에 따라 위치 조절
                },
              ]}
            >
            <Text style={styles.label}>위험도: {aiData}%</Text>
            </View>
          </View>
        )}
      </View>

      <Text style={[styles.recentlyAdded, styles.recentlyPosition]}>
        {todayString}의 위험 확률
      </Text>

      

      <Pressable style={styles.menu} onPress={handleMenuPress}>
        <Image
          style={styles.icon1}
          resizeMode="cover"
          source={require("../assets/menu4.png")}
        />
      </Pressable>

      <Pressable
        style={styles.iconPosition2}
        onPress={handleCalendarPress}
      >
        <Image
          style={[styles.icon2, styles.iconPosition2]}
          resizeMode="cover"
          source={require("../assets/calendar3.png")}
        />
      </Pressable>
    </Pressable>
  );
};


const styles = StyleSheet.create({



  
  triangle: {
    position: "absolute",
    top: -12,
    left: 95,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderTopWidth: 12,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "white",
  },
  
  container: {
    alignItems: 'center',
    marginTop: -20,
  },
  scale: {
    flexDirection: 'row',
    backgroundColor: '#ccc',
    height: 13,
    width: '80%',
    marginTop: 200,
  },

  scaleTick: {
    backgroundColor: "#90ee90",
    height: '100%',
    borderWidth: 1,
    borderColor: "#707070",
    borderStyle: "solid",
  },
  scaleTick2: {
    backgroundColor: Color.khaki,
    height: '100%',
    borderWidth: 1,
    borderColor: "#707070",
    borderStyle: "solid",
  },
  scaleTick3:{
    backgroundColor: Color.crimson,
    height: '100%',
    borderWidth: 1,
    borderColor: "#707070",
    borderStyle: "solid",
  },
  scaleTick4: {
    backgroundColor: "#ffff",
    height: '100%',
    borderWidth: 0,
    borderColor: "#707070",
    borderStyle: "solid",
  },
  label: {
    position: "absolute",
    marginTop: -50,
    fontSize: 20,
    marginLeft: -53,
    color: Color.white,
    fontWeight:"700",
  },

  dangerMeterContainer: {
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16,
  },
  icon2: {
    height: 40,
    width: 40,
  },
  iconPosition2: {
    marginLeft: 183, 
    marginTop: 250,
    position: "absolute",
    
  },

  backgroundPosition: {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    position: "absolute",
  },
  iconPosition: {
    top: "50%",
    position: "absolute",
  },
  rectangleLayout: {
    height: 15,
    width: 40,
    borderRadius: Border.br_12xs,
    left: 51,
    position: "absolute",
  },
  thuTypo: {
    textAlign: "left",
    fontSize: FontSize.size_2xs,
    left: "23.71%",
    color: Color.white,
    fontFamily: FontFamily.robotoRegular,
    top: "50%",
    position: "absolute",
  },
  thuPosition: {
    marginTop: 49,
    textAlign: "left",
    fontSize: FontSize.size_2xs,
    left: "23.71%",
    fontFamily: FontFamily.robotoRegular,
    top: "50%",
    position: "absolute",
  },
  recentlyPosition: {
    lineHeight: 41,
    letterSpacing: 1,
    textAlign: "left",
    top: "50%",
    position: "absolute",
    marginLeft: -5,
  },
  background: {
    backgroundColor: Color.gray_100,
  },
  containerIcon: {
    marginTop: -4.84,
    right: 15,
    width: 67,
    height: 12,
  },


  barsstatusdefault: {
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    position: "absolute",
    
  },
  rectangle: {
    bottom: 33,
    backgroundColor: Color.khaki,
    borderWidth: 1,
    borderColor: "#707070",
    borderStyle: "solid",
    width: 40,
    borderRadius: Border.br_12xs,
    left: 51,
  },
  rectangleIcon: {
    marginTop: 49.5,
    width: 40,
    borderRadius: Border.br_12xs,
    left: 51,
    top: "50%",
  },
  rectangle1: {
    bottom: 13,
    backgroundColor: Color.crimson,
    borderWidth: 1,
    borderColor: "#707070",
    borderStyle: "solid",
    width: 40,
    borderRadius: Border.br_12xs,
    left: 51,
  },
  thu: {
    marginTop: 69,
  },
  thu1: {
    color: Color.lightgray,
  },
  thu2: {
    marginTop: 89,
  },
  recentlyAdded: {
    marginTop: -64,
    left: "22.66%",
    fontSize: FontSize.size_6xl,
    fontWeight: "700",
    fontFamily: FontFamily.hancomMalangMalangRegular,
    color: Color.white,
    marginLeft: 25,
  },
  recentlyAdded1: {
    marginTop: 56,
    left: "66.94%",
    fontSize: FontSize.size_21xl,
    color: Color.lightsteelblue,
    fontFamily: FontFamily.robotoRegular,
  },
  thu4: {
    color: Color.white,
  },
  icon: {
    marginTop: -60.56,
    left: 34,
    width: 17,
    height: 27,
  },
  view: {
    marginTop: -57.5,
    marginLeft: -55,
    left: "50%",
    borderRadius: Border.br_3xs,
    backgroundColor: Color.steelblue,
    width: 110,
    height: 18,
  },
  icon1: {
    marginTop: -62,
    width: "90%",
    height: "90%",
    marginLeft: -3,
  },
  menu: {
    right: 17,
    width: 35, 
    height: 35,
    position: "absolute",
    top: "60%",
    transform: [{ translateY: -20.5 }],
  },
  pressable: {
    backgroundColor: Color.darkslateblue,
    width: 428,
    height: 235,
  },
});

export default React.memo(RiskContainer);