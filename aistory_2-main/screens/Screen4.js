import React, { useState, useEffect } from "react";
// import * as React from "react";
import { Pressable, Image, StyleSheet, View, ScrollView } from "react-native";
import RiskContainer from "../components/RiskContainer";
import { useNavigation } from "@react-navigation/native";
import { Border, Color } from "../GlobalStyles";
import axios from "axios";
import ALLSensorData from "../components/ALLSensorData";
import ENV from '../env';
import FireAlert from "../components/FireAlert";


const Screen4 = ({route}) => {
  const phoneNumber = route.params.phoneNumber;
  // const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();
  const [aiData, setAIData] = useState(null);

  const fetchAIData = async () => {
    try {
      const serverUrl = ENV.SERVER_URL;
      const response = await axios.get(`${serverUrl}/aiData`, {
        params: { phoneNumber },
      });
  
      if (response.data.success) {
        setAIData(response.data.aiData); // 가져온 AI 데이터 설정
      } else {
        console.error("AI 데이터 요청 실패");
      }
    } catch (error) {
      console.error("AI 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchAIData();

    
    // const aiDataIntervalId = setInterval(fetchAIData, 1800000); // 30분마다 AI 데이터 가져오기
    const aiDataIntervalId = setInterval(fetchAIData, 20000); // 1분마다 AI 데이터 가져오기

    return () => {
      clearInterval(aiDataIntervalId);
    };
  }, []);


  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex:3, }}>
        <FireAlert />
      </View>
    <View style={styles.view}>
      <RiskContainer phoneNumber={phoneNumber} dangerPercentage={32}/>
      

      {/* 온습도 */}
      <Pressable
        style={[styles.pressable, styles.pressableLayout]}
        onPress={() => navigation.navigate("Screen1", {phoneNumber})}
      >
        <Image
          style={styles.icon}
          resizeMode="cover"
          source={require("../assets/111.png")}
        />
      </Pressable>
      {/* 발열량 */}
      <Pressable
        style={[styles.pressable1, styles.pressableLayout]}
        onPress={() => navigation.navigate("Screen2", {phoneNumber})}
      >
        <Image
          style={styles.icon}
          resizeMode="cover"
          source={require("../assets/21.png")}
        />
      </Pressable>
      <Image
        style={styles.icon2}
        resizeMode="cover"
        source={require("../assets/-1.png")}
      />
      {/* 전체 */}
      <Image
        style={styles.icon3}
        resizeMode="cover"
        source={require("../assets/3.png")}
      />
      <Image
        style={styles.icon4}
        resizeMode="cover"
        source={require("../assets/ztemp.png")}
      />
      <ScrollView 
      contentContainerStyle={styles.scrollViewContent}
      horizontal={true}
      showsHorizontalScrollIndicator = {true}
      >
      {/* SensorDataChart 컴포넌트 추가 및 sensorData props 전달 */}
      <View style={styles.view4}>
      <ALLSensorData aiData={aiData} />
      </View>
      
      </ScrollView>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  icon4: {
    
    marginTop: -133,
    marginLeft:-1,
  },

  view4:{
    flex: 1,
    marginTop: 40,
  },
  scrollViewContent: {
    flexGrow: 1,
    
  },

  pressableLayout: {
    height: 193,
    width: 129,
  },
  viewPosition: {
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
    position: "absolute",
  },
  icon: {
    height: "100%",
    width: "100%",
  },
  pressable: {
    marginTop: 22,
    marginRight: 135,
  },
  pressable1: {
    marginTop: -193,
    marginLeft: 135,
  },
  icon2: {
    width: 0,
    height: 0,
    marginTop: -176,
    marginRight: 1,
  },
  icon3: {
    width: 223,
    height: 129,
    marginTop: 123,
    marginLeft: 10,
    zIndex: 2,
  },
  view3: {
    borderTopLeftRadius: Border.br_15xl,
    borderTopRightRadius: Border.br_15xl,
    backgroundColor: "#c0dbea",
  },
  view1: {
    width: 428,
    height: 399,
    marginTop: 35,
  },
  view: {
    backgroundColor: Color.darkslateblue,
    flex: 1,
    alignItems: "center",
    width: "100%",
    marginTop: -33,
  },
});

export default Screen4;
