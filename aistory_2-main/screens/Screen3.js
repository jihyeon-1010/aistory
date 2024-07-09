import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Pressable, ImageBackground, 
  Text, ScrollView, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {styles} from "./styles3";
import axios from "axios";
import ENV from '../env';

const Screen3 = ({route}) => {
  
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [showAddressChange, setShowAddressChange] = useState(false);
  const [showSensorInfoChange, setShowSensorInfoChange] = useState(false);
  const [newSensorNumber, setNewSensorNumber] = useState("");
 
  // 로그아웃 함수
  const handleLogout = () => {
    // 확인을 누르면 로그아웃 처리
    const handleConfirmLogout = () => {
      
      // 로그아웃 후 로그인 창으로 이동
      navigation.navigate("Screen6");
    };
  
   
    Alert.alert(
      "로그아웃 확인",
      "로그아웃 하시겠습니까?",
      [
        {
          text: "확인",
          onPress: handleConfirmLogout,
          
        },
        {
          text: "취소",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };
// 주소지 변경 클릭 이벤트 핸들러
const handleAddressChangeClick = () => {
  setShowPersonalInfo(false); // 개인정보 변경 섹션 닫기
  setShowSensorInfoChange(false); // 센서 정보 변경 섹션 닫기
  setShowAddressChange(!showAddressChange);
  setEnteredPassword(""); // 비밀번호 입력 초기화
  
  
};

// 센서 정보 변경 클릭 이벤트 핸들러
const handleSensorInfoChangeClick = () => {
  setShowPersonalInfo(false); // 개인정보 변경 섹션 닫기
  setShowSensorInfoChange(!showSensorInfoChange);
  setEnteredPassword(""); // 비밀번호 입력 초기화
};
  
  const fetchUserInfo = async () => {
    try {
      const serverUrl = ENV.SERVER_URL;
      const response = await axios.get(`${serverUrl}/getUserInfo`, {
        params: {
          phoneNumber: route.params.phoneNumber,
          
        }, 
      });

      if (response.data.success) {
        setUserInfo(response.data.user); 
      } else {
       console.error("사용자 정보 요청 실패", route.params.phoneNumber);
        
      }
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    
      fetchUserInfo(); 
    
  }, []); 

  // 센서 번호 변경 요청 보내기
  const handleSensorNumberChange = async (newSensorNumber) => {
    try {
      const serverUrl = ENV.SERVER_URL;
      const response = await axios.post(`${serverUrl}/updateSensorNumber`, {
        phoneNumber: route.params.phoneNumber,
        newSensorNumber: newSensorNumber
      });

      if (response.data.success) {
        // 센서 번호 변경 성공
        console.log("센서 번호 변경 성공");
        Alert.alert("센서 번호 변경 성공", "센서 번호가 변경되었습니다.");
        setUserInfo(prevUserInfo => ({
          ...prevUserInfo,
          sensor_number: newSensorNumber
        }));
      } else {
        console.error("센서 번호 변경 실패");
      }
    } catch (error) {
      
      if (error.response && error.response.data && error.response.data.message) {
        Alert.alert("센서 번호 변경 실패", error.response.data.message);
      } else {
        Alert.alert("센서 번호 변경 실패", "서버 오류가 발생했습니다.");
      }
    }
  };

   // 비밀번호 확인 함수
  const checkPassword = () => {
    if (userInfo && userInfo.password === enteredPassword) {
      Alert.alert("비밀번호가 일치합니다", "개인정보 변경 페이지로 이동합니다.");
      navigation.navigate("Screen9", {phoneNumber: route.params.phoneNumber});
    } else {
      Alert.alert("비밀번호가 일치하지 않습니다", "비밀번호를 다시 입력해주세요.");
      console.log(userInfo.password);
      console.log(enteredPassword);
    }
  };

  // 주소지 변경 비밀번호 확인
  const checkPassword1 = () => {
    if (userInfo && userInfo.password === enteredPassword) {
     
      navigation.navigate("Screen9", {
        phoneNumber: route.params.phoneNumber,
        section: "addressChange", 
      });
    } else {
      Alert.alert("비밀번호가 일치하지 않습니다", "비밀번호를 다시 입력해주세요.");
      console.log(userInfo.password);
      console.log(enteredPassword);
    }
  };


  
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <View style={styles.view}>
      <View style={styles.view1} />
      <Image
       
        style = {styles.backgroundImage}
        resizeMode="cover"
        source={require("../assets/-4.png")}
      />
      <View style={styles.view2} />
      
      <Pressable
        style={styles.iconnavigationclose24px}
        onPress={() => navigation.goBack()}
      >
        <Image
          style={styles.icon1}
          resizeMode="cover"
          source={require("../assets/iconnavigationclose-24px1.png")}
        />
      </Pressable>
      <Text style={[styles.text1, styles.textTypo]}>마이페이지</Text>
      <Image
        style={[styles.icon2, styles.iconLayout]}
        resizeMode="cover"
        source={require("../assets/11.png")}
      />
      <ImageBackground
        style={styles.icon3}
        resizeMode="cover"
        source={require("../assets/2.png")}
      />
      <Text style={[styles.recentlyAdded, styles.recentlyTypo1]}>
        {userInfo?.name || "사용자"}</Text>
      <Text
        style={[styles.recentlyAdded1, styles.recentlyTypo1]}
      >{`위치 : ${userInfo?.address || "주소 정보 없음"}`}</Text>

      {/* 개인정보 변경 버튼 */}
      <Pressable style={[styles.pressable, styles.pressableLayout]}
      onPress={()=> setShowPersonalInfo(!showPersonalInfo)}>
        <ImageBackground
          style={styles.idCardClipAltIcon}
          resizeMode="cover"
          source={require("../assets/idcardclipalt.png")}
        />
        <Text style={[styles.recentlyAdded2, styles.recentlyTypo]}>
          개인정보 변경
        </Text>
      </Pressable>

      {/* 정보 상자 렌더링 - 개인정보 변경*/}
      {showPersonalInfo && (
        <View style={styles.personalInfoBox}>
          <Text style={[styles.recentlyAdded5, styles.recentlyTypo2]}>
            사용자 확인이 필요한 서비스입니다.
            현재 비밀번호를 입력해주세요.
          </Text>
          <Text style={[styles.recentlyAdded6, styles.recentlyTypo3]}>
            비밀번호 입력
          </Text>
          <TextInput
            style={[styles.textinput, styles.icon2Layout]}
            secureTextEntry={true}
            value={enteredPassword}
            onChangeText={setEnteredPassword} 
          />
          <View style={[styles.pressable3, styles.recentlyTypo4]}>
            <Pressable onPress={checkPassword}>
              <Text style={[styles.recentlyAdded7, styles.recentlyTypo4]}>사용자 정보 확인</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* 주소지 변경 */}
      <Pressable 
      style={[styles.pressable1, styles.pressableLayout]}
      onPress={handleAddressChangeClick}
      >
        <ImageBackground
          style={styles.addressBookIcon}
          resizeMode="cover"
          source={require("../assets/addressbook.png")}
        />
        <Text style={[styles.recentlyAdded3, styles.recentlyTypo]}>
          주소지 변경
        </Text>
      </Pressable>

      {showAddressChange && (
        <View style={styles.addressChangeBox}>
          <Text style={[styles.recentlyAdded5, styles.recentlyTypo2]}>
            사용자 확인이 필요한 서비스입니다.
            현재 비밀번호를 입력해주세요.
          </Text>
          <Text style={[styles.recentlyAdded6, styles.recentlyTypo3]}>
            비밀번호 입력
          </Text>
          <TextInput
            style={[styles.textinput, styles.icon2Layout]}
            secureTextEntry={true}
            value={enteredPassword}
            onChangeText={setEnteredPassword} 
          />
          <View style={[styles.pressable3, styles.recentlyTypo4]}>
            <Pressable onPress={checkPassword1}>
              <Text style={[styles.recentlyAdded7, styles.recentlyTypo4]}>사용자 정보 확인</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* 센서 정보 변경 */}
      <Pressable
        style={[styles.pressable4, styles.pressableLayout]}
        onPress={handleSensorInfoChangeClick}>
      <ImageBackground
        style={styles.sensorFireIcon}
        resizeMode="cover"
        source={require("../assets/sensorfire.png")}
      />
      <Text style={[styles.recentlyAdded4, styles.recentlyTypo]}>센서 정보 변경</Text>
      </Pressable>

      {/* 정보 상자 렌더링 - 센서 정보 변경 */}
      {showSensorInfoChange && (
        <View style={styles.sensorInfoChangeBox}>
          <Text style={[styles.recentlyAdded4, styles.recentlyTypo5]}>센서 정보 변경</Text>
          <Text style={[styles.recentlyAdded6, styles.recentlyTypo3]}>
            현재 센서 기기 정보
          </Text>
          <Image
            style={[styles.icon4, styles.icon4Layout]}
            resizeMode="cover"
            source={require("../assets/-15.png")}
          />
          <Text style={styles.recentlyAdded8}>{userInfo?.sensor_number || "센서정보 없음"}</Text>
          <Text style={[styles.recentlyAdded6, styles.recentlyTypo6]}>
            변경할 기기 번호
          </Text>
          <TextInput
            style={[styles.textinput, styles.icon4Layout]}
            keyboardType="default"
            onChangeText={text => setNewSensorNumber(text)}
          />
          <View style={[styles.pressable5, styles.recentlyTypo7]}>
            <Pressable onPress={() => handleSensorNumberChange(newSensorNumber)}>
            <Text style={[styles.recentlyAdded9, styles.recentlyTypo7]}>변경하기</Text>
            </Pressable>
          </View>
        </View>
        
      )}
      <Pressable
        style={[styles.pressable4, styles.pressableLayout]}
        onPress={handleLogout}>
      <ImageBackground
        style={styles.sensorFireIcon}
        resizeMode="cover"
        source={require("../assets/sign-out-alt.png")}
      />
      <Text style={[styles.recentlyAdded4, styles.recentlyTypo]}>로그아웃</Text>
      </Pressable>
    </View>
    </ScrollView>
  );
};



export default Screen3;
