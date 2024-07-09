// import * as React from "react";
import React, { useState, useEffect } from "react";
import { Pressable, Image, StyleSheet, View, ScrollView } from "react-native";
import RiskContainer from "../components/RiskContainer";
import { useNavigation } from "@react-navigation/native";
import { Border, Color } from "../GlobalStyles";
import SensorDataChart from "../components/SensorDataChart";
import ENV from "../env";
import axios from "axios";

const Screen1 = ({route}) => {
  // const {phoneNumber} = route.params;
  const phoneNumber = route.params.phoneNumber;
  const navigation = useNavigation();
  const [sensorData, setSensorData] = React.useState(null);

  const fetchSensorData = async () => {
    try {
      const serverUrl = ENV.SERVER_URL;
      const response = await axios.get(`${serverUrl}/sensorData`, {
        params: { phoneNumber },
      });

      if (response.data.success) {
        setSensorData(response.data.sensorData);
      } else {
        console.error("센서 데이터 요청 실패");
      }
    } catch (error) {
      console.error("센서 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  React.useEffect(() => {
    fetchSensorData(); 

    // const sensorDataIntervalId = setInterval(fetchSensorData, 1800000); // 30분마다 센서 데이터 가져오기
    const sensorDataIntervalId = setInterval(fetchSensorData, 30000); // 1분마다 센서 데이터 가져오기

    return () => {
      clearInterval(sensorDataIntervalId);
    };
  }, []);


  return (
    <ScrollView  contentContainerStyle={styles.scrollViewContent}>
    <View style={styles.view}>
      <RiskContainer phoneNumber={phoneNumber}  />
      {/* 온습도 */}
      <Image
        style={[styles.icon, styles.iconLayout]}
        resizeMode="cover"
        source={require("../assets/111.png")}
      />
      <Image
        style={[styles.icon4, styles.icon4Layout]}
        resizeMode="cover"
        source={require("../assets/htemp.png")}
      />
      {/* 발열량 */}
      <Pressable
        style={[styles.pressable, styles.iconLayout]}
        onPress={() => navigation.navigate("Screen2", {phoneNumber})}
      >
        <Image
          style={styles.icon1}
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
      <Pressable
        style={styles.pressable1}
        onPress={() => navigation.navigate("Screen4", {phoneNumber})}
      >
        <Image
          style={styles.icon1}
          resizeMode="cover"
          source={require("../assets/3.png")}
        />
      </Pressable>
      {/* 상자박스 */}
      {/* SensorDataChart 컴포넌트 추가 및 sensorData props 전달 */}
      <ScrollView 
      contentContainerStyle={styles.scrollViewContent}
      horizontal={true}
      showsHorizontalScrollIndicator = {true}
      >
      <View style={styles.view3}>
      <SensorDataChart sensorData={sensorData} />
      </View>
     
      </ScrollView>      
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  view3: {
    flex: 1,
    marginTop: 40,
    borderTopLeftRadius: Border.br_15xl,
    borderTopRightRadius: Border.br_15xl,
    
  },
  scrollViewContent: {
    flexGrow: 1,
    
  },
  iconLayout: {
    height: 193,
    width: 129,
  },
  icon: {
    marginTop: 15,
    marginRight: 135,
    zIndex: 2,
  },
  icon4: {
    marginTop: -185,
    marginRight: 133,
    zIndex: 1,
  },
  icon4Layout: {
    height: 193,
    width: 129,
  },



  icon1: {
    height: "100%",
    width: "100%",
  },
  pressable: {
    marginTop: -193,
    marginLeft: 135,
  },
  icon2: {
    width: 0,
    height: 0,
    marginTop: -176,
    marginRight: 1,
  },
  pressable1: {
    width: 223,
    height: 129,
    marginTop: 117,
  },
  view2: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderTopLeftRadius: Border.br_15xl,
    borderTopRightRadius: Border.br_15xl,
    backgroundColor: "#fdd0e3",
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
    marginTop: -35,
  },
});

export default Screen1;
