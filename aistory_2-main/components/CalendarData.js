import React from "react";
import { Alert } from "react-native";
import { LineChart } from 'react-native-chart-kit';

function CalendarDataChart ({ sensorData }){
  if (!sensorData || sensorData.length === 0) {
    
    Alert.alert("날짜 선택", "데이터를 확인하고 싶은 날을 선택해주세요.");
    
    return ;
  }

  const data = {
    legend: ["타겟온도", "주변온도", "습도"],
    labels: sensorData.map((dataPoint) => {
      const date = new Date(dataPoint.timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }),
    datasets: [
      {
        data: sensorData.map((dataPoint) => dataPoint.object_temp), // 타겟온도 데이터를 Y 축으로 사용
        color: (opacity = 1) => `rgba(239, 149, 149, ${opacity})`, // 라인 색상 설정
        label: '타겟온도', // 라벨 설정
      },
      {
        data: sensorData.map((dataPoint) => dataPoint.ambient_temp), // 주변 온도 데이터를 Y 축으로 사용
        color: (opacity = 1) => `rgba(247, 219, 106, ${opacity})`, // 라인 색상 설정
        label: '주변온도', // 라벨 설정
      },
      {
        data: sensorData.map((dataPoint) => dataPoint.humidity), // 주변 온도 데이터를 Y 축으로 사용
        color: (opacity = 1) => `rgba(112, 145, 245, ${opacity})`, // 라인 색상 설정
        label: '습도', // 라벨 설정
      },
      //  rgba(255, 105, 105,  rgba(112, 145, 245, - 파랑 , rgba(148, 166, 132, - 초록

    ],
  };

  const chartConfig = {
    backgroundGradientFrom: 'rgba(230, 230, 250, 1)',
    backgroundGradientTo: 'rgba(230, 230, 250, 1)',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
  };


  return (
    <LineChart
      width={500}
      data={data}
      height={400}
      chartConfig={chartConfig}
      withVerticalLines={true}
      withHorizontalLines={true}
      withDots={true}
      withInnerLines={true}
      withOuterLines={true}
      withShadow={true}
      fromZero={true}
    />
  );
}

export default CalendarDataChart;
