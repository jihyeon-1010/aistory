import React, { useState, useRef, useEffect } from "react";
import { Text, Image, View, TextInput, ScrollView, Pressable, Alert, } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {useNavigation} from "@react-navigation/native";
import {styles} from "./styles9";
import axios from "axios";
import ENV from '../env';

const Screen9 = ({route}) => {
  const {phoneNumer, section} = route.params;
  const navigation = useNavigation();
  const [value, setValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [newName, setNewName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const scrollRef = useRef(null);
  const [items, setItems] = useState([
  
      { label: "이름 변경", value: "이름 변경"},
      { label: "전화번호 변경", value: "전화번호 변경"},
      { label: "비밀번호 변경", value: "비밀번호 변경"},
    
  ])

 
  //주소지 변경 섹션으로 스크롤
  useEffect(() => {
    if (section === "addressChange") {
      scrollRef.current.scrollTo({ y: section4Offeset, animated: true });
    }
  }, []);

  // 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    try {
      // const serverUrl = 'http://192.168.0.4:3000';
      const serverUrl = ENV.SERVER_URL;
      const response = await axios.get(`${serverUrl}/getUserInfo`, {
        params: { phoneNumber: route.params.phoneNumber } 
      });
  
      if (response.data.success) {
        setUserInfo(response.data.user); 
         
      } else {
        
      }
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 오류 발생:", error);
    }
  };
  
  
  useEffect(() => {
    if (route.params.phoneNumber) {
      fetchUserInfo(); // 사용자 정보 가져오기
    }
  }, [route.params.phoneNumber]);

  // 사용자 주소지 변경 요청
const changeAddress = async () => {
  try {
    const serverUrl = ENV.SERVER_URL;
    
    
    const response = await axios.post(`${serverUrl}/changeUserAddress`, {
      phoneNumber: route.params.phoneNumber,
      newAddress: newAddress, 
    });

    if (response.data.success) {
      Alert.alert("주소지 변경 성공","로그인 화면으로 이동합니다. 다시 로그인해주세요.");

      navigation.navigate('Screen6');
      
      fetchUserInfo();
    } else {
      console.error("사용자 주소지 변경 실패");
    }
  } catch (error) {
    console.error("사용자 주소지를 변경하는 중 오류 발생: ", error);
  }
};

// 사용자 주소지 변경 버튼 핸들러
const handleAddressChange = () => {
  if (!userInfo) {
    console.error("사용자 정보가 없습니다.");
    Alert.alert("사용자 정보가 없습니다.");
    return;
  }

  if (!newAddress) {
    console.error("새로운 주소를 입력해주세요.");
    Alert.alert("입력된 주소가 없습니다. 주소를 입력해주세요.");
    return;
  }

  changeAddress();
};


  // 사용자 전화번호 변경 요청
const changePhoneNumber = async () => {
  try {
    // const serverUrl = 'http://192.168.0.4:3000';
    const serverUrl = ENV.SERVER_URL;
    if(!/^\d{11}$/.test(newPhoneNumber)){
      console.error("전화번호는 11자리의 숫자여야 합니다.");
      Alert.alert("형식에 맞지 않는 번호입니다.11자리의 숫자를 입력해주세요.");
      return;
    }
    const existingPhoneNumberResponse = await axios.get(`${serverUrl}/checkPhoneNumberInUse/${newPhoneNumber}`);
    if (existingPhoneNumberResponse.data.used) {
      console.error("이미 사용 중인 전화번호입니다.");
      Alert.alert("이미 가입된 번호입니다. 다시 입력해주세요.");
      return;
    }
    const response = await axios.post(`${serverUrl}/changeUserPhoneNumber`, {
      phoneNumber: route.params.phoneNumber,
      newPhoneNumber: newPhoneNumber, 
    });

    if (response.data.success) {
      setNewPhoneNumber(newPhoneNumber);

      navigation.setParams({
        phoneNumber: newPhoneNumber,
      });
      Alert.alert("전화번호 변경 성공","로그인 화면으로 이동합니다. 다시 로그인해주세요.");

      navigation.navigate('Screen6');
      
    } else {
      console.error("사용자 전화번호 변경 실패");
    }
  } catch (error) {
    console.error("사용자 전화번호를 변경하는 중 오류 발생: ", error);
  }
};

// 사용자 비밀번호 변경 요청
const changePassword = async () => {
  try {
    const serverUrl = 'http://192.168.0.4:3000';
    const response = await axios.post(`${serverUrl}/changeUserPassword`, {
      phoneNumber: route.params.phoneNumber,
      newPassword: newPassword, 
    });

    if (response.data.success) {
      Alert.alert("비밀번호 변경 성공","로그인 화면으로 이동합니다. 다시 로그인해주세요.");

      navigation.navigate('Screen6');
     
      fetchUserInfo();
    } else {
      console.error("사용자 비밀번호 변경 실패");
    }
  } catch (error) {
    console.error("사용자 비밀번호를 변경하는 중 오류 발생: ", error);
  }
};

// 사용자 전화번호 변경 버튼 핸들러
const handlePhoneNumberChange = () => {
  if (!userInfo) {
    console.error("사용자 정보가 없습니다.");
    Alert.alert("사용자 정보가 없습니다.");
    return;
  }

  if (!newPhoneNumber) {
    console.error("새로운 전화번호를 입력해주세요.");
    Alert.alert("전화번호를 입력해주세요.");
    return;
  }

  changePhoneNumber();
};

// 사용자 비밀번호 변경 버튼 핸들러
const handlePasswordChange = () => {
  if (!userInfo) {
    console.error("사용자 정보가 없습니다.");
    Alert.alert("사용자 정보가 없습니다.");
    return;
  }

  if (!newPassword) {
    console.error("새로운 비밀번호를 입력해주세요.");
    Alert.alert("비밀번호를 입력해주세요.");
    return;
  }

  changePassword();
};

  
  //사용자 이름 변경 요청
  const changeUserName = async() => {
    try{
      const serverUrl = 'http://192.168.0.4:3000';
      const response = await axios.post(`${serverUrl}/changeUserName`, {
        phoneNumber: route.params.phoneNumber,
        newName: newName, 
      });

      if (response.data.success) {
        
        fetchUserInfo();
      } else {
        console.error("사용자 이름 변경 실패");
      }
    } catch(error) {
      console.error("사용자 이름을 변경하는 중 오류 발생: ", error);
    }
  };

  //사용자 이름 변경 버튼 핸들러
  const handleNameChange = () => {
    if (!userInfo) {
      console.error("사용자 정보가 없습니다.");
      Alert.alert("사용자 정보가 없습니다.");
      return;
    }

    if (!newName) {
      console.error("새로운 이름을 입력해주세요.");
      Alert.alert("입력된 이름이 없습니다. 이름을 입력해주세요.");
      return;
    }

    const trimmedNewName = newName.trim(); // 공백 제거
    changeUserName();
    
  };

  

  // 스크롤 이동(드롭다운)
  const handleDropdownChange = (value) => {
    console.log("handleDropdownChange called with value:", value);

   

    // 해당 세션으로 스크롤 이동

    console.log("scrollViewRef.current:", scrollViewRef.current);

    if (value === "이름 변경") {
      console.log("Scrolling to 이름변경 section");
      scrollRef.current.scrollTo({ y: 0, animated: true });
    } else if (value === "전화번호 변경") {
      console.log("Scrolling to 전화번호 변경 section");
      scrollRef.current.scrollTo({ y: section2Offset, animated: true });
    } else if (value === "비밀번호 변경"){
      console.log("Scrolling to 비밀번호 변경 section");
      scrollRef.current.scrollTo({y : section3Offset, animated: true});
    }
  };

  const scrollViewRef = useRef(null);
  const section2Offset = 400; // 전화번호 변경 섹션 오프셋
  const section3Offset = 800; // 비밀번호 변경 섹션 오프셋
  const section4Offeset = 1300;
  
  
  return (
    
    <View style={styles.view}>
      <Pressable
        style={ styles.iconPosition1}
        onPress={() => navigation.goBack()}
      >
      <Image
        style={[styles.icon, styles.iconPosition]}
        resizeMode="cover"
        source={require("../assets/arrow.png")}
      />
      </Pressable>
      <Text style={styles.recentlyAdded}>개인정보 변경</Text>
      <View
        style={[styles.view1, styles.viewLayout, { zIndex: dropdownOpen ? 2 : 1 }]}
        
     
      >
        <DropDownPicker
          placeholder={value ? value : "수정할 개인정보 선택"}
          style={styles.dropdownpicker}
          open={dropdownOpen}
          value={value}
          setValue={setValue}
          items={items}
          setItems={setItems}
          setOpen={setDropdownOpen}
          onChangeValue={(selectedValue) => {
            console.log("DropDownPicker value changed:", selectedValue);
            setDropdownOpen(false);
            handleDropdownChange(selectedValue);
          }}
          dropDownContainerStyle={styles.dropdowndropDownContainer}
        />
      </View>
      <ScrollView 
      style={styles.scrollViewContainer}
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      >
      {/* 이름 변경 */}
      
      <View style={styles.view2} />
      <Text style={[styles.recentlyAdded1, styles.recentlyTypo1]}>
        이름 변경
      </Text>
      <Image
        style={[styles.icon2, styles.iconSpaceBlock1]}
        resizeMode="cover"
        source={require("../assets/23-1.png")}
      />
      <Text style={[styles.recentlyAdded2, styles.recentlyTypo]}>
        현재 사용자 이름
      </Text>
      <Image
        style={[styles.icon2, styles.iconSpaceBlock]}
        resizeMode="cover"
        source={require("../assets/-15.png")}
      />
      <Text style={styles.recentlyAdded4}>{userInfo ? userInfo.name : "사용자"}</Text>
      <Text style={[styles.recentlyAdded5, styles.recentlyTypo]}>
        변경할 사용자 이름
      </Text>
      <TextInput
        style={[styles.textinput, styles.iconSpaceBlock]}
        keyboardType="default"
        value={newName}
        onChangeText={setNewName}
      />
      <Pressable onPress={handleNameChange} style={styles.button}>
        <Image
          style={[styles.icon1, styles.iconSpaceBlock]}
          resizeMode="cover"
          source={require("../assets/-6.png")}
        />
        <Text style={styles.recentlyAdded6}>변경하기</Text>
      </Pressable>
      
      {/* 전화번호 변경 */}
      
      <View style={styles.view4} />
      <Text style={[styles.recentlyAdded7, styles.recentlyTypo1]}>전화번호 변경</Text>
      <Image
        style={[styles.icon2, styles.iconSpaceBlock1]}
        resizeMode="cover"
        source={require("../assets/23-1.png")}
      />
      <Text style={[styles.recentlyAdded2, styles.recentlyTypo]}>
        현재 사용자 전화번호
      </Text>
      <Image
        style={[styles.icon2, styles.iconSpaceBlock]}
        resizeMode="cover"
        source={require("../assets/-15.png")}
      />
      <Text style={styles.recentlyAdded4}>{userInfo ? userInfo.phone_number: "전화번호"}</Text>
      <Text style={[styles.recentlyAdded5, styles.recentlyTypo]}>
        변경할 사용자 전화번호
      </Text>
      <TextInput
        style={[styles.textinput, styles.iconSpaceBlock]}
        keyboardType="number-pad"
        value={newPhoneNumber}
        onChangeText={setNewPhoneNumber}
      />
      <Pressable onPress={handlePhoneNumberChange} style={styles.button}>
      <Image
        style={[styles.icon1, styles.iconSpaceBlock]}
        resizeMode="cover"
        source={require("../assets/-6.png")}
      />
      <Text style={styles.recentlyAdded6}>변경하기</Text>
      </Pressable>

      {/* 비밀번호 변경 */}
      
      <View style={styles.view4} />
      <Text style={[styles.recentlyAdded7, styles.recentlyTypo1]}>비밀번호 변경</Text>
      <Image
        style={[styles.icon2, styles.iconSpaceBlock1]}
        resizeMode="cover"
        source={require("../assets/23-1.png")}
      />
      <Text style={[styles.recentlyAdded2, styles.recentlyTypo]}>
        현재 사용자 비밀번호
      </Text>
      <Image
        style={[styles.icon2, styles.iconSpaceBlock]}
        resizeMode="cover"
        source={require("../assets/-15.png")}
      />
      <Text style={styles.recentlyAdded4}>{userInfo ? userInfo.password : "비밀번호"}</Text>
      <Text style={[styles.recentlyAdded5, styles.recentlyTypo]}>
        변경할 사용자 비밀번호
      </Text>
      <TextInput
        style={[styles.textinput, styles.iconSpaceBlock]}
        keyboardType="default"
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Pressable onPress={handlePasswordChange} style={styles.button}>
      <Image
        style={[styles.icon1, styles.iconSpaceBlock]}
        resizeMode="cover"
        source={require("../assets/-6.png")}
      />
      <Text style={styles.recentlyAdded6}>변경하기</Text>
      </Pressable>
      <View style={styles.view4}></View>

      {/* 주소지 변경 */}
      
      <View style={styles.view4} />
      <Text style={[styles.recentlyAdded7, styles.recentlyTypo1]}>주소지 변경</Text>
      <Image
        style={[styles.icon4, styles.iconSpaceBlock3]}
        resizeMode="cover"
        source={require("../assets/23-1.png")}
      />
      <Text style={[styles.recentlyAdded8, styles.recentlyTypo]}>
        현재 사용자 주소
      </Text>
      <Image
        style={[styles.icon4, styles.iconSpaceBlock]}
        resizeMode="cover"
        source={require("../assets/-15.png")}
      />
      <Text style={styles.recentlyAdded9}>{userInfo ? userInfo.address : "주소"}</Text>
      <Text style={[styles.recentlyAdded10, styles.recentlyTypo2]}>
        변경할 사용자 주소
      </Text>
      <TextInput
        style={[styles.textinput1, styles.iconSpaceBlock]}
        keyboardType="default"
        value={newAddress}
        onChangeText={setNewAddress}
      />
      <Pressable onPress={handleAddressChange} style={styles.button}>
      <Image
        style={[styles.icon1, styles.iconSpaceBlock]}
        resizeMode="cover"
        source={require("../assets/-6.png")}
      />
      <Text style={styles.recentlyAdded6}>변경하기</Text>
      </Pressable>
      <View style={styles.view4}></View>
      
      </ScrollView>
    </View>
    
  );
};


export default Screen9;
