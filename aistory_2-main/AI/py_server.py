# python_server.py
from flask import Flask, request, jsonify
import torch
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import mysql.connector
# import joblib
import pickle


# mysql 연결 설정
db_config = {
    "host" : "localhost",
    "user" : "aistory2",
    "password" : "aistory2",
    "database" : "aistory",
}

conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

app = Flask(__name__)
  # 스케일러 파일 경로 수정
# scaler = joblib.load('scaler2.pkl')

model = torch.load('model.pth')
# model_weights = torch.load('model_weights2.pth')
model.load_state_dict(torch.load('model_weights.pth'))

model.eval()

# 데이터 정규화를 위한 스케일러 로드
scaler = StandardScaler()
# model.load_state_dict(torch.load('model.pth'))

@app.route('/predict', methods=['POST'])
def predict():
    try:
        request_data = request.json  # POST 요청으로 데이터 받음
        print("노드에서 전달받은 데이터:", request_data)

        
        sensor_data = request_data['sensor_data'][0]
        print("sensor_data", sensor_data)

        #  독립 변수 추출
        season = sensor_data.get('season', '')
        flame_sensor_value = sensor_data.get('flame_sensor_value', 0)
        humidity = sensor_data.get('humidity', 0)
        object_temp = sensor_data.get('object_temp', 0)
        ambient_temp = sensor_data.get('ambient_temp', 0)
           
        
        # season을 더미 변수로 변환
        seasons = ['Autumn', 'Winter', 'Spring', 'Summer']
        # season_encoded = [1 if season == s else 0 for s in seasons]
        # season을 더미 변수로 변환
        season_encoded = pd.get_dummies(pd.Series([season]), prefix='season')

        # 모든 특성을 하나의 텐서로 연결
        input_tensor = torch.tensor([season_encoded + [flame_sensor_value, humidity, object_temp, ambient_temp]], dtype=torch.float32)
        print(input_tensor)
        
        input_tensor[:, 1:] = torch.tensor(scaler.transform(input_tensor[:, 1:]), dtype=torch.float32)
        result = model(input_tensor).item()

        model.eval()
        with torch.no_grad():
            output = model(input_tensor)
            Predicted_Prob = torch.sigmoid(output).item()

        predicted_value_to_save = int(Predicted_Prob * 100)


        # DB에 결과 insert
        cursor.execute("INSERT INTO ai (sensor_number, ai_data, timestamp) VALUES ('ss01', %s, default)", (predicted_value_to_save,))
        
        conn.commit()


        print("인공지능 모델 예측 결과:", Predicted_Prob)
        print("데이터 저장 성공:", predicted_value_to_save)

        return jsonify({'predicted_prob': Predicted_Prob})
    except Exception as e:
        error_message = str(e)  
        print("에러 발생:", error_message)
        return jsonify({'error': error_message})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # Flask 서버 실행