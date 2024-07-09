// 본 - 발열량

import React, { useState, useEffect } from "react";
// import * as React from "react";
import { StyleSheet, View, Image, Text, Pressable, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontSize, FontFamily, Border, Color } from "../GlobalStyles";
import RiskContainer from "../components/RiskContainer";
import TempSensorData from "../components/TempSensorData";
import ENV from '../env';
import axios from "axios";

const Screen2 = ({route}) => {
  const phoneNumber = route.params.phoneNumber;
  const navigation = useNavigation();
  const [sensorData, setSensorData] = useState(null); 

  const fetchSensorData = async () => {
    try {
      const serverUrl = ENV.SERVER_URL;
      const response = await axios.get(`${serverUrl}/sensorData`, {
        params: { phoneNumber },
      });
      
      if (response.data.success) {
        setSensorData(response.data.sensorData); // 가져온 센서 데이터 설정
      } else {
        console.error("센서 데이터 요청 실패");
      }
    } catch (error) {
      console.error("센서 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  // 컴포넌트가 마운트될 때와 AI 데이터가 변경될 때 센서 데이터 가져오기
  useEffect(() => {
    fetchSensorData();

    // 30분마다 센서 데이터 가져오기
    // const intervalId = setInterval(() => {fetchSensorData();}, 1800000);
    const intervalId = setInterval(() => {fetchSensorData();}, 30000);

    // 컴포넌트가 언마운트될 때 clearInterval을 호출
    return () => {
      clearInterval(intervalId);
    };
  }, []); 

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <View style={styles.view}>
      <RiskContainer phoneNumber={phoneNumber}/>
      
      {/* 온습도 */}
      <Pressable
        style={[styles.pressable, styles.icon3Layout]}
        onPress={() => navigation.navigate("Screen1", {phoneNumber})}
      >
        <Image
          style={styles.icon}
          resizeMode="cover"
          source={require("../assets/111.png")}
        />
      </Pressable>

      {/* 발열량 */}
      <Image
        style={[styles.icon3, styles.icon3Layout]}
        resizeMode="cover"
        source={require("../assets/21.png")}
      />
      <Image
        style={[styles.icon5, styles.icon3Layout]}
        resizeMode="cover"
        source={require("../assets/gtemp2.png")}
      />
      <Image
        style={styles.icon4}
        resizeMode="cover"
        source={require("../assets/-1.png")}
      />

      {/* 전체 */}
      <Pressable
        style={styles.pressable1}
        onPress={() => navigation.navigate("Screen4", {phoneNumber})}
      >
        <Image
          style={[styles.icon, styles.icon1Layout]}
          resizeMode="cover"
          source={require("../assets/3.png")}
        />
      </Pressable>
      {/* 상자박스 */}
      {/* <View style={styles.view3}>
        <View style={styles.view5Position}>
          <View style={[styles.view5, styles.view5Position]} />
        </View>
      </View> */}
      <ScrollView 
      contentContainerStyle={styles.scrollViewContent}
      horizontal={true}
      showsHorizontalScrollIndicator = {true}
      >
      <View style={styles.view4}>

      <TempSensorData tempSensorData={sensorData} /> 
      </View>
      </ScrollView>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  icon5: {
    marginTop: -185,
    marginLeft: 218,
  },
  
  view4: {
    flex: 1,
    marginTop: 40,
  },
  scrollViewContent: {
    flewGorw: 1,
  },

  view5Position: {
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
    position: "absolute",
  },
  time1Position: {
    top: "50%",
    position: "absolute",
  },
  recentlyFlexBox: {
    textAlign: "left",
    lineHeight: 41,
    letterSpacing: 1,
  },
  thuTypo1: {
    marginLeft: 102,
    fontSize: FontSize.size_2xs,
    textAlign: "left",
    fontFamily: FontFamily.robotoRegular,
  },
  thuTypo: {
    marginTop: -15,
    marginLeft: 102,
    fontSize: FontSize.size_2xs,
    textAlign: "left",
    fontFamily: FontFamily.robotoRegular,
  },
  

  icon1Layout:{
    marginTop: 1,
    marginLeft: 8,
  },

  icon3Layout: {
    height: 193,
    width: 129,
  },
  view1: {
    height: 235,
    width: 428,
    backgroundColor: Color.darkslateblue,
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
  
 
  icon: {
    height: "100%",
    width: "100%",
  },
  menu: {
    width: 41,
    height: 41,
    marginLeft: 360,
    marginTop: 5,
  },
  icon1: {
    width: 17,
    height: 27,
    marginTop: -33,
    marginLeft: -330,
  },
  view2: {
    borderRadius: Border.br_3xs,
    backgroundColor: Color.steelblue,
    width: 110,
    height: 18,
    marginTop: -24,
    alignSelf: "center",
  },
  recentlyAdded: {
    fontSize: FontSize.size_17xl,
    fontWeight: "700",
    fontFamily: FontFamily.hancomMalangMalangRegular,
    marginLeft: 97,
    marginTop: 20,
    color: Color.white,
  },
  
  rectangleIcon: {
    marginLeft: 51,
    marginTop: -14,
    height: 15,
    width: 40,
    borderRadius: Border.br_12xs,
  },
  recentlyAdded1: {
    fontSize: FontSize.size_21xl,
    color: Color.lightsteelblue,
    marginTop: -8,
    marginLeft: 287,
    fontFamily: FontFamily.robotoRegular,
  },
  
  pressable: {
    marginTop: 22,
    marginLeft: 82,
  },
  icon3: {
    marginTop: -200,
    marginLeft: 218,
    zIndex: 2,
    
  },
  icon4: {
    width: 0,
    height: 0,
    marginTop: -176,
    marginLeft: 214,
  },
  pressable1: {
    width: 223,
    height: 129,
    marginTop: 117,
    alignSelf: "center",
    marginLeft: -41,
  },
  view5: {
    borderTopLeftRadius: Border.br_15xl,
    borderTopRightRadius: Border.br_15xl,
    backgroundColor: "#d3b4e1",
    
  },
  view3: {
    height: 399,
    marginTop: 35,
    width: 428,
    
  },
  view: {
    flex: 1,
    width: "110%",
    backgroundColor: Color.darkslateblue,
    marginTop: -35,
    marginLeft: -8,
    
  },
});

export default Screen2;
