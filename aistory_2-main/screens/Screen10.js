import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import RiskContainer from "../components/RiskContainer2";
import { Border, Color } from "../GlobalStyles";
import {Calendar, LocaleConfig} from 'react-native-calendars';
import axios from 'axios';
import ENV from '../env';
import CalendarDataChart from "../components/CalendarData";



const Screen10 = ({route}) => {
  const phoneNumber = route.params.phoneNumber;
  const [selectedDate, setSelectedDate] = useState("");
  const [sensorData, setSensorData] = useState(null);
  const [selected, setSelected] = useState('');

  const fetchSensorData = async () => {
    try {
      const serverUrl = ENV.SERVER_URL;
      const response = await axios.get(`${serverUrl}/senDataForDate`, {
        params: { phoneNumber, selectedDate },
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

  
  useEffect(() => {
    fetchSensorData();

  }, [selectedDate]); 

  const marked = useMemo(() => ({
    [selected]: {
      selected: true,
      selectedColor:  Color.lightsteelblue,
      selectedTextColor: Color.darkslateblue,
    }
  }), [selected]);  
  

  // 오늘 날짜
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <View style={styles.view}>
      <RiskContainer phoneNumber={phoneNumber}/>
      <View style={styles.calendarContainer}>
      <Calendar
        markedDates={marked}
        // 초기 선택된 날짜
        current={getCurrentDate()}
        // 캘린더 테마
        theme={{
          calendarBackground: Color.darkslateblue, //  캘린더 배경
          arrowColor: 'white', 
          //선택된 날짜
          todayTextColor: 'white', // 오늘 날짜 텍스트
          todayBackgroundColor: 'rgba(255, 255, 255, 0.2)', // 오늘 날짜 배경
          // Color.lightsteelblue
          dayTextColor: "white", //날짜 텍스트
          textDisabledColor: "gray", // 비활성된 날짜 텍스트
          monthTextColor: "white", //월 텍스트 색상

        }}

        // 날짜 선택 시 호출되는 콜백 함수
        onDayPress={(day) => {
          console.log('Selected day: ', day);
          setSelected(day.dateString);
          setSelectedDate(day.dateString);
        }}

      />

      </View>
      {/* 데이터박스 */}
      {selectedDate !== "" && (
          <Text style={styles.selectedDateText}>Selected Date: {selectedDate}</Text>
        )}
      <ScrollView 
      contentContainerStyle={styles.scrollViewContent}
      horizontal={true}
      showsHorizontalScrollIndicator = {true}
      >
      <View style={styles.view3}>
      
      <CalendarDataChart sensorData={sensorData} />
        
      </View>
      </ScrollView>
    </View>
    </ScrollView>

    
  );
};

const styles = StyleSheet.create({

  selectedDateText: {
    color: "white",
    fontSize: 16,
    marginTop: 30,
    marginBottom: -20,
  },

  view5: {
    borderTopLeftRadius: Border.br_15xl,
    borderTopRightRadius: Border.br_15xl,
    backgroundColor: Color.lightsteelblue,
    
  },
  view3: {
    
    marginTop: 40,
    flex: 1,
    zIndex: 10,
    
  },

  view5Position: {
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
    // position: "absolute",
  },

  

  calendarContainer: {
    marginTop: -135,
    width: "95%",
    

  },

  scrollViewContent: {
    flexGrow: 1,
    
  },

  view: {
    backgroundColor: Color.darkslateblue,
    flex: 1,
    alignItems: "center",
    width: "100%",
    marginTop: -35,
    zIndex: -1,
  },
});

export default Screen10;