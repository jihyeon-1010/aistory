import React from 'react';
import { LineChart } from 'react-native-chart-kit';



function SensorDataChart ({ sensorData }){
  if (!sensorData || sensorData.length === 0) {
    return null; // 또는 다른 처리
  }

  //today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);


  // 그래프 데이터 설정
  const todaySensorData = sensorData.filter((dataPoint) => {
    const dataTimestamp = new Date(dataPoint.timestamp);
    return dataTimestamp >= today && dataTimestamp < tomorrow;
  });

  const data = {
    legend: ["온도", "습도"],
    labels: todaySensorData.map((dataPoint) => {
      const date = new Date(dataPoint.timestamp);
      const hours = date.getHours().toString().padStart(2, '0'); // 시간
      const minutes = date.getMinutes().toString().padStart(2, '0'); // 분
      return `${hours}:${minutes}`;
    }),
    datasets: [
      {
        data: todaySensorData.map((dataPoint) => dataPoint.humidity), // 습도 데이터를 Y 축으로 사용
        color: (opacity = 1) => `rgba(112, 145, 245, ${opacity})`, // 라인 색상 설정
        label: '습도', // 라벨 설정
      },
      {
        data: todaySensorData.map((dataPoint) => dataPoint.temperature), // 온도 데이터를 Y 축으로 사용
        color: (opacity = 1) => `rgba(150, 194, 145, ${opacity})`, // 라인 색상 설정
        label: '온도', // 라벨 설정
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: 'rgba(253, 208, 227, 0.5)',
    backgroundGradientTo: 'rgba(253, 208, 227, 0.5)',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // 라인 굵기 설정
    // legendPosition: 'left',
  };

  return (
    <LineChart
      width={1400}
      data={data}
      height={400}
      chartConfig={chartConfig}
      withVerticalLines={true} // 수직 눈금선 비활성화
      withHorizontalLines={true} // 수평 눈금선 활성화
      withDots={true} // 데이터 포인트에 점 표시 활성화
      withInnerLines={true} // 그래프 내부 라인 비활성화
      withOuterLines={true} // 그래프 바깥쪽 라인 활성화
      withShadow={true}
      fromZero={true}
      
    />
  );
}

export default SensorDataChart;
