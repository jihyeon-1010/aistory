import React from 'react';
import { LineChart } from 'react-native-chart-kit';

function ALLSensorData ({ aiData }){
  
  if (!aiData || aiData.length === 0) {
    return null; 
  }

   // 오늘 날짜 계산
   const today = new Date();
  //  today.setDate(today.getDate() +2);
   today.setHours(0, 0, 0, 0);
   console.log(today);
 
   // 오늘 날짜의 데이터 필터링
   const todayData = aiData.filter((dataPoint) => {
     const dataDate = new Date(dataPoint.timestamp);
     console.log(dataDate);
     return dataDate >= today;
   });

  // 그래프 데이터 설정
  const data = {
    legend: ["위험확률 추이"],
    labels: todayData.map((dataPoint) => {
      const date = new Date(dataPoint.timestamp);
      const hours = date.getHours().toString().padStart(2, '0'); // 시간
      const minutes = date.getMinutes().toString().padStart(2, '0'); // 분
      return `${hours}:${minutes}`;
    }),
    datasets: [
      {
        data: todayData.map((dataPoint) => dataPoint.ai_data), // Y축 : ai_data
        color: (opacity = 1) => `rgba(49, 56, 102, ${opacity})`, 
        label: '확률', // 라벨
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: 'rgba(192, 219, 234, 1)',
    backgroundGradientTo: 'rgba(192, 219, 234, 1)',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // 라인 굵기 설정
    // legendPosition: 'left',
  };

  return (
    <LineChart
      width={1400}
      data={data}
      height={350}
      chartConfig={chartConfig}
      withVerticalLines={true} // 수직 눈금선 
      withHorizontalLines={true} // 수평 눈금선 
      withDots={true} // 데이터 포인트에 점 표시 
      withInnerLines={true} // 그래프 내부 라인
      withOuterLines={true} // 그래프 바깥쪽 라인
      withShadow={true}
      fromZero={true} // y축 0부터
      bezier={true}
    />
  );
}

export default ALLSensorData;
