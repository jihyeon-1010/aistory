import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Pressable,
  ImageBackground,
  Text,
  TextInput,
  ScrollView, 
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, Color, Border, FontSize } from "../GlobalStyles";
import axios from "axios";
import ENV from '../env';

const Screen8 = ({route}) => {
  
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [newSensorNumber, setNewSensorNumber] = useState("");

  // 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    try {
      // const serverUrl = 'http://192.168.35.45:3000';
      const serverUrl = ENV.SERVER_URL;
      const response = await axios.get(`${serverUrl}/getUserInfo`, {
        params: { phoneNumber: route.params.phoneNumber } 
      });

      if (response.data.success) {
        setUserInfo(response.data.user); 
       
      } else {
        console.error("사용자 정보 요청 실패");
      }
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 오류 발생:", error);
    }
  };


  useEffect(() => {
    if (route.params.phoneNumber) {
      fetchUserInfo(); // 사용자 정보 가져오기
    }
  }, [route.params.phoneNumber]); // phoneNumber가 변경될 때만 useEffect 호출

  // 센서 번호 변경 요청 보내기
  const handleSensorNumberChange = async (newSensorNumber) => {
    try {

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
      console.error("센서 번호 변경 중 오류 발생:", error);
    }
  };

  

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <View style={styles.view}>
      <View style={styles.view1} />
      <Image
        style={[styles.icon, styles.iconLayout]}
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
      <Image
        style={[styles.icon2, styles.iconLayout]}
        resizeMode="cover"
        source={require("../assets/11.png")}
      />
      {/* 사용자 */}
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
      <Pressable style={[styles.pressable, styles.pressableLayout]}>
        <ImageBackground
          style={styles.idCardClipAltIcon}
          resizeMode="cover"
          source={require("../assets/idcardclipalt.png")}
        />
        <Text style={[styles.recentlyAdded2, styles.recentlyTypo]}>
          개인정보 변경
        </Text>
      </Pressable>
      <Pressable style={[styles.pressable1, styles.pressableLayout]}>
        <ImageBackground
          style={styles.addressBookIcon}
          resizeMode="cover"
          source={require("../assets/addressbook.png")}
        />
        <Text style={[styles.recentlyAdded3, styles.recentlyTypo]}>
          주소지 변경
        </Text>
      </Pressable>
      <View style={[styles.view3, styles.pressableLayout]} />
      <ImageBackground
        style={styles.sensorFireIcon}
        resizeMode="cover"
        source={require("../assets/sensorfire.png")}
      />
      <Text style={[styles.recentlyAdded4, styles.recentlyTypo]}>
        센서 정보 변경
      </Text>
      <Text style={[styles.recentlyAdded5, styles.recentlyTypo3]}>
        현재 센서 기기 정보
      </Text>
      <Image
        style={[styles.icon4, styles.icon4Layout]}
        resizeMode="cover"
        source={require("../assets/-15.png")}
      />
      <Text style={styles.recentlyAdded6}>{userInfo?.sensor_number || "센서정보 없음"}</Text>
      <Text style={[styles.recentlyAdded7, styles.recentlyTypo3]}>
        변경할 기기 번호
      </Text>
      <TextInput
        style={[styles.textinput, styles.icon4Layout]}
        keyboardType="default"
        onChangeText={text => setNewSensorNumber(text)}
      />
      <View style={[styles.pressable2, styles.recentlyTypo6]}>
        <Pressable onPress={() => handleSensorNumberChange(newSensorNumber)}>
         <Text style={[styles.recentlyAdded8, styles.recentlyTypo6]}>변경하기</Text>
        </Pressable>
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  
  scrollViewContent: {
    flexGrow: 1,
    // paddingBottom:100,
  },

  recentlyTypo6: {
    color: Color.white,
    textAlign: "center",
    fontFamily: FontFamily.hancomMalangMalangRegular,
    fontWeight: "700",
    letterSpacing: 0,
    fontSize: FontSize.size_lg,
  },

  pressable2: {
    marginTop: 21,
    height: 45,
    marginLeft: 29,
    backgroundColor: Color.steelblue,
    borderRadius: Border.br_3xs,
    width: "79.51%",
  },

  recentlyAdded8: {
    width: "40.97%",
    marginTop: 10,
    marginLeft: 90,
  },

  iconLayout: {
    overflow: "hidden",
    maxWidth: "100%",
    width: "89.72%",
  },
  recentlyTypo2: {
    marginLeft: 131,
    textAlign: "left",
    fontFamily: FontFamily.hancomMalangMalangRegular,
    letterSpacing: 0,
  },
  pressableLayout: {
    marginLeft: 9,
    backgroundColor: Color.gray_200,
    borderRadius: Border.br_xl,
    width: "85.51%",
  },
  recentlyTypo1: {
    marginLeft: 131,
    textAlign: "left",
    fontFamily: FontFamily.hancomMalangMalangRegular,
    letterSpacing: 0,
  },
  recentlyTypo3: {
    marginLeft: 33,
    fontSize: FontSize.size_lg,
    color: Color.dimgray,
    textAlign: "left",
    fontFamily: FontFamily.hancomMalangMalangRegular,
    fontWeight: "700",
    letterSpacing: 0,
  
  },
  recentlyTypo: {
    color: Color.dimgray,
    textAlign: "left",
    fontFamily: FontFamily.hancomMalangMalangRegular,
    fontWeight: "700",
    letterSpacing: 0,
    fontSize: FontSize.size_3xl,
  },
  icon4Layout: {
    height: 41,
    width: 327,
    borderRadius: Border.br_3xs,
    marginLeft: 29,
  },
  view1: {
    alignSelf: "stretch",
    height: 44,
    // marginTop: 90,
    
  },
  icon: {
    height: 926,
    marginTop: -44,
  },
  view2: {
    width: 320,
    height: 61,
    marginTop: -926,
    flex: 1,

  },
  icon1: {
    height: "100%",
    width: "100%",
  },
  iconnavigationclose24px: {
    width: 32,
    height: 32,
    marginTop: -42,
    marginLeft: 13,
  },
  icon2: {
    height: 130,
    marginTop: 17,
  },
  icon3: {
    width: 94,
    height: 94,
    marginTop: -102,
    marginLeft: 13,
  },
  recentlyAdded: {
    width: "30%",
    color: Color.gray_300,
    marginTop: -78,
    fontWeight: "700",
    fontSize: FontSize.size_3xl,
    marginLeft: 131,
    textAlign: "left",
    fontFamily: FontFamily.hancomMalangMalangRegular,
    letterSpacing: 0,
    
   
  },
  recentlyAdded1: {
    width: "51.87%",
    fontSize: FontSize.size_mini,
    lineHeight: 18,
    color: Color.white,
    marginTop: 4,
    marginLeft: 131,
    textAlign: "left",
    fontFamily: FontFamily.hancomMalangMalangRegular,
    letterSpacing: 0,
   
  },
  idCardClipAltIcon: {
    top: 20,
    bottom: 19,
    width: 49,
    left: 20,
    position: "absolute",
  },
  recentlyAdded2: {
    marginTop: -14,
    left: "26.78%",
    color: Color.dimgray,
    top: "50%",
    position: "absolute",
    maxWidth: "100%",
  },
  pressable: {
    marginTop: 80,
    height: 80,
    marginLeft: 9,
    backgroundColor: Color.gray_200,
    borderRadius: Border.br_xl,
    width: "85.51%",
  },
  addressBookIcon: {
    marginTop: -26,
    width: 50,
    height: 50,
    top: "50%",
    left: 20,
    position: "absolute",
  },
  recentlyAdded3: {
    marginTop: -15,
    left: "26.78%",
    color: Color.dimgray,
    top: "50%",
    position: "absolute",
  },
  pressable1: {
    marginTop: 21,
    height: 88,
    marginLeft: 9,
    backgroundColor: Color.gray_200,
    borderRadius: Border.br_xl,
    width: "85.51%",
  },
  
  view3: {
    height: 349,
    marginTop: 19,
    marginLeft: 9,
    backgroundColor: Color.gray_200,
    borderRadius: Border.br_xl,
    width: "85.51%",
  },
  sensorFireIcon: {
    height: 49,
    marginTop: -327,
    marginLeft: 29,
    width: 49,
  },
  recentlyAdded4: {
    width: "40.61%",
    marginTop: -39,
    marginLeft: 106,
  },
  recentlyAdded5: {
    width: "40.11%",
    marginTop: 27,
  },
  icon4: {
    opacity: 0.5,
    marginTop: 5,
  },
  recentlyAdded6: {
    width: "40.64%",
    marginTop: -32,
    marginLeft: 44,
    fontSize: FontSize.size_lg,
    color: Color.dimgray,
    textAlign: "left",
    fontFamily: FontFamily.hancomMalangMalangRegular,
    fontWeight: "700",
    letterSpacing: 0,
  },
  recentlyAdded7: {
    width: "40.97%",
    marginTop: 28,
  },
  textinput: {
    backgroundColor: Color.white,
    marginTop: 6,
  },
  view: {
    backgroundColor: Color.darkslateblue,
    flex: 1,
    width: "100%",
    paddingBottom:120,
   
  },
});

export default Screen8;
