// import * as React from "react";
import React, {useState} from "react";
import { Text, StyleSheet, TextInput, Pressable, View,ScrollView, Alert, Image , TouchableOpacity} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontSize, Color, FontFamily, Border, Padding } from "../GlobalStyles";
import axios from "axios";
import ENV from '../env';
// import PushNotification from 'react-native-push-notification';

// const ToggleButton = ({ isSubscribed, handleToggle }) => (
//   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//     <Text style={{ marginRight: 10, fontSize: FontSize.size_6xl, letterSpacing: 0, textAlign: 'left', color: Color.white, fontFamily: FontFamily.hancomMalangMalangRegular, fontWeight: '700', marginBottom: 5 }}>알림 구독:</Text>
//     <TouchableOpacity
//       style={[styles.button, isSubscribed ? styles.activeButton : styles.inactiveButton]}
//       onPress={handleToggle}
//     >
//       <Text style={{ color: 'white' }}>{isSubscribed ? 'ON' : 'OFF'}</Text>
//     </TouchableOpacity>
//   </View>
// );

const Screen5 = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [sensorNumber, setSensorNumber] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleToggle = () => {
    setIsSubscribed(!isSubscribed); // 알림 구독 토글 상태 변경
    PushNotification.localNotification({
      title: '알림 구독',
      message: isSubscribed ? '알림 구독을 취소했습니다.' : '이제 알림을 받습니다.',
    });
  };


  const handleSignUp = async () => {
    try {
      
      if (!name || !phoneNumber || !password || !confirmPassword || !address || !sensorNumber) {
        Alert.alert("회원 가입 실패", "입력하지 않은 정보가 있습니다.");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("비밀번호 불일치", "비밀번호가 일치하지 않습니다.");
        return;
      }
     

      const serverUrl = ENV.SERVER_URL;
      const userData = {
        id: phoneNumber,
        name,
        phoneNumber,
        password,
        address,
        sensorNumber,
      };

      //allowSensor 확인
      const allowSensorResponse = await axios.get(`${serverUrl}/checkAllowSensor/${sensorNumber}`);
      if (!allowSensorResponse.data.allowed) {
        Alert.alert("센서번호 확인 실패", "존재하지 않는 센서번호입니다. 다시 확인해주세요.");
        return;
      }

      // 이미 사용 중인 sensorNumber 확인
      const sensorAlreadyUsedResponse = await axios.get(`${serverUrl}/checkSensorAlreadyUsed/${sensorNumber}`);
      if (sensorAlreadyUsedResponse.data.used) {
        Alert.alert("센서번호 확인 실패", "이미 다른 사용자가 사용 중인 센서번호입니다.");
        return;
      }
      
      const response = await axios.post(`${serverUrl}/signup`, userData);
      // (성공 메시지 + 로그인 화면으로 이동)
      if (response.data.success){
        Alert.alert("회원 가입 성공", "회원 가입이 성공적으로 완료되었습니다.");
        navigation.navigate("Screen6");
      } else {
        if (response.status === 400 && response.data.message === "이미 가입된 전화번호입니다.") {
          Alert.alert("회원 가입 실패", "이미 가입된 전화번호입니다.");
        } else {
          Alert.alert("회원 가입 실패", "회원 가입 실패. 다시 시도해주세요");
        }

      }
      
    } catch (error) {
      
      Alert.alert("회원 가입 실패", "서버요청 실패. 다시 시도해주세요");
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <View style={styles.view}>
      {/* 뒤로가기 화살표 */}
    <Pressable
        style={ styles.iconPosition}
        onPress={() => navigation.goBack()}
      >
      <Image
        style={[styles.icon, styles.iconPosition]}
        resizeMode="cover"
        source={require("../assets/arrow.png")}
      />
      </Pressable>
      <Text style={styles.recentlyAdded}>회원가입</Text>
      {/* 이름 입력 */}
      <Text style={[styles.recentlyAdded1, styles.recentlyTypo]}>이름</Text>
      <TextInput
        style={[styles.textinput, styles.textinputLayout]}
        keyboardType="default"
        value={name}
        onChangeText={setName}
      />

      {/* 전화번호 입력 */}
      <Text style={[styles.recentlyAdded2, styles.recentlyTypo]}>전화번호</Text>
      <TextInput
        style={[styles.textinput1, styles.textinputLayout]}
        keyboardType="number-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      {/* 비밀번호 입력 */}
      <Text style={[styles.recentlyAdded3, styles.recentlyTypo]}>비밀번호</Text>
      <TextInput
        style={[styles.textinput1, styles.textinputLayout]}
        keyboardType="default"
        value={password}
        onChangeText={setPassword}
      />
      {/* 비밀번호 확인 */}
      <Text style={[styles.recentlyAdded3, styles.recentlyTypo]}>비밀번호 확인</Text>
      <TextInput
        style={[styles.textinput1, styles.textinputLayout]}
        keyboardType="default"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {/* 주소 입력 */}
      <Text style={[styles.recentlyAdded4, styles.recentlyTypo]}>주소</Text>
      <TextInput
        style={[styles.textinput1, styles.textinputLayout]}
        keyboardType="default"
        value={address}
        onChangeText={setAddress}
      />
      
      {/* 센서번호 입력 */}
      <Text style={styles.recentlyTypo}>센서번호</Text>
      <TextInput
        style={[styles.textinput1, styles.textinputLayout]}
        keyboardType="default"
        value={sensorNumber}
        onChangeText={setSensorNumber}
      />
      {/* <ToggleButton isSubscribed={isSubscribed} handleToggle={handleToggle} /> */}
      {/* 회원가입 버튼 */}
      <Pressable
        style={[styles.pressable, styles.textinputLayout]}
        onPress={handleSignUp}>
        <Text style={styles.recentlyAdded6}>가입하기</Text>
      </Pressable>
      
      
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Padding.p_25xl,
    backgroundColor: Color.darkslateblue,
  },

  recentlyTypo: {
    marginLeft: -7,
    fontSize: FontSize.size_6xl,
    letterSpacing: 0,
    textAlign: "left",
    color: Color.white,
    fontFamily: FontFamily.hancomMalangMalangRegular,
    fontWeight: "700",
    marginBottom: 5,
  },
  textinputLayout: {
    height: 60,
    width: 375,
    borderRadius: Border.br_3xs,
    marginLeft: -8,
    marginBottom: 10,
  },
  recentlyAdded: {
    fontSize: FontSize.size_11xl,
    letterSpacing: 1,
    textAlign: "left",
    color: Color.white,
    fontFamily: FontFamily.hancomMalangMalangRegular,
    fontWeight: "700",
    lineHeight: 41,
    marginTop: -33,
    marginLeft: 30,
  },
  recentlyAdded1: {
    marginTop: 50,
  },
  textinput: {
    backgroundColor: Color.white,
    width: 375,
    borderRadius: Border.br_12xs,
  },
  recentlyAdded2: {
    marginTop: 4,
  },
  textinput1: {
    marginTop: 2,
    backgroundColor: Color.white,
    width: 375,
    borderRadius: Border.br_12xs,
  },
  recentlyAdded3: {
    marginTop: 3,
  },
  recentlyAdded4: {
    marginTop: 2,
  },
  pressable: {
    backgroundColor: Color.lightsteelblue,
    marginTop: 40,
    width: 375,
    borderRadius: Border.br_12xs,
  },
  recentlyAdded6: {
    fontSize: FontSize.size_11xl,
    color: Color.black,
    marginTop: 11,
    alignSelf: "center",
    letterSpacing: 0,
    textAlign: "center",
    fontFamily: FontFamily.hancomMalangMalangRegular,
    fontWeight: "700",
    lineHeight: 41,
  },
  view: {
    backgroundColor: Color.darkslateblue,
    flex: 1,
    width: "100%",
    paddingLeft: Padding.p_8xl,
    paddingTop: Padding.p_25xl,
    paddingRight: Padding.p_7xl,
  },
  iconPosition: {
    marginTop: -5,
    marginLeft: -5,
  }
});

export default Screen5;
