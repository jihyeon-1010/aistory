import * as React from "react";
import { Text, StyleSheet, TextInput, Pressable, View, ScrollView, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { FontSize, Color, FontFamily, Border, Padding } from "../GlobalStyles";
import axios from "axios";
import ENV from '../env';

const Screen6 = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [password, setPassword] =React.useState("");

  useFocusEffect(
    React.useCallback(() => {
      setPhoneNumber(""); 
      setPassword("");
    }, [])
  );


  const handleLogin = async () => {
    try {
      const serverUrl = ENV.SERVER_URL;
      const userData = {
        phoneNumber,
        password,
      };

      const response = await axios.post(`${serverUrl}/login`, userData);
      if (response.data.success) {
        Alert.alert("로그인 성공", "로그인에 성공하셨습니다.");
  
        const sensorDataResponse = await axios.get(`${serverUrl}/sensorData`, {
          params: { phoneNumber },
        });
  
        if (sensorDataResponse.data) {
          const sensorData = sensorDataResponse.data;
          
          // aiData 요청
          const aiDataResponse = await axios.get(`${serverUrl}/aiData`, {
            params: { phoneNumber },
          });
  
          if (aiDataResponse.data) {
            const aiData = aiDataResponse.data;
  
            navigation.navigate("Screen4", {
              phoneNumber: phoneNumber,
              sensorData: sensorData,
              aiData: aiData, // aiData를 Screen4로 전달
            });
  
            // console.log('Sensor Data:', sensorData);
            // console.log('AI Data:', aiData);
          }
        }  
      
    }else {
        // 로그인 실패
        Alert.alert("로그인 실패", "전화번호 또는 비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      Alert.alert("로그인 실패", "서버 요청 실패. 다시 시도해주세요");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <View style={styles.view}>
      <Text style={styles.recentlyAdded}>로그인</Text>
      <Text style={[styles.recentlyAdded1, styles.recentlyTypo1]}>ID</Text>
      <TextInput
        style={[styles.textinput, styles.textinputLayout]}
        keyboardType="number-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <Text style={[styles.recentlyAdded2, styles.recentlyTypo1]}>
        PASSWORD
      </Text>
      <TextInput
        style={[styles.textinput1, styles.textinputLayout]}
        keyboardType="default"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Pressable
        style={[styles.pressable, styles.textinputLayout]}
        onPress={handleLogin}>
        <Text style={[styles.recentlyAdded3, styles.recentlyTypo]}>로그인</Text>
      </Pressable>
      
      <Pressable
        style={[styles.pressable1, styles.textinputLayout]}
        onPress={() => navigation.navigate("Screen5")}>      
        <Text style={[styles.recentlyAdded4, styles.recentlyTypo]}>회원가입</Text>
      </Pressable>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Padding.p_20xl,
  },

  recentlyTypo1: {
    marginLeft: -5,
    letterSpacing: 0,
    fontSize: FontSize.size_6xl,
    textAlign: "left",
    color: Color.white,
    fontFamily: FontFamily.hancomMalangMalangRegular,
    fontWeight: "700",
  },
  textinputLayout: {
    height: 60,
    width: 375,
    borderRadius: Border.br_3xs,
    marginLeft: -10,
  },
  recentlyTypo: {
    alignSelf: "center",
    marginTop: 10,
    fontSize: FontSize.size_11xl,
    letterSpacing: 0,
    textAlign: "center",
    fontFamily: FontFamily.hancomMalangMalangRegular,
    fontWeight: "700",
    lineHeight: 41,
    marginLeft: -10,
  },
  recentlyAdded: {
    fontSize: FontSize.size_17xl,
    letterSpacing: 1,
    textAlign: "left",
    fontFamily: FontFamily.hancomMalangMalangRegular,
    fontWeight: "700",
    lineHeight: 41,
    color: Color.white,
    marginTop: 10,
    marginLeft: -6, 
    marginBottom: -20,
  },
  recentlyAdded1: {
    marginTop: 100,
    
  },
  textinput: {
    backgroundColor: Color.white,
    width: 375,
    borderRadius: Border.br_3xs,
  },
  recentlyAdded2: {
    marginTop: 9,
  },
  textinput1: {
    marginTop: 2,
    backgroundColor: Color.white,
    width: 375,
    borderRadius: Border.br_3xs,
    marginBottom: 10,
  },
  pressable: {
    backgroundColor: Color.lightsteelblue,
    marginTop: 21,
    width: 375,
    borderRadius: Border.br_3xs,
  },
  recentlyAdded3: {
    color: Color.black,
  },
  pressable1: {
    backgroundColor: "rgba(233, 233, 233, 0.65)",
    marginTop: 20,
    width: 375,
    borderRadius: Border.br_3xs,
  },
  recentlyAdded4: {
    color: Color.white,
    alignSelf: "center",
    marginTop: -55,
    fontSize: FontSize.size_11xl,
  },
  view: {
    backgroundColor: Color.darkslateblue,
    flex: 1,
    width: "100%",
    paddingLeft: Padding.p_8xl,
    paddingTop: 25,
    paddingRight: Padding.p_7xl,
  },
});

export default Screen6;
