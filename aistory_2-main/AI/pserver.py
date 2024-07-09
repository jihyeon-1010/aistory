# pserver.py

from flask import Flask, request, jsonify
import torch
import torch.nn as nn
import numpy as np
from sklearn.preprocessing import StandardScaler
import mysql.connector
import joblib

app = Flask(__name__)

class Net(nn.Module):
    def __init__(self, input_size):
        super(Net, self).__init__()
        self.fc1 = nn.Linear(input_size, 128)
        self.dropout1 = nn.Dropout(0.3)
        self.fc2 = nn.Linear(128, 64)
        self.dropout2 = nn.Dropout(0.3)
        self.fc3 = nn.Linear(64, 32)
        self.dropout3 = nn.Dropout(0.3)
        self.fc4 = nn.Linear(32, 1)
        self.tanh = nn.Tanh()

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = self.dropout1(x)
        x = torch.tanh(self.fc2(x))
        x = self.dropout2(x)
        x = torch.sigmoid(self.fc3(x))
        x = self.dropout3(x)
        x = self.fc4(x)
        x = self.tanh(x)
        return x

db_config = {
    "host" : "localhost",
    "user" : "aistory2",
    "password" : "aistory2",
    "database" : "aistory",
}

conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

model = Net(input_size=8)
model.load_state_dict(torch.load('model16.pth'))
model.eval()

scaler = joblib.load('scaler5.pkl')
# scaler = StandardScaler()


@app.route('/predict', methods=['POST'])
def predict():
    try:
        request_data = request.json
        print("노드에서 전달받은 데이터:", request_data)

        sensor_data = request_data['sensor_data'][0]
        print("sensor_data", sensor_data)

       
        flame_sensor_value = sensor_data.get('flame_sensor_value', 0)
        humidity = sensor_data.get('humidity', 0)
        object_temp = sensor_data.get('object_temp', 0)
        ambient_temp = sensor_data.get('ambient_temp', 0)
        season = sensor_data.get('season', '')
        seasons = ['Autumn', 'Winter', 'Spring', 'Summer']
        season_encoded = [1 if season == s else 0 for s in seasons]

        # input_tensor = torch.tensor([season_encoded + [flame_sensor_value, humidity, object_temp, ambient_temp]], dtype=torch.float32)

        # scaler = StandardScaler()
        # input_data = input_tensor[:, 1:].numpy()
        
        # input_data = input_tensor[:, 1:]
        # input_data_scaled = scaler.fit_transform(input_data)
        # input_tensor[:, 1:] = torch.tensor(input_data_scaled, dtype=torch.float32)
        # print(input_tensor)
        # with torch.no_grad():
        #     output = model(input_tensor)
        #     Predicted_Prob = torch.sigmoid(output).item()

        input_data = np.array([[flame_sensor_value, humidity, object_temp, ambient_temp] + season_encoded])
        print(input_data)
        input_data_scaled = scaler.transform(input_data[:, :])
        # input_data_scaled = np.insert(input_data_scaled, 0, flame_sensor_value, axis=1)

        input_tensor = torch.tensor( input_data_scaled, dtype=torch.float32)
        print(input_tensor)

        with torch.no_grad():
            output = model(input_tensor)
            Predicted_Prob = torch.sigmoid(output).item()

        predicted_value_to_save = int(Predicted_Prob * 100)

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
    app.run(host='0.0.0.0', port=5000, debug=True)
