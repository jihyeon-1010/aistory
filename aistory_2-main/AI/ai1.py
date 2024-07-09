import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import MinMaxScaler

# 데이터 로드 및 전처리
data = pd.read_csv('/content/sample_data/newait2.csv')
X = data[['season', 'flame_sensor_value', 'humidity', 'object_temp', 'ambient_temp']]
X = pd.get_dummies(X, columns=['season'])
y = data['fire']

# 결측치 처리
X.fillna(X.mean(), inplace=True)

# 데이터 정규화
scaler = StandardScaler()
X.iloc[:, 1:] = scaler.fit_transform(X.iloc[:, 1:])

# 데이터 분할
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=30)

# 신경망 모델 정의
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
        # self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = self.dropout1(x)
        x = torch.tanh(self.fc2(x))
        x = self.dropout2(x)
        x = torch.sigmoid(self.fc3(x))
        x = self.dropout3(x)
        x = self.fc4(x)
        x = self.tanh(x)
        # x = self.sigmoid(x)
        return x

# Focal Loss 정의
class FocalLoss(nn.Module):
    def __init__(self, alpha=5, gamma=1, logits=True, reduction='mean'):
        super(FocalLoss, self).__init__()
        self.alpha = alpha
        self.gamma = gamma
        self.logits = logits
        self.reduction = reduction

    def forward(self, inputs, targets):
        if self.logits:
            BCE_loss = nn.BCEWithLogitsLoss(reduction='none')(inputs, targets)
        else:
            BCE_loss = nn.BCELoss(reduction='none')(inputs, targets)
        pt = torch.exp(-BCE_loss)
        F_loss = self.alpha * (1 - pt) ** self.gamma * BCE_loss

        if self.reduction == 'mean':
            return torch.mean(F_loss)
        elif self.reduction == 'sum':
            return torch.sum(F_loss)
        else:
            return F_loss

# 모델 학습
input_size = X_train.shape[1]
model = Net(input_size)
criterion = FocalLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=10, verbose=True)

num_epochs = 1000
early_stopping_counter = 0
best_loss = float('inf')

for epoch in range(num_epochs):
    inputs = torch.tensor(X_train.values, dtype=torch.float32)
    labels = torch.tensor(y_train.values, dtype=torch.float32).view(-1, 1)

    optimizer.zero_grad()
    outputs = model(inputs)
    loss = criterion(outputs, labels)
    loss.backward()
    optimizer.step()

    # 검증 데이터로 성능 평가
    with torch.no_grad():
        test_inputs = torch.tensor(X_test.values, dtype=torch.float32)
        predicted_logits = model(test_inputs)
        predicted_prob = torch.sigmoid(predicted_logits).numpy()


        threshold = 0.6
        predicted_binary = (predicted_prob > threshold).astype(int)

        val_loss = mean_squared_error(y_test, predicted_prob)

    # 학습률 스케줄링
    scheduler.step(val_loss)

    # 조기 종료
    if loss < best_loss:
        best_loss = loss
        early_stopping_counter = 0
    else:
        early_stopping_counter += 1

    if early_stopping_counter >= 20:
        print(f"Early stopping at epoch {epoch}")
        break


# 모델 평가
with torch.no_grad():
    mse = mean_squared_error(y_test, predicted_prob)
    r2 = r2_score(y_test, predicted_prob)

    rmse = np.sqrt(mse)

    print("Mean Squared Error (Probability):", mse)
    print("R-squared (R2) Score (Probability):", r2)
    print("Root Mean Squared Error (RMSE) (Probability):", rmse)

    results_prob_df = pd.DataFrame({'Actual': y_test.values, 'Predicted_Prob': predicted_prob.flatten()})

    # risk levels
    def categorize_risk(probability):
        if probability <= 0.3:
            return 'Low Risk'
        elif probability <= 0.65:
            return 'Medium Risk'
        elif probability <= 0.7:
            return 'High Risk'
        else:
            return 'Very High Risk'

    results_prob_df['Risk_Level'] = results_prob_df['Predicted_Prob'].apply(categorize_risk)

    print("\nProbability Predictions:")
    print(results_prob_df)


    results_binary_df = pd.DataFrame({'Actual': y_test.values, 'Predicted_Binary': predicted_binary.flatten()})
    # print("\nBinary Predictions:")
    # print(results_binary_df)




new_data = pd.read_csv('/content/sample_data/newwait3.csv')  # 새로운 데이터 파일 로드
new_X = new_data[['season', 'flame_sensor_value', 'humidity', 'object_temp', 'ambient_temp']]
new_X = pd.get_dummies(new_X, columns=['season'])

# 결측치 처리
new_X.fillna(new_X.mean(), inplace=True)

# 특성 스케일링

# 새로운 데이터에 대한 스케일러 생성 및 학습 데이터로 학습
new_scaler = StandardScaler()

new_X.iloc[:, 1:] = scaler.fit_transform(new_X.iloc[:, 1:])
# 데이터 정규화
missing_columns = set(X.columns) - set(new_X.columns)  # X에는 있지만 new_X에는 없는 컬럼 찾기
for column in missing_columns:
    new_X[column] = X[column].mean()  # 누락된 컬럼을 0으로 초기화



new_X = new_X[X.columns]  # 컬럼 순서 일치시키기
# print("학습 데이터 컬럼:", X.columns)
# print("새로운 데이터 컬럼:", new_X.columns)
# new_X = new_scaler.transform(new_X)  # 정규화

# 새로운 데이터에 대한 예측
with torch.no_grad():
    new_inputs = torch.tensor(new_X.values, dtype=torch.float32)
    new_predicted_logits = model(new_inputs)
    new_predicted_prob = torch.sigmoid(new_predicted_logits).numpy()

    threshold = 0.5
    new_predicted_binary = (new_predicted_prob > threshold).astype(int)

# 예측 결과 출력
new_results_df = pd.DataFrame({'Predicted_Prob': new_predicted_prob.flatten()})
# new_results_df['Risk_Level'] = new_results_df['Predicted_Prob'].apply(categorize_risk)  # 이 부분 수정 필요
print("Predictions for new data:")
print(new_results_df)

